import Crypto from 'crypto-browserify';
import { Buffer } from 'buffer';
import { CIPHER_ALGORITHM, IV_LENGTH } from '../data/CONSTANTS';

/**
 * @param {string} name - user name
 * @param {string} accountRs - user account
 * @param {boolean} usePin - true if the user wants to use a pin
 * @param {string} passPhrase - user pass phrase
 * @param {string} pin - user pin
 * @returns {object} user object
 * @description initialises the user information for localStorage
 */
export const initUser = (name, accountRs, usePin, passPhrase = "", pin = "", firstTime = false) => {
    return {
        name: name,
        accountRs: accountRs,
        usePin: usePin,
        token: (usePin) ? encrypt(passPhrase, pin) : "",
        timestamp: undefined,
        backupDone: false,
        firstTime: firstTime,
    }
}

/**
 * @param {string} passPhrase - user pass phrase
 * @param {string} userPin - user pin
 * @returns {string} encrypted pass phrase
 * @description encrypts the pass phrase with the user pin
 */
export const encrypt = (passPhrase, userPin) => {

    // Encrypt the pass phrase with the user pin using AES-256-CBC
    try {
        const iv = Crypto.randomBytes(IV_LENGTH);
        // userPin to AES-256-CBC key
        const key = Crypto.createHash('sha256').update(String(userPin)).digest('base64').substr(0, 32);
        // Create cipher      
        const cipher = Crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);
        // Encrypt pass phrase
        let encrypted = cipher.update(passPhrase);
        // Add the final block
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // Return the encrypted pass phrase
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (exception) {
        console.error("🚀 ~ file: storage.js:41 ~ encrypt ~ exception", exception)
        throw new Error(exception.message);
    }
}

/**
 * @param {string} token - encrypted pass phrase
 * @param {string} userPin - user pin
 * @returns {string} decrypted pass phrase
 * @description decrypts the pass phrase with the user pin
 */
export const decrypt = (token, userPin) => {
    try {
        // Split the token into the iv and the encrypted text
        const textParts = token.split(':');
        // Extract the iv
        const iv = Buffer.from(textParts.shift(), 'hex');
        // Extract the encrypted text
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        // userPin to AES-256-CBC key
        const key = Crypto.createHash('sha256').update(String(userPin)).digest('base64').substr(0, 32);
        // Create decipher
        const decipher = Crypto.createDecipheriv(CIPHER_ALGORITHM, Buffer.from(key), iv);
        // Decrypt the text
        let decrypted = decipher.update(encryptedText);
        // Add the final block
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        // Return the decrypted pass phrase
        return decrypted.toString();
    }
    catch (exception) {
        return false;
    }
}

/**
 * @param {object} user - user object
 * @description registers or updates the user in localStorage
 */
export const registerOrUpdateUser = (user) => {
    localStorage.setItem(user.name, JSON.stringify(user));
}

/**
 * @param {string} name - user name
 * @description removes the user from localStorage
 */
export const dropUser = (name) => {
    localStorage.removeItem(name);
}

/**
 * @param {string} name - user name
 * @returns {object} user object
 * @description gets the user from localStorage
 */
export const getUser = (name) => {
    try {
        const item = localStorage.getItem(name);
        return item !== null ? JSON.parse(item) : null;
    } catch (exception) {
        return {};
    }
}

/**
 * @returns {string} app version
 * @description gets the app version from localStorage
 */
export const getVersion = () => {
    try {
        return localStorage.getItem('MythicalVersion');
    } catch (exception) {
        console.error("🚀 ~ getVersion ~ exception:", exception)
        return null;
    }
}

export const setVersion = (version) => {
    localStorage.setItem('MythicalVersion', version);
}

export const clearCacheData = () => {
    caches.keys().then((names) => {
        names.forEach((name) => {
            caches.delete(name);
        });
    });
};

/**
 * @param {string} version - app version
 * @description registers the app version in localStorage
 * @description this is used to check if the app has been updated
 */
export const getAllUsers = () => {
    try {
        const item = localStorage.getItem('users');
        return item !== null ? JSON.parse(item) : [];
    } catch (exception) {
        return [];
    }
}

/**
 * @param {object} user - user object
 * @description registers the user in the list of all users
 */
export const addToAllUsers = (user) => {
    let users = getAllUsers();
    users.push(user.name);
    localStorage.setItem("users", JSON.stringify(users));
}

/**
 * @param {object} user - user object
 * @description removes the user from the list of all users
 */
export const removeFromAllUsers = (user) => {
    let users = getAllUsers();
    let newUsers = [];

    let ix = users.findIndex((e) => (e === user));

    if (ix !== -1) {
        if (ix === 0) {
            newUsers = users.slice(1);
        } else if (ix === users.length - 1) {
            newUsers = users.slice(0, ix);
        } else {
            newUsers = users.slice(0, ix).concat(users.slice(ix + 1, users.length));
        }
        localStorage.setItem("users", JSON.stringify(newUsers));
    }
}

/**
 * @param {string} name - user name
 * @param {string} timestamp - timestamp
 * @description updates the timestamp of the user
 */
export const updateTimestamp = (name, timestamp) => {
    let user = getUser(name);
    user.timestamp = timestamp;
    registerOrUpdateUser(user);
}

/**
 * @param {string} name - user name
 * @returns {string} timestamp
 * @description gets the timestamp of the user
 */
export const getTimestamp = (name) => {
    if (name) {
        let user = getUser(name);
        if (user) return user.timestamp;
    }
}

/**
 * @param {string} name - user name
 * @returns {boolean} true if the backup has been done
 * @description gets the backupDone flag of the user
 */
export const getBackupDone = (name) => {
    let user = getUser(name);
    return user.backupDone;
}

/**
 * @param {string} name - user name
 * @description sets the backupDone flag of the user
 * @description this is used to check if the backup has been done
 */
export const setBackupDone = (name) => {
    let user = getUser(name);
    user.backupDone = true;
    registerOrUpdateUser(user);
}

/**
 * @param {string} name - user name
 * @returns {boolean} true if the user has been registered
 * @description true if the user has been registered
 */
export const setNotFirstTime = (name) => {
    let user = getUser(name);
    user.firstTime = false;
    registerOrUpdateUser(user);
}