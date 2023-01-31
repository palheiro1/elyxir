import Crypto from 'crypto-browserify';

export const generateHash = (text) => {
    return Crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex');
}