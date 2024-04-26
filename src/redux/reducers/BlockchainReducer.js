import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';

const initialState = {
    prev_height: null,
    epoch_beginning: Date.UTC(2018, 0, 1, 0, 0, 0),
};

/**
 *
 * @name getBlockchainBlocks
 *
 */
export const getBlockchainBlocks = createAsyncThunk('blockchain/numberOfBlocks', async (_, thunkAPI) => {
    try {
        const {
            data: { numberOfBlocks },
        } = await getBlockchainStatus();

        return numberOfBlocks;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

/**
 *
 * @name blockchainSlice
 * @description The blockchain slice
 * @version 1.0.0
 *
 */
export const blockchainSlice = createSlice({
    name: 'blockchainStatus',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(getBlockchainBlocks.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(getBlockchainBlocks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            if (state.prev_height !== action.payload) {
                state.prev_height = action.payload;
            }
        });
        builder.addCase(getBlockchainBlocks.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    },
});

export const { reset } = blockchainSlice.actions;
export default blockchainSlice.reducer;
