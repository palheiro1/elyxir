import ardorjs from 'ardorjs';
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


export const isArdorAccount = account => {
    return /^ARDOR-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(account);
};

/**
 * @description - checks if the user has all the cards of the collection
 * @param {array} userSet - list of user's assets
 * @param {array} collectionSet - list of collection's assets
 * @returns returns true if bs has all items of set as.
 */
function eqSet(userSet, collectionSet) {
    for (var assetId of collectionSet) {
        if (!userSet.has(assetId)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {array} userAssets - list of user's assets
 * @param {array} collectionAssets - list of collection's assets
 * @returns {object} - object with complete, userAssets, missingAssets and totalNum properties
 * @description - check if every asset of the collection exists at least once in the users' assets
 */
export function validateWinner(userAssets, collectionAssets) {
    const userValidAssets = [];
    userAssets.forEach(asset => {
        if (asset.quantityQNT > 0) {
            userValidAssets.push(asset.asset);
        }
    });

    const userSet = new Set(userValidAssets);

    const collectionSet = new Set(
        collectionAssets.map(asset => {
            return asset.asset;
        })
    );
    const intersection = new Set([...userSet].filter(x => collectionSet.has(x)));

    const sets_equal = eqSet(intersection, collectionSet);

    // difference between intersection (all user's cards) and collection
    let difference = new Set([...collectionSet].filter(x => !intersection.has(x)));
    // the difference are the missing cards.

    return {
        complete: sets_equal,
        userAssets: [...intersection],
        missingAssets: [...difference],
        totalNum: collectionAssets.length,
    };
}

/**
 * @param {string} value - pin
 * @param {object} status - object with invalid and error properties
 * @returns {object} - object with invalid and error properties
 * @description - checks if the pin is valid
 */
export function validatePin(value, status) {
    let invalid = status.invalid;
    let error = status.error;

    invalid = value.length < 4 ? true : false;
    error = invalid ? 'too short' : '';

    return { invalid: invalid, error: error };
}
