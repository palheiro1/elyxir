import axios from 'axios';
import { OMNO_API } from '../data/CONSTANTS';

export const fetchOmnoMarket = async () => {
    try {
        const response = await axios.get(
            OMNO_API +
                '?%7B%22password%22%3A%22password%22%2C%22service%22%3A%22trade%22%2C%22request%22%3A%22state%22%7D',
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("🚀 ~ file: omno.js:11 ~ fetchOmnoMarket ~ response:", response.data)
        return response.data.state.offer;
    } catch (error) {
        console.log('🚀 ~ file: omno.js:12 ~ fetchOmnoMarket ~ error:', error);
    }
};
