import {
    BLACKLIST_ASSETS,
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

const SILENT_REQUEST = { silent: true };

const safeOptional = async (task, fallback) => {
    try {
        const value = await task();
        if (value === false || value === undefined || value === null) {
            return { value: fallback, failed: true };
        }
        return { value, failed: false };
    } catch (error) {
        return { value: fallback, failed: true };
    }
};

const asArray = value => (Array.isArray(value) ? value : []);

const mergeAssetLists = (itemsAssets = [], accountAssets = []) => {
    const assetsById = new Map();

    asArray(itemsAssets).forEach(asset => {
        if (asset?.asset) assetsById.set(asset.asset, asset);
    });

    asArray(accountAssets).forEach(asset => {
        if (asset?.asset && !assetsById.has(asset.asset) && isElyxirAsset(asset.asset)) {
            assetsById.set(asset.asset, { asset: asset.asset });
        }
    });

    return Array.from(assetsById.values());
};

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
    const accountAssetsResponse = await getAccountAssets(accountRs);
    if (!Array.isArray(accountAssetsResponse?.accountAssets)) {
        throw new Error('Failed to fetch Ardor account assets');
    }

    const accountAssets = accountAssetsResponse.accountAssets;
    const [itemsAssetsResult, accountIdResult] = await Promise.allSettled([
        getAssetsByIssuer(ITEMSACCOUNT, SILENT_REQUEST),
        Promise.resolve().then(() => addressToAccountId(accountRs)),
    ]);

    const itemsAssets =
        itemsAssetsResult.status === 'fulfilled' && asArray(itemsAssetsResult.value).length > 0
            ? itemsAssetsResult.value
            : accountAssets.map(asset => ({ asset: asset.asset }));
    const accountId = accountIdResult.status === 'fulfilled' ? accountIdResult.value : null;

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
    const validAssets = mergeAssetLists(itemsAssets, accountAssets).filter(asset => !BLACKLIST_ASSETS.includes(asset.asset));

    const itemsBonusResult = await safeOptional(() => getItemsForBonus(), []);

    const itemsOmnoBalanceResult = await safeOptional(
        () => (accountId ? getOmnoItemsBalance(accountId, validAssets) : Promise.resolve([])),
        []
    );
    const { stuckedCards } = getStuckedBattleCards();
    const flaskMultipliersResult = await safeOptional(() => getFlaskAssets(SILENT_REQUEST), {});

    const itemsBonus = asArray(itemsBonusResult.value);
    const itemsOmnoBalance = asArray(itemsOmnoBalanceResult.value);
    const flaskMultipliers = flaskMultipliersResult.value || {};

    const formattedAssets = await Promise.all(
        validAssets.map(async asset => {
            const accountAsset = asArray(accountAssets).find(a => a.asset === asset.asset);
            const stuckedQnt = stuckedCards?.[asset.asset] || 0;

            let askOrders = [];
            let bidOrders = [];
            let askOmnoOrders = [];
            let bidOmnoOrders = [];
            let lastPrice = 0;
            let lastOmnoPrice = 0;

            const assetDetailsResult = await safeOptional(() => getAsset(asset.asset, SILENT_REQUEST), {
                asset: asset.asset,
                name: asset.name || asset.asset,
                quantityQNT: 0,
            });
            const assetDetails = assetDetailsResult.value;
            const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
            const totalQuantityQNT = assetDetails?.quantityQNT || 0;
            const quantityQNT = Number(accountAsset?.quantityQNT) || 0;
            const type = getItemType(asset.asset);
            const bonus = itemsBonus.find(item => item.asset === assetDetails.asset)?.bonus;

            const multiplier = flaskMultipliers[asset.asset];
            const [askResponse, bidResponse, lastTradesResponse, omnoOrdersResponse] = await Promise.all([
                safeOptional(() => getAskOrders(asset.asset, SILENT_REQUEST), { askOrders: [] }),
                safeOptional(() => getBidOrders(asset.asset, SILENT_REQUEST), { bidOrders: [] }),
                safeOptional(() => getLastTrades(asset.asset, SILENT_REQUEST), { trades: [] }),
                safeOptional(() => getOmnoMarketOrdesForAsset(asset.asset, SILENT_REQUEST), {
                    askOrders: [],
                    bidOrders: [],
                }),
            ]);

            askOrders = asArray(askResponse.value.askOrders);
            bidOrders = asArray(bidResponse.value.bidOrders);
            askOmnoOrders = asArray(omnoOrdersResponse.value.askOrders);
            bidOmnoOrders = asArray(omnoOrdersResponse.value.bidOrders);

            if (asArray(lastTradesResponse.value.trades).length > 0) {
                const auxLastPrice = lastTradesResponse.value.trades[0].priceNQTPerShare / NQTDIVIDER;
                lastPrice = Number.isInteger(auxLastPrice) ? auxLastPrice : auxLastPrice.toFixed(2);
            }

            const omnoBalance = itemsOmnoBalance.find(item => item.asset === asset.asset);
            const omnoQuantity = omnoBalance ? Math.max(0, omnoBalance.quantityQNT - stuckedQnt) : 0;

            delete assetDetails.requestProcessingTime;
            const formattedAsset = {
                ...assetDetails,
                quantityQNT,
                totalQuantityQNT,
                imgUrl: type ? getItemImage(assetDetails.name, type) : undefined,
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
                metadataLoadFailed: assetDetailsResult.failed,
                marketLoadFailed:
                    askResponse.failed || bidResponse.failed || lastTradesResponse.failed || omnoOrdersResponse.failed,
                bonusLoadFailed: itemsBonusResult.failed,
                omnoLoadFailed: itemsOmnoBalanceResult.failed,
                flaskMultiplierLoadFailed: flaskMultipliersResult.failed,
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
