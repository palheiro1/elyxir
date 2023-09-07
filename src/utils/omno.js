import axios from 'axios';
import { OMNO_API } from '../data/CONSTANTS';

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
