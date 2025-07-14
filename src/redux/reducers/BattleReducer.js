import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getArenas, getUserBattles } from '../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId, getAccount } from '../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';
import locations from '../../components/Pages/BattlegroundsPage/assets/LocationsEnum';

const prepareArenaAndLocationMaps = arenas => {
    const arenaMap = new Map(arenas.map(arena => [arena.id, arena]));
    const locationMap = new Map(locations.map(loc => [loc.id, loc]));
    return { arenaMap, locationMap };
};

const fetchAccountsInParallel = async battles => {
    const accountSet = new Set();
    battles.forEach(b => {
        accountSet.add(b.attackerAccount);
        accountSet.add(b.defenderAccount);
    });

    const uniqueAccounts = Array.from(accountSet);
    const accountResponses = await Promise.all(uniqueAccounts.map(accountId => getAccount(accountId)));
    const accountMap = new Map(uniqueAccounts.map((id, i) => [id, accountResponses[i]]));
    return accountMap;
};

const parseBattles = async (battles, arenas, accountId) => {
    const { locationMap } = prepareArenaAndLocationMaps(arenas);
    const accountMap = await fetchAccountsInParallel(battles);

    return battles.map(battle => {
        const isUserDefending = battle.defenderAccount === accountId;
        const timestamp = formatTimeStamp(battle.timestamp);

        const location = locationMap.get(battle.arenaId) || {};
        const defender = accountMap.get(battle.defenderAccount);
        const attacker = accountMap.get(battle.attackerAccount);

        return {
            ...battle,
            isUserDefending,
            date: timestamp,
            arenaName: location.name || 'Unknown',
            defenderDetails: defender,
            attackerDetails: attacker,
        };
    });
};

export const fetchUserBattles = createAsyncThunk('battle/fetchUserBattles', async (accountRs, { rejectWithValue }) => {
    try {
        const [arenasResponse, accountId] = await Promise.all([getArenas(), addressToAccountId(accountRs)]);

        const arenas = arenasResponse.arena;
        const rawBattles = await getUserBattles(accountId);

        const enrichedBattles = await parseBattles(rawBattles.reverse(), arenas, accountId);

        return {
            arenas,
            details: enrichedBattles,
            accountId,
        };
    } catch (error) {
        console.error('❌ Error fetching user battles:', error);
        return rejectWithValue('Unknown error fetching user battles data');
    }
});

// --------------------------------------------------
// Redux slice
// --------------------------------------------------

const initialState = {
    arenasInfo: null,
    userBattles: null,
    battleDetails: null,
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
            .addCase(fetchUserBattles.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBattles.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.arenasInfo = payload.arenas;
                state.userBattles = payload.details;
                state.battleDetails = payload.details;
            })
            .addCase(fetchUserBattles.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Failed to fetch user battles';
            });
    },
});

export const { resetBattleState } = battleSlice.actions;
export default battleSlice.reducer;
