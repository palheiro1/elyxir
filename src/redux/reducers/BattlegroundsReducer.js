import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivePlayers, getBattleCount, getLandLords } from '../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId } from '../../services/Ardor/ardorInterface';
import { getUsersState } from '../../services/Ardor/omnoInterface';
import { GEMASSET, WETHASSET } from '../../data/CONSTANTS';


// Thunk asíncrono para obtener y procesar los datos
export const fetchBattleData = createAsyncThunk(
    'battle/fetchBattleData',
    async ({ accountRs, cards }, { rejectWithValue }) => {
        try {
            const [battleCount, activePlayers, landLords] = await Promise.all([
                getBattleCount(),
                getActivePlayers(),
                getLandLords(),
            ]);

            const accountId = await addressToAccountId(accountRs);
            const userInfo = await getUsersState().then(res => res.data.find(item => item.id === accountId));

            let omnoGEMsBalance = 0;
            let omnoWethBalance = 0;
            let parseWETH = 0;
            let filteredCards = [];

            if (userInfo?.balance) {
                const assetIds = Object.keys(userInfo.balance.asset);
                omnoGEMsBalance = userInfo.balance.asset[GEMASSET] || 0;
                omnoWethBalance = userInfo.balance.asset[WETHASSET] || 0;
                parseWETH = parseFloat(userInfo.balance.asset[WETHASSET] || 0);

                filteredCards = cards
                    .filter(card => assetIds.includes(card.asset))
                    .map(card => ({
                        ...card,
                        omnoQuantity: userInfo.balance.asset[card.asset],
                    }));
            }

            return {
                battleCount,
                activePlayers,
                landLords,
                omnoGEMsBalance,
                omnoWethBalance,
                parseWETH,
                filteredCards,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const battleSlice = createSlice({
    name: 'battle',
    initialState: {
        battleCount: null,
        activePlayers: null,
        landLords: null,
        omnoGEMsBalance: 0,
        omnoWethBalance: 0,
        parseWETH: 0,
        filteredCards: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetBattleState: state => {
            state.battleCount = null;
            state.activePlayers = null;
            state.landLords = null;
            state.omnoGEMsBalance = 0;
            state.omnoWethBalance = 0;
            state.parseWETH = 0;
            state.filteredCards = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBattleData.pending, state => {
                state.loading = true;
            })
            .addCase(fetchBattleData.fulfilled, (state, action) => {
                state.loading = false;
                state.battleCount = action.payload.battleCount;
                state.activePlayers = action.payload.activePlayers;
                state.landLords = action.payload.landLords;
                state.omnoGEMsBalance = action.payload.omnoGEMsBalance;
                state.omnoWethBalance = action.payload.omnoWethBalance;
                state.parseWETH = action.payload.parseWETH;
                state.filteredCards = action.payload.filteredCards;
            })
            .addCase(fetchBattleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBattleState } = battleSlice.actions;
export default battleSlice.reducer;
