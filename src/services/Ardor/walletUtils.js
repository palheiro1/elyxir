import { CURRENCY, NQTDIVIDER } from '../../data/CONSTANTS';
import { getAccountCurrencies, getIgnisBalance } from './ardorInterface';

/**
 * @name getGIFTZBalance
 * @description Get GIFTZ balance
 * @param {String} address - Account address
 * @author Jesús Sánchez Fernández
 */
export const getGIFTZBalance = async address => {
    const response = await getAccountCurrencies(address, CURRENCY);
    console.log("🚀 ~ file: walletUtils.js:6 ~ getGIFTZBalance ~ response", response)
    return Object.keys(response).length > 0 ? response : 0;
};


/**
 * @name getIGNISBalance
 * @description Get IGNIS balance
 * @param {String} account - Account address
 * @author Jesús Sánchez Fernández
 */
export const getIGNISBalance = async (account) => {
    const response = await getIgnisBalance(account);
    return Number(Math.min(response.balanceNQT/NQTDIVIDER,response.unconfirmedBalanceNQT/NQTDIVIDER)).toFixed(2);
}