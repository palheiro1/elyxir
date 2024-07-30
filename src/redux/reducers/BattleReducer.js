// battleSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getArenas, getUserBattles } from '../../services/Battlegrounds/Battlegrounds';
import { formatTimeStamp } from '../../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';
import { addressToAccountId, getAccount } from '../../services/Ardor/ardorInterface';
import locations from '../../components/Pages/BattlegroundsPage/assets/LocationsEnum';

export const fetchUserBattles = createAsyncThunk('battle/fetchUserBattles', async (accountRs, { rejectWithValue }) => {
    try {
        const arenas = await getArenas();
        const accountId = await addressToAccountId(accountRs);
        const userBattles = (await getUserBattles(accountId))
            .map(battle => ({
                ...battle,
                isUserDefending: battle.defenderAccount === accountId,
            }))
            .reverse();

        const details = await Promise.all(
            userBattles.map(async battle => {
                const arenaInfo = await getArenaInfo(
                    battle.arenaId,
                    battle.defenderAccount,
                    battle.attackerAccount,
                    arenas.arena
                );

                return {
                    ...battle,
                    date: formatTimeStamp(battle.timestamp),
                    arenaName: arenaInfo.arena.name,
                    defenderDetails: arenaInfo.defender,
                    attackerDetails: arenaInfo.attacker,
                };
            })
        );

        return { arenas: arenas.arena, details, accountId };
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const getArenaInfo = async (arenaId, defenderAccount, attackerAccount, arenasInfo) => {
    let arena = arenasInfo.find(arena => arena.id === arenaId);
    const [defender, attacker] = await Promise.all([getAccount(defenderAccount), getAccount(attackerAccount)]);
    let name = locations.find(item => item.id === arenaId);
    return {
        defender: defender,
        attacker: attacker,
        arena: { ...name, ...arena },
    };
};

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
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUserBattles.pending, state => {
                state.loading = true;
            })
            .addCase(fetchUserBattles.fulfilled, (state, action) => {
                state.loading = false;
                state.arenasInfo = action.payload.arenas;
                state.userBattles = action.payload.details;
                state.battleDetails = action.payload.details;
            })
            .addCase(fetchUserBattles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBattleState } = battleSlice.actions;

export default battleSlice.reducer;
