// Ardor Interface
import axios from 'axios';
import qs from 'qs';
import ardorjs from 'ardorjs';

import { NODEURL, NQTDIVIDER } from '../../data/CONSTANTS';
//import { APILIMIT, JACKPOTACCOUNT } from '../../data/CONSTANTS';


const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};


//building the logo url
export function getImageURL(nodeurl, fullHash) {
    const params = new URLSearchParams();
    const queryparams = {
        requestType: "downloadTaggedData",
        chain: "IGNIS",
        transactionFullHash: fullHash,
        retrieve: true
    };

    for (const [key, val] of Object.entries(queryparams)) {
        params.append(key, val);
    }

    return nodeurl + '?' + params.toString();
}

export function getAccountFromPhrase(value) {
    return ardorjs.secretPhraseToAccountId(value, false);
}

function getTransactionBytes(nodeurl, query) {
    console.log(nodeurl, query);

    return axios.post(nodeurl, qs.stringify(query), config).then(function (response) {
        return response.data;
    });
}


//Account balance
export function getIgnisBalance(account) {
    return axios.get(NODEURL, {
        params: {
            requestType: "getBalance",
            chain: "IGNIS",
            account: account
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
}

export function getAccountCurrentAskOrders(nodeurl, account) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccountCurrentAskOrders",
            chain: "IGNIS",
            account: account
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        // handle error
        console.log(error);
    });
}

export function getAccountCurrentBidOrders(nodeurl, account) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccountCurrentBidOrders",
            chain: "IGNIS",
            account: account
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        // handle error
        console.log(error);
    });
}

export function getAskOrders(nodeurl, asset) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAskOrders",
            chain: "IGNIS",
            asset: asset,
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        // handle error
        console.log(error);
    });
}


export function getBidOrders(nodeurl, asset) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getBidOrders",
            chain: "IGNIS",
            asset: asset,
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
}

export function getAskOrder(nodeurl, order) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAskOrder",
            chain: "IGNIS",
            order: order,
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export function getBidOrder(nodeurl, order) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getBidOrder",
            chain: "IGNIS",
            order: order,
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export function getAssetsByIssuer(nodeurl, account) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAssetsByIssuer",
            account: account
        }
    }).then(function (response) {
        return response.data.assets[0];
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}


export function getAccount(nodeurl, account) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccount",
            account: account
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export function getAsset(nodeurl, asset) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAsset",
            asset: asset
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export function getAccountAssets(nodeurl, account, asset = "") {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccountAssets",
            includeAssetInfo: false,
            account: account,
            asset: asset
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export const getAccountCurrencies = async (account, currency) => {
    return axios.get(NODEURL, {
        params: {
            requestType: "getAccountCurrencies",
            account: account,
            currency: currency
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function sendIgnis(nodeurl, amountNQT, recipient, passPhrase, message, messagePrunable = true, deadline = 30, priority = "NORMAL") {
    console.log('sendIgnis()');
    let recipientNew = false;

    getAccount(nodeurl, recipient).then((response) => {
        if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    })

    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
    let query = {
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
        transactionPriority: priority
    };

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=sendMoney';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config)
        .then((response) => {
            let fee = recipientNew ? 14 * NQTDIVIDER : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;
            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;
            console.log('get transactionBytes');

            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    var txdata;

                    if (message !== "") {
                        let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                        txdata = {
                            transactionBytes: signed,
                            prunableAttachmentJSON: txattachment
                        };
                    } else {
                        txdata = { transactionBytes: signed };
                    }

                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then((response) => {
                            return response;
                        })
                })
        });
}


export function cancelAskOrder(nodeurl, chain, order, passPhrase) {
    console.log('cancelAskOrder()');
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);

    let query = {
        chain: 2,
        order: order,
        feeNQT: -1,
        feeRateNQTPerFXT: -1,
        deadline: 15,
        broadcast: false,
        publicKey: publicKey
    };

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=cancelAskOrder';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';

    return axios.post(url_sendmoney, qs.stringify(query), config)
        .then((response) => {
            let fee = response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;

            console.log('get transactionBytes');

            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);

                    const txdata = {
                        transactionBytes: signed
                    };

                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then((response) => {
                            return response;
                        })
                })
        });
}


export function cancelBidOrder(nodeurl, chain, order, passPhrase) {
    console.log('cancelBidOrder()');
    const publicKey = ardorjs.secretPhraseToPublicKey(passPhrase);
    let query = {
        chain: 2,
        order: order,
        feeNQT: -1,
        feeRateNQTPerFXT: -1,
        deadline: 15,
        broadcast: false,
        publicKey: publicKey
    };

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=cancelBidOrder';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';

    return axios.post(url_sendmoney, qs.stringify(query), config)
        .then((response) => {
            const fee = response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;
            console.log('get transactionBytes');

            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    const txdata = { transactionBytes: signed };
                    console.log("sending signed transaction");

                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function (response) {
                            return response;
                        })
                })
        });
}


export function getTrades(nodeurl, chain, account, timestamp) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getTrades",
            chain: chain,
            account: account,
            timestamp: timestamp,
            includeAssetInfo: true
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        // handle error
        console.log(error);
    });
}

function transferCurrency(nodeurl, currency, unitsQNT, recipient, passPhrase, message = "", messagePrunable = true) {
    console.log('transferCurrency()');
    let recipientNew = false;

    getAccount(nodeurl, recipient).then((response) => {
        if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    })

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
        messageIsPrunable: messagePrunable
    };

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=transferCurrency';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config)
        .then((response) => {
            let fee = recipientNew ? 14 * NQTDIVIDER : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;
            console.log('get transactionBytes');

            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    let txdata;

                    if (message !== "") {
                        let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                        txdata = {
                            transactionBytes: signed,
                            prunableAttachmentJSON: txattachment
                        };
                    } else {
                        txdata = { transactionBytes: signed };
                    }

                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function (response) {
                            return response;
                        })
                })
        });
}

function transferCurrencyZeroFee(nodeurl, currency, unitsQNT, recipient, passPhrase, message = "", messagePrunable = true) {
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
        messageIsPrunable: messagePrunable
    };

    console.log('get minimumFee');
    const url_sendmoney = nodeurl + '?requestType=transferCurrency';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';

    return axios.post(url_sendmoney, qs.stringify(query), config)
        .then((response) => {
            console.log(response);
            query.feeNQT = 0;

            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    let txdata;

                    if (message !== "") {
                        let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                        txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
                    } else {
                        txdata = { transactionBytes: signed };
                    }

                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function (response) {
                            return response;
                        })
                })
        });
}

function getCurrency(nodeurl, currency) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getCurrency",
            currency: currency
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}


function transferAsset(nodeurl, asset, quantityQNT, recipient, passPhrase, message = '', messagePrunable = true, deadline = 30, priority = "NORMAL") {
    console.log('transferAsset(): ' + asset);
    let recipientNew = false;

    getAccount(nodeurl, recipient).then((response) => {
        recipientNew = response.data.errorCode === 5 || response.data.errorCode === 4;
    })

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
        transactionPriority: priority
    };

    console.log('get minimumFee');
    const url_tx = nodeurl + '?requestType=transferAsset';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';

    return axios.post(url_tx, qs.stringify(query), config)
        .then(function (response) {
            let fee = recipientNew ? 14 * NQTDIVIDER : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;

            console.log('get transactionBytes');
            return axios.post(url_tx, qs.stringify(query), config)
                .then(function (response) {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    let txdata;

                    if (message !== "") {
                        let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                        txdata = {
                            transactionBytes: signed,
                            prunableAttachmentJSON: txattachment
                        };
                    } else {
                        txdata = { transactionBytes: signed };
                    }

                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then((response) => {
                            return response;
                        });
                });
        });
}


function transferGEM(nodeurl, GEMASSET, quantityQNT, recipient, passPhrase, message = '', messagePrunable = true, deadline = 30, priority = "NORMAL") {
    console.log('transferAsset(): ' + GEMASSET);
    let recipientNew = false;
    getAccount(nodeurl, recipient).then((response) => {
        recipientNew = response.data.errorCode === 5 || response.data.errorCode === 4;
    })

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
        transactionPriority: priority
    };

    console.log('get minimumFee');
    const url_tx = nodeurl + '?requestType=transferAsset';
    const url_broadcast = nodeurl + '?requestType=broadcastTransaction';
    return axios.post(url_tx, qs.stringify(query), config)
        .then(function (response) {
            let fee = recipientNew ? 14 * NQTDIVIDER : response.data.minimumFeeFQT * response.data.bundlerRateNQTPerFXT * 0.00000001;

            query.feeNQT = Math.ceil(fee);
            console.log("fee from node: " + fee + ", set to:" + query.feeNQT);

            query.broadcast = false;

            console.log('get transactionBytes');
            return axios.post(url_tx, qs.stringify(query), config)
                .then((response) => {
                    const signed = ardorjs.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    var txdata;

                    if (message !== "") {
                        let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                        txdata = { transactionBytes: signed, prunableAttachmentJSON: txattachment };
                    } else {
                        txdata = { transactionBytes: signed };
                    }
                    console.log("sending signed transaction");

                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function (response) {
                            return response;
                        });
                });
        });
}

function getBlockchainTransactions(nodeurl, chain, account, executedOnly, timestamp, lastIndex) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getBlockchainTransactions",
            chain: chain,
            account: account,
            executedOnly: executedOnly,
            timestamp: timestamp,
            lastIndex: lastIndex
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function getUnconfirmedTransactions(nodeurl, chain, account, type, subtype) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getUnconfirmedTransactions",
            chain: chain,
            account: account,
            type: type,
            subtype: subtype
        }
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function getConstants(nodeurl) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getConstants"
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function getBlockchainStatus(nodeurl) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getBlockchainStatus"
        }
    }).then(function (response) {
        return response;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function getPrunableMessages(nodeurl, chain, userRs, otherRs, timestamp, firstIndex, lastIndex) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getPrunableMessages",
            chain: chain,
            account: userRs,
            otherAccount: otherRs,
            timestamp: timestamp,
            firstIndex: firstIndex,
            lastIndex: lastIndex
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

export function getPrunableMessages2(nodeurl, chain, userRs, otherRs, timestamp, firstIndex, lastIndex) {
    let query = {
        chain: 2,
        account: userRs,
        otherAccount: otherRs,
        timestamp: timestamp,
        firstIndex: firstIndex,
        lastIndex: lastIndex
    }

    const url = nodeurl + '?requestType=getPrunableMessages';
    return axios.post(url, qs.stringify(query), config)
}

function getBlock(nodeurl, height) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getBlock",
            height: height
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
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
    return axios.get(nodeurl, {
        params: {
            requestType: "getAssetDividends",
            chain: chain,
            asset: assetId
        }
    }).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function getAccountLedger(nodeurl, accountRs, firstIndex = "", lastIndex = "", eventType = "") {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccountLedger",
            account: accountRs,
            firstIndex: firstIndex,
            lastIndex: lastIndex,
            eventType: eventType,
            includeHoldingInfo: true
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    }).catch(function (error) {
        // handle error
        console.log(error);
    });
}

function getAccountProperties(nodeurl, accountRs, setterRs, property = "") {
    return axios.get(nodeurl, {
        params: {
            requestType: "getAccountProperties",
            setter: setterRs,
            recipient: accountRs,
            property: property
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    })
}

export function getCurrencySellOffers(nodeurl, currency, sellerRs = "") {
    return axios.get(nodeurl, {
        params: {
            requestType: "getSellOffers",
            chain: 2,
            currency: currency,
            account: sellerRs
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    })
}

export function getTime(nodeurl) {
    return axios.get(nodeurl, {
        params: {
            requestType: "getTime",
        }
    }).then(function (response) {
        //console.log(response);
        return response.data;
    })
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
    getAccountProperties
};