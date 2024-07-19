import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllCards } from '../../services/cardsService';  // Asegúrate de apuntar al archivo correcto

const initialState = {
    cards: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

/**
 *
 * @name fetchCards
 *
 */
export const fetchCards = createAsyncThunk('cards/fetchAll', async ({ accountRs, collectionRs, specialRs, firstTime }, thunkAPI) => {
    try {
        const cards = await fetchAllCards(accountRs, collectionRs, specialRs, firstTime ? false : true);
        return cards;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response ? error.response.data.message : error.message);
    }
});

/**
 *
 * @name cardsSlice
 * @description The cards slice
 * @version 1.0.0
 *
 */
export const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(fetchCards.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(fetchCards.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.cards = action.payload;
        });
        builder.addCase(fetchCards.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    },
});

export const { reset } = cardsSlice.actions;
export default cardsSlice.reducer;
