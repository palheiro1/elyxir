import { OMNO_ACCOUNT, OMNO_CONTRACT, isElyxirAsset } from '../data/CONSTANTS';
import { parseJson } from './txUtils';
import { getJobLifecycle, getJobOutcome } from './elyxirLifecycle';

const LINK_WINDOW_SECONDS = 60 * 60;

const getMessage = tx => {
    const message = tx?.attachment?.message;
    if (!message) return null;
    return parseJson(message) || null;
};

export const getAlchemyCreateParameter = tx => {
    if (tx?.type !== 1 || tx?.subtype !== 0) return null;
    if (tx?.recipientRS !== OMNO_ACCOUNT) return null;

    const message = getMessage(tx);
    if (message?.contract !== OMNO_CONTRACT || !Array.isArray(message.operation)) return null;

    const createOperation = message.operation.find(operation => {
        return operation?.service === 'elyxir' && operation?.request === 'create';
    });

    return createOperation?.parameter || null;
};

const getMessageJobId = tx => {
    const message = getMessage(tx);
    if (!message) return null;

    if (message.jobId) return message.jobId;
    if (Array.isArray(message.operation)) {
        const operationWithJob = message.operation.find(operation => operation?.parameter?.jobId);
        if (operationWithJob) return operationWithJob.parameter.jobId;
    }

    return null;
};

const isAlchemyAssetTransfer = tx => {
    return tx?.type === 2 && tx?.subtype === 1 && isElyxirAsset(tx?.attachment?.asset);
};

const getTxId = tx => tx?.fullHash || tx?.transaction || `${tx?.timestamp}-${tx?.attachment?.asset}`;

const getExpectedAssets = (source, recipes = []) => {
    const assets = new Set();
    if (source?.flaskAssetId) assets.add(source.flaskAssetId);
    if (source?.creationAssetId) assets.add(source.creationAssetId);
    if (source?.recipeAssetId) assets.add(source.recipeAssetId);

    const recipeDefinition = recipes.find(recipe => recipe.recipeAssetId === source?.recipeAssetId);
    if (recipeDefinition) {
        if (Array.isArray(recipeDefinition.tools)) recipeDefinition.tools.forEach(asset => assets.add(asset));
        if (Array.isArray(recipeDefinition.ingredients)) {
            recipeDefinition.ingredients.forEach(ingredient => assets.add(ingredient.assetId));
        }
    }

    if (Array.isArray(source?.tools)) source.tools.forEach(asset => assets.add(asset));
    if (Array.isArray(source?.ingredients)) source.ingredients.forEach(ingredient => assets.add(ingredient.assetId));
    return assets;
};

const toMovement = (tx, accountRs, items) => {
    const assetId = tx?.attachment?.asset;
    const item = items.find(candidate => candidate.asset === assetId);
    const direction = tx.senderRS === accountRs ? 'out' : 'in';

    return {
        id: getTxId(tx),
        tx,
        direction,
        assetId,
        itemName: item?.description || item?.name || assetId,
        quantityQNT: tx?.attachment?.quantityQNT,
        jobId: getMessageJobId(tx),
        timestamp: tx?.timestamp,
        date: null,
    };
};

const isNearCreate = (movement, createTx, expectedAssets) => {
    if (!createTx || !movement?.tx) return false;
    if (!expectedAssets.has(movement.assetId)) return false;

    const distance = Math.abs(Number(createTx.timestamp) - Number(movement.timestamp));
    return Number.isFinite(distance) && distance <= LINK_WINDOW_SECONDS;
};

const dedupeMovements = movements => {
    const seen = new Set();
    return movements.filter(movement => {
        if (seen.has(movement.id)) return false;
        seen.add(movement.id);
        return true;
    });
};

export const buildAlchemyHistory = ({ transactions = [], jobs = [], items = [], accountRs, recipes = [] }) => {
    const sortedTransactions = [...transactions].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    const createEntries = sortedTransactions
        .map(tx => ({ tx, parameter: getAlchemyCreateParameter(tx) }))
        .filter(entry => entry.parameter?.jobId);

    const movements = sortedTransactions
        .filter(isAlchemyAssetTransfer)
        .filter(tx => tx.senderRS === accountRs || tx.recipientRS === accountRs)
        .filter(tx => tx.senderRS === OMNO_ACCOUNT || tx.recipientRS === OMNO_ACCOUNT)
        .map(tx => toMovement(tx, accountRs, items));

    const usedMovementIds = new Set();

    const jobEvents = jobs.map(job => {
        const createEntry = createEntries.find(entry => entry.parameter.jobId === job.jobId);
        const expectedAssets = getExpectedAssets({ ...createEntry?.parameter, ...job }, recipes);

        const linkedMovements = movements.filter(movement => {
            if (movement.jobId === job.jobId) return true;
            if (isNearCreate(movement, createEntry?.tx, expectedAssets)) return true;
            return false;
        });

        linkedMovements.forEach(movement => usedMovementIds.add(movement.id));

        return {
            id: job.jobId,
            kind: 'job',
            job,
            createTx: createEntry?.tx || null,
            parameter: createEntry?.parameter || null,
            movements: dedupeMovements(linkedMovements),
            status: job.status,
            statusLabel: job.status || 'UNKNOWN',
            lifecycle: getJobLifecycle(job),
            outcome: getJobOutcome(job),
            timestamp: createEntry?.tx?.timestamp || job.startHeight || 0,
        };
    });

    const createOnlyEvents = createEntries
        .filter(entry => !jobs.some(job => job.jobId === entry.parameter.jobId))
        .map(entry => {
            const expectedAssets = getExpectedAssets(entry.parameter, recipes);
            const linkedMovements = movements.filter(movement => {
                if (usedMovementIds.has(movement.id)) return false;
                if (movement.jobId === entry.parameter.jobId) return true;
                if (isNearCreate(movement, entry.tx, expectedAssets)) return true;
                return false;
            });

            linkedMovements.forEach(movement => usedMovementIds.add(movement.id));

            const hasSettlementEvidence = linkedMovements.some(movement => movement.direction === 'in');

            return {
                id: entry.parameter.jobId,
                kind: 'create',
                job: null,
                createTx: entry.tx,
                parameter: entry.parameter,
                movements: dedupeMovements(linkedMovements),
                status: hasSettlementEvidence ? 'ALREADY_SETTLED' : 'REJECTED',
                statusLabel: hasSettlementEvidence ? 'Already settled' : 'Rejected',
                lifecycle: 'unknown',
                outcome: hasSettlementEvidence ? 'settled' : 'rejected',
                timestamp: entry.tx?.timestamp || 0,
            };
        });

    const orphanMovements = movements
        .filter(movement => !usedMovementIds.has(movement.id))
        .map(movement => ({
            id: movement.id,
            kind: 'movement',
            job: null,
            createTx: null,
            parameter: null,
            movements: [movement],
            status: movement.direction === 'out' ? 'ASSETS_SENT' : 'SETTLEMENT',
            statusLabel: movement.direction === 'out' ? 'Assets sent to Omno' : 'Settlement movement',
            lifecycle: 'unknown',
            outcome: 'movement',
            timestamp: movement.timestamp || 0,
        }));

    return [...jobEvents, ...createOnlyEvents, ...orphanMovements].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
};
