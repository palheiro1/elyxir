import Crypto from 'crypto-browserify';

export const generateHash = (text) => {
    return Crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex');
}

export const compareHash = (text, hash) => {
    return generateHash(text) === hash;
}

export const isHash = (hash) => {
    return /^[0-9a-fA-F]{64}$/.test(hash);
}