import { secretPhraseToAccountId } from 'ardorjs';

/*
function validateQuantity(value, max, min, status) {

    const { invalid, error } = status;
    const val_num = Number(value);

    if (value!==''){
        invalid = !(value.match('[1-9]\d*|0\d+'));//doesnt work with MUI TextField
        error = invalid ? value+' is not a number.' : '';
    if (val_num<=max && val_num >= min){
      // its a number!
      if (val_num%1!==0){
          return {invalid:true, error:'You can only buy whole packs'};
      }
      return {invalid:invalid, error:error};
    }
    else if (val_num>max) {
      invalid = true;
      error=value+' is over the maximum amount ('+max+').';
      return {invalid:invalid, error:error};
    }
    else if (val_num<min){
      invalid = true;
      error=value+' is below the minimum amount ('+min+').';
      return {invalid:invalid, error:error};
    }
  }
  else {
    invalid = true;
    error = 'invalid value';
  }
  return {invalid:invalid, error:error};
}
*/

/*
function validatePrice(value, max, min, status) {
  let invalid=status.invalid;
  let error=status.error;
  let val_num = Number(value);
  //console.log(value,typeof(value),val_num,max,min,invalid,error);
  if (value!==''){
    invalid = !(value.match('[1-9]\d*|0\d+')); //note: this doesnt work with the MUI-textfield 
    error = invalid ? value+' is not a number.' : '';
    if (val_num<=max && val_num >= min){
      return {invalid:invalid, error:error};
    }
    else if (val_num>max) {
      invalid = true;
      error=value+' is over the maximum of '+max+' Ignis.';
      return {invalid:invalid, error:error};
    }
    else if (val_num<min){
      invalid = true;
      error=value+' is below the minimum of '+min+' Ignis.';
      return {invalid:invalid, error:error};
    }
  }
  else {
    invalid = true;
    error = 'invalid value'; //non-numbers will be filtered and can cause empty string.
  }
  return {invalid:invalid, error:error};
}
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
/*
export function validatePhraseLength(value,status){
  let invalid=status.invalid;
  let error=status.error;

  if (value !== '') {
    invalid = value.length < 20;
    error = invalid ? 'phrase looks too short.' : '';
  } else {
    // case if field is empty
    invalid = false;
    error = '';
  }
  return {invalid:invalid, error:error};
}
*/

export function getAccountFromPhrase(value){
    return {
        account: secretPhraseToAccountId(value,false)
    };
}

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

/*
function validateAddress(value){
  const invalid = value.match('^ARDOR-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}') ? false : true;
  const error = invalid ? "this doesn't look like a valid ARDOR address." : '';
  return({invalid: invalid, error: error});
}
*/

function eqSet(userSet, collectionSet) {
    //returns true if bs has all items of set as.
    // eqSet(collection, user) to check if user has collection complete
    for (var assetId of collectionSet) {
        if (!userSet.has(assetId)) {
            return false;
        }
    }
    return true;
}

export function validateWinner(userAssets, collectionAssets){
    // function to check if every asset of the collection exists at least once in
    // the users' assets
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

export function validatePin(value, status){
    let invalid=status.invalid;
    let error=status.error;
    
    invalid = value.length < 4 ? true : false;
    error = invalid ? "too short" : '';

    return({invalid: invalid, error: error});
}