import axios from 'axios';

export const getIgnisFromFaucet = async (address, publicKey) => {
    try {
        const response = await axios.post('https://faucet-api.mythicalbeings.io/faucet', {
            address: address,
            publicKey: publicKey,
        });
        return response.data;
    } catch (error) {
        console.error('🚀 ~ file: faucet.js:10 ~ getIgnisFromFaucet ~ error:', error);
        throw error;
    }
};
