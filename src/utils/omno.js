import axios from 'axios';
import { GIFTZASSET, OMNO_API, WETHASSET } from '../data/CONSTANTS';

export const fetchOmnoMarket = async () => {
    try {
        const response = await axios.get(OMNO_API, {
            params: {
                action: 'getOmnoMarket',
            },
        });
        return response.data || [];
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error so the caller can handle it if needed
    }
};

export const fetchGiftzMarket = async () => {
    const offers = await fetchOmnoMarket();
    const wethAsset = offers.filter(item => {
        return (
            Object.keys(item.give).length === 1 &&
            Object.keys(item.take).length === 1 &&
            item.give.asset[GIFTZASSET] &&
            item.take.asset[WETHASSET]
        );
    });

    const totalOnSale = wethAsset.reduce((total, item) => {
        return total + item.multiplier * item.give.asset[GIFTZASSET];
    }, 0);

    return { wethAsset, totalOnSale };
}