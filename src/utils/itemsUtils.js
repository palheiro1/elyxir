import axios from 'axios';
import { IMGURL, ITEMSACCOUNT } from '../data/CONSTANTS';
import { addressToAccountId, getAccountAssets, getAsset, getAssetsByIssuer } from '../services/Ardor/ardorInterface';

export const fetchAllItems = async accountRs => {
    const [{ accountAssets }, itemsAssets, accountId] = await Promise.all([
        getAccountAssets(accountRs),
        getAssetsByIssuer(ITEMSACCOUNT),
        addressToAccountId(accountRs),
    ]);
    return itemsGenerator(accountAssets, itemsAssets, accountId);
};

export const getOmnoItemsBalance = async (accountId, itemsAssets) => {
    const response = await axios.get('https://api.mythicalbeings.io/index.php?action=getOmnoUserState');

    const accountData = response.data.find(item => item.id === accountId);
    if (!accountData || !accountData.balance?.asset) return [];

    const userBalance = accountData.balance.asset;

    const itemsBalance = itemsAssets
        .map(asset => {
            const quantityQNT = Number(userBalance[asset.asset] || 0);
            return {
                asset: asset.asset,
                quantityQNT,
            };
        })
        .filter(item => item.quantityQNT > 0);

    return itemsBalance;
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
    const itemsBonus = fetchItemsBonus();

    const itemsOmnoBalance = await getOmnoItemsBalance(accountId, itemsAssets);
    const formattedAssets = await Promise.all(
        itemsAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);

            if (!accountAsset) return null;

            const assetDetails = await getAsset(accountAsset.asset);
            const totalQuantityQNT = assetDetails?.quantityQNT || 0;
            const quantityQNT = Number(accountAsset?.quantityQNT) || 0;
            const bonus = itemsBonus.find(item => item.asset === assetDetails.asset)?.bonus;

            const omnoBalance = itemsOmnoBalance.find(item => item.asset === accountAsset.asset);
            const omnoQuantity = omnoBalance ? omnoBalance.quantityQNT : 0;

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

export const getItemImage = itemName => {
    if (!itemName || itemName === '') return;
    return `${IMGURL}potions/${itemName}.png`;
};

export const fetchItemsBonus = () => {
    //Mock by the moment. Will be configured on omno
    const itemsBonus = [
        {
            asset: '6485210212239811',
            bonus: {
                type: 'medium',
                value: 2,
                power: 1,
            },
        },
        {
            asset: '7582224115266007515',
            bonus: {
                type: 'medium',
                power: 1,
                value: 3,
            },
        },
        {
            asset: '10474636406729395731',
            bonus: {
                type: 'medium',
                power: 1,
                value: 1,
            },
        },
        {
            asset: '5089659721388119266',
            bonus: {
                type: 'domain',
                power: 1,
                value: 1,
            },
        },
        {
            asset: '8693351662911145147',
            bonus: {
                type: 'domain',
                power: 1,
                value: 2,
            },
        },
        {
            asset: '11206437400477435454',
            bonus: {
                power: 1,
                type: 'domain',
                value: 3,
            },
        },
        {
            asset: '12861522637067934750',
            bonus: {
                power: 1,
                type: 'domain',
                value: 4,
            },
        },
        {
            asset: '3858707486313568681',
            bonus: {
                type: 'domain',
                power: 1,
                value: 5,
            },
        },
    ];

    return itemsBonus;
};
