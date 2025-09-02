import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllItems } from '../../utils/itemsUtils'; // asegúrate de que la ruta sea correcta


/**
 * @name itemsSlice
 * @description
 * Redux slice to manage the state of in-game items. 
 * Handles asynchronous fetching of items from the blockchain or API,
 * allows manual state reset, and provides the ability to set items manually.
 *
 * @asyncThunk fetchItems
 * @description
 * Asynchronous thunk to fetch all items for a given account.
 * Uses `fetchAllItems` utility and handles loading, success, and error states.
 * 
 * @param {Object} params - Object containing the account information.
 * @param {string} params.accountRs - Account RS identifier for fetching items.
 * @returns {Promise<Array>} A promise that resolves to an array of items.
 *
 * @action resetItemsState
 * @description Resets the items state to its initial values (empty items, no error, not loading).
 *
 * @action setItemsManually
 * @description Manually sets the items state with the provided payload.
 * @param {Array} action.payload - Array of items to manually set in the state.
 *
 * @state
 * @property {Array} items - List of items fetched or manually set.
 * @property {boolean} loading - Indicates if items are being fetched.
 * @property {string|null} error - Error message if fetching fails.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const fetchItems = createAsyncThunk('items/fetchItems', async ({ accountRs }, { rejectWithValue }) => {
    try {
        const itemsData = await fetchAllItems(accountRs);
        return itemsData;
    } catch (error) {
        return rejectWithValue('Unknown error fetching items');
    }
});

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetItemsState: state => {
            state.items = [];
            state.loading = false;
            state.error = null;
        },
        setItemsManually: (state, action) => {
            state.items = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchItems.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch items';
            });
    },
});

export const { resetItemsState, setItemsManually } = itemsSlice.actions;
export default itemsSlice.reducer;
