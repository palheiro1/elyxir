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
