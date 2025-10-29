import { OMNO_CONTRACT } from '../data/CONSTANTS';

const K = Math.log(4.0) / 6.0; // ≈ 0.231049060186648
const A = 0.503968421;
const BLOCKS_PER_DAY = 1440.0;

export const calculateSuccessRateWithBlocks = durationBlocks => {
    const tDays = durationBlocks / BLOCKS_PER_DAY;
    return 1.0 - A * Math.exp(-K * tDays);
};

export const calculateSuccessRate = days => {
    return 1.0 - A * Math.exp(-K * days);
};

export const getCraftPotionMessage = ({
    accountId,
    jobId,
    recipeAssetId,
    creationAssetId,
    flaskAssetId,
    durationBlocks,
    testMode = false,
    blockId,
}) => {
    const message = {
        contract: OMNO_CONTRACT,
        operation: [
            {
                service: 'elyxir',
                request: 'create',
                parameter: {
                    jobId,
                    owner: accountId,
                    recipeAssetId,
                    creationAssetId,
                    flaskAssetId,
                    durationBlocks,
                    testMode,
                    blockId,
                },
            },
        ],
    };

    return JSON.stringify(message);
};

export const formatSuccessRate = value => Math.trunc(value * 10000) / 100;
