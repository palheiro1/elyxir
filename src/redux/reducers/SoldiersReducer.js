import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSoldiers } from '../../services/Battlegrounds/Battlegrounds';

export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (_, { rejectWithValue }) => {
    try {
        const soldiers = await getSoldiers();
        return soldiers;
    } catch (error) {
        console.error('🚀 ~ fetchSoldiers ~ error:', error);
        return rejectWithValue('Unknown error fetching soldiers');
    }
});

const initialState = {
    soldiers: [],
    loading: false,
    error: null,
};

const soldiersSlice = createSlice({
    name: 'soldiers',
    initialState,
    reducers: {
        resetSoldiersState: state => {
            state.soldiers = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSoldiers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSoldiers.fulfilled, (state, action) => {
                state.loading = false;
                state.soldiers = action.payload;
            })
            .addCase(fetchSoldiers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Unknown error' };
            });
    },
});

export const { resetSoldiersState } = soldiersSlice.actions;
export default soldiersSlice.reducer;
