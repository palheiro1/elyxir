import axios from 'axios';
// import { OMNO_API } from '../data/CONSTANTS';

export const fetchOmnoMarket = async () => {
    try {
        const response = await axios.get('https://api.mythicalbeings.io/index.php?action=getOmnoMarket');
        console.log("🚀 ~ file: omno.js:7 ~ fetchOmnoMarket ~ response:", response)
        return response.data;
    } catch (error) {
        console.log('🚀 ~ file: omno.js:12 ~ fetchOmnoMarket ~ error:', error);
    }
};
