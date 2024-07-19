// battleSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addressToAccountId, getAccount } from '../../../../../services/Ardor/ardorInterface';
import { getArenas, getUserBattles } from '../../../../../services/Battlegrounds/Battlegrounds';
import { formatTimeStamp } from '../../Utils/BattlegroundsUtils';

export const fetchArenasAndUserBattles = createAsyncThunk(
    'battle/fetchArenasAndUserBattles',
    async (accountRs, { rejectWithValue }) => {
        try {
            const arenas = await getArenas();
            const accountId = await addressToAccountId(accountRs);
            const battles = (await getUserBattles(accountId))
                .map(battle => ({
                    ...battle,
                    isUserDefending: battle.defenderAccount === accountId,
                }))
                .reverse();

            return { arenas: arenas.arena, battles, accountId };
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchBattleDetails = createAsyncThunk(
    'battle/fetchBattleDetails',
    async ({ battles, arenasInfo }, { rejectWithValue }) => {
        try {
            const details = await Promise.all(
                battles.map(async battle => {
                    const arena = arenasInfo.find(a => a.id === battle.arenaId);
                    const [defender, attacker] = await Promise.all([
                        getAccount(battle.defenderAccount),
                        getAccount(battle.attackerAccount),
                    ]);
                    return {
                        ...battle,
                        date: formatTimeStamp(battle.timestamp),
                        arenaName: arena.name,
                        defenderDetails: defender,
                        attackerDetails: attacker,
                    };
                })
            );
            return details;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const battleSlice = createSlice({
    name: 'battle',
    initialState: {
        arenasInfo: null,
        userBattles: null,
        battleDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetBattleState: state => {
            state.arenasInfo = null;
            state.userBattles = null;
            state.battleDetails = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchArenasAndUserBattles.pending, state => {
                state.loading = true;
            })
            .addCase(fetchArenasAndUserBattles.fulfilled, (state, action) => {
                state.loading = false;
                state.arenasInfo = action.payload.arenas;
                state.userBattles = action.payload.battles;
            })
            .addCase(fetchArenasAndUserBattles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBattleDetails.pending, state => {
                state.loading = true;
            })
            .addCase(fetchBattleDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.battleDetails = action.payload;
            })
            .addCase(fetchBattleDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBattleState } = battleSlice.actions;

export default battleSlice.reducer;
