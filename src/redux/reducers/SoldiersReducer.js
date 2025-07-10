import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';

export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getOmnoGameState`);
        return response.data.state.definition.soldier;
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
