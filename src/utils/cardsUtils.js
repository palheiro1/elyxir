import {
    CATOBLEPASASSETWRONG,
    IMGURL,
    IMG_MD_PATH,
    IMG_THUMB_PATH,
    MARUXAINAASSETWRONG,
    QUANT_COMMON,
    QUANT_RARE,
    QUANT_SPECIAL,
    QUANT_VERYRARE,
    REFERRALASSET,
    SASQUATCHASSET,
} from '../data/CONSTANTS';
import { getAccountAssets, getAskOrders, getAssetsByIssuer, getBidOrders } from '../services/Ardor/ardorInterface';

// -------------------------------------------------
//                  CARDS UTILS
// -------------------------------------------------

export function isJSON(str) {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

function getTarascaImage(name) {
    const imgurl = IMGURL + IMG_MD_PATH + name + '.jpg';
    return imgurl;
}

function getThumbsImage(name) {
    const imgurl = IMGURL + IMG_THUMB_PATH + name + '.jpg';
    return imgurl;
}

// -------------------------------------------------
//                  CARDS FETCH
// -------------------------------------------------

export const fetchAllCards = async (accountRs, collectionRs, specialRs, fetchOrders = false) => {
    const [account, collectionAssets, specialAssets] = await Promise.all([
        getAccountAssets(accountRs),
        getAssetsByIssuer(collectionRs),
        getAssetsByIssuer(specialRs),
    ]);
    const blacklistedAssets = [REFERRALASSET, SASQUATCHASSET, MARUXAINAASSETWRONG];
    const specialCards = specialAssets.filter(asset => !blacklistedAssets.includes(asset.asset));
    const fullCollection = collectionAssets.concat(specialCards).filter(asset => asset.asset !== CATOBLEPASASSETWRONG);
    return await cardsGenerator(account.accountAssets, fullCollection, fetchOrders);
};

// -------------------------------------------------
//            CARDS UTILS FOR INVENTORY
// -------------------------------------------------

export const cardsGenerator = async (accountAssets, collectionAssets, fetchOrders = false) => {
    var ret = [];

    for (let index = 0; index < collectionAssets.length; index++) {
        const asset = collectionAssets[index];
        const accountAsset = accountAssets.find(a => a.asset === asset.asset);
        const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
        const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
        if (asset.description) {
            let newAsset = await cardInfoGenerator(asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders);
            if (newAsset !== undefined) {
                ret.push(newAsset);
            }
        }
    }

    return ret;
};

export const cardInfoGenerator = async (asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders = false) => {
    const new_description = asset.description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null');

    if (new_description) {
        let cardDetails = new_description;
        if (isJSON(new_description)) {
            cardDetails = JSON.parse(new_description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null'));
        }

        let askOrders = [];
        let bidOrders = [];
        if (fetchOrders) {
            await getAskOrders(asset.asset).then(response => {
                askOrders = response.askOrders;
            });
            await getBidOrders(asset.asset).then(response => {
                bidOrders = response.bidOrders;
            });
        }

        let totalQuantityQNT = 0;
        if (cardDetails.rarity === 'special') {
            totalQuantityQNT = QUANT_SPECIAL;
            cardDetails.rarity = 'Special';
        } else if (cardDetails.rarity === 'very rare') {
            totalQuantityQNT = QUANT_VERYRARE;
            cardDetails.rarity = 'Epic';
        } else if (cardDetails.rarity === 'rare') {
            totalQuantityQNT = QUANT_RARE;
            cardDetails.rarity = 'Rare';
        } else if (cardDetails.rarity === 'common') {
            totalQuantityQNT = QUANT_COMMON;
            cardDetails.rarity = 'Common';
        }

        let cardname = cardDetails.name === 'Kăk-whăn’-û-ghăt Kǐg-û-lu’-nǐk' ? 'Kăk-whăn’ ...' : cardDetails.name;

        return {
            asset: asset.asset,
            assetname: asset.name,
            name: cardname,
            description: cardDetails.description,
            channel: cardDetails.channel,
            rarity: cardDetails.rarity,
            quantityQNT: quantityQNT,
            totalQuantityQNT: totalQuantityQNT,
            unconfirmedQuantityQNT: unconfirmedQuantityQNT,
            totalQuantitiyQNT: asset.quantityQNT,
            cardImgUrl: getTarascaImage(asset.name),
            cardThumbUrl: getThumbsImage(asset.name),
            askOrders: askOrders,
            bidOrders: bidOrders,
        };
    } else {
        return undefined;
    }
};
