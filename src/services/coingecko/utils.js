import axios from 'axios';

/*
export const getIgnisPrice = async () => {
    const responseUSD = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ignis&vs_currencies=usd'
    );
    const data = await responseUSD.json();
    return data.ignis.usd;
}

export const getEthPrice = async () => {
    const responseUSD = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await responseUSD.json();
    return data.ethereum.usd;
}

export const getMaticPriceWithEth = async () => {
    const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=eth'
    );
    const data = await response.json();
    return data['matic-network'].eth;
}
*/

export const getCurrencies = async () => {
    try {
        const response = await axios.get('https://faucet-api.mythicalbeings.io/currencies');
        return response.data;
    } catch (error) {
        console.error('🚀 ~ getIgnisFromFaucet ~ error:', error);
        throw error;
    }
};

export const getIgnisPrice = async () => {
    const response = await getCurrencies();
    return response.ignis;
};

export const getEthPrice = async () => {
    const response = await getCurrencies();
    return response.eth;
};

export const getMaticPriceWithEth = async () => {
    const response = await getCurrencies();
    return response.maticEth;
};


