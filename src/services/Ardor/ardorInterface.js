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
    const fee = isRecipientNew ? 14 * NQTDIVIDER : data.minimumFeeFQT * data.bundlerRateNQTPerFXT * 0.00000001;
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

    try {
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

export const cancelBidOrder = async (order, passPhrase) => {
    if (!order || !passPhrase) return false;
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

    try {
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

    const url_tx = NODEURL + '?requestType=transferAsset';

    try {
        query.feeNQT = await calculateFee(query, url_tx);
        query.broadcast = false;

        const response = await axios.post(url_tx, qs.stringify(query), config);
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
// |                  B R I D G E               |
// ----------------------------------------------

export const getEthDepositAddress = async accountRs => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'getUnwrapDepositAddress',
                account: accountRs,
            },
        });
        return response.data.depositAddress;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:741 ~ getEthDepositAddress ~ error', error);
    }
};

export const getPegAddresses = async () => {
    try {
        const response = await axios.get(BRIDGEAPIURL, {
            params: {
                action: 'getPegAddresses',
            },
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:754 ~ getPegAddresses ~ error', error);
    }
};

export const processUnwrapsForAccount = async accountRs => {
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
// |            C H A T   M E S S A G E S       |
// ----------------------------------------------

export const sendDirectMessage = async ({ recipient, passPhrase, message }) => {
    if (!recipient || !passPhrase || !message) return false;

    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

    let query = {
        requestType: 'sendMessage',
        chain: 2,
        recipient: recipient,
        publicKey: publicKey,
        messageToEncrypt: message,
        messageToEncryptIsText: true,
        encryptedMessageIsPrunable: true,
        deadline: 30,
        feeNQT: 0,
    };

    try {
        const response = await axios.post(NODEURL, qs.stringify(query), config);
        console.log('🚀 ~ file: ardorInterface.js:811 ~ sendDirectMessage ~ response', response);
        const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
        const response_2 = await axios.post(URL_BROADCAST, qs.stringify({ transactionBytes: signed }), config);
        console.log('🚀 ~ file: ardorInterface.js:813 ~ sendDirectMessage ~ response_2', response_2);
        return response_2.status === 200;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:820 ~ sendDirectMessage ~ error', error);
        return false;
    }
};

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
