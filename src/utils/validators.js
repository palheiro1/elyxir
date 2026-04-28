import ardorjs from 'ardorjs';
import { isAddress } from 'ethers';
import { getAllUsers } from './storage';

/**
 * @param {object} infoAccount - object with accountRs and token properties
 * @returns {boolean} - true if the user is logged in, false otherwise
 * @description - checks if the user is logged in
 */
export const isNotLogged = infoAccount => {
    return infoAccount.token === null || infoAccount.accountRs === null;
};

/**
 * @param {string} value - user name
 * @param {array} userList - list of all users
 * @returns {object} - object with invalid and error properties
 * @description - checks if the user name is already taken
 */
export const existUser = value => getAllUsers().includes(value);

/**
 * @param {string} value - user name
 * @param {string} account - account address
 * @returns {object} - object with invalid and error properties
 * @description - checks if the pass phrase belongs to the account
 */
export function checkIsValidPassphrase(passphrase, expectedAccount) {
    const actualAccount = ardorjs.secretPhraseToAccountId(passphrase, false);
    return actualAccount === expectedAccount;
}

/**
 * @param {string} account - account address
 * @returns {Boolean} - true if the account is valid, false otherwise
 * @description - checks if the pass phrase belongs to the account
 */
export const isArdorAccount = account => {
    if (typeof account !== 'string') return false;
    return /^ARDOR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}$/.test(account);
};

export const isEthereumAddress = address => typeof address === 'string' && isAddress(address);
