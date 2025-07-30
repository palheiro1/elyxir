import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActivePlayers, getBattleCount, getLandLords } from '../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId } from '../../services/Ardor/ardorInterface';
import { getUsersState } from '../../services/Ardor/omnoInterface';
import { GEMASSET, WETHASSET } from '../../data/CONSTANTS';
import { getStuckedBattleCards } from '../../components/Pages/BattlegroundsPage/Utils/BattlegroundsUtils';

/**
 * @name extractUserInfo
 * @description Helper function to find and return user info object from a list of users by matching the account ID.
 * @param {Array} users - Array of user objects.
 * @param {string} accountId - Account ID to find in the users array.
 * @returns {Object|undefined} The user object matching the accountId or undefined if not found.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const extractUserInfo = (users, accountId) => users.find(user => user.id === accountId);

/**
 * @name getFilteredCards
 * @description Filters the full list of cards to only those owned by the user, merging in the user's asset quantities.
 * @param {Array} cards - Full list of card objects.
 * @param {Object} userAssets - Object mapping asset IDs to quantities owned by the user.
 * @returns {Array} Filtered and updated card objects containing `omnoQuantity` with user quantities.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const getFilteredCards = (cards, userAssets) => {
    const assetIds = Object.keys(userAssets);
    const { stuckedCards } = getStuckedBattleCards();
    return cards
        .filter(card => assetIds.includes(card.asset))
        .map(card => {
            const stuckedQnt = stuckedCards?.[card.asset] || 0;
            return {
                ...card,
                omnoQuantity: userAssets[card.asset] - stuckedQnt || 0,
            };
        });
};

/**
 * @name updateFilteredCards
 * @description Async function to update filtered cards for a given account by fetching user assets and dispatching the result.
 * @param {string} accountRs - The Reed-Solomon encoded Ardor account address.
 * @param {Array} cards - Full list of available cards.
 * @param {Function} dispatch - Redux dispatch function to update state.
 * @returns {Promise<void>} Resolves after dispatching filtered cards to Redux store.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const updateFilteredCards = async (accountRs, cards, dispatch) => {
    const [accountId, { data: usersState }] = await Promise.all([addressToAccountId(accountRs), getUsersState()]);
    const userInfo = extractUserInfo(usersState, accountId);
    const assets = userInfo?.balance?.asset ?? {};

    const filteredCards = getFilteredCards(cards, assets);
    dispatch(setFilteredCards(filteredCards));
};

/**
 * @name fetchBattleData
 * @description Redux async thunk to fetch battle statistics, active players, landlords, and user asset balances from external services.
 * Handles errors and returns the relevant data for the battle slice state.
 * @param {Object} params - Parameters object.
 * @param {string} params.accountRs - Reed-Solomon Ardor account string.
 * @returns {Promise<Object>} Returns a promise resolving to an object with battle data and user asset balances.
 * Rejects with an error message on failure.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
export const fetchBattleData = createAsyncThunk(
    'battle/fetchBattleData',
    async ({ accountRs }, { rejectWithValue }) => {
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

/**
 * @name battleSlice
 * @description Redux slice managing battle-related state including battle count, active players, landlords, filtered cards, and user balances.
 * Includes reducers to reset state and set filtered cards, and handles async thunk lifecycle states for fetching battle data.
 * State shape:
 * {
 *   battleCount: number|null,
 *   activePlayers: number|null,
 *   landLords: number|null,
 *   omnoGEMsBalance: number,
 *   omnoWethBalance: number,
 *   parseWETH: number,
 *   filteredCards: Array|null,
 *   loading: boolean,
 *   error: string|null,
 * }
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        resetBattleState: () => initialState,
        setFilteredCards: (state, action) => {
            state.filteredCards = action.payload;
        },
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

export const { resetBattleState, setFilteredCards } = battleSlice.actions;
export default battleSlice.reducer;
