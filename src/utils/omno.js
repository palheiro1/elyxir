import axios from 'axios';
import { OMNO_API } from '../data/CONSTANTS';

let isFetching = false;

export const fetchOmnoMarket = async () => {
    if (isFetching) {
        // If there's already a request in progress, wait for it to complete.
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (!isFetching) {
                    clearInterval(interval);
                    resolve();
                }
            }, 300);
        });
    }

    try {
        isFetching = true;
        const response = await axios.get(OMNO_API, {
            params: {
                action: 'getOmnoMarket',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error so the caller can handle it if needed
    } finally {
        isFetching = false;
    }
};