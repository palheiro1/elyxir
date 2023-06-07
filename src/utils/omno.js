import axios from 'axios';

let cache = null;
let isFetching = false;

export const fetchOmnoMarket = async () => {
    if (cache) {
        return cache;
    }

    if (isFetching) {
        // Si ya hay una solicitud en curso, esperamos a que termine y retornamos la caché actualizada
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!isFetching) {
                    clearInterval(interval);
                    resolve(cache);
                }
            }, 300);
        });
    }

    try {
        isFetching = true;
        const response = await axios.get('https://api.mythicalbeings.io/index.php?action=getOmnoMarket');
        cache = response.data;
        setTimeout(() => {
            cache = null;
        }, 7500);
        return cache;
    } catch (error) {
        console.log('🚀 ~ file: omno.js:12 ~ fetchOmnoMarket ~ error:', error);
    } finally {
        isFetching = false;
    }
};
