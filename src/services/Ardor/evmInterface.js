import { getCurrencies } from '../coingecko/utils';

export const getGemPrice = async () => {
    const price = await getCurrencies();
    return price.gem;
};

export const getManaPrice = async () => {
    const price = await getCurrencies();
    return price.mana;
};




/*
export const getGemPrice = async () => {
    const request = await fetch("https://interface.gateway.uniswap.org/v2/quote", {
        "body": "{\"tokenInChainId\":137,\"tokenIn\":\"0x5F790ffA0695967A2d711872EcB4c7553e24794D\",\"tokenOutChainId\":137,\"tokenOut\":\"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619\",\"amount\":\"9000000000000000000000\",\"sendPortionEnabled\":true,\"type\":\"EXACT_INPUT\",\"intent\":\"quote\",\"configs\":[{\"protocols\":[\"V2\",\"V3\",\"MIXED\"],\"enableUniversalRouter\":true,\"routingType\":\"CLASSIC\",\"enableFeeOnTransferFeeFetching\":true}]}",
        "method": "POST",
    });

    const jsonRequest = await request.json();
    const gemPriceInWei = jsonRequest?.quote?.route[0][0]?.amountOut
    const gemPrice = gemPriceInWei / 10 ** 18;

    return gemPrice;
}

export const getManaPrice = async () => {
    const request = await fetch("https://interface.gateway.uniswap.org/v2/quote", {
        "body": "{\"tokenInChainId\":137,\"tokenIn\":\"0x2caCCa1266653bB090D3Fb511456EBCA33150562\",\"tokenOutChainId\":137,\"tokenOut\":\"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619\",\"amount\":\"9000000000000000000000\",\"sendPortionEnabled\":true,\"type\":\"EXACT_INPUT\",\"intent\":\"quote\",\"configs\":[{\"protocols\":[\"V2\",\"V3\",\"MIXED\"],\"enableUniversalRouter\":true,\"routingType\":\"CLASSIC\",\"enableFeeOnTransferFeeFetching\":true}]}",
        "method": "POST",
    });

    const jsonRequest = await request.json();
    const manaPriceInWei = jsonRequest?.quote?.route[0][0]?.amountOut
    const manaPrice = manaPriceInWei / 10 ** 18;

    return manaPrice;
}
*/
