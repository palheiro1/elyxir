
/**
 * @fileoverview Constants for mainnet.
 * @dev This file is used to store the constants for the mainnet.
 * @author Tarasca
 * @version 1.0.0
 */

// ---------------------------------------------------------
// ------------------ APP CONFIGURATION --------------------
// ---------------------------------------------------------
export const REFRESH_DATA_TIME =  30 * 1000; // 30 seconds
export const REFRESH_MARKE_TIME =  5 * 1000; // 5 seconds

// -------------------------------------------------
// ------------------ CURRENCIES -------------------
// -------------------------------------------------
export const CURRENCY = "9375231913536683768";
export const CURRENCYOFFER = "14399941215024895112";
export const EXCHANGERATE = 295;

// ---------------------------------------------
// ------------------ ASSETS -------------------
// ---------------------------------------------
export const TARASCACARDASSET = "13187825386854631652"; 
export const GEMASSET = "10230963490193589789";
export const REFERRALASSET = "15893499867718551186"; // mainnet
export const SASQUATCHASSET = "13270129604409279596";
export const MARUXAINAASSETWRONG = "7783220465634719235";
export const CATOBLEPASASSETWRONG = "16992402711643280652";

// ---------------------------------------------
// ------------------ ADDRESS ------------------
// ---------------------------------------------
export const CURRENCYSELLER = "ARDOR-TU3S-47Y5-6GSM-8ZSJ8";
export const COLLECTIONACCOUNT = "ARDOR-4V3B-TVQA-Q6LF-GMH3T";  
export const JACKPOTACCOUNT = "ARDOR-4V3B-TVQA-Q6LF-GMH3T";
export const BUYPACKACCOUNT = "ARDOR-4V3B-TVQA-Q6LF-GMH3T"; 
export const TARASCACARDACCOUNT = "ARDOR-5NCL-DRBZ-XBWF-DDN5T";  
export const BRIDGEACCOUNT = "ARDOR-3YEX-JZFZ-UATF-EKGLN";  
export const GEMASSETACCOUNT = "ARDOR-XG7G-V7BV-GT4P-FUGW6";  
export const BURNACCOUNT = "ARDOR-Q9KZ-74XD-WERK-CV6GB";
export const REFERRALCONTRACTACCOUNT = "ARDOR-YAAE-KL8S-28Y4-BNQW3";

// ---------------------------------------------
// -------------- GAME PARAMETERS --------------
// ---------------------------------------------
export const PACKPRICE = 295;
export const PACKPRICEGIFTZ = 1;
export const MAXPACKS = 999;
export const NQTDIVIDER = 100000000;

// ---------------------------------------------
// ---------------- IMAGE PATHS-- --------------
// ---------------------------------------------
export const IMGURL = "https://media.mythicalbeings.io/";
export const IMG_HI_PATH = "md/"
export const IMG_MD_PATH = "sm/"
export const IMG_THUMB_PATH = "thumbs/"

// ---------------------------------------------
// -------------- REFERRAL SYSTEM --------------
// ---------------------------------------------
export const VIEW_ONLY_DISABLES = [];  // if user.viewonly && VIEW_ONLY_DISABLES.find(e=>e==gameaction) sozusagen..
export const VIEW_ONLY_REASON = "This function is disabled until start of Season 01!";
export const WHITELIST = [];
export const SEASON1TIMESTAMP = 105800000;
export const CURRENTSEASON = "season01";

// ---------------------------------------------
// ------------------- JACKPOT -----------------
// ---------------------------------------------
export const FREQUENCY = 5040;  
export const JACKPOTHALF = true;
export const BLOCKTIME = 60;
export const LOWIGNIS = 65;

// ---------------------------------------------
// --------------- ASSET QUANTITY --------------
// ---------------------------------------------
export const QUANT_COMMON = 10000;
export const QUANT_RARE = 5000;
export const QUANT_VERYRARE = 2500;
export const QUANT_SPECIAL = 250;
export const QUANT_UNBURNED = 100000000000000000;

// ---------------------------------------------
// --------- LOCAL STORAGE AND CRYPT -----------
// ---------------------------------------------
export const CIPHER_ALGORITHM = "aes-256-cbc";
export const IV_LENGTH = 16;

// ---------------------------------------------
// ----------------- CRAFTING ------------------
// ---------------------------------------------
export const CRAFTING_RATIO = 5;
export const CRAFTINGCOMMON = 150;
export const CRAFTINGRARE = 450;

// ---------------------------------------------
// ----------------- MORPHING ------------------
// ---------------------------------------------
export const MORPHING_ACCOUNT = "ARDOR-J45A-8UPL-XYHR-DAUD8"
export const MORPHINGCOMMON = 50
export const MORPHINGRARE = 250
export const MORPHINGEPIC = 750

// ---------------------------------------------
// --------------- TRANSACTIONS ----------------
// ---------------------------------------------
export const DEFAULT_CONTACTS = [
    { accountRs: MORPHING_ACCOUNT, name: 'Mythical Beings Morph' },
    { accountRs: COLLECTIONACCOUNT, name: 'Mythical Beings' },
    { accountRs: BRIDGEACCOUNT, name: 'Mythical Beings ERC1155 Bridge' },
    { accountRs: BUYPACKACCOUNT, name: 'Mythical Beings' },
    { accountRs: TARASCACARDACCOUNT, name: 'Mythical Beings' },
    { accountRs: GEMASSETACCOUNT, name: 'Mythical Beings' },
    { accountRs: JACKPOTACCOUNT, name: 'Mythical Beings' },
];

// ---------------------------------------------
// ----------------- APIS URL ------------------
// ---------------------------------------------
export const GAMEAPIURL = "https://api.mythicalbeings.io/";
export const BRIDGEAPIURL = "https://api.mythicalbeings.io/";
export const NODEURL = "https://node1.mythicalbeings.io:27876/nxt";
export const APILIMIT = 125;