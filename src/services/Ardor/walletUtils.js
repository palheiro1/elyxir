import { BUYPACKACCOUNT, CURRENCY, NQTDIVIDER } from '../../data/CONSTANTS';
import { decrypt, getUser } from '../../utils/storage';
import { getAccountCurrencies, getIgnisBalance, sendIgnis, transferAsset, transferGEM } from './ardorInterface';

export const checkPin = (user, pin) => {
    console.log('🚀 ~ file: walletUtils.js:6 ~ checkPin ~ user', user);
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

export const getMorphMessage = (asset, noCards) => {
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