import { v4 as uuid } from 'uuid';
import { sendMessage, transferAsset } from '../Ardor/ardorInterface';
import { OMNO_ACCOUNT, OMNO_API, OMNO_CONTRACT } from '../../data/CONSTANTS';
import { getCraftPotionMessage } from '../../utils/elyxirUtils';
import axios from 'axios';

export const getFlaskAssets = async ({ silent = false } = {}) => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getElyxirState`);
        if (!response) return false;
        return response.data.elyxir.definition.flaskMultipliers;
    } catch (error) {
        if (!silent) console.error('🚀 ~ getFlaskAssets ~ error:', error);
        return false;
    }
};

export const getRecipesDefinition = async () => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getElyxirState`);
        if (!response) return false;
        return response.data.elyxir.definition.recipes;
    } catch (error) {
        console.error('🚀 ~ getRecipesDefinition ~ error:', error);
        return false;
    }
};

export const getElyxirConfiguration = async () => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getElyxirState`);
        if (!response) return false;
        return response.data.elyxir;
    } catch (error) {
        console.error('🚀 ~ getElyxirConfiguration ~ error:', error);
        return false;
    }
};

export const getUserJobs = async ({ accountId }) => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getElyxirState`);
        if (!response?.data?.elyxir) return [];

        const normalizeJobs = (rawJobs = {}, archived = false) =>
            Object.entries(rawJobs || {}).map(([jobId, jobData]) => ({
                ...jobData,
                jobId,
                canonicalJobId: jobId,
                archived,
            }));

        let jobs = [
            ...normalizeJobs(response.data.elyxir.jobs, false),
            ...normalizeJobs(response.data.elyxir.completedJobs, true),
        ];

        jobs = jobs.filter(job => job.owner === accountId);

        return jobs;
    } catch (error) {
        console.error('🚀 ~ getUserJobs ~ error:', error);
        return [];
    }
};

/**
 * @name sendCraftPotionAssets
 * @description Sends all required assets for potion crafting to the crafting contract.
 * @param {Object[]} mergedAssets - Array of assets to transfer with quantities.
 * @param {string} passphrase - The user's passphrase for transaction signing.
 * @returns {Promise<boolean>} Returns true if all transfers succeed, false otherwise.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const sendCraftPotionAssets = async ({ mergedAssets = [], passphrase }) => {
    try {
        if (!mergedAssets.length) return false;

        const results = await Promise.all(
            mergedAssets.map(({ asset, qnt }) =>
                transferAsset({
                    asset,
                    quantityQNT: qnt,
                    message: JSON.stringify({ contract: OMNO_CONTRACT }),
                    recipient: OMNO_ACCOUNT,
                    passPhrase: passphrase,
                    messagePrunable: true,
                    deadline: 361,
                    priority: 'HIGH',
                })
            )
        );

        return results.every(Boolean);
    } catch (error) {
        console.error('🚀 ~ sendCraftPotionAssets ~ error:', error);
        return false;
    }
};

/**
 * @name sendCraftPotionMessage
 * @description Sends multiple asset transfer transactions to craft a potion, each including a shared message payload.
 * @param {Object} params - Function parameters.
 * @param {string} params.accountId - The account ID of the sender.
 * @param {string} params.recipeAssetId - The recipe asset ID used for crafting.
 * @param {string} params.creationAssetId - The resulting creation asset ID.
 * @param {string} params.flaskAssetId - The flask asset ID required for the craft.
 * @param {number} params.durationBlocks - Duration of the crafting process in blocks.
 * @param {string} params.passphrase - The sender's account passphrase.
 * @returns {Promise<void>} Resolves when all transfers are completed.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const sendCraftPotionMessage = async ({
    accountId,
    recipeAssetId,
    creationAssetId,
    flaskAssetId,
    durationBlocks,
    passphrase,
    blockId,
}) => {
    try {
        const jobId = uuid();

        const message = getCraftPotionMessage({
            accountId,
            recipeAssetId,
            creationAssetId,
            flaskAssetId,
            durationBlocks,
            jobId,
            blockId,
        });

        return await sendMessage({ recipient: OMNO_ACCOUNT, message, passPhrase: passphrase });
    } catch (error) {
        console.error('🚀 ~ sendCraftPotionMessage ~ error:', error);
        return false;
    }
};
