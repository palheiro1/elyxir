import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllItems } from '../../utils/itemsUtils'; // asegúrate de que la ruta sea correcta

/**
 * @name fetchItems
 * @description Async thunk to fetch items for a given account
 */
export const fetchItems = createAsyncThunk('items/fetchItems', async ({ accountRs }, { rejectWithValue }) => {
    try {
        const itemsData = await fetchAllItems(accountRs);
        return itemsData;
    } catch (error) {
        console.error('🚀 ~ fetchItems error:', error);
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
