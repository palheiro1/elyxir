import equal from 'fast-deep-equal';

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
import { handleConfirmateNotification, handleNewIncomingNotification, handleNewOutcomingNotification } from './alerts';
import { generateHash } from './hash';

/**
 * @name checkDataChange
 * @description Check if data has changed and update it
 * @param {String} name - Name of the data
 * @param {Object} currentHash - Current hash of the data
 * @param {Object} newHash - New hash of the data
 * @param {Function} setState - Function to update the data
 * @param {Function} setHash - Function to update the hash
 * @param {Object} newData - New data
 * @returns {void} - Nothing
 */
export function checkDataChange(name, currentHash, setState, setHash, newData) {
    const newHash = generateHash(newData);
    if (!equal(currentHash, newHash)) {
        console.log(`Mythical Beings: ${name} changed`);
        setState(newData);
        setHash(newHash);
    }
}

/**
 * @name handleNotifications
 * @description Handle new and confirmed transactions
 * @param {Object} unconfirmedTransactions - Unconfirmed transactions
 * @param {Object} newsTransactions - New transactions
 * @param {String} accountRs - Account RS
 * @param {Object} cardsNotification - Cards notification
 * @param {Function} setCardsNotification - Function to update cards notification
 * @param {Function} toast - Function to show a toast
 * @param {Object} cards - Cards
 * @param {Function} onOpenCardReceived - Function to open a card received
 * @param {Function} setUnconfirmedTransactions - Function to update unconfirmed transactions
 * @returns {void} - Nothing
 */
export const handleNotifications = ({
    unconfirmedTransactions,
    newsTransactions,
    accountRs,
    cardsNotification,
    setCardsNotification,
    toast,
    cards,
    setUnconfirmedTransactions,
    newTransactionRef,
    confirmedTransactionRef,
}) => {
    const auxUnconfirmed = [...unconfirmedTransactions];
    let counterIncomings = auxUnconfirmed.filter(tx => tx.recipientRS === accountRs).length;
    let counterOutcomings = auxUnconfirmed.filter(tx => tx.senderRS === accountRs).length;

    // Check for new transactions
    for (const tx of newsTransactions) {
        const index = auxUnconfirmed.findIndex(t => t.fullHash === tx.fullHash);
        if (index === -1) {
            const isIncoming = tx.recipientRS === accountRs;
            if (isIncoming) {
                counterIncomings++;
                handleNewIncomingNotification(tx, isIncoming, toast, counterIncomings, newTransactionRef);
            } else {
                counterOutcomings++;
                handleNewOutcomingNotification(tx, isIncoming, toast, counterOutcomings, newTransactionRef);
            }
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

            if (asset && asset !== 'GEM' && isIncoming) {
                cardsForNotify.push({ asset, amount });
            } else {
                handleConfirmateNotification(tx, isIncoming, toast, confirmedTransactionRef);
            }

            auxUnconfirmed.splice(auxUnconfirmed.indexOf(tx), 1);
        }
    }

    // Set cards to notify
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
    try {
        const [askOrdersResponse, bidOrdersResponse] = await Promise.all([
            getAccountCurrentAskOrders(account),
            getAccountCurrentBidOrders(account),
        ]);
        const askOrders = askOrdersResponse.askOrders;
        const bidOrders = bidOrdersResponse.bidOrders;
        return { askOrders, bidOrders };
    } catch (error) {
        console.log('🚀 ~ file: walletUtils.js:141 ~ error', error);
        return { askOrders: [], bidOrders: [] };
    }
};

/**
 * @name getAskAndBids
 * @description Get ask and bids
 * @param {String} asset - Asset id
 * @returns {Object} - Ask and bids orders and asset count
 */
export const getAskAndBids = async asset => {
    try {
        const [askOrders, bidOrders, assetCount] = await Promise.all([
            getAskOrders(asset),
            getBidOrders(asset),
            fetchAssetCount(asset),
        ]);
        const askOrdersResponse = askOrders.askOrders;
        const bidOrdersResponse = bidOrders.bidOrders;
        return { askOrders: askOrdersResponse, bidOrders: bidOrdersResponse, assetCount };
    } catch (error) {
        console.log('🚀 ~ file: walletUtils.js:167 ~ getAskAndBids ~ error', error);
        return { askOrders: [], bidOrders: [], assetCount: 0 };
    }
};

/**
 * @name getGIFTZBalance
 * @description Get GIFTZ balance
 * @param {String} address - Account address
 * @author Jesús Sánchez Fernández
 */
export const getGIFTZBalance = async address => {
    try {
        const balanceData = await getAccountCurrencies(address, CURRENCY);
        return Object.keys(balanceData).length > 0 ? balanceData : 0;
    } catch (error) {
        console.log('🚀 ~ file: walletUtils.js:183 ~ getGIFTZBalance ~ error', error);
        return 0;
    }
};

/**
 * @name getIGNISBalance
 * @description Get IGNIS balance
 * @param {String} account - Account address
 * @author Jesús Sánchez Fernández
 */
export const getIGNISBalance = async account => {
    try {
        const balanceData = await getIgnisBalance(account);
        const balance = Number(
            Math.min(balanceData.balanceNQT / NQTDIVIDER, balanceData.unconfirmedBalanceNQT / NQTDIVIDER)
        ).toFixed(2);
        return balance;
    } catch (error) {
        console.error(error);
        return 0;
    }
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

    const response_1 = await transferAsset({
        asset: asset,
        quantityQNT: noCards,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(error => {
        console.log('🚀 ~ file: walletUtils.js:260 ~ sendToMorph ~ transferAsset', error);
        success = false;
    });

    if (!success || !response_1) return false;

    // ----------------------------------
    console.log(cost);
    const response_2 = await transferGEM({
        quantityQNT: cost * NQTDIVIDER,
        recipient: BUYPACKACCOUNT,
        passPhrase,
        message,
        messagePrunable: true,
        deadline: 1440,
        priority: 'HIGH',
    }).catch(error => {
        console.log('🚀 ~ file: walletUtils.js:277 ~ sendToMorph ~ transferGEM', error);
        success = false;
    });

    if (!success || !response_2) return false;
    return success;
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

/**
 * @name sendIgnis
 * @description Send ignis
 * @param {String} passphrase - Passphrase
 * @param {Number} amountNQT - Amount to send
 * @param {String} ignisBalance - IGNIS balance
 * @param {String} recipient - Recipient address
 * @returns {Object} - Transaction object
 */
export const sendGiftz = async ({ passphrase, amountNQT, ignisBalance, recipient }) => {
    const amount = Number(amountNQT);

    if (parseFloat(Number(ignisBalance)) < parseFloat(0.1))
        return await transferCurrencyZeroFee(CURRENCY, amount, recipient, passphrase, '');
    else return await transferCurrency(CURRENCY, amount, recipient, passphrase, '');
};

/**
 * @name sendGem
 * @description Send gem to an address
 * @param {String} passphrase - Passphrase
 * @param {Number} amountNQT - Amount to send
 * @param {String} recipient - Recipient address
 */
export const sendGem = async ({ passphrase, amountNQT, recipient }) => {
    return await transferAsset({
        asset: GEMASSET,
        quantityQNT: amountNQT * NQTDIVIDER,
        recipient: recipient,
        passPhrase: passphrase,
    });
};

/**
 * @name sendAskOrder
 * @description Send an ask order - Easy wrapper
 * @param {String} asset - Asset id
 * @param {Number} price - Price
 * @param {Number} quantity - Quantity
 * @param {String} passPhrase - Passphrase
 * @returns {Object} - Transaction object
 */
export const sendAskOrder = async ({ asset, price, quantity, passPhrase }) => {
    const response = await createAskOrder({ asset, price, quantity, passPhrase });
    return response;
};

/**
 * @name sendBidOrder
 * @description Send a bid order - Easy wrapper
 * @param {String} asset - Asset id
 * @param {Number} price - Price
 * @param {Number} quantity - Quantity
 * @param {String} passPhrase - Passphrase
 * @returns {Object} - Transaction object
 */
export const sendBidOrder = async ({ asset, price, quantity, passPhrase }) => {
    const response = await createBidOrder({ asset, price, quantity, passPhrase });
    return response;
};

/**
 * @name sendToJackpot
 * @description Send cards to the jackpot
 * @param {Array} cards - Array of cards
 * @param {String} passPhrase - Passphrase
 * @returns {Array} - Array of responses
 */
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
        const responses = await Promise.allSettled(promises);
        // Check all promises
        const success = responses.every(response => response.status === 'fulfilled');
        return success;
    }
};

/**
 * @name sendToPolygonBridge
 * @description Send cards to the polygon bridge
 * @param {Array} cards - Array of cards
 * @param {String} ardorAccount - Ardor account
 * @param {String} ethAccount - Ethereum account
 * @param {String} passPhrase - Passphrase
 * @returns {Boolean} - True if success, false if not
 * @dev This function is used to send cards to the polygon bridge
 */
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
