import { BUYPACKACCOUNT, CURRENCY, NQTDIVIDER } from '../data/CONSTANTS';
import { decrypt, getUser } from './storage';
import { fetchAssetCount, getAccountCurrencies, getAccountCurrentAskOrders, getAccountCurrentBidOrders, getAskOrders, getBidOrders, getIgnisBalance, sendIgnis, transferAsset, transferGEM } from '../services/Ardor/ardorInterface';

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
export const checkPin = (user, pin) => {
    const recoverUser = getUser(user);
    const { token } = recoverUser;

    const passphrase = decrypt(token, pin);
    if (!passphrase) return false;
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
