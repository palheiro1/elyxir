/**
 * @fileoverview Constants for mainnet.
 * @dev This file is used to store the constants for the mainnet.
 * @author Tarasca
 * @version 1.0.0
 */

// ---------------------------------------------------------
// ------------------ APP CONFIGURATION --------------------
// ---------------------------------------------------------
export const REFRESH_DATA_TIME = 5 * 1000; // 5 seconds
export const REFRESH_BLOCK_TIME = 2 * 1000; // 10 seconds
export const REFRESH_UNWRAP_TIME = 30 * 1000; // 30 seconds
export const REFRESH_JACKPOT_PARTICIPANTS = 15 * 1000; // 30 seconds

export const RARITY_COLORS = {
    Common: 'linear-gradient(45deg, #8e9eab, #eef2f3) 1',
    Rare: 'linear-gradient(45deg, #2F80ED, #56CCF2) 1',
    Epic: 'linear-gradient(45deg, #F09819, #EDDE5D) 1',
    Special: 'linear-gradient(60deg, #53AF53, #2D5B53) 1',
};

export const MEDIUM_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://tarasca-dao.medium.com/feed';

// -------------------------------------------------
// ------------------ CURRENCIES -------------------
// -------------------------------------------------
export const CURRENCY = '9375231913536683768';
export const CURRENCYOFFER = '14399941215024895112';
export const EXCHANGERATE = 295;

// ---------------------------------------------
// ------------------ ASSETS -------------------
// ---------------------------------------------
export const TARASCACARDASSET = '13187825386854631652';
export const GEMASSET = '10230963490193589789';
export const WETHASSET = '5748561916300082783'; // TEST ASSET
export const REFERRALASSET = '15893499867718551186'; // mainnet
export const SASQUATCHASSET = '13270129604409279596';
export const MARUXAINAASSETWRONG = '7783220465634719235';
export const CATOBLEPASASSETWRONG = '16992402711643280652';

// ---------------------------------------------
// ------------------ ADDRESS ------------------
// ---------------------------------------------
export const CURRENCYSELLER = 'ARDOR-TU3S-47Y5-6GSM-8ZSJ8';
export const COLLECTIONACCOUNT = 'ARDOR-4V3B-TVQA-Q6LF-GMH3T';
export const JACKPOTACCOUNT = 'ARDOR-4V3B-TVQA-Q6LF-GMH3T';
export const BUYPACKACCOUNT = 'ARDOR-4V3B-TVQA-Q6LF-GMH3T';
export const TARASCACARDACCOUNT = 'ARDOR-5NCL-DRBZ-XBWF-DDN5T';
export const BRIDGEACCOUNT = 'ARDOR-3YEX-JZFZ-UATF-EKGLN';
export const GEMASSETACCOUNT = 'ARDOR-XG7G-V7BV-GT4P-FUGW6';
export const WETHASSETACCOUNT = 'ARDOR-66J7-K4T7-8C9M-66W67';
export const GIFTZASSETACCOUNT = 'ARDOR-TU3S-47Y5-6GSM-8ZSJ8';
export const BURNACCOUNT = 'ARDOR-Q9KZ-74XD-WERK-CV6GB';
export const REFERRALCONTRACTACCOUNT = 'ARDOR-YAAE-KL8S-28Y4-BNQW3';

// ---------------------------------------------
// -------------- GAME PARAMETERS --------------
// ---------------------------------------------
export const PACKPRICE = 295;
export const PACKPRICEGIFTZ = 1;
export const MAXPACKS = 999;
export const NQTDIVIDER = 100000000;

// ---------------------------------------------
// ---------- NEW ECONOMICS WITH OMNO ----------
// ---------------------------------------------
export const GIFTZASSET = '13993107092599641878';
export const PACKPRICEWETH = 2;
export const OMNO_CONTRACT = 'mythicalOmnoTest';
export const OMNO_ACCOUNT = 'ARDOR-LQET-FNLD-USL8-2AGBP';
export const OMNO_API = 'http://136.243.155.148:30001/api';

// ---------------------------------------------
// ---------------- IMAGE PATHS-- --------------
// ---------------------------------------------
export const IMGURL = 'https://media.mythicalbeings.io/';
export const IMG_HI_PATH = 'md/';
export const IMG_MD_PATH = 'sm/';
export const IMG_THUMB_PATH = 'thumbs/';

// ---------------------------------------------
// -------------- REFERRAL SYSTEM --------------
// ---------------------------------------------
export const VIEW_ONLY_DISABLES = []; // if user.viewonly && VIEW_ONLY_DISABLES.find(e=>e==gameaction) sozusagen..
export const VIEW_ONLY_REASON = 'This function is disabled until start of Season 01!';
export const WHITELIST = [];
export const SEASON1TIMESTAMP = 105800000;
export const CURRENTSEASON = 'season01';

// ---------------------------------------------
// ------------------- JACKPOT -----------------
// ---------------------------------------------
export const FREQUENCY = 5040;
export const JACKPOTHALF = true;
export const BLOCKTIME = 60;
export const LOWIGNIS = 65;
export const IGNIS_REQUIRED = 100;

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
export const CIPHER_ALGORITHM = 'aes-256-cbc';
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
export const MORPHING_ACCOUNT = 'ARDOR-J45A-8UPL-XYHR-DAUD8';
export const MORPHINGCOMMON = 50;
export const MORPHINGRARE = 250;
export const MORPHINGEPIC = 750;

// ---------------------------------------------
// --------------- TRANSACTIONS ----------------
// ---------------------------------------------
export const DEFAULT_CONTACTS = [
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
export const GAMEAPIURL = 'https://api.mythicalbeings.io/';
export const BRIDGEAPIURL = 'https://api.mythicalbeings.io/';
export const NODEURL = 'https://node1.mythicalbeings.io:27876/nxt';
export const APILIMIT = 125;

// -------------------------------------------------
// ----------------- ALL ACCOUNTS ------------------
// -------------------------------------------------

export const ALL_ACCOUNTS = [
    COLLECTIONACCOUNT,
    BRIDGEACCOUNT,
    BUYPACKACCOUNT,
    TARASCACARDACCOUNT,
    GEMASSETACCOUNT,
    JACKPOTACCOUNT,
    MORPHING_ACCOUNT,
    CURRENCYSELLER,
    BURNACCOUNT,
    REFERRALCONTRACTACCOUNT,
];

// ---------------------------------------------
// ----------------- EXTERNAL ------------------
// ---------------------------------------------
export const EXCHANGES = [
    {
        name: 'Bittrex',
        url: 'https://bittrex.com',
        image: 'images/exchanges/bittrex.png',
    },
    {
        name: 'Bilaxy',
        url: 'https://bilaxy.com',
        image: 'images/exchanges/bilaxy.png',
    },
    {
        name: 'Biteeu',
        url: 'https://biteeu.com',
        image: 'images/exchanges/biteeu.png',
    },
    {
        name: 'Changelly',
        url: 'https://changelly.com',
        image: 'images/exchanges/changelly.png',
    },
    {
        name: 'ChangeNOW',
        url: 'https://changenow.io',
        image: 'images/exchanges/changenow.png',
    },
    {
        name: 'Hanbitco',
        url: 'https://hanbitco.com',
        image: 'images/exchanges/hanbitco.png',
    },
    {
        name: 'Indodax',
        url: 'https://indodax.com',
        image: 'images/exchanges/indodax.png',
    },
    {
        name: 'p2pb2b',
        url: 'https://p2pb2b.io',
        image: 'images/exchanges/p2pb2b.png',
    },
    {
        name: 'STEX',
        url: 'https://stex.com',
        image: 'images/exchanges/stex.png',
    },
    {
        name: 'ProBit',
        url: 'https://probit.com',
        image: 'images/exchanges/probit.png',
    },
    {
        name: 'SimpleSwap',
        url: 'https://simpleswap.io',
        image: 'images/exchanges/simpleswap.png',
    },
    {
        name: 'TOKOK',
        url: 'https://tokok.com',
        image: 'images/exchanges/tokok.png',
    },
    {
        name: 'VCC Exchange',
        url: 'https://vcc.exchange',
        image: 'images/exchanges/vcc.png',
    },
];

// ---------------------------------------------
// ----------------- ASSETS IDS ----------------
// ---------------------------------------------

export const ASSETS_IDS = [
    '4367881087678870632',
    '15778342868690621160',
    '12936439663349626618',
    '7024690161218732154',
    '2795734210888256790',
    '16326649816730553703',
    '10917692030112170713',
    '10444425886085847503',
    '18101012326255288772',
    '11654119158397769364',
    '3758988694981372970',
    '1462047204733593633',
    '6864800023593094679',
    '8717959006135737805',
    '6086151229884242778',
    '8966516609271135665',
    '1941380340903453000',
    '1328293559375692481',
    '7535070915409870441',
    '5528548442683058721',
    '524790161704873898',
    '583958094572828441',
    '12313032092046113556',
    '4735490741705855799',
    '16412049206728355506',
    '16570943417360649598',
    '609721796834652174',
    '9057629654312953814',
    '3865726407233803673',
    '13430257599807483745',
    '374078224198142471',
    '8026549983053279231',
    '7891814295348826088',
    '9451976923053037726',
    '188493294393002400',
    '13187825386854631652',
    '14906207210027210012',
    '16453401161130674677',
    '3607141736374727634',
    '1770779863759720918',
    '65767141008711421',
    '8825927167203958938',
    '7536385584787697086',
    '13244842214545819858',
    '8504616031553931056',
    '3651682276536707874',
    '15284691712437925618',
    '488367278629756964',
    '1310229991284473521',
    '10956456574154580310',
    GEMASSET,
    WETHASSET,
];
