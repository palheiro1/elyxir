import { configureStore } from '@reduxjs/toolkit';
import BlockchainReducer from '../reducers/BlockchainReducer';
import CardsReducer from '../reducers/CardsReducer';
import ItemsReducer from '../reducers/ItemsReducer';
import ElyxirReducer from '../reducers/ElyxirReducer';

/**
 *
 * @name store
 * @description The redux store
 * @version 1.0.0
 *
 */
export const store = configureStore({
    reducer: {
        blockchain: BlockchainReducer,
        cards: CardsReducer,
        items: ItemsReducer,
        elyxir: ElyxirReducer,
    },
});
