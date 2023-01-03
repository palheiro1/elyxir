import Crypto from 'crypto';
import { IV_LENGTH } from '../data/CONSTANTS';

/**
 * @param {string} name - user name
 * @param {string} accountRs - user account
 * @param {boolean} usePin - true if the user wants to use a pin
 * @param {string} passPhrase - user pass phrase
 * @param {string} pin - user pin
 * @returns {object} user object
 * @description initialises the user information for localStorage
 */
export function initUser(name, accountRs, usePin, passPhrase="", pin=""){
    return {
        name: name, 
        accountRs: accountRs,
        usePin: usePin,
        token: (usePin) ? encrypt(passPhrase, pin) : "",
        timestamp: undefined,
        backupDone: false
    } 
}

/**
 * @param {string} passPhrase - user pass phrase
 * @param {string} userPin - user pin
 * @returns {string} encrypted pass phrase
 * @description encrypts the pass phrase with the user pin
 */
export const encrypt = (passPhrase, userPin) => {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = Crypto.createCipheriv('aes-256-cbc', Buffer.from(userPin.toString()), iv);

    let encrypted = cipher.update(passPhrase);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ":" + encrypted.toString('hex');
}

/**
 * @param {string} token - encrypted pass phrase
 * @param {string} userPin - user pin
 * @returns {string} decrypted pass phrase
 * @description decrypts the pass phrase with the user pin
 */
export const decrypt = (token, userPin) => {
    try {
        const textParts = token.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = Crypto.createDecipheriv('aes-256-cbc', Buffer.from(userPin.toString()), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch(exception) {
        console.log("🚀 ~ file: storage.js:52 ~ decrypt ~ exception", exception)
        throw new Error(exception.message);
    }
}

/**
 * @param {object} user - user object
 * @description registers or updates the user in localStorage
 */
export function registerOrUpdateUser(user) {
    localStorage.setItem(user.name, JSON.stringify(user));
}

/**
 * @param {string} name - user name
 * @description removes the user from localStorage
 */
export function dropUser(name) {
    localStorage.removeItem(name);
}

/**
 * @param {string} name - user name
 * @returns {object} user object
 * @description gets the user from localStorage
 */
export function getUser(name) {
    const item = localStorage.getItem(name);
    return item !== null ? JSON.parse(item) : null;
}

/**
 * @returns {string} app version
 * @description gets the app version from localStorage
 */
export function getVersion() {
    const item = localStorage.getItem('APP_VERSION');
    return item !== null ? JSON.parse(item) : null;
}

/**
 * @param {string} version - app version
 * @description registers the app version in localStorage
 * @description this is used to check if the app has been updated
 */
export function getAllUsers() {
    const item = localStorage.getItem('users');
    return item !== null ? JSON.parse(item) : [];
}

/**
 * @param {object} user - user object
 * @description registers the user in the list of all users
 */
export function addToAllUsers(user) {
    let users = getAllUsers();

    if (users.length === 0)
        users.push(user.name);
    else
        users = [user.name];

    localStorage.setItem("users", JSON.stringify(users));
}

/**
 * @param {object} user - user object
 * @description removes the user from the list of all users
 */
export function removeFromAllUsers(user) {
    let users = getAllUsers();
    let newUsers = [];

    let ix = users.findIndex((e) => (e === user));

    if (ix !== -1){
        if (ix === 0){
            newUsers = users.slice(1);
        } else if (ix === users.length-1){
            newUsers = users.slice(0,ix);
        } else {
            newUsers = users.slice(0,ix).concat(users.slice(ix+1,users.length));
        }
        localStorage.setItem("users",JSON.stringify(newUsers));
    }
}

/**
 * @param {string} name - user name
 * @param {string} timestamp - timestamp
 * @description updates the timestamp of the user
 */
export function updateTimestamp(name, timestamp){
    let user = getUser(name);
    user.timestamp = timestamp;
    registerOrUpdateUser(user);
}

/**
 * @param {string} name - user name
 * @returns {string} timestamp
 * @description gets the timestamp of the user
 */
export function getTimestamp(name){
    if (name){
        let user = getUser(name);
        if (user) return user.timestamp;
    }
}

/**
 * @param {string} name - user name
 * @returns {boolean} true if the backup has been done
 * @description gets the backupDone flag of the user
 */
export function getBackupDone(name){
    let user = getUser(name);
    return user.backupDone;
}

/**
 * @param {string} name - user name
 * @description sets the backupDone flag of the user
 * @description this is used to check if the backup has been done
 */
export function setBackupDone(name){
    let user = getUser(name);
    user.backupDone = true;
    registerOrUpdateUser(user);
}