import { configureStore } from '@reduxjs/toolkit';
import BlockchainReducer from '../reducers/BlockchainReducer';
import CardsReducer from '../reducers/CardsReducer';
import BattleReducer from '../reducers/BattleReducer';

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
		battle: BattleReducer,
    },
});
