// Ardor Interface
import axios from 'axios';
import qs from 'qs';
import ardorjs from 'ardorjs';

import { GEMASSET, JACKPOTACCOUNT, NODEURL, NQTDIVIDER } from '../../data/CONSTANTS';

// -------------------------------------------------
const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};
// -------------------------------------------------

// -------------------------------------------------
//                   BASIC UTILS
// -------------------------------------------------

export const getImageURL = async (nodeurl, fullHash) => {
    const params = new URLSearchParams();
    const queryparams = {
        requestType: 'downloadTaggedData',
        chain: 'IGNIS',
        transactionFullHash: fullHash,
        retrieve: true,
    };

    Object.entries(queryparams).forEach(([key, val]) => {
        params.set(key, val);
    });

    return `${nodeurl}?${params.toString()}`;
};

export const getAccountFromPhrase = async value => {
    return ardorjs.secretPhraseToAccountId(value, false);
};

const getTransactionBytes = async query => {
    return axios.post(NODEURL, qs.stringify(query), config).then(function (response) {
        return response.data;
    });
};

export const fetchAssetCount = async asset => {
    const response = await fetch(
        NODEURL + '?requestType=getAccountAssets&account=' + JACKPOTACCOUNT + '&asset=' + asset
    );
    const result = await response.json();
    return result.quantityQNT ? result.quantityQNT : 0;
};

export const getIgnisBalance = async account => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getBalance',
                chain: 'IGNIS',
                account: account,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('🚀 ~ file: ardorInterface.js:71 ~ getIgnisBalance ~ error', error);
        });
};

export const getAccountCurrentAskOrders = async account => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getAccountCurrentAskOrders',
                chain: 'IGNIS',
                account: account,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:92 ~ getAccountCurrentAskOrders ~ error', error);
        });
};

export const getAccountCurrentBidOrders = async account => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getAccountCurrentBidOrders',
                chain: 'IGNIS',
                account: account,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:109 ~ getAccountCurrentBidOrders ~ error', error);
        });
};

export const getAskOrders = async asset => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getAskOrders',
                chain: 'IGNIS',
                asset: asset,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:127 ~ getAskOrders ~ error', error);
        });
};

export const getBidOrders = async asset => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getBidOrders',
                chain: 'IGNIS',
                asset: asset,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('🚀 ~ file: ardorInterface.js:144 ~ getBidOrders ~ error', error);
        });
};

export const getAskOrder = async order => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getAskOrder',
                chain: 'IGNIS',
                order: order,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:162 ~ getAskOrder ~ error', error);
        });
};

export const getBidOrder = async order => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getBidOrder',
                chain: 'IGNIS',
                order: order,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:180 ~ getBidOrder ~ error', error);
        });
};

export const getAssetsByIssuer = async issuerAccount => {
    try {
        const {
            data: { assets },
        } = await axios.get(NODEURL, {
            params: {
                requestType: 'getAssetsByIssuer',
                account: issuerAccount,
            },
        });
        return assets[0];
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:196 ~ getAssetsByIssuer ~ error', error);
    }
};

export const getAccount = async account => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getAccount',
                account: account,
            },
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:213 ~ getAccount ~ error', error);
        });
};

export const getAsset = async asset => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getAsset',
                asset: asset,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:230 ~ getAsset ~ error', error);
        });
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
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getTrades',
                chain: chain,
                account: account,
                timestamp: timestamp,
                includeAssetInfo: true,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:266 ~ getTrades ~ error', error);
        });
};

export const getLastTrades = async assets => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getLastTrades',
                chain: 2,
                assets: assets,
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:284 ~ getLastTrades ~ error', error);
        });
};

// ----------------------------------------------
// CURRENCY
// ----------------------------------------------

export const getAccountCurrencies = async (account, currency) => {
    return axios
        .get(NODEURL, {
            params: {
                requestType: 'getAccountCurrencies',
                account: account,
                currency: currency,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:306 ~ getAccountCurrencies ~ error', error);
        });
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
    const account = await getAccount(recipient);
    const recipientNew = account.data.errorCode === 5;

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

    const url_sendmoney = NODEURL + '?requestType=sendMoney';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    const res = await axios.post(url_sendmoney, qs.stringify(query), config);
    const fee = recipientNew ? 14 * NQTDIVIDER : res.data.minimumFeeFQT * res.data.bundlerRateNQTPerFXT * 0.00000001;
    query.feeNQT = Math.ceil(fee);
    query.broadcast = false;
    const res2 = await axios.post(url_sendmoney, qs.stringify(query, config));
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
    return await axios.post(url_broadcast, qs.stringify(txdata), config);
};

const transferCurrency = async (currency, unitsQNT, recipient, passPhrase, message = '', messagePrunable = true) => {
    let recipientNew = false;

    try {
        const response = await getAccount(recipient);
        if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    } catch (error) {
        console.error(error);
    }

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

    const url_sendmoney = NODEURL + '?requestType=transferCurrency';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';
    try {
        const response = await axios.post(url_sendmoney, qs.stringify(query), config);

        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;

        const response2 = await axios.post(url_sendmoney, qs.stringify(query), config);
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

        return await axios.post(url_broadcast, qs.stringify(txdata), config);
    } catch (error) {
        console.error(error);
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

    const url_sendmoney = NODEURL + '?requestType=transferCurrency';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    try {
        const response2 = await axios.post(url_sendmoney, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response2.data.unsignedTransactionBytes, passPhrase);
        let txdata;

        if (message !== '') {
            let txattachment = JSON.stringify(response2.data.transactionJSON.attachment);
            txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
        } else {
            txdata = { transactionBytes: signed };
        }

        return await axios.post(url_broadcast, qs.stringify(txdata), config);
    } catch (error) {
        console.error(error);
    }
};

const getCurrency = async currency => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getCurrency',
                currency: currency,
            },
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:480 ~ getCurrency ~ error', error);
        });
};

// ----------------------------------------------
// AKS & BID ORDERS
// ----------------------------------------------

export const createAskOrder = async ({ asset, price, quantity, passPhrase }) => {
    if (!passPhrase) throw new Error('PassPhrase is required');
    if (!asset) throw new Error('Asset is required');
    if (!price) throw new Error('Price is required');
    if (!quantity) throw new Error('Quantity is required');

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
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    try {
        const postOrderResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        let fee = postOrderResponse.data.minimumFeeFQT * postOrderResponse.data.bundlerRateNQTPerFXT * 0.00000001;
        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;
        const postOrderTransactionBytesResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );
        let txdata = { transactionBytes: signed };
        await axios.post(url_broadcast, qs.stringify(txdata), config);
        return true;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
        return false;
    }
};

export const cancelAskOrder = async (order, passPhrase) => {
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

    const url_cancel = `${NODEURL}?requestType=cancelAskOrder`;
    const url_broadcast = `${NODEURL}?requestType=broadcastTransaction`;

    try {
        const { data: res1 } = await axios.post(url_cancel, qs.stringify(query), config);

        query.feeNQT = Math.ceil(res1.minimumFeeFQT * res1.bundlerRateNQTPerFXT * 0.00000001);
        query.broadcast = false;

        const { data: res2 } = await axios.post(url_cancel, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(res2.unsignedTransactionBytes, passPhrase);
        await axios.post(url_broadcast, qs.stringify({ transactionBytes: signed }), config);
        return true;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:341 ~ error', error);
        return false;
    }
};

export const createBidOrder = async ({ asset, price, quantity, passPhrase }) => {
    if (!passPhrase) throw new Error('PassPhrase is required');
    if (!asset) throw new Error('AssetID is required');
    if (!price) throw new Error('Price is required');
    if (!quantity) throw new Error('Quantity is required');

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
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    try {
        const postOrderResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        let fee = postOrderResponse.data.minimumFeeFQT * postOrderResponse.data.bundlerRateNQTPerFXT * 0.00000001;
        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;
        const postOrderTransactionBytesResponse = await axios.post(url_postOrder, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );
        let txdata = { transactionBytes: signed };
        await axios.post(url_broadcast, qs.stringify(txdata), config);
        return true;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
        return false;
    }
};

export const cancelBidOrder = async (order, passPhrase) => {
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

    const url_sendmoney = `${NODEURL}?requestType=cancelBidOrder`;
    const url_broadcast = `${NODEURL}?requestType=broadcastTransaction`;

    try {
        const response = await axios.post(url_sendmoney, qs.stringify(query), config);
        const fee = response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;
        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;
        const response2 = await axios.post(url_sendmoney, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response2.data.unsignedTransactionBytes, passPhrase);
        const txdata = { transactionBytes: signed };
        await axios.post(url_broadcast, qs.stringify(txdata), config);
        return true;
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
    let recipientNew = false;

    await getAccount(recipient).then(response => {
        recipientNew = response.data.errorCode === 5;
    });

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

    const url_tx = NODEURL + '?requestType=transferAsset';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        if (response.data.errorCode === 6) return false;

        query.feeNQT = Math.ceil(fee);

        query.broadcast = false;

        const response_1 = await axios.post(url_tx, qs.stringify(query), config);
        const signed = ardorjs.signTransactionBytes(response_1.data.unsignedTransactionBytes, passPhrase);
        let txdata;
        if (message !== '') {
            let txattachment = JSON.stringify(response_1.data.transactionJSON.attachment);
            txdata = {
                transactionBytes: signed,
                prunableAttachmentJSON: txattachment,
            };
        } else {
            txdata = { transactionBytes: signed };
        }
        const response_2 = await axios.post(url_broadcast, qs.stringify(txdata), config);
        return response_2;
    });
};

export const getAssetDividends = async (chain, assetId) => {
    try {
        const response = await axios.get(NODEURL, {
            params: {
                requestType: 'getAssetDividends',
                chain,
                asset: assetId,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener los dividendos del activo: ${error.message}`);
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
        console.log("🚀 ~ file: ardorInterface.js:722 ~ getAccountLedger ~ error", error)
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
    let recipientNew = false;
    await getAccount(recipient).then(response => {
        recipientNew = response.data.errorCode === 5 || response.data.errorCode === 4;
    });

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
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';
    return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        query.feeNQT = Math.ceil(fee);
        query.broadcast = false;

        return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
            const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
            var txdata;

            if (message !== '') {
                let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
            } else {
                txdata = { transactionBytes: signed };
            }

            return await axios.post(url_broadcast, qs.stringify(txdata), config).then(function (response) {
                return response;
            });
        });
    });
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
        console.error(error);
        throw new Error('Failed to fetch transactions');
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
        console.error(error);
        throw new Error('Failed to fetch unconfirmed transactions');
    }
};

const getBlockchainStatus = async () => {
    return await axios
        .get(NODEURL, {
            params: {
                requestType: 'getBlockchainStatus',
            },
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log('🚀 ~ file: ardorInterface.js:820 ~ getBlockchainStatus ~ error', error);
        });
};

export {
    getTransactionBytes,
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
