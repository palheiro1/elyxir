import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getArenas, getUserBattles } from '../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId, getAccount } from '../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';
import locations from '../../components/Pages/BattlegroundsPage/assets/LocationsEnum';
import { getAsset } from '../../utils/cardsUtils';

/**
 * @name prepareArenaAndLocationMaps
 * @description Prepares `Map` objects for arenas and their corresponding locations to allow fast lookup by ID.
 * @param {Array<{id: string, name: string}>} arenas - Array of arena objects that include both arena and location data.
 * @returns {{ arenaMap: Map<string, object>, locationMap: Map<string, object> }} Object containing maps for arenas and locations keyed by their ID.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const prepareArenaAndLocationMaps = arenas => {
    const arenaMap = new Map(arenas.map(arena => [arena.id, arena]));
    const locationMap = new Map(locations.map(loc => [loc.id, loc]));
    return { arenaMap, locationMap };
};

/**
 * @name fetchAccountsInParallel
 * @description Fetches account information in parallel for all unique attacker and defender accounts in the given battles.
 * @param {Array<{attackerAccount: string, defenderAccount: string}>} battles - Array of battle objects.
 * @returns {Promise<Map<string, object>>} A map of account IDs to their corresponding fetched account data.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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

/**
 * @name parseBattles
 * @description Enriches battle data with formatted timestamp, arena names, and attacker/defender account details.
 * @param {Array<object>} battles - Raw battles array.
 * @param {Array<object>} arenas - Arena and location data.
 * @param {string} accountId - The account ID of the current user to determine if they are the defender.
 * @returns {Promise<Array<object>>} Array of enriched battle objects with user context and location/account details.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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

/**
 * @name fetchUserBattles
 * @description Redux thunk to fetch user battles, resolve arenas and accounts, and return enriched battle data.
 * @param {string} accountRs - Reed-Solomon formatted address of the user.
 * @param {object} thunkAPI - Thunk API object containing utilities like `rejectWithValue`.
 * @returns {Promise<{arenas: Array, details: Array, accountId: string}>} An object containing arena data, enriched battle details, and the numeric account ID.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const calculateBattleRewards = async (battles, arenas) => {
    const rewards = {};

    await Promise.all(
        battles.map(async battle => {
            const arena = arenas.find(a => a.id === battle.arenaId);
            if (!arena || !arena.battleCost) {
                rewards[battle.battleId] = null;
                return;
            }

            try {
                if (!arena.battleCost || !arena.battleCost.asset || Object.keys(arena.battleCost.asset).length === 0) {
                    rewards[battle.battleId] = null;
                    return;
                }
                const rewardFraction = battle.isWinnerLowerPower ? 0.9 : 0.8;
                const assets = Object.entries(arena.battleCost.asset);

                const rewardDetails = await Promise.all(
                    assets.map(async ([assetId, price]) => {
                        const assetDetails = await getAsset(assetId);
                        return {
                            assetId,
                            name: assetDetails.name,
                            amount: price * rewardFraction,
                            decimals: assetDetails.decimals,
                        };
                    })
                );

                rewards[battle.battleId] = rewardDetails;
            } catch (error) {
                console.error(`Error calculando recompensa para batalla ${battle.battleId}:`, error);
                rewards[battle.battleId] = null;
            }
        })
    );

    return rewards;
};

/**
 * @name fetchUserBattles
 * @description Redux async thunk action that fetches and enriches the battle data for a given user account.
 * It performs the following steps:
 * 1. Retrieves the list of arenas and converts the user's address (`accountRs`) to an internal account ID.
 * 2. Fetches the raw battles data for the user by account ID.
 * 3. Parses and enriches battles with arena and account details.
 * 4. Calculates battle rewards based on the enriched battles and arenas.
 * 5. Returns an object containing arenas, enriched battle details, accountId, and rewards.
 * Handles errors gracefully by rejecting with a descriptive error message.
 * @param {string} accountRs - The user's account address string.
 * @param {Object} thunkAPI - Redux thunk API object containing rejectWithValue function.
 * @returns {Promise<Object>} Promise resolving to an object with arenas, battle details, accountId, and rewards.
 * @throws Will reject with a value if an error occurs during fetching or processing.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const fetchUserBattles = createAsyncThunk('battle/fetchUserBattles', async (accountRs, { rejectWithValue }) => {
    try {
        const [arenasResponse, accountId] = await Promise.all([getArenas(), addressToAccountId(accountRs)]);

        const arenas = arenasResponse.arena;
        const rawBattles = await getUserBattles(accountId);
        const enrichedBattles = await parseBattles(rawBattles.reverse(), arenas, accountId);
        const battleRewards = await calculateBattleRewards(enrichedBattles, arenas);

        return {
            arenas,
            details: enrichedBattles,
            accountId,
            rewards: battleRewards,
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
    battleRewards: null,
    loading: false,
    error: null,
};

const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        resetBattleState: () => initialState,
        // Reducer adicional para actualizar recompensas si es necesario
        updateBattleReward: (state, action) => {
            const { battleId, reward } = action.payload;
            if (state.battleRewards) {
                state.battleRewards[battleId] = reward;
            }
        },
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
                state.battleRewards = payload.rewards;
            })
            .addCase(fetchUserBattles.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload || 'Failed to fetch user battles';
            });
    },
});

export const { resetBattleState } = battleSlice.actions;
export default battleSlice.reducer;
