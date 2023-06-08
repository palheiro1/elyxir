// Ardor Interface and other libraries
import axios from 'axios';
import qs from 'qs';
import ardorjs from 'ardorjs';

// Constants
import {
    BRIDGEAPIURL,
    CURRENCY,
    EXCHANGERATE,
    GEMASSET,
    JACKPOTACCOUNT,
    NODEURL,
    NQTDIVIDER,
} from '../../data/CONSTANTS';

// -------------------------------------------------
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};

const URL_SEND_MONEY = `${NODEURL}?requestType=sendMoney`;
const URL_CURRENCY_BUY = `${NODEURL}?requestType=currencyBuy`;

const URL_TRANSFER_CURRENCY = `${NODEURL}?requestType=transferCurrency`;
const URL_TRANSFER_ASSET = `${NODEURL}?requestType=transferAsset`;

const URL_CANCEL_ASK_ORDER = `${NODEURL}?requestType=cancelAskOrder`;
const URL_CANCEL_BID_ORDER = `${NODEURL}?requestType=cancelBidOrder`;

const URL_BROADCAST = `${NODEURL}?requestType=broadcastTransaction`;
const URL_SEND_MESSAGE = `${NODEURL}?requestType=sendMessage`;

// -------------------------------------------------
//                   BASIC UTILS
// -------------------------------------------------

export const getAccountFromPhrase = async value => {
    if (!value || typeof value !== 'string') throw new Error('Invalid secret phrase');
    return ardorjs.secretPhraseToAccountId(value, false);
};

export const fetchAssetCount = async asset => {
    try {
        const response = await fetch(
            NODEURL + '?requestType=getAccountAssets&account=' + JACKPOTACCOUNT + '&asset=' + asset
        );
        const result = await response.json();
        return result.quantityQNT ? result.quantityQNT : 0;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:53 ~ fetchAssetCount ~ error', error);
        return 0;
    }
};

// -------------------------------------------------
//                  ARDOR REQUESTS
// -------------------------------------------------

const getRequestToIgnisByAccount = async (type, account) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: type,
                chain: 'IGNIS',
                account,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:68 ~ getRequestToIgnisByAccount ~ error', error);
    }
};

const getRequestToIgnisByAsset = async (type, asset) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: type,
                chain: 'IGNIS',
                asset,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:95 ~ getRequestToIgnisByAsset ~ error', error);
    }
};

const getRequestToIgnisByOrder = async (type, order) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: type,
                chain: 'IGNIS',
                order,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:118 ~ getRequestToIgnisByOrder ~ error', error);
    }
};

export const getIgnisBalance = async account => {
    return await getRequestToIgnisByAccount('getBalance', account);
};

export const getAccountCurrentAskOrders = async account => {
    return await getRequestToIgnisByAccount('getAccountCurrentAskOrders', account);
};

export const getAccountCurrentBidOrders = async account => {
    return await getRequestToIgnisByAccount('getAccountCurrentBidOrders', account);
};

export const getAskOrders = async asset => {
    return await getRequestToIgnisByAsset('getAskOrders', asset);
};

export const getBidOrders = async asset => {
    return await getRequestToIgnisByAsset('getBidOrders', asset);
};

export const getAskOrder = async order => {
    return await getRequestToIgnisByOrder('getAskOrder', order);
};

export const getBidOrder = async order => {
    return await getRequestToIgnisByOrder('getBidOrder', order);
};

export const getAssetsByIssuer = async account => {
    return (await getRequestToIgnisByAccount('getAssetsByIssuer', account)).assets[0];
};

export const getAccount = async account => {
    return await getRequestToIgnisByAccount('getAccount', account);
};

export const getAsset = async asset => {
    return await getRequestToIgnisByAsset('getAsset', asset);
};

export const getAccountAssets = async (accountId, assetId = '') => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getAccountAssets',
                includeAssetInfo: false,
                account: accountId,
                asset: assetId,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getTrades = async (chain, account, timestamp) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getTrades',
                chain,
                account,
                timestamp,
                includeAssetInfo: true,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:167 ~ getTrades ~ error', error);
    }
};

export const getTransaction = async (chain, fullHash) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getTransaction',
                chain,
                fullHash,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:190 ~ getTransaction ~ error', error);
    }
};

export const getLastTrades = async assets => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getLastTrades',
                chain: 2,
                assets,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:182 ~ getLastTrades ~ error', error);
    }
};

const calculateFeeByRecipient = async (recipient, query, URL_TO_CALL) => {
    const account = await getAccount(recipient);
    const isRecipientNew = account.errorCode === 5;
    const data = (await axios.post(URL_TO_CALL, qs.stringify(query), config)).data;
    let fee;
    if (data.bundlerRateNQTPerFXT) {
        fee = isRecipientNew ? 20 * NQTDIVIDER : data.minimumFeeFQT * data.bundlerRateNQTPerFXT * 0.00000001;
    } else {
        fee = isRecipientNew ? 20 * NQTDIVIDER : data.minimumFeeFQT * 0.00000001;
    }
    return Math.ceil(fee);
};

const calculateFee = async (query, URL_TO_CALL) => {
    const { data: sendMoneyData } = await axios.post(URL_TO_CALL, qs.stringify(query), config);
    return Math.ceil(sendMoneyData.minimumFeeFQT * sendMoneyData.bundlerRateNQTPerFXT * 0.00000001);
};

// ----------------------------------------------
// CURRENCY
// ----------------------------------------------

const getCurrency = async currency => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getCurrency',
                currency,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:210 ~ getCurrency ~ error', error);
    }
};

export const getAccountCurrencies = async (account, currency) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getAccountCurrencies',
                account,
                currency,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:198 ~ getAccountCurrencies ~ error', error);
    }
};

const sendIgnis = async ({
    amountNQT,
    recipient,
    passPhrase,
    message,
    messagePrunable = true,
    deadline = 30,
    priority = 'NORMAL',
}) => {
    if (!passPhrase || !recipient || !amountNQT) return false;
    try {
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

        const query = Object.assign({
            chain: 2,
            recipient: recipient,
            amountNQT: amountNQT,
            feeNQT: -1,
            feeRateNQTPerFXT: -1,
            deadline: deadline,
            broadcast: false,
            publicKey: publicKey,
            message: message,
            messageIsPrunable: messagePrunable,
            transactionPriority: priority,
        });

        query.feeNQT = await calculateFeeByRecipient(recipient, query, URL_SEND_MONEY);
        query.broadcast = false;

        const res2 = await axios.post(URL_SEND_MONEY, qs.stringify(query, config));
        console.log('🚀 ~ file: ardorInterface.js:286 ~ res2:', res2);
        const signed = ardorjs.signTransactionBytes(res2.data.unsignedTransactionBytes, passPhrase);

        let txdata;
        if (message !== '') {
            const txattachment = JSON.stringify(res2.data.transactionJSON.attachment);
            txdata = {
                transactionBytes: signed,
                prunableAttachmentJSON: txattachment,
            };
        } else {
            txdata = { transactionBytes: signed };
        }

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:262 ~ error', error);
        return false;
    }
};

const transferCurrency = async (currency, unitsQNT, recipient, passPhrase, message = '', messagePrunable = true) => {
    if (!passPhrase || !recipient || !currency || !unitsQNT) return false;
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

    let query = {
        chain: 2,
        recipient: recipient,
        currency: currency,
        unitsQNT: unitsQNT,
        feeNQT: -1,
        feeRateNQTPerFXT: -1,
        deadline: 15,
        broadcast: false,
        publicKey: publicKey,
        message: message,
        messageIsPrunable: messagePrunable,
    };

    try {
        const fee = await calculateFeeByRecipient(recipient, query, URL_TRANSFER_CURRENCY);
        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;

        const response2 = await axios.post(URL_TRANSFER_CURRENCY, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response2.data.unsignedTransactionBytes, passPhrase);
        let txdata;

        if (message !== '') {
            let txattachment = JSON.stringify(response2.data.transactionJSON.attachment);
            txdata = {
                transactionBytes: signed,
                prunableAttachmentJSON: txattachment,
            };
        } else {
            txdata = { transactionBytes: signed };
        }

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:305 ~ transferCurrency ~ error', error);
        return false;
    }
};

const transferCurrencyZeroFee = async (
    currency,
    unitsQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true
) => {
    if (!passPhrase || !recipient || !currency || !unitsQNT) return false;
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
    let query = {
        chain: 2,
        recipient: recipient,
        currency: currency,
        unitsQNT: unitsQNT,
        feeNQT: 0,
        feeRateNQTPerFXT: 0,
        deadline: 15,
        broadcast: false,
        publicKey: publicKey,
        message: message,
        messageIsPrunable: messagePrunable,
    };

    try {
        const response2 = await axios.post(URL_TRANSFER_CURRENCY, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response2.data.unsignedTransactionBytes, passPhrase);
        let txdata;

        if (message !== '') {
            let txattachment = JSON.stringify(response2.data.transactionJSON.attachment);
            txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
        } else {
            txdata = { transactionBytes: signed };
        }

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:346 ~ error', error);
        return false;
    }
};

export const buyGiftz = async ({ passphrase, amountNQT }) => {
    if (!passphrase || !amountNQT) return false;
    const message = JSON.stringify({ contract: 'IgnisAssetLottery' });
    const publicKey = ardorjs.secretPhraseToPublicKey(passphrase);
    var query = {
        chain: 2,
        currency: CURRENCY,
        rateNQTPerUnit: EXCHANGERATE * NQTDIVIDER,
        unitsQNT: amountNQT,
        feeNQT: -1,
        deadline: 15,
        broadcast: false,
        publicKey: publicKey,
    };
    try {
        const minimumFee = await calculateFee(query, URL_CURRENCY_BUY);
        query.feeNQT = minimumFee;
        query.broadcast = false;

        const sendMoneyWithFee = await axios.post(URL_CURRENCY_BUY, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(sendMoneyWithFee.data.unsignedTransactionBytes, passphrase);
        let txdata;

        if (message !== '') {
            let txattachment = JSON.stringify(sendMoneyWithFee.data.transactionJSON.attachment);
            txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
        } else {
            txdata = { transactionBytes: signed };
        }

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:397 ~ error', error);
        return false;
    }
};

// ----------------------------------------------
// AKS & BID ORDERS
// ----------------------------------------------

export const createAskOrder = async ({ asset, price, quantity, passPhrase }) => {
    if (!passPhrase || !asset || !price || !quantity) return false;
    const ORDERTYPE = 'placeAskOrder';
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

    const query = {
        requestType: ORDERTYPE,
        asset: asset,
        priceNQTPerShare: price,
        publicKey: publicKey,
        chain: 2,
        quantityQNT: quantity,
        feeNQT: -1,
        feeRateNQTPerFXT: -1,
        deadline: 15,
        broadcast: false,
    };

    const url_postOrder = NODEURL + '?requestType=' + ORDERTYPE;

    try {
        query.feeNQT = await calculateFee(query, url_postOrder);
        query.broadcast = false;

        const postOrderTransactionBytesResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );

        let txdata = { transactionBytes: signed };

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
        return false;
    }
};

export const cancelAskOrder = async (order, passPhrase) => {
    if (!order || !passPhrase) return false;

    try {
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
        const query = {
            chain: 2,
            order,
            feeNQT: -1,
            feeRateNQTPerFXT: -1,
            deadline: 15,
            broadcast: false,
            publicKey,
        };
        query.feeNQT = await calculateFee(query, URL_CANCEL_ASK_ORDER);
        query.broadcast = false;

        const { data: res2 } = await axios.post(URL_CANCEL_ASK_ORDER, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(res2.unsignedTransactionBytes, passPhrase);
        const respuesta = await axios.post(URL_BROADCAST, qs.stringify({ transactionBytes: signed }), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:341 ~ error', error);
        return false;
    }
};

export const createBidOrder = async ({ asset, price, quantity, passPhrase }) => {
    if (!passPhrase || !asset || !price || !quantity) return false;

    try {
        const ORDERTYPE = 'placeBidOrder';
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

        const query = {
            requestType: ORDERTYPE,
            asset: asset,
            priceNQTPerShare: price,
            publicKey: publicKey,
            chain: 2,
            quantityQNT: quantity,
            feeNQT: -1,
            feeRateNQTPerFXT: -1,
            deadline: 15,
            broadcast: false,
        };

        const url_postOrder = NODEURL + '?requestType=' + ORDERTYPE;

        query.feeNQT = await calculateFee(query, url_postOrder);
        query.broadcast = false;
        const postOrderTransactionBytesResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );
        let txdata = { transactionBytes: signed };
        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
        return false;
    }
};

export const cancelBidOrder = async (order, passPhrase) => {
    if (!order || !passPhrase) return false;

    try {
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
        const query = {
            chain: 2,
            order,
            feeNQT: -1,
            feeRateNQTPerFXT: -1,
            deadline: 15,
            broadcast: false,
            publicKey,
        };
        query.feeNQT = await calculateFee(query, URL_CANCEL_BID_ORDER);
        query.broadcast = false;

        const response2 = await axios.post(URL_CANCEL_BID_ORDER, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response2.data.unsignedTransactionBytes, passPhrase);
        const txdata = { transactionBytes: signed };

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txdata), config);
        return respuesta.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// ----------------------------------------------
// TRANSFERING ASSETS
// ----------------------------------------------

const transferAsset = async ({
    asset,
    quantityQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true,
    deadline = 30,
    priority = 'NORMAL',
}) => {
    console.log(asset, quantityQNT, recipient, passPhrase)
    if (!asset || !quantityQNT || !recipient || !passPhrase) return false;
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

    let query = {
        chain: 2,
        recipient: recipient,
        quantityQNT: quantityQNT,
        asset: asset,
        feeNQT: -1,
        feeRateNQTPerFXT: -1,
        deadline: deadline,
        broadcast: false,
        publicKey: publicKey,
        message: message,
        messageIsPrunable: messagePrunable,
        transactionPriority: priority,
    };

    try {
        query.feeNQT = await calculateFee(query, URL_TRANSFER_ASSET);
        query.broadcast = false;

        const response = await axios.post(URL_TRANSFER_ASSET, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);

        const txData = {
            transactionBytes: signed,
        };

        if (message !== '') {
            txData.prunableAttachmentJSON = JSON.stringify(response.data.transactionJSON.attachment);
        }

        const response_2 = await axios.post(URL_BROADCAST, qs.stringify(txData), config);
        return response_2.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:604 ~ error', error);
        return false;
    }
};

export const getAccountLedger = async ({ accountRs, firstIndex = 0, lastIndex = 20, eventType = '' }) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getAccountLedger',
                account: accountRs,
                firstIndex,
                lastIndex,
                eventType,
                includeHoldingInfo: true,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:614 ~ getAccountLedger ~ error', error);
        // handle error
        throw new Error(`Error al obtener el libro de cuentas: ${error.message}`);
    }
};

// ----------------------------------------------
// TRANSFERING GEMS
// ----------------------------------------------

const transferGEM = async ({
    quantityQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true,
    deadline = 30,
    priority = 'NORMAL',
}) => {
    if (!quantityQNT || !recipient || !passPhrase) return false;

    try {
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

        let query = {
            chain: 2,
            recipient: recipient,
            quantityQNT: quantityQNT,
            asset: GEMASSET,
            feeNQT: -1,
            feeRateNQTPerFXT: -1,
            deadline: deadline,
            broadcast: false,
            publicKey: publicKey,
            message: message,
            messageIsPrunable: messagePrunable,
            transactionPriority: priority,
        };

        query.feeNQT = await calculateFee(query, URL_TRANSFER_ASSET);
        query.broadcast = false;

        const response = await axios.post(URL_TRANSFER_ASSET, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
        const txData = { transactionBytes: signed };

        if (message !== '') {
            txData.prunableAttachmentJSON = JSON.stringify(response.data.transactionJSON.attachment);
        }

        const response_2 = await axios.post(URL_BROADCAST, qs.stringify(txData), config);
        return response_2.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:670 ~ error', error);
        return false;
    }
};

// ----------------------------------------------
// GET BLOCKCHAIN STATUS & TRANSACTIONS
// ----------------------------------------------

const getBlockchainTransactions = async (chain, account, executedOnly = true, timestamp, lastIndex) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getBlockchainTransactions',
                chain,
                account,
                executedOnly,
                timestamp,
                lastIndex,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:693 ~ getBlockchainTransactions ~ error', error);
    }
};

const getUnconfirmedTransactions = async (chain, account, type, subtype) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getUnconfirmedTransactions',
                chain,
                account,
                type,
                subtype,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:711 ~ getUnconfirmedTransactions ~ error', error);
    }
};

const getBlockchainStatus = async () => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getBlockchainStatus',
            },
        });
        return response;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:723 ~ getBlockchainStatus ~ error', error);
    }
};

// ----------------------------------------------
// |                B R I D G E S               |
// ----------------------------------------------

// ----------------------------------------------
// OLD BRIDGE
// ONLY UNWRAP
// ----------------------------------------------

export const getEthDepositAddressForOldBridge = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'getUnwrapDepositAddress',
                account: accountRs,
            },
        });
        return response.data.depositAddress;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:775 ~ getEthDepositAddressForOldBridge ~ error:', error);
    }
};

export const processUnwrapsForOldBridge = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'processUnwrapsForAccount',
                account: accountRs,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:768 ~ processUnwrapsForAccount ~ error', error);
    }
};

// ----------------------------------------------
// NEW BRIDGE - ERC 1155
// ----------------------------------------------

export const getPegAddressesFor1155 = async () => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'getPegAddressesFor1155',
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:754 ~ getPegAddresses ~ error', error);
    }
};

export const getEthDepositAddressFor1155 = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'getUnwrapDepositAddressFor1155',
                account: accountRs,
            },
        });
        return response.data.depositAddress;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:741 ~ getEthDepositAddress ~ error', error);
    }
};

export const processUnwrapsFor1155 = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'processUnwrapsForAccountFor1155',
                account: accountRs,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:837 ~ processUnwrapsFor1155 ~ error:', error);
    }
};

// ----------------------------------------------
// NEW BRIDGE - ERC 20
// ----------------------------------------------

export const getPegAddressesFor20 = async () => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'mbGetPegAddresses',
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:785 ~ getPegAddressesFor20 ~ error:', error);
    }
};

export const getEthDepositAddressFor20 = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'mbGetWrapDepositAddress',
                account: accountRs,
            },
        });
        return response.data.depositAddress;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:868 ~ getEthDepositAddressFor20 ~ error:', error);
    }
};

export const processWrapsFor20 = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'mbProcessWrapsForAccount',
                account: accountRs,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:882 ~ processUnwrapsFor20 ~ error:', error);
    }
};

// ----------------------------------------------
// |            C H A T   M E S S A G E S       |
// ----------------------------------------------

export const sendDirectMessage = async ({ recipient, passPhrase, message }) => {
    if (!recipient || !passPhrase || !message) return false;

    try {
        const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
        const recipientPublicKey = (await getAccountPublicKey(recipient)).publicKey;
        const encryptedMessage = ardorjs.encryptMessage(message, passPhrase, recipientPublicKey, false);
        if (!recipientPublicKey || !encryptedMessage) return false;

        let query = {
            chain: 2,
            publicKey: publicKey,
            recipient: recipient,
            feeNQT: -1,
            deadline: 15,
            broadcast: false,
            encryptedMessageData: encryptedMessage.encryptedMessageData,
            encryptedMessageNonce: encryptedMessage.encryptedMessageNonce,
            encryptedMessageIsPrunable: true,
        };

        const fee = await calculateFeeByRecipient(recipient, query, URL_SEND_MESSAGE);
        query.feeNQT = fee;
        query.broadcast = false;

        const response = await axios.post(URL_SEND_MESSAGE, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
        const txData = { transactionBytes: signed };

        txData.prunableAttachmentJSON = JSON.stringify(response.data.transactionJSON.attachment);

        const respuesta = await axios.post(URL_BROADCAST, qs.stringify(txData), config);
        if (respuesta.errorCode) return false;
        return respuesta.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:820 ~ sendDirectMessage ~ error', error);
        return false;
    }
};

export const getAllMessages = async accountRs => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getPrunableMessages',
                account: accountRs,
                chain: 2,
                lastIndex: 50,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:858 ~ getAllMessages ~ error:', error);
    }
};

export const decryptMessage = async ({ passPhrase, message, publicKey }) => {
    try {
        const encryptedMessage = message.encryptedMessage;
        const { data } = encryptedMessage;

        // Build publicKeyMessage
        const publicKeyMessage = {
            ...encryptedMessage,
            publicKey: publicKey,
            isCompresed: true,
            isText: true,
            encryptedMessageIsText: true,
        };

        const mensaje = ardorjs.decryptNote(data, publicKeyMessage, passPhrase);
        return mensaje.message;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:872 ~ decryptMessage ~ error:', error);
        return false;
    }
};

export const getAccountPublicKey = async accountRs => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getAccountPublicKey',
                account: accountRs,
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:887 ~ getAccountPublicKey ~ error:', error);
        return false;
    }
};

/*

            deadline: 30,
            feeNQT: 0,
            broadcast: false,
            */

export {
    sendIgnis,
    transferCurrency,
    transferCurrencyZeroFee,
    transferAsset,
    transferGEM,
    getCurrency,
    getBlockchainStatus,
    getBlockchainTransactions,
    getUnconfirmedTransactions,
};
