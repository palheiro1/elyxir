import { CURRENCY, NQTDIVIDER } from '../../data/CONSTANTS';
import { decrypt, getUser } from '../../utils/storage';
import { getAccountCurrencies, getIgnisBalance } from './ardorInterface';

export const checkPin = (user, pin) => {
    console.log("🚀 ~ file: walletUtils.js:6 ~ checkPin ~ user", user)
    const recoverUser = getUser(user);
    const { token } = recoverUser;

    const passphrase = decrypt(token, pin);
    if (!passphrase) return false;
    return {
        ...recoverUser,
        passphrase: passphrase
    }
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
    return Number(
        Math.min(response.balanceNQT / NQTDIVIDER, response.unconfirmedBalanceNQT / NQTDIVIDER)
    ).toFixed(2);
};
