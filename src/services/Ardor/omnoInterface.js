import axios from 'axios';
import { GIFTZASSET, OMNO_ACCOUNT, OMNO_CONTRACT, WETHASSET } from '../../data/CONSTANTS';
import { fetchOmnoMarket } from '../../utils/omno';
import { addressToAccountId, getAccountFromPhrase, sendMessage } from './ardorInterface';

const OMNO_API_URL = 'https://api.mythicalbeings.io/index.php?action=getOmnoUserState';

const getOmnoAccountId = account => {
    const value = String(account || '');
    return value.startsWith('ARDOR-') ? addressToAccountId(value) : value;
};

const getPositiveQuantityString = item => {
    const value = String(item?.quantityQNT ?? item?.quantity ?? item?.balance ?? 0).trim();
    if (!/^\d+$/.test(value)) return '0';
    const normalized = value.replace(/^0+(?=\d)/, '');
    return normalized === '0' ? '0' : normalized;
};

const hasPositiveQuantity = item => getPositiveQuantityString(item) !== '0';

const getOmnoUserBalance = async account => {
    const accountId = getOmnoAccountId(account);
    const response = await axios.get(OMNO_API_URL);
    return response.data.find(item => String(item.id) === String(accountId));
};

const buildOmnoAssetWithdrawMessage = assets =>
    JSON.stringify({
        contract: OMNO_CONTRACT,
        operation: [
            {
                service: 'platform',
                request: 'failClear',
            },
            {
                service: 'user',
                request: 'withdraw',
                parameter: {
                    contractPaysWithdrawFee: true,
                    value: {
                        asset: assets,
                    },
                    requireFailClear: true,
                },
            },
            {
                service: 'platform',
                request: 'failClear',
            },
        ],
    });

const getOmnoAskOrders = (allOffers = [], asset) => {
    const selectedOffers = allOffers.filter(item => {
        if (item.give.asset === undefined || item.take.asset === undefined) return false;
        return (
            Object.keys(item.give).length === 1 &&
            Object.keys(item.take).length === 1 &&
            item.give.asset[asset] &&
            item.take.asset[WETHASSET]
        );
    });
    // Order by price (lowest first) - take.asset is WETH
    selectedOffers.sort((a, b) => {
        return a.take.asset[WETHASSET] - b.take.asset[WETHASSET];
    });
    return selectedOffers;
};

const getOmnoBidOrders = (allOffers = [], asset) => {
    const selectedOffers = allOffers.filter(item => {
        if (item.give.asset === undefined || item.take.asset === undefined) return false;
        return (
            Object.keys(item.give).length === 1 &&
            Object.keys(item.take).length === 1 &&
            item.give.asset[WETHASSET] &&
            item.take.asset[asset]
        );
    });
    selectedOffers.sort((a, b) => {
        return a.give.asset[WETHASSET] - b.give.asset[WETHASSET];
    });
    return selectedOffers;
};

export const getOmnoMarketOrdesForAsset = async (asset, options) => {
    const allOffers = await fetchOmnoMarket(options);
    const askOrders = getOmnoAskOrders(allOffers, asset);
    const bidOrders = getOmnoBidOrders(allOffers, asset);
    return { askOrders, bidOrders };
};

export const getOmnoGiftzBalance = async address => {
    try {
        // Convert address to accountId
        const userBalance = await getOmnoUserBalance(address);

        if (userBalance && userBalance.balance?.asset?.[GIFTZASSET]) {
            return userBalance.balance.asset[GIFTZASSET];
        }

        return 0; // Default value if balance is not found
    } catch (error) {
        console.error('Error fetching Omno giftz balance:', error.message);
        throw error; // Re-throw the error for further handling, if necessary
    }
};

export const getOmnoAssetBalances = async ({ account, assetIds = [] }) => {
    if (!account || !assetIds.length) return [];

    const userBalance = await getOmnoUserBalance(account);
    const assetBalance = userBalance?.balance?.asset || {};

    return assetIds
        .map(assetId => ({
            asset: String(assetId),
            quantityQNT: getPositiveQuantityString({ quantityQNT: assetBalance[String(assetId)] || 0 }),
        }))
        .filter(hasPositiveQuantity);
};

export const withdrawElyxirAssetsFromOmno = async ({ assets = [], passPhrase, walletProvider }) => {
    const withdrawAssets = assets.reduce((result, item) => {
        const asset = String(item?.asset || '');
        const quantity = getPositiveQuantityString(item);
        if (asset && quantity !== '0') result[asset] = quantity;
        return result;
    }, {});

    if (!Object.keys(withdrawAssets).length) return false;

    const message = buildOmnoAssetWithdrawMessage(withdrawAssets);

    if (walletProvider) {
        return await walletProvider.sendMessage({
            recipientRS: OMNO_ACCOUNT,
            message,
            prunable: true,
            priority: 'HIGH',
        });
    }

    return await sendMessage({
        recipient: OMNO_ACCOUNT,
        passPhrase,
        message,
    });
};

export const withdrawAllGiftzFromOmno = async passphrase => {
    const address = getAccountFromPhrase(passphrase);
    const balance = await getOmnoGiftzBalance(address);

    const message = JSON.stringify({
        contract: OMNO_CONTRACT,
        operation: [
            {
                service: 'platform',
                request: 'failClear',
            },
            {
                service: 'user',
                request: 'withdraw',
                parameter: {
                    contractPaysWithdrawFee: true,
                    value: {
                        asset: {
                            [GIFTZASSET]: balance.toString(),
                        },
                    },
                    requireFailClear: true,
                },
            },
            {
                service: 'platform',
                request: 'failClear',
            },
        ],
    });

    return await sendMessage({
        recipient: OMNO_ACCOUNT,
        passPhrase: passphrase,
        message: message,
    });
};

export const withdrawCardsFromOmno = async ({ cards, passPhrase }) => {
    const assets = {};

    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        assets[card.asset] = card.quantity.toString();
    }

    const message = JSON.stringify({
        contract: OMNO_CONTRACT,
        operation: [
            {
                service: 'platform',
                request: 'failClear',
            },
            {
                service: 'user',
                request: 'withdraw',
                parameter: {
                    contractPaysWithdrawFee: true,
                    value: {
                        asset: assets,
                    },
                    requireFailClear: true,
                },
            },
            {
                service: 'platform',
                request: 'failClear',
            },
        ],
    });

    return await sendMessage({
        recipient: OMNO_ACCOUNT,
        passPhrase: passPhrase,
        message: message,
    });
};

export const getUsersState = async () => {
    return axios
        .get(OMNO_API_URL)
        .then(res => res)
        .catch(error => error);
};

export const sendCardsToBattle = async ({ cards, passPhrase, arenaId, potion = null }) => {
    const assets = [];

    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        if (cards[index] !== '') assets.push(card.asset);
    }

    if (potion) assets.push(potion.asset);

    const message = JSON.stringify({
        contract: 'MBOmno',
        operation: [
            {
                service: 'rgame',
                request: 'formArmy',

                parameter: {
                    arena: arenaId,
                    asset: assets,
                },
            },
        ],
    });

    return await sendMessage({
        recipient: OMNO_ACCOUNT,
        passPhrase: passPhrase,
        message: message,
    });
};
