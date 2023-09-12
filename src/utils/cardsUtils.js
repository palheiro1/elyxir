import {
    ASSETS_IDS,
    BUYPACKACCOUNT,
    CATOBLEPASASSETWRONG,
    CURRENCY_ASSETS,
    GIFTZASSET,
    GIFTZ_OPEN_MACHINE,
    IMGURL,
    IMG_MD_PATH,
    IMG_THUMB_PATH,
    MARUXAINAASSETWRONG,
    NQTDIVIDER,
    OMNO_ACCOUNT,
    OMNO_CONTRACT,
    PACKPRICE,
    QUANT_COMMON,
    QUANT_RARE,
    QUANT_SPECIAL,
    QUANT_VERYRARE,
    REFERRALASSET,
    SASQUATCHASSET,
    WETHASSET,
} from '../data/CONSTANTS';

import {
    getAccountAssets,
    getAskOrders,
    getAssetsByIssuer,
    getBidOrders,
    getLastTrades,
    sendIgnis,
    transferAsset,
} from '../services/Ardor/ardorInterface';
import { getOmnoMarketOrdesForAsset } from '../services/Ardor/omnoInterface';

import { sendWETHWithMessage } from './walletUtils';

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
    const isCurrencyAsset = Object.keys(CURRENCY_ASSETS).includes(asset);
    return (
        (isCurrencyAsset ? CURRENCY_ASSETS[asset] : collectionCardsStatic.find(card => card.asset === asset)) || null
    );
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

export const fetchCurrencyAssets = async (accountRs, currencyAssets = [], fetchOrders = false) => {
    const response = await Promise.all(
        currencyAssets.map(async asset => {
            const [account, currencyAsset] = await Promise.all([getAccountAssets(accountRs), getAssetsByIssuer(asset)]);
            return await cardsGenerator(account.accountAssets, currencyAsset, fetchOrders);
        })
    );

    return response;
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

export const buyPackWithWETH = async (passphrase, noPacks, WETHBalance, selectedOffers = [], priceInWETH = 0) => {
    if (selectedOffers.length === 0 || noPacks === 0 || priceInWETH === 0) return false;

    const balance = WETHBalance * NQTDIVIDER;
    if (balance < priceInWETH) return false;

    /*
    const fee = await sendIgnis({
        amountNQT: "50000000",
        recipient: OMNO_ACCOUNT,
        passPhrase: passphrase,
        message: JSON.stringify({
            contract: OMNO_CONTRACT,
        }),
    });

    if (!fee) {
        console.error('🚀 ~ file: cardsUtils.js ~ line 156 ~ buyPackWithWETH ~ ERROR SENDING FEE');
        return false;
    }
    */

    const trades = selectedOffers.map(offer => {
        return {
            service: 'trade',
            request: 'accept',
            parameter: {
                id: offer.id.toString(),
                multiplier: offer.amount.toString(),
            },
        };
    });

    const message = JSON.stringify({
        contract: OMNO_CONTRACT,
        operation: [
            {
                service: 'platform',
                request: 'failClear',
            },
            ...trades,
            {
                service: 'user',
                request: 'withdraw',
                parameter: {
                    contractPaysWithdrawFee: true,
                    value: {
                        asset: {
                            [GIFTZASSET]: noPacks.toString(),
                        },
                    },
                    requireFailClear: true,
                },
            },
            {
                service: 'user',
                request: 'withdraw',
                parameter: {
                    value: {
                        contractPaysWithdrawFee: true,
                        asset: {
                            [WETHASSET]: priceInWETH.toString(),
                        },
                    },
                    requireFailSet: true,
                },
            },
            {
                service: 'platform',
                request: 'failClear',
            },
        ],
    });

    return await sendWETHWithMessage({
        amountNQT: priceInWETH,
        recipient: OMNO_ACCOUNT,
        passphrase: passphrase,
        message: message,
    });
};

export const openPackWithGiftz = async (passphrase, noPacks, giftzBalance) => {
    if (giftzBalance < noPacks) return false;

    const message = JSON.stringify({ contract: 'SellMachineGiftzAsset' });
    let response = false;

    try {
        response = await transferAsset({
            asset: GIFTZASSET,
            quantityQNT: noPacks,
            recipient: GIFTZ_OPEN_MACHINE,
            passPhrase: passphrase,
            message: message,
        });
    } catch (error) {
        console.error('🚀 ~ file: cardsUtils.js ~ line 242 ~ openPackWithGiftz ~ error', error);
    }

    return response;
};

/*
export const openPackWithGiftz = async (passphrase, noPacks, giftzBalance, ignisBalance) => {
    const amountNQT = noPacks * PACKPRICEGIFTZ;
    if (giftzBalance < amountNQT) return false;

    const message = JSON.stringify({ contract: 'IgnisAssetLottery' });

    if (parseFloat(Number(ignisBalance)) < parseFloat(0.1))
        return await transferCurrencyZeroFee(CURRENCY, amountNQT, BUYPACKACCOUNT, passphrase, message, true);
    else return await transferCurrency(CURRENCY, amountNQT, BUYPACKACCOUNT, passphrase, message, true);
};
*/

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
        let askOmnoOrders = [];
        let bidOmnoOrders = [];
        let lastPrice = 0;
        let lastOmnoPrice = 0;
        if (fetchOrders) {
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
        }

        let totalQuantityQNT = 0;
        let rarity = RARITY_MAP[cardDetails.rarity];
        if (rarity) {
            totalQuantityQNT = rarity.quantity;
            cardDetails.rarity = rarity.name;
        }

        const cardname = getTruncatedName(cardDetails.name);
        const fixContinent = cardDetails.channel === 'Europa' ? 'Europe' : cardDetails.channel;

        return {
            asset: asset.asset,
            assetname: asset.name,
            name: cardname,
            description: cardDetails.description,
            channel: fixContinent,
            rarity: cardDetails.rarity,
            quantityQNT: quantityQNT,
            totalQuantityQNT: totalQuantityQNT,
            unconfirmedQuantityQNT: unconfirmedQuantityQNT,
            lastPrice: lastPrice,
            lastOmnoPrice: lastOmnoPrice,
            cardImgUrl: getTarascaImage(asset.name),
            cardThumbUrl: getThumbsImage(asset.name),
            askOrders: askOrders,
            bidOrders: bidOrders,
            askOmnoOrders: askOmnoOrders,
            bidOmnoOrders: bidOmnoOrders,
        };
    }
};

// -------------------------------------------------
//               CHECK IF IS MB ASSET
// -------------------------------------------------

export const isMBAsset = asset => {
    return ASSETS_IDS.includes(asset);
};
