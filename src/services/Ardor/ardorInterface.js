// Ardor Interface
import axios from 'axios';
import qs from 'qs';
import ardorjs from 'ardorjs';

import { GEMASSET, JACKPOTACCOUNT, NODEURL, NQTDIVIDER } from '../../data/CONSTANTS';
//import { APILIMIT, JACKPOTACCOUNT } from '../../data/CONSTANTS';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};

//building the logo url
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

//Account balance
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
        console.error(error);
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
            console.log(error);
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
            //console.log(response);
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
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
            console.log(error);
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
    console.log('🚀 ~ file: ardorInterface.js:263 ~ account', account);
    const recipientNew = account.data.errorCode === 5;
    console.log('🚀 ~ file: ardorInterface.js:265 ~ recipientNew', recipientNew);

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
    console.log('🚀 ~ file: ardorInterface.js:285 ~ res', res);
    const fee = recipientNew
        ? 14 * NQTDIVIDER
        : res.data.minimumFeeFQT * res.data.bundlerRateNQTPerFXT * 0.00000001;
    query.feeNQT = Math.ceil(fee);
    query.broadcast = false;
    const res2 = await axios.post(url_sendmoney, qs.stringify(query, config));
    console.log('🚀 ~ file: ardorInterface.js:290 ~ res2', res2);
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

    const { data: res1 } = await axios.post(url_cancel, qs.stringify(query), config);

    query.feeNQT = Math.ceil(res1.minimumFeeFQT * res1.bundlerRateNQTPerFXT * 0.00000001);
    query.broadcast = false;

    const { data: res2 } = await axios.post(url_cancel, qs.stringify(query), config);
    const signed = ardorjs.signTransactionBytes(res2.unsignedTransactionBytes, passPhrase);

    return axios.post(url_broadcast, qs.stringify({ transactionBytes: signed }), config);
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
        const signed = ardorjs.signTransactionBytes(
            response2.data.unsignedTransactionBytes,
            passPhrase
        );
        const txdata = { transactionBytes: signed };
        const finalResponse = await axios.post(url_broadcast, qs.stringify(txdata), config);
        return finalResponse;
    } catch (error) {
        console.error(error);
        throw error;
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
            console.log(error);
        });
};

function transferCurrency(
    nodeurl,
    currency,
    unitsQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true
) {
    console.log('transferCurrency()');
    let recipientNew = false;

    getAccount(recipient).then(response => {
        if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    });

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

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=transferCurrency';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config).then(response => {
        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        query.feeNQT = Math.ceil(fee);
        console.log('fee from node: ' + fee + ', set to:' + query.feeNQT);

        query.broadcast = false;
        console.log('get transactionBytes');

        return axios.post(url_sendmoney, qs.stringify(query), config).then(response => {
            const signed = ardorjs.signTransactionBytes(
                response.data.unsignedTransactionBytes,
                passPhrase
            );
            let txdata;

            if (message !== '') {
                let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                txdata = {
                    transactionBytes: signed,
                    prunableAttachmentJSON: txattachment,
                };
            } else {
                txdata = { transactionBytes: signed };
            }

            console.log('sending signed transaction');
            return axios
                .post(url_broadcast, qs.stringify(txdata), config)
                .then(function (response) {
                    return response;
                });
        });
    });
}

function transferCurrencyZeroFee(
    nodeurl,
    currency,
    unitsQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true
) {
    console.log('transferCurrencyZeroFee()');

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

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=transferCurrency';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';

    return axios.post(url_sendmoney, qs.stringify(query), config).then(response => {
        console.log(response);
        query.feeNQT = 0;

        query.broadcast = false;
        console.log('get transactionBytes');
        return axios.post(url_sendmoney, qs.stringify(query), config).then(response => {
            const signed = ardorjs.signTransactionBytes(
                response.data.unsignedTransactionBytes,
                passPhrase
            );
            let txdata;

            if (message !== '') {
                let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
            } else {
                txdata = { transactionBytes: signed };
            }

            console.log('sending signed transaction');
            return axios
                .post(url_broadcast, qs.stringify(txdata), config)
                .then(function (response) {
                    return response;
                });
        });
    });
}

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
            console.log(error);
        });
};

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
        let fee =
            postOrderResponse.data.minimumFeeFQT *
            postOrderResponse.data.bundlerRateNQTPerFXT *
            0.00000001;
        query.feeNQT = Math.ceil(fee);
        console.log('fee from node: ' + fee + ', set to:' + query.feeNQT);
        query.broadcast = false;
        console.log('get transactionBytes');
        const postOrderTransactionBytesResponse = await axios.post(
            url_postOrder,
            qs.stringify(query),
            config
        );
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );
        let txdata = { transactionBytes: signed };
        console.log('sending signed transaction');
        const broadcastResponse = await axios.post(url_broadcast, qs.stringify(txdata), config);
        console.log(broadcastResponse);
        return true;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
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
        let fee =
            postOrderResponse.data.minimumFeeFQT *
            postOrderResponse.data.bundlerRateNQTPerFXT *
            0.00000001;
        query.feeNQT = Math.ceil(fee);
        console.log('fee from node: ' + fee + ', set to:' + query.feeNQT);
        query.broadcast = false;
        console.log('get transactionBytes');
        const postOrderTransactionBytesResponse = await axios.post(
            url_postOrder,
            qs.stringify(query),
            config
        );
        const signed = ardorjs.signTransactionBytes(
            postOrderTransactionBytesResponse.data.unsignedTransactionBytes,
            passPhrase
        );
        let txdata = { transactionBytes: signed };
        console.log('sending signed transaction');
        const broadcastResponse = await axios.post(url_broadcast, qs.stringify(txdata), config);
        console.log(broadcastResponse);
        return true;
    } catch (error) {
        console.log('🚀 ~ file: ardorInterface.js:595 ~ createAskOrder ~ error', error);
        return false;
    }
};

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
    console.log('🚀 ~ file: ardorInterface.js:520 ~ recipient', recipient);
    console.log('transferAsset(): ' + asset);
    let recipientNew = false;

    await getAccount(recipient).then(response => {
        recipientNew = response.data.errorCode === 5;
    });

    console.log('🚀 ~ file: ardorInterface.js:522 ~ recipientNew', recipientNew);

    console.log('get publicKey');
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
    console.log('🚀 ~ file: ardorInterface.js:544 ~ query', query);

    console.log('get minimumFee');
    const url_tx = NODEURL + '?requestType=transferAsset';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';

    return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        query.feeNQT = Math.ceil(fee);
        console.log('fee from node: ' + fee + ', set to:' + query.feeNQT);

        query.broadcast = false;

        console.log('get transactionBytes');
        const response_1 = await axios.post(url_tx, qs.stringify(query), config);
        console.log(
            '🚀 ~ file: ardorInterface.js:561 ~ returnawaitaxios.post ~ response_1',
            response_1
        );
        const signed = ardorjs.signTransactionBytes(
            response_1.data.unsignedTransactionBytes,
            passPhrase
        );
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
        console.log('sending signed transaction');
        const response_2 = await axios.post(url_broadcast, qs.stringify(txdata), config);
        return response_2;
    });
};

const transferGEM = async ({
    quantityQNT,
    recipient,
    passPhrase,
    message = '',
    messagePrunable = true,
    deadline = 30,
    priority = 'NORMAL',
}) => {
    console.log('transferAsset(): ' + GEMASSET);
    let recipientNew = false;
    await getAccount(recipient).then(response => {
        recipientNew = response.data.errorCode === 5 || response.data.errorCode === 4;
    });

    console.log('get publicKey');
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

    console.log('get minimumFee');
    const url_tx = NODEURL + '?requestType=transferAsset';
    const url_broadcast = NODEURL + '?requestType=broadcastTransaction';
    return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
        let fee = recipientNew
            ? 14 * NQTDIVIDER
            : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

        query.feeNQT = Math.ceil(fee);
        console.log('fee from node: ' + fee + ', set to:' + query.feeNQT);

        query.broadcast = false;

        console.log('get transactionBytes');
        return await axios.post(url_tx, qs.stringify(query), config).then(async response => {
            const signed = ardorjs.signTransactionBytes(
                response.data.unsignedTransactionBytes,
                passPhrase
            );
            var txdata;

            if (message !== '') {
                let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
            } else {
                txdata = { transactionBytes: signed };
            }
            console.log('sending signed transaction');

            return await axios
                .post(url_broadcast, qs.stringify(txdata), config)
                .then(function (response) {
                    return response;
                });
        });
    });
};

const getBlockchainTransactions = async (
    chain,
    account,
    executedOnly = true,
    timestamp,
    lastIndex
) => {
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

function getConstants(nodeurl) {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getConstants',
            },
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function getBlockchainStatus() {
    return axios
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
            console.log(error);
        });
}

function getPrunableMessages(nodeurl, chain, userRs, otherRs, timestamp, firstIndex, lastIndex) {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getPrunableMessages',
                chain: chain,
                account: userRs,
                otherAccount: otherRs,
                timestamp: timestamp,
                firstIndex: firstIndex,
                lastIndex: lastIndex,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

export function getPrunableMessages2(
    nodeurl,
    chain,
    userRs,
    otherRs,
    timestamp,
    firstIndex,
    lastIndex
) {
    let query = {
        chain: 2,
        account: userRs,
        otherAccount: otherRs,
        timestamp: timestamp,
        firstIndex: firstIndex,
        lastIndex: lastIndex,
    };

    const url = nodeurl + '?requestType=getPrunableMessages';
    return axios.post(url, qs.stringify(query), config);
}

function getBlock(nodeurl, height) {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getBlock',
                height: height,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

/*
// TO-DO: REFACTOR THIS!!!

function getNumParticipations(nodeurl,accountRs,timestamp){
    let numParticipations = 0;
    let promises = [];

    for (var i=0; i<8; i++) {
        const firstIndex = i*APILIMIT;
        const lastIndex = (i+1)*APILIMIT-1;
        console.log("firstindex: "+firstIndex+", lastIndex:"+lastIndex);
        //const response = await getPrunableMessages(nodeurl,2,accountRs,JACKPOTACCOUNT,timestamp,firstIndex,lastIndex);
        promises.push(getPrunableMessages2(nodeurl,2,accountRs,JACKPOTACCOUNT,timestamp,firstIndex,lastIndex));
    }
    Promise.all(promises).then((responses) => {
        for (var i=0;i<10; i++){
            const response = responses[i];

            if(response.data && response.data.prunableMessages){
                response.data.prunableMessages.forEach((prunableMessage) => {
                    const msg = JSON.parse(prunableMessage.message.replace(/\bNaN\b/g, "null"));
                    if (msg.submittedBy === "Jackpot" && msg.reason === "confirmParticipation") {
                        console.log("detected a confirmParticipation Message");
                        console.log(msg)
                        numParticipations++;
                    }
                })

                if (response.data.prunableMessages.length<APILIMIT){  // I think this indicates the last set of data, if not filled to API limit!
                    console.log("last data set detected? exit loop..");
                }            
            }
        }        
    })

    return numParticipations;
}
*/

function getAssetDividends(nodeurl, chain, assetId) {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getAssetDividends',
                chain: chain,
                asset: assetId,
            },
        })
        .then(function (response) {
            console.log(response);
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function getAccountLedger(nodeurl, accountRs, firstIndex = '', lastIndex = '', eventType = '') {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getAccountLedger',
                account: accountRs,
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                eventType: eventType,
                includeHoldingInfo: true,
            },
        })
        .then(function (response) {
            //console.log(response);
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function getAccountProperties(nodeurl, accountRs, setterRs, property = '') {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getAccountProperties',
                setter: setterRs,
                recipient: accountRs,
                property: property,
            },
        })
        .then(function (response) {
            //console.log(response);
            return response.data;
        });
}

export function getCurrencySellOffers(nodeurl, currency, sellerRs = '') {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getSellOffers',
                chain: 2,
                currency: currency,
                account: sellerRs,
            },
        })
        .then(function (response) {
            //console.log(response);
            return response.data;
        });
}

export function getTime(nodeurl) {
    return axios
        .get(nodeurl, {
            params: {
                requestType: 'getTime',
            },
        })
        .then(function (response) {
            //console.log(response);
            return response.data;
        });
}

export {
    getTransactionBytes,
    getConstants,
    sendIgnis,
    transferCurrency,
    transferCurrencyZeroFee,
    transferAsset,
    transferGEM,
    getCurrency,
    getBlockchainStatus,
    getBlockchainTransactions,
    getUnconfirmedTransactions,
    getPrunableMessages,
    getBlock,
    getAssetDividends,
    getAccountLedger,
    getAccountProperties,
};
