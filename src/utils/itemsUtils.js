import { getStuckedBattleCards } from '../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';
import { IMGURL, ITEMS_ASSETS, ITEMSACCOUNT } from '../data/CONSTANTS';
import { addressToAccountId, getAccountAssets, getAsset, getAssetsByIssuer } from '../services/Ardor/ardorInterface';
import { getItemsForBonus, getOmnoItemsBalance } from '../services/Items/Items';

/**
 * @name fetchAllItems
 * @description Fetches all items for a given Ardor account.
 * Retrieves account assets, item definitions by issuer, and resolves account ID in parallel.
 * Then normalizes the data using `itemsGenerator`.
 * @param {string} accountRs - Ardor account RS identifier.
 * @returns {Promise<Array>} Promise resolving to a list of formatted items.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const fetchAllItems = async accountRs => {
    const [{ accountAssets }, itemsAssets, accountId] = await Promise.all([
        getAccountAssets(accountRs),
        getAssetsByIssuer(ITEMSACCOUNT),
        addressToAccountId(accountRs),
    ]);
    return itemsGenerator(accountAssets, itemsAssets, accountId);
};

/**
 * @name itemsGenerator
 * @description Formats assets by merging account and blockchain details.
 * @param {Array} accountAssets - List of account assets with quantities.
 * @param {Array} itemsAssets - List of target assets to fetch details for.
 * @returns {Promise<Array>} List of formatted assets.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const itemsGenerator = async (accountAssets, itemsAssets, accountId) => {
    const itemsBonus = await getItemsForBonus();

    const itemsOmnoBalance = await getOmnoItemsBalance(accountId, itemsAssets);
    const { stuckedCards } = getStuckedBattleCards();

    const formattedAssets = await Promise.all(
        itemsAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);
            const stuckedQnt = stuckedCards?.[asset.asset] || 0;

            const assetDetails = await getAsset(asset.asset);
            const totalQuantityQNT = assetDetails?.quantityQNT || 0;
            const quantityQNT = Number(accountAsset?.quantityQNT) || 0;
            const bonus = itemsBonus.find(item => item.asset === assetDetails.asset)?.bonus;

            const omnoBalance = itemsOmnoBalance.find(item => item.asset === asset.asset);
            const omnoQuantity = omnoBalance ? Math.max(0, omnoBalance.quantityQNT - stuckedQnt) : 0;

            delete assetDetails.requestProcessingTime;
            const formattedAsset = {
                ...assetDetails,
                quantityQNT,
                totalQuantityQNT,
                imgUrl: getItemImage(assetDetails.name),
                bonus,
                omnoQuantity,
            };

            return formattedAsset;
        })
    );

    return formattedAssets.filter(Boolean);
};

/**
 * @name getItemImage
 * @description Utility to generate the URL of an item image based on its name.
 * @param {string} itemName - Name of the item.
 * @returns {string|undefined} Fully qualified image URL, or undefined if no name is provided.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getItemImage = itemName => {
    if (!itemName || itemName === '') return;
    return `${IMGURL}potions/${itemName}.png`;
};

export const isItemAsset = asset => {
    return ITEMS_ASSETS.includes(asset);
};
