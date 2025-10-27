import {
    ASSETS_IDS,
    BURNACCOUNT,
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
    STARTED_BURNING,
    WETHASSET,
} from '../data/CONSTANTS';

import {
    getAccountAssets,
    getAskOrders,
    getAssetsByIssuer,
    getBidOrders,
    getBlockchainTransactions,
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
        // console.error('🚀 ~ isJSON ~ e:', e);
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
    // Get burned amounts once for all currency assets
    const burnedAmounts = await getBurnedAmounts();

    const response = await Promise.all(
        currencyAssets.map(async asset => {
            const [account, currencyAsset] = await Promise.all([getAccountAssets(accountRs), getAssetsByIssuer(asset)]);
            return await cardsGenerator(account.accountAssets, currencyAsset, fetchOrders, burnedAmounts);
        })
    );
    return response; // Don't flatten - each element should be an array for one currency asset
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
                    contractPaysWithdrawFee: true,
                    value: {
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
    if (parseInt(giftzBalance) < parseInt(noPacks)) return false;

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
    // Get burned amounts once for all cards to avoid repeated API calls
    const burnedAmounts = await getBurnedAmounts();

    var ret = await Promise.all(
        collectionAssets.map(async asset => {
            const accountAsset = accountAssets.find(a => a.asset === asset.asset);
            const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
            const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
            if (asset.description) {
                let newAsset = await cardInfoGenerator(
                    asset,
                    quantityQNT,
                    unconfirmedQuantityQNT,
                    fetchOrders,
                    burnedAmounts
                );
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

function cleanJSON(jsonString) {
    return jsonString
        .replace(/\bNaN\b/g, 'null') // Reemplaza NaN por null
        .replace(/\t/g, 'null') // Reemplaza tabulaciones por null
        .replace(/[\n\r]/g, '') // Elimina nuevas líneas y retornos de carro
        .replace(/\\n/g, '') // Elimina las secuencias de escape de nuevas líneas
        .replace(/\\r/g, ''); // Elimina las secuencias de escape de retornos de carro
}

export const cardInfoGenerator = async (
    asset,
    quantityQNT,
    unconfirmedQuantityQNT,
    fetchOrders = false,
    burnedAmounts = null
) => {
    let cardDetails = cleanJSON(asset.description);

    if (cardDetails) {
        if (isJSON(cardDetails)) {
            cardDetails = JSON.parse(cardDetails);
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

        // Use passed burnedAmounts or fetch if not provided (fallback for other uses)
        const burnedAmountsToUse = burnedAmounts || (await getBurnedAmounts());
        const burnedQuantity = burnedAmountsToUse[asset.asset] || 0;

        return {
            asset: asset.asset,
            assetname: asset.name,
            name: cardname,
            description: cardDetails.description,
            channel: fixContinent,
            rarity: cardDetails.rarity,
            quantityQNT: quantityQNT,
            totalQuantityQNT: totalQuantityQNT,
            burnedQuantity: burnedQuantity,
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

export const getBurnedAmounts = async () => {
    try {
        const transactions = await getBlockchainTransactions(2, BURNACCOUNT, true, STARTED_BURNING, -1);

        const assetTransfers = transactions.transactions?.filter(tx => tx.attachment?.asset) || [];

        return assetTransfers.reduce((acc, tx) => {
            const { asset, quantityQNT } = tx.attachment;
            acc[asset] = (acc[asset] || 0) + Number(quantityQNT);
            return acc;
        }, {});
    } catch (error) {
        console.error('🚀 ~ getBurnedAmounts ~ error', error);
        return {};
    }
};

export const getBurnTransactions = async (account = null, startTimestamp = STARTED_BURNING) => {
    try {
        const transactions = await getBlockchainTransactions(2, BURNACCOUNT, true, startTimestamp, -1);

        const assetTransfers = transactions.transactions?.filter(tx => tx.attachment?.asset) || [];
        const filteredTransfers = assetTransfers.filter(tx => tx.senderRS === account);

        return account ? filteredTransfers : assetTransfers;
    } catch (error) {
        console.error('🚀 ~ getBurnedAmounts ~ error', error);
        return {};
    }
};

// -------------------------------------------------
//               CHECK IF IS MB ASSET
// -------------------------------------------------

export const isMBAsset = asset => {
    return ASSETS_IDS.includes(asset);
};

export const STUCKED_CARDS_KEY = 'stuckedBattleCards';

/**
 * @name setStuckedBattleCards
 * @description Stores a snapshot of the currently selected battle cards in localStorage under the `stuckedCards` key.
 * Each card is counted by its `asset` ID to support duplicate cards. Also stores the current block height
 * to later verify if the data is outdated.
 * @param {Array<Object>} cards - An array of card objects, each containing at least an `asset` property.
 * @param {number} height - The current block height, used to detect outdated stored data.
 * @returns {Object} The stored payload object containing `stuckedCards` and `height`.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const setStuckedBattleCards = (cards, height) => {
    try {
        if (!Array.isArray(cards)) {
            console.warn('Expected an array of cards.');
            return {};
        }

        const newStucked = {};
        for (const card of cards) {
            if (card?.asset) {
                newStucked[card.asset] = (newStucked[card.asset] || 0) + 1;
            }
        }

        const existingData = JSON.parse(localStorage.getItem(STUCKED_CARDS_KEY)) || {};
        const existingStucked = existingData.stuckedCards || {};
        const existingHeight = existingData.height || 0;

        const mergedStucked = { ...existingStucked };
        for (const asset in newStucked) {
            mergedStucked[asset] = (mergedStucked[asset] || 0) + newStucked[asset];
        }

        const finalHeight = Math.max(existingHeight || 0, height || 0);

        const payload = { stuckedCards: mergedStucked, height: finalHeight };
        localStorage.setItem(STUCKED_CARDS_KEY, JSON.stringify(payload));

        return payload;
    } catch (error) {
        console.error('Failed to save stucked cards to localStorage:', error);
        return {};
    }
};

/**
 * @name getStuckedBattleCards
 * @description Retrieves the `stuckedCards` object from localStorage. If the data is missing
 * or fails to parse, returns an empty object as fallback. This function is used
 * to restore potentially stuck battle card selections from previous sessions.
 * @returns {Object} The parsed `stuckedCards` object from localStorage, or an empty object on failure.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const getStuckedBattleCards = () => {
    try {
        const stored = localStorage.getItem(STUCKED_CARDS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to parse stucked cards from localStorage:', error);
        return {};
    }
};

/**
 * @name cleanStuckedBattleCards
 * @description Removes the `stuckedCards` entry from localStorage if its stored `height`
 * does not match the current provided block height. Used to prevent outdated or
 * stuck battle card data from persisting across sessions.
 * @param {number} height - The current block height to compare against the stored one.
 * @returns {void}
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const cleanStuckedBattleCards = height => {
    try {
        const stored = JSON.parse(localStorage.getItem(STUCKED_CARDS_KEY));
        if (stored && stored.height !== height) {
            localStorage.removeItem(STUCKED_CARDS_KEY);
        }
    } catch (error) {
        console.error('Failed to clean stucked cards from localStorage:', error);
    }
};
