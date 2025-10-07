import { OMNO_CONTRACT } from '../data/CONSTANTS';
import { ELYXIR_CONFIG } from '../services/Elyxir/elyxirCrafting';

// Calculate success rate based on craft duration using actual DURATION_OPTIONS
export const calculateSuccessRate = days => {
    // Find the closest duration option or interpolate
    const options = ELYXIR_CONFIG.DURATION_OPTIONS;

    // Find exact match first
    const exactMatch = options.find(opt => opt.days === days);
    if (exactMatch) {
        return exactMatch.successChance;
    }

    // If no exact match, find the closest lower and upper bounds
    const sortedOptions = [...options].sort((a, b) => a.days - b.days);

    // If days is less than minimum, return minimum
    if (days <= sortedOptions[0].days) {
        return sortedOptions[0].successChance;
    }

    // If days is greater than maximum, return maximum
    if (days >= sortedOptions[sortedOptions.length - 1].days) {
        return sortedOptions[sortedOptions.length - 1].successChance;
    }

    // Linear interpolation between two closest values
    for (let i = 0; i < sortedOptions.length - 1; i++) {
        const lower = sortedOptions[i];
        const upper = sortedOptions[i + 1];

        if (days >= lower.days && days <= upper.days) {
            const ratio = (days - lower.days) / (upper.days - lower.days);
            return Math.round(lower.successChance + ratio * (upper.successChance - lower.successChance));
        }
    }

    // Fallback
    return 31;
};

export const getCraftPotionMessage = ({
    accountId,
    jobId,
    recipeAssetId,
    creationAssetId,
    flaskAssetId,
    durationBlocks,
    testMode = false,
}) => {
    const message = {
        contract: OMNO_CONTRACT,
        operation: {
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
            },
        },
    };

    return JSON.stringify(message);
};
