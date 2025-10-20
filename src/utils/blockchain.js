import { store } from '../redux/store/store';

/**
 * @name waitForBlockChange
 * @description Waits until the blockchain height changes compared to the given initial block.
 * @param {number} initialBlock - The block height at the start of the crafting process.
 * @returns {Promise<void>} Resolves when the block height changes.
 */
export const waitForBlockChange = async initialBlock => {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            const currentBlock = store.getState().blockchain.prev_height;
            if (currentBlock > initialBlock) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 3000); // Verifica cada 3 segundos
    });
};

export const formatTimeStamp = timestamp => {
    const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
    let battleStamp = new Date(eb.getTime() + timestamp * 1000);
    battleStamp = new Date(battleStamp.getTime()).toLocaleString();
    return battleStamp;
};
