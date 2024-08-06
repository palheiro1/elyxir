import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';

export const fetchSoldiers = createAsyncThunk('soldiers/fetchSoldiers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${OMNO_API}/index.php?action=getOmnoGameState`);
        return response.data.state.definition.soldier;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
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
                state.error = action.payload;
            });
    },
});

export const { resetSoldiersState } = soldiersSlice.actions;
export default soldiersSlice.reducer;
