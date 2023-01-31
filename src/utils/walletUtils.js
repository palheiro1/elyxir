import { BUYPACKACCOUNT, CURRENCY, GEMASSET, JACKPOTACCOUNT, NQTDIVIDER } from '../data/CONSTANTS';
import { decrypt, getUser } from './storage';
import {
    createAskOrder,
    createBidOrder,
    fetchAssetCount,
    getAccountCurrencies,
    getAccountCurrentAskOrders,
    getAccountCurrentBidOrders,
    getAskOrders,
    getBidOrders,
    getIgnisBalance,
    sendIgnis,
    transferAsset,
    transferCurrency,
    transferCurrencyZeroFee,
    transferGEM,
} from '../services/Ardor/ardorInterface';
import { getAsset } from './cardsUtils';
import { handleConfirmateNotification, handleNewNotification } from './alerts';

export const handleNotifications = ({ unconfirmedTransactions, newsTransactions, accountRs, cardsNotification, setCardsNotification, toast, cards, onOpenCardReceived, setUnconfirmedTransactions }) => {
    const auxUnconfirmed = [...unconfirmedTransactions];

    // Check for new transactions
    for (const tx of newsTransactions) {
        const index = auxUnconfirmed.findIndex(t => t.fullHash === tx.fullHash);
        if (index === -1) {
            const isIncoming = tx.recipientRS === accountRs;
            handleNewNotification(tx, isIncoming, toast);
            auxUnconfirmed.push(tx);
        }
    }
    // Check for confirmed transactions
    const cardsForNotify = [...cardsNotification];
    for (const tx of auxUnconfirmed) {
        const index = newsTransactions.findIndex(t => t.fullHash === tx.fullHash);
        if (index === -1) {
            const isIncoming = tx.recipientRS === accountRs;
            const asset = getAsset(tx.attachment.asset, cards);
            const amount = Number(tx.attachment.quantityQNT);

            if (asset && asset !== 'GEM' && isIncoming) cardsForNotify.push({ asset, amount });
            else handleConfirmateNotification(tx, isIncoming, toast, onOpenCardReceived);

            auxUnconfirmed.splice(auxUnconfirmed.indexOf(tx), 1);
        }
    }

    setCardsNotification(cardsForNotify);
    // Set unconfirmed transactions
    setUnconfirmedTransactions(auxUnconfirmed);
};

/**
 * @name checkPin
 * @description Check pin user PIN and decrypt token
 * @param {String} user - User
 * @param {String} pin - Pin
 * @returns {Object} - User info if success, false if not
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This function is used to check the pin
 */
export const checkPin = (user, pin, needPassphrase = true) => {
    const recoverUser = getUser(user);
    const { token } = recoverUser;

    const passphrase = decrypt(token, pin);
    if (!passphrase) return false;

    if (!needPassphrase) return recoverUser;
    return {
        ...recoverUser,
        passphrase: passphrase,
    };
};

/**
 * @name getCurrentAskAndBids
 * @description Get current ask and bids
 * @param {String} account - Account address
 * @returns {Object} - Ask and bids orders
 * @author Jesús Sánchez Fernández
 * @version 0.1
 */
export const getCurrentAskAndBids = async account => {
    const askOrders = (await getAccountCurrentAskOrders(account)).askOrders;
    const bidOrders = (await getAccountCurrentBidOrders(account)).bidOrders;

    return { askOrders, bidOrders };
};

/**
 * @name getAskAndBids
 * @description Get ask and bids
 * @param {String} asset - Asset id
 * @returns {Object} - Ask and bids orders and asset count
 */
export const getAskAndBids = async asset => {
    const askOrders = (await getAskOrders(asset)).askOrders;
    const bidOrders = (await getBidOrders(asset)).bidOrders;
    const assetCount = await fetchAssetCount(asset);

    return { askOrders, bidOrders, assetCount };
};

/**
 * @name getGIFTZBalance
 * @description Get GIFTZ balance
 * @param {String} address - Account address
 * @author Jesús Sánchez Fernández
 */
export const getGIFTZBalance = async address => {
    const response = await getAccountCurrencies(address, CURRENCY);
    return Object.keys(response).length > 0 ? response : 0;
};

/**
 * @name getIGNISBalance
 * @description Get IGNIS balance
 * @param {String} account - Account address
 * @author Jesús Sánchez Fernández
 */
export const getIGNISBalance = async account => {
    const response = await getIgnisBalance(account);
    return Number(Math.min(response.balanceNQT / NQTDIVIDER, response.unconfirmedBalanceNQT / NQTDIVIDER)).toFixed(2);
};

/**
 * @name getMorphMessage
 * @description Get morph message
 * @param {String} asset - Asset id
 * @param {Number} noCards - Number of cards
 * @returns {String} - Message to send to morph
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This function is used to get the message to send to morph
 */
const getMorphMessage = (asset, noCards) => {
    return JSON.stringify({
        contract: 'TarascaDaoOmno',
        operation: [
            {
                service: 'cardmorph',
                request: 'morph',
                parameter: {
                    asset: asset,
                    count: ''.concat('', noCards, ''),
                    withdraw: true,
                },
            },
        ],
    });
};

/**
 * @name sendToMorph
 * @description Send cards to morph
 * @param {String} asset - Asset id
 * @param {Number} noCards - Number of cards
 * @param {String} passPhrase - Passphrase
 * @param {Number} cost - Cost of the morph
 * @returns {Boolean} - True if success, false if not
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This function is used to send cards to morph
 */
export const sendToMorph = async ({ asset, noCards, passPhrase, cost }) => {
    let success = true;
    const message = getMorphMessage(asset, noCards);

    const transferedAsset = await transferAsset({
        asset: asset,
        quantityQNT: noCards,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(error => {
        console.log('🚀 ~ file: ardorInterface.js:615 ~ sendToMorph ~ error', error);
        success = false;
    });

    if (!transferedAsset || !success) return false;

    // ----------------------------------

    const transferedGEM = await transferGEM({
        quantityQNT: cost * NQTDIVIDER,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(error => {
        console.log('🚀 ~ file: ardorInterface.js:634 ~ sendToMorph ~ error', error);
        success = false;
    });

    return transferedGEM && success;
};

/**
 * @name sendToCraft
 * @description Send cards to craft
 * @param {String} asset - Asset id
 * @param {Number} noCards - Number of cards
 * @param {String} passPhrase - Passphrase
 * @param {Number} cost - Cost of the craft
 * @returns {Boolean} - True if success, false if not
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This function is used to send cards to craft
 */
export const sendToCraft = async ({ asset, noCards, passPhrase, cost }) => {
    const message = JSON.stringify({ contract: 'TarascaDAOCardCraft' });
    let success = true;

    const transferedAsset = await transferAsset({
        asset: asset,
        quantityQNT: noCards,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(function (error) {
        console.log('🚀 ~ file: ardorInterface.js:669 ~ sendToCraft ~ error', error);
        success = false;
    });

    if (!transferedAsset || !success) return false;

    const transferedIgnis = await sendIgnis({
        amountNQT: cost * NQTDIVIDER,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(function (error) {
        console.log('🚀 ~ file: ardorInterface.js:685 ~ sendToCraft ~ error', error);
        success = false;
    });

    return transferedIgnis && success;
};

export const sendGiftz = async ({ passphrase, amountNQT, ignisBalance, recipient }) => {
    const amount = Number(amountNQT);

    if (parseFloat(Number(ignisBalance)) < parseFloat(0.1))
        return await transferCurrencyZeroFee(CURRENCY, amount, recipient, passphrase, '');
    else return await transferCurrency(CURRENCY, amount, recipient, passphrase, '');
};

export const sendGem = async ({ passphrase, amountNQT, recipient }) => {
    return await transferAsset({
        asset: GEMASSET,
        quantityQNT: amountNQT * NQTDIVIDER,
        recipient: recipient,
        passPhrase: passphrase,
    });
};

export const sendAskOrder = async ({ asset, price, quantity, passPhrase }) => {
    const response = await createAskOrder({ asset, price, quantity, passPhrase });
    return response;
};

export const sendBidOrder = async ({ asset, price, quantity, passPhrase }) => {
    const response = await createBidOrder({ asset, price, quantity, passPhrase });
    return response;
};

export const sendToJackpot = async ({ cards, passPhrase }) => {
    const isBlocked = cards.some(card => card.quantityQNT < card.unconfirmedQuantityQNT);
    if (!isBlocked) {
        const message = JSON.stringify({ contract: 'Jackpot' });
        const promises = cards.map(card =>
            transferAsset({
                asset: card.asset,
                quantityQNT: 1,
                passPhrase: passPhrase,
                recipient: JACKPOTACCOUNT,
                message: message,
                messagePrunable: true,
                deadline: 60,
                priority: 'HIGH',
            })
        );
        console.log('🚀 ~ file: walletUtils.js:234 ~ sendToJackpot ~ promises', promises);
        const responses = await Promise.allSettled(promises);
        return responses;
    }
};

export const sendToPolygonBridge = async ({ cards, ardorAccount, ethAccount, passPhrase }) => {
    const promises = cards.map(card =>
        transferAsset({
            asset: card.asset,
            quantityQNT: card.quantity,
            recipient: ardorAccount,
            passPhrase: passPhrase,
            message: ethAccount,
            messagePrunable: true,
            deadline: 361,
            priority: 'HIGH',
        })
    );

    try {
        const results = await Promise.all(promises);
        const success = results.every(result => result.status === 200);
        if (success) {
            return true;
        } else {
            console.error('Error transferring assets: Not all promises resolved successfully');
            return false;
        }
    } catch (error) {
        console.error(`Error transferring assets: ${error.message}`);
        return false;
    }
};
