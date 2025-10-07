import { uuid } from 'uuidv4';
import { sendMessage, transferAsset } from '../Ardor/ardorInterface';
import { OMNO_ACCOUNT, OMNO_API } from '../../data/CONSTANTS';
import { getCraftPotionMessage } from '../../utils/elyxirUtils';
import axios from 'axios';

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
 * @param {Array<{asset: string, qnt: number}>} [params.mergedAssets=[]] - List of assets and quantities to merge for the potion.
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
    mergedAssets = [],
}) => {
    if (!mergedAssets.length) return;

    const jobId = uuid();

    const message = getCraftPotionMessage({
        accountId,
        recipeAssetId,
        creationAssetId,
        flaskAssetId,
        durationBlocks,
        jobId,
    });

    // await Promise.all(
    //     mergedAssets.map(({ asset, qnt }) =>
    //         transferAsset({
    //             asset,
    //             quantityQNT: qnt,
    //             message,
    //             recipient: OMNO_ACCOUNT,
    //             passPhrase: passphrase,
    //         })
    //     )
    // );

    return await sendMessage({ recipient: OMNO_ACCOUNT, message, passPhrase: passphrase });
};
