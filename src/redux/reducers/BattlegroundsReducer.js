import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivePlayers, getBattleCount, getLandLords } from '../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId } from '../../services/Ardor/ardorInterface';
import { getUsersState } from '../../services/Ardor/omnoInterface';
import { GEMASSET, WETHASSET } from '../../data/CONSTANTS';

const extractUserInfo = (users, accountId) => users.find(user => user.id === accountId);

const getFilteredCards = (cards, userAssets) => {
    const assetIds = Object.keys(userAssets);
    return cards
        .filter(card => assetIds.includes(card.asset))
        .map(card => ({
            ...card,
            omnoQuantity: userAssets[card.asset] || 0,
        }));
};

export const fetchBattleData = createAsyncThunk(
    'battle/fetchBattleData',
    async ({ accountRs, cards }, { rejectWithValue }) => {
        try {
            const [[battleCount, activePlayers, landLords], accountId, { data: usersState }] = await Promise.all([
                Promise.all([getBattleCount(), getActivePlayers(), getLandLords()]),
                addressToAccountId(accountRs),
                getUsersState(),
            ]);

            const userInfo = extractUserInfo(usersState, accountId);
            const assets = userInfo?.balance?.asset ?? {};

            return {
                battleCount: battleCount ?? 0,
                activePlayers,
                landLords,
                omnoGEMsBalance: assets[GEMASSET] ?? 0,
                omnoWethBalance: assets[WETHASSET] ?? 0,
                parseWETH: parseFloat(assets[WETHASSET] ?? 0),
                filteredCards: getFilteredCards(cards, assets),
            };
        } catch (error) {
            console.error('Error fetching battle data:', error);
            return rejectWithValue('Unknown error fetching battle data');
        }
    }
);

const initialState = {
    battleCount: null,
    activePlayers: null,
    landLords: null,
    omnoGEMsBalance: 0,
    omnoWethBalance: 0,
    parseWETH: 0,
    filteredCards: null,
    loading: false,
    error: null,
};

const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        resetBattleState: () => initialState,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBattleData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBattleData.fulfilled, (state, { payload }) => {
                Object.assign(state, {
                    ...payload,
                    loading: false,
                });
            })
            .addCase(fetchBattleData.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Failed to fetch battle data';
            });
    },
});

export const { resetBattleState } = battleSlice.actions;
export default battleSlice.reducer;
