import { BLOCKTIME } from '../data/CONSTANTS';

export const BLOCKS_PER_DAY = Math.round(86400 / BLOCKTIME);
export const DEFAULT_MIN_DURATION_BLOCKS = BLOCKS_PER_DAY;
export const DEFAULT_MAX_DURATION_BLOCKS = BLOCKS_PER_DAY * 30;
export const RACE_START_ISO = '2026-06-15T00:01:00Z';
export const RACE_START_DATE = new Date(RACE_START_ISO);
export const RACE_START_ARDOR_TIMESTAMP = 266716860;
export const ARDOR_EPOCH_MS = Date.UTC(2018, 0, 1, 0, 0, 0);

const toFiniteNumber = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};

export const getDurationBounds = definition => {
    const minCandidate = toFiniteNumber(definition?.minDurationBlocks ?? definition?.min);
    const maxCandidate = toFiniteNumber(definition?.maxDurationBlocks ?? definition?.max);
    const min = minCandidate && minCandidate > 0 ? Math.floor(minCandidate) : DEFAULT_MIN_DURATION_BLOCKS;
    const max = maxCandidate && maxCandidate > 0 ? Math.floor(maxCandidate) : DEFAULT_MAX_DURATION_BLOCKS;

    return {
        min,
        max: Math.max(min, max),
    };
};

export const clampDurationBlocks = (value, bounds = {}) => {
    const min = toFiniteNumber(bounds.min) || DEFAULT_MIN_DURATION_BLOCKS;
    const max = Math.max(min, toFiniteNumber(bounds.max) || DEFAULT_MAX_DURATION_BLOCKS);
    const numeric = toFiniteNumber(value);
    if (!numeric) return min;
    return Math.min(max, Math.max(min, Math.round(numeric)));
};

export const getDurationPresets = bounds => {
    const safeBounds = getDurationBounds(bounds);
    const presets = [
        { label: '1d', blocks: BLOCKS_PER_DAY },
        { label: '2d', blocks: BLOCKS_PER_DAY * 2 },
        { label: '5d', blocks: BLOCKS_PER_DAY * 5 },
        { label: '10d', blocks: BLOCKS_PER_DAY * 10 },
        { label: 'Max', blocks: safeBounds.max },
    ];
    const seen = new Set();

    return presets
        .map(preset => ({ ...preset, blocks: clampDurationBlocks(preset.blocks, safeBounds) }))
        .filter(preset => {
            if (seen.has(preset.blocks)) return false;
            seen.add(preset.blocks);
            return true;
        });
};

export const blocksToDurationLabel = blocks => {
    const totalSeconds = Math.max(0, Number(blocks || 0) * BLOCKTIME);
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return 'Ready now';

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60);
    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes && days === 0) parts.push(`${minutes}m`);
    if (!parts.length) parts.push('1m');

    return parts.join(' ');
};

export const getApproxDateForBlocks = (blocks, now = new Date()) => {
    const numeric = toFiniteNumber(blocks);
    if (numeric == null) return null;
    return new Date(new Date(now).getTime() + numeric * BLOCKTIME * 1000);
};

export const getApproxDateForHeight = ({ targetHeight, currentHeight, now = new Date() }) => {
    const target = toFiniteNumber(targetHeight);
    const current = toFiniteNumber(currentHeight);
    if (target == null || current == null || current <= 0) return null;
    return getApproxDateForBlocks(target - current, now);
};

export const formatLocalDateTime = (dateInput, { year = false, timeZoneName = false } = {}) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(date.getTime())) return 'Date pending';

    return new Intl.DateTimeFormat(undefined, {
        ...(year ? { year: 'numeric' } : {}),
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...(timeZoneName ? { timeZoneName: 'short' } : {}),
    }).format(date);
};

export const formatUtcDateTime = dateInput => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(date.getTime())) return 'Date pending';

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short',
    }).format(date);
};

export const ardorTimestampToDate = timestamp => {
    const numeric = toFiniteNumber(timestamp);
    return numeric == null ? null : new Date(ARDOR_EPOCH_MS + numeric * 1000);
};

export const getJobResolveHeight = job => {
    const height = toFiniteNumber(job?.resolvedHeight ?? job?.endHeight ?? job?.startHeight);
    return height == null ? null : height;
};

export const getJobStartHeight = job => {
    const height = toFiniteNumber(job?.startHeight);
    return height == null ? null : height;
};

export const isJobSuccessful = job => {
    if (
        job?.isSuccess === false ||
        job?.success === false ||
        job?.resolvedStatus === 'FAILURE' ||
        job?.status === 'EXPLODED' ||
        job?.status === 'CATASTROPHIC'
    ) {
        return false;
    }

    return (
        job?.isSuccess === true ||
        job?.success === true ||
        job?.resolvedStatus === 'SUCCESS' ||
        job?.resolvedStatus === 'FINALIZED' ||
        job?.status === 'FINALIZED'
    );
};

const isPotionDelivered = job => (job?.testMode === true ? job?.creationDelivered === true : job?.creationDelivered !== false);

export const estimateHeightForDate = ({ currentHeight, date, now = new Date() }) => {
    const current = toFiniteNumber(currentHeight);
    const targetDate = date instanceof Date ? date : new Date(date);
    if (current == null || current <= 0 || Number.isNaN(targetDate.getTime())) return null;

    return Math.round(current + (targetDate.getTime() - new Date(now).getTime()) / (BLOCKTIME * 1000));
};

const compareRaceEntries = (left, right) => {
    if (left.ardorTimestamp != null && right.ardorTimestamp != null) return left.ardorTimestamp - right.ardorTimestamp;
    if (left.ardorTimestamp != null) return -1;
    if (right.ardorTimestamp != null) return 1;
    return Number(left.resolveHeight || 0) - Number(right.resolveHeight || 0);
};

export const buildRaceLeaderboard = ({ jobs = [], potions = [], blockTimestamps = {}, currentHeight, now = new Date() } = {}) => {
    const raceStartHeight = estimateHeightForDate({ currentHeight, date: RACE_START_DATE, now });
    const potionByAsset = new Map((potions || []).map(potion => [String(potion.asset), potion]));
    const winners = new Map();

    jobs.forEach(job => {
        if (!job || !isJobSuccessful(job) || !isPotionDelivered(job)) return;

        const startHeight = getJobStartHeight(job);
        const resolveHeight = getJobResolveHeight(job);
        if (startHeight == null || resolveHeight == null) return;

        const startArdorTimestamp = toFiniteNumber(blockTimestamps[String(startHeight)]);
        const ardorTimestamp = toFiniteNumber(blockTimestamps[String(resolveHeight)]);
        const isStartedAfterRaceStart = startArdorTimestamp != null
            ? startArdorTimestamp >= RACE_START_ARDOR_TIMESTAMP
            : raceStartHeight != null && startHeight >= raceStartHeight;
        const isResolvedAfterRaceStart = ardorTimestamp != null
            ? ardorTimestamp >= RACE_START_ARDOR_TIMESTAMP
            : raceStartHeight != null && resolveHeight >= raceStartHeight;

        if (!isStartedAfterRaceStart || !isResolvedAfterRaceStart) return;

        const creationAssetId = String(job.creationAssetId || '');
        const entry = {
            ...job,
            potion: potionByAsset.get(creationAssetId) || null,
            creationAssetId,
            startHeight,
            resolveHeight,
            startArdorTimestamp,
            ardorTimestamp,
            startedDate: startArdorTimestamp != null ? ardorTimestampToDate(startArdorTimestamp) : null,
            resolvedDate: ardorTimestamp != null ? ardorTimestampToDate(ardorTimestamp) : null,
            verification: startArdorTimestamp != null && ardorTimestamp != null ? 'Verified block time' : 'Height estimate',
        };
        const previous = winners.get(creationAssetId);

        if (!previous || compareRaceEntries(entry, previous) < 0) {
            winners.set(creationAssetId, entry);
        }
    });

    return Array.from(winners.values()).sort((left, right) => {
        const leftName = left.potion?.name || left.creationAssetId;
        const rightName = right.potion?.name || right.creationAssetId;
        return leftName.localeCompare(rightName);
    });
};

export const buildRacePotionStatuses = ({ recipes = [], potions = [], leaderboard = [] } = {}) => {
    const potionByAsset = new Map((potions || []).map(potion => [String(potion.asset), potion]));
    const recipeByCreationAsset = new Map(
        (recipes || [])
            .filter(recipe => recipe?.creationAssetId)
            .map(recipe => [String(recipe.creationAssetId), recipe])
    );
    const deliveryByCreationAsset = new Map(
        (leaderboard || [])
            .filter(entry => entry?.creationAssetId)
            .map(entry => [String(entry.creationAssetId), entry])
    );
    const creationAssetIds = Array.from(
        new Set([
            ...Array.from(recipeByCreationAsset.keys()),
            ...Array.from(deliveryByCreationAsset.keys()),
        ])
    );

    return creationAssetIds
        .map(creationAssetId => {
            const delivery = deliveryByCreationAsset.get(creationAssetId) || null;
            const recipe = recipeByCreationAsset.get(creationAssetId) || null;

            return {
                creationAssetId,
                recipe,
                potion: delivery?.potion || potionByAsset.get(creationAssetId) || null,
                delivery,
                isDelivered: Boolean(delivery),
                rewardAsset: 'GIFTZ',
                rewardQuantity: 1,
            };
        })
        .sort((left, right) => {
            if (left.isDelivered !== right.isDelivered) return left.isDelivered ? -1 : 1;
            const leftName = left.potion?.name || left.creationAssetId;
            const rightName = right.potion?.name || right.creationAssetId;
            return leftName.localeCompare(rightName);
        });
};
