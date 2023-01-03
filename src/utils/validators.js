import { secretPhraseToAccountId } from 'ardorjs';

/**
 * @param {string} value - user name
 * @param {array} userList - list of all users
 * @returns {object} - object with invalid and error properties
 * @description - checks if the user name is already taken
 */
export function validateUsername(value, userList) {

    const user_existing = userList.find((el)=> el === value);
    const length = value.length;

    if (user_existing){
        return {invalid:true, error:"User name is already taken"};
    } else if (length === 0) {
        return {invalid:true, error:"User name can't be empty"};
    }

    return {invalid:false, error:""};
}

/**
 * @param {string} value - user name
 * @param {string} account - account address
 * @returns {object} - object with invalid and error properties
 * @description - checks if the pass phrase belongs to the account
 */
export function validatePassPhrase(value, account){
    let invalid=false;
    let error=""; 
    const accountFromPhrase = secretPhraseToAccountId(value, false);

    if (accountFromPhrase !== account){
        invalid = true;
        error = "This pass phrase belongs to account " + accountFromPhrase;
    }

    return {invalid: invalid, error: error};
}

/**
 * @param {string} value - user name
 * @returns {object} - object with invalid and error properties
 * @description - checks if the ethreum address is valid
 */
export function validateEthAddress(value){
    let invalid=false;
    let error="";

    if (value!==''){

        if (value.length<40) {
            invalid = true;
            error = 'address looks too short.';
        } else if (!(value.charAt(0) === "0" && value.charAt(1) === "x")) {
            invalid = true;
            error = 'address must begin with 0x';
        }

    } else {
        // case if field is empty
        invalid = false;
        error = '';
    }
    return {invalid: invalid, error: error};
}

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
export function validateWinner(userAssets, collectionAssets){
    const userValidAssets = [];
    userAssets.forEach(asset => {
        if (asset.quantityQNT > 0){
            userValidAssets.push(asset.asset);
        }
    });

    const userSet = new Set(userValidAssets);

    const collectionSet = new Set(collectionAssets.map(asset=>{return asset.asset}));
    const intersection = new Set([...userSet].filter(x => collectionSet.has(x)));

    const sets_equal = eqSet(intersection,collectionSet);

    // difference between intersection (all user's cards) and collection
    let difference = new Set([...collectionSet].filter(x => !intersection.has(x)));
    // the difference are the missing cards.

    return {
        complete: sets_equal,
        userAssets: [...intersection],
        missingAssets: [...difference],
        totalNum: collectionAssets.length
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
    error = invalid ? "too short" : '';

    return({invalid: invalid, error: error});
}