import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllCards } from '../../utils/cardsUtils';

export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async ({ accountRs, collectionRs, specialRs }, { rejectWithValue }) => {
        try {
            const cardsData = await fetchAllCards(accountRs, collectionRs, specialRs, false);
            return cardsData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetCardsState: state => {
            state.cards = [];
            state.loading = false;
            state.error = null;
        },
        setCardsManually: (state, action) => {
            state.cards = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCards.pending, state => {
                state.loading = true;
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload;
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCardsState, setCardsManually } = cardsSlice.actions;
export default cardsSlice.reducer;
