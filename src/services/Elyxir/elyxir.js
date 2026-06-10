import { v4 as uuid } from 'uuid';
import { sendMessage, transferAsset } from '../Ardor/ardorInterface';
import { OMNO_ACCOUNT, OMNO_API, OMNO_CONTRACT } from '../../data/CONSTANTS';
import { getCraftPotionMessage } from '../../utils/elyxirUtils';
import axios from 'axios';

export const CRAFT_BATCH_REQUEST = 'MYTHICAL_ELYXIR_CRAFT_BATCH_REQUEST';
export const CRAFT_BATCH_RESPONSE = 'MYTHICAL_ELYXIR_CRAFT_BATCH_RESPONSE';
export const CRAFT_BATCH_PROGRESS = 'MYTHICAL_ELYXIR_CRAFT_BATCH_PROGRESS';

const CRAFT_BATCH_TIMEOUT_MS = 35 * 60 * 1000;

export const getFlaskAssets = async () => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getElyxirState`);
        if (!response) return false;
        return response.data.elyxir.definition.flaskMultipliers;
    } catch (error) {
        console.error('🚀 ~ getFlaskAssets ~ error:', error);
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
        if (!response?.data?.elyxir?.jobs) return [];

        const rawJobs = response.data.elyxir.jobs;

        let jobs = Object.entries(rawJobs).map(([jobId, jobData]) => ({
            jobId,
            ...jobData,
        }));

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
 * @param {Object} walletProvider - Optional Play Hub wallet provider for embedded signing.
 * @returns {Promise<boolean>} Returns true if all transfers succeed, false otherwise.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const sendCraftPotionAssets = async ({ mergedAssets = [], passphrase, walletProvider }) => {
    try {
        if (!mergedAssets.length) return false;
        if (!walletProvider && !passphrase) return false;

        const message = JSON.stringify({ contract: OMNO_CONTRACT });

        const responses = [];

        for (const { asset, qnt } of mergedAssets) {
            const response = walletProvider
                ? await walletProvider.transferAsset({
                      recipientRS: OMNO_ACCOUNT,
                      amount: {
                          assetId: asset,
                          quantityQNT: qnt,
                      },
                      message,
                      prunable: true,
                      priority: 'HIGH',
                  })
                : await transferAsset({
                      asset,
                      quantityQNT: qnt,
                      message,
                      recipient: OMNO_ACCOUNT,
                      passPhrase: passphrase,
                      messagePrunable: true,
                      deadline: 120,
                      priority: 'HIGH',
                  });

            if (!response) return false;
            responses.push(response);
        }

        return responses.every(Boolean);
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
 * @param {Object} params.walletProvider - Optional Play Hub wallet provider for embedded signing.
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
    walletProvider,
    blockId,
}) => {
    try {
        if (!walletProvider && !passphrase) return false;

        const jobId = uuid();

        const message = getCraftPotionMessage({
            accountId,
            recipeAssetId,
            creationAssetId,
            flaskAssetId,
            durationBlocks,
            jobId,
            testMode: true,
            blockId,
        });

        if (walletProvider) {
            return await walletProvider.sendMessage({
                recipientRS: OMNO_ACCOUNT,
                message,
                prunable: true,
                priority: 'HIGH',
            });
        }

        return await sendMessage({ recipient: OMNO_ACCOUNT, message, passPhrase: passphrase });
    } catch (error) {
        console.error('🚀 ~ sendCraftPotionMessage ~ error:', error);
        return false;
    }
};

export const requestCraftPotionBatch = ({
    walletHostOrigin,
    jobId = uuid(),
    recipeAssetId,
    creationAssetId,
    flaskAssetId,
    durationBlocks,
    blockId,
    onProgress,
}) => {
    return new Promise((resolve, reject) => {
        let targetOrigin;
        try {
            targetOrigin = new URL(walletHostOrigin).origin;
        } catch {
            reject(new Error('Invalid Play Hub wallet origin.'));
            return;
        }

        if (!window.parent || window.parent === window) {
            reject(new Error('Elyxir batch crafting must run inside Play Hub.'));
            return;
        }

        const requestId = window.crypto?.randomUUID?.() || uuid();
        const cleanup = () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeout);
        };
        const fail = error => {
            cleanup();
            reject(error);
        };
        const handleMessage = event => {
            if (event.origin !== targetOrigin) return;
            if (event.source !== window.parent) return;
            if (event.data?.requestId !== requestId) return;

            if (event.data?.type === CRAFT_BATCH_PROGRESS) {
                onProgress?.(event.data);
                return;
            }

            if (event.data?.type !== CRAFT_BATCH_RESPONSE) return;

            cleanup();
            if (event.data.ok) {
                resolve(event.data.result);
                return;
            }

            const error = new Error(event.data.error?.message || 'Wallet rejected Elyxir crafting.');
            error.code = event.data.error?.code;
            error.data = event.data.error?.data || event.data.error?.manifest;
            reject(error);
        };
        const timeout = setTimeout(() => {
            fail(new Error('Wallet batch request timed out.'));
        }, CRAFT_BATCH_TIMEOUT_MS);

        window.addEventListener('message', handleMessage);
        window.parent.postMessage(
            {
                type: CRAFT_BATCH_REQUEST,
                requestId,
                payload: {
                    jobId,
                    recipeAssetId,
                    creationAssetId,
                    flaskAssetId,
                    durationBlocks,
                    blockId,
                },
            },
            targetOrigin
        );
    });
};
