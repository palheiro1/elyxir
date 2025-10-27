import {
    FLASKS_ASSETS,
    IMGURL,
    INGREDIENTS_ASSETS,
    ITEMSACCOUNT,
    NQTDIVIDER,
    POTIONS_ASSETS,
    RECIPES_ASSETS,
    TOOLS_ASSETS,
    isElyxirAsset,
} from '../data/CONSTANTS';
import {
    addressToAccountId,
    getAccountAssets,
    getAskOrders,
    getAsset,
    getAssetsByIssuer,
    getBidOrders,
    getLastTrades,
} from '../services/Ardor/ardorInterface';
import { getOmnoMarketOrdesForAsset } from '../services/Ardor/omnoInterface';
import { getFlaskAssets } from '../services/Elyxir/elyxir';
import { getItemsForBonus, getOmnoItemsBalance } from '../services/Items/Items';
import { getStuckedBattleCards } from './cardsUtils';

/**
 * @name getItemType
 * @description Returns the type of an asset based on predefined asset groups.
 * @param {string} asset - Asset identifier.
 * @returns {string|undefined} The asset type if found, otherwise undefined.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const getItemType = asset => {
    if (POTIONS_ASSETS.includes(asset)) return 'potion';
    if (INGREDIENTS_ASSETS.includes(asset)) return 'ingredient';
    if (TOOLS_ASSETS.includes(asset)) return 'tool';
    if (FLASKS_ASSETS.includes(asset)) return 'flask';
    if (RECIPES_ASSETS.includes(asset)) return 'recipe';
};

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
    const flaskMultipliers = await getFlaskAssets();

    const formattedAssets = await Promise.all(
        itemsAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);
            const stuckedQnt = stuckedCards?.[asset.asset] || 0;

            let askOrders = [];
            let bidOrders = [];
            let askOmnoOrders = [];
            let bidOmnoOrders = [];
            let lastPrice = 0;
            let lastOmnoPrice = 0;

            const assetDetails = await getAsset(asset.asset);
            const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
            const totalQuantityQNT = assetDetails?.quantityQNT || 0;
            const quantityQNT = Number(accountAsset?.quantityQNT) || 0;
            const type = getItemType(asset.asset);
            const bonus = itemsBonus.find(item => item.asset === assetDetails.asset)?.bonus;

            const multiplier = flaskMultipliers[asset.asset];
            const [askResponse, bidResponse, lastTradesResponse, omnoOrdersResponse] = await Promise.all([
                getAskOrders(asset.asset),
                getBidOrders(asset.asset),
                getLastTrades(asset.asset),
                getOmnoMarketOrdesForAsset(asset.asset),
            ]);

            askOrders = askResponse.askOrders;
            bidOrders = bidResponse.bidOrders;
            askOmnoOrders = omnoOrdersResponse.askOrders;
            bidOmnoOrders = omnoOrdersResponse.bidOrders;

            if (lastTradesResponse.trades.length > 0) {
                const auxLastPrice = lastTradesResponse.trades[0].priceNQTPerShare / NQTDIVIDER;
                lastPrice = Number.isInteger(auxLastPrice) ? auxLastPrice : auxLastPrice.toFixed(2);
            }

            const omnoBalance = itemsOmnoBalance.find(item => item.asset === asset.asset);
            const omnoQuantity = omnoBalance ? Math.max(0, omnoBalance.quantityQNT - stuckedQnt) : 0;

            delete assetDetails.requestProcessingTime;
            const formattedAsset = {
                ...assetDetails,
                quantityQNT,
                totalQuantityQNT,
                imgUrl: getItemImage(assetDetails.name, type),
                bonus,
                type,
                omnoQuantity,
                multiplier,
                askOrders,
                bidOrders,
                askOmnoOrders,
                bidOmnoOrders,
                lastPrice,
                lastOmnoPrice,
                unconfirmedQuantityQNT,
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
export const getItemImage = (itemName, type) => {
    if (!itemName || itemName === '') return;
    return `${IMGURL}elyxir/${type}s/${itemName.toLowerCase()}.png`;
};

export const isItemAsset = asset => {
    return isElyxirAsset(asset);
};
