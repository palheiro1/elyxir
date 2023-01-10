import {
    CATOBLEPASASSETWRONG,
    IMGURL,
    IMG_MD_PATH,
    IMG_THUMB_PATH,
    MARUXAINAASSETWRONG,
    NODEURL,
    QUANT_COMMON,
    QUANT_RARE,
    QUANT_SPECIAL,
    QUANT_VERYRARE,
    REFERRALASSET,
    SASQUATCHASSET,
} from '../data/CONSTANTS';
import { getAccountAssets, getAskOrders, getAssetsByIssuer, getBidOrders } from '../services/Ardor/ardorInterface';
import axios from 'axios';

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

export const fetchAllCards = (accountRs, collectionRs, specialRs, fetchOrders = false) => {
    
    return axios.all([getAccountAssets(NODEURL, accountRs), getAssetsByIssuer(NODEURL, collectionRs), getAssetsByIssuer(NODEURL, specialRs)]).then(
        axios.spread(function (account, collectionAssets, specialAssets) {
            //blacklisting the REF asset, its from the same account as the special cards
            let specialCards = specialAssets.filter(
                asset => asset.asset !== REFERRALASSET && asset.asset !== SASQUATCHASSET && asset.asset !== MARUXAINAASSETWRONG
            );

            let fullCollection = collectionAssets.concat(specialCards).filter(asset => asset.asset !== CATOBLEPASASSETWRONG);
            return cardsGenerator(account.accountAssets, fullCollection, fetchOrders);
        })
    );
};

// -------------------------------------------------
//            CARDS UTILS FOR INVENTORY
// -------------------------------------------------

export function cardsGenerator(accountAssets, collectionAssets, fetchOrders = false) {
    var ret = [];

    collectionAssets.forEach(function (asset) {
        const accountAsset = accountAssets.find(a => a.asset === asset.asset);
        const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
        const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
        if (asset.description) {
            let newAsset = cardInfoGenerator(asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders);
            if (newAsset !== undefined) {
                ret.push(newAsset);
            }
        }
    });
    return ret;
}

export function cardInfoGenerator(asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders = false) {
    const new_description = asset.description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null');

    if (new_description) {
        let cardDetails = new_description;
        if (isJSON(new_description)) {
            cardDetails = JSON.parse(new_description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null'));
        }

        let askOrders = [];
        let bidOrders = [];
        if (fetchOrders) {
            getAskOrders(NODEURL, asset.asset).then(response => {
                askOrders = response.askOrders;
            });
            getBidOrders(NODEURL, asset.asset).then(response => {
                bidOrders = response.bidOrders;
            });
        }

        let totalQuantityQNT = 0;
        if (cardDetails.rarity === 'special') {
            totalQuantityQNT = QUANT_SPECIAL;
        } else if (cardDetails.rarity === 'very rare') {
            totalQuantityQNT = QUANT_VERYRARE;
        } else if (cardDetails.rarity === 'rare') {
            totalQuantityQNT = QUANT_RARE;
        } else if (cardDetails.rarity === 'common') {
            totalQuantityQNT = QUANT_COMMON;
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
}
