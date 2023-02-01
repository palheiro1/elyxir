import {
    BUYPACKACCOUNT,
    CATOBLEPASASSETWRONG,
    CURRENCY,
    GEMASSET,
    IMGURL,
    IMG_MD_PATH,
    IMG_THUMB_PATH,
    MARUXAINAASSETWRONG,
    NQTDIVIDER,
    PACKPRICE,
    PACKPRICEGIFTZ,
    QUANT_COMMON,
    QUANT_RARE,
    QUANT_SPECIAL,
    QUANT_VERYRARE,
    REFERRALASSET,
    SASQUATCHASSET,
} from '../data/CONSTANTS';

import {
    getAccountAssets,
    getAskOrders,
    getAssetsByIssuer,
    getBidOrders,
    getLastTrades,
    sendIgnis,
    transferCurrency,
    transferCurrencyZeroFee,
} from '../services/Ardor/ardorInterface';

// -------------------------------------------------
//                  CARDS UTILS
// -------------------------------------------------

export const isJSON = str => {
    try {
        return str && JSON.parse(str);
    } catch (e) {
        return false;
    }
};

export const getTarascaImage = name => {
    return `${IMGURL}${IMG_MD_PATH}${name}.jpg`;
};

export const getThumbsImage = name => {
    return `${IMGURL}${IMG_THUMB_PATH}${name}.jpg`;
};

export const getAsset = (asset, collectionCardsStatic) => {
    return asset === GEMASSET ? 'GEM' : collectionCardsStatic.find(card => card.asset === asset);
};

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

export const fetchGemCards = async (accountRs, gemRs, fetchOrders = false) => {
    const [account, gemAssets] = await Promise.all([getAccountAssets(accountRs), getAssetsByIssuer(gemRs)]);
    return await cardsGenerator(account.accountAssets, gemAssets, fetchOrders);
};

// -------------------------------------------------
//                  BUY PACKS
// -------------------------------------------------

export const buyPackWithIgnis = async (passphrase, noPacks, ignisBalance) => {
    const amountNQT = noPacks * PACKPRICE * NQTDIVIDER;
    const balance = ignisBalance * NQTDIVIDER;

    if (balance < amountNQT) return false;

    const message = JSON.stringify({ contract: 'IgnisAssetLottery' });

    return await sendIgnis({
        amountNQT: amountNQT,
        recipient: BUYPACKACCOUNT,
        passPhrase: passphrase,
        message: message,
        messagePrunable: true,
    });
};

export const buyPackWithGiftz = async (passphrase, noPacks, giftzBalance, ignisBalance) => {
    const amountNQT = noPacks * PACKPRICEGIFTZ;
    if (giftzBalance < amountNQT) return false;

    const message = JSON.stringify({ contract: 'IgnisAssetLottery' });

    if (parseFloat(Number(ignisBalance)) < parseFloat(0.1))
        return await transferCurrencyZeroFee(CURRENCY, amountNQT, BUYPACKACCOUNT, passphrase, message, true);
    else return await transferCurrency(CURRENCY, amountNQT, BUYPACKACCOUNT, passphrase, message, true);
};

// -------------------------------------------------
//            CARDS UTILS FOR INVENTORY
// -------------------------------------------------
export const cardsGenerator = async (accountAssets, collectionAssets, fetchOrders = false) => {
    var ret = await Promise.all(
        collectionAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);
            const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
            const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
            if (asset.description) {
                let newAsset = await cardInfoGenerator(asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders);
                if (newAsset !== undefined) {
                    return newAsset;
                }
            }
        })
    );
    return ret.filter(Boolean);
};

// -------------------------------------------------

const RARITY_MAP = {
    special: { quantity: QUANT_SPECIAL, name: 'Special' },
    'very rare': { quantity: QUANT_VERYRARE, name: 'Epic' },
    rare: { quantity: QUANT_RARE, name: 'Rare' },
    common: { quantity: QUANT_COMMON, name: 'Common' },
};

const getTruncatedName = name => (name === 'Kăk-whăn’-û-ghăt Kǐg-û-lu’-nǐk' ? 'Kăk-whăn’ ...' : name);

export const cardInfoGenerator = async (asset, quantityQNT, unconfirmedQuantityQNT, fetchOrders = false) => {
    const new_description = asset.description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null');

    if (new_description) {
        let cardDetails = new_description;
        if (isJSON(new_description)) {
            cardDetails = JSON.parse(new_description.replace(/\bNaN\b/g, 'null').replace(/\t/g, 'null'));
        }

        let askOrders = [];
        let bidOrders = [];
        let lastPrice = 0;
        if (fetchOrders) {
            const askResponse = await getAskOrders(asset.asset);
            askOrders = askResponse.askOrders;

            const bidResponse = await getBidOrders(asset.asset);
            bidOrders = bidResponse.bidOrders;

            const lastTradesResponse = await getLastTrades(asset.asset);
            lastPrice =
                lastTradesResponse.trades.length > 0 && lastTradesResponse.trades[0].priceNQTPerShare / NQTDIVIDER;
        }

        let totalQuantityQNT = 0;
        let rarity = RARITY_MAP[cardDetails.rarity];
        if (rarity) {
            totalQuantityQNT = rarity.quantity;
            cardDetails.rarity = rarity.name;
        }

        let cardname = getTruncatedName(cardDetails.name);

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
            lastPrice: lastPrice,
            cardImgUrl: getTarascaImage(asset.name),
            cardThumbUrl: getThumbsImage(asset.name),
            askOrders: askOrders,
            bidOrders: bidOrders,
        };
    }
};
