import axios from 'axios';

export const getIgnisFromFaucet = async address => {
    try {
        const response = await axios.post('https://faucet-api.mythicalbeings.io/faucet', {
            address: address,
        });
        return response.data;
    } catch (error) {
        console.error('🚀 ~ file: faucet.js:10 ~ getIgnisFromFaucet ~ error:', error);
        throw error.message;
    }
};
