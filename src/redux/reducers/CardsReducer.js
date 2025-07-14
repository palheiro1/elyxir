import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllCards } from '../../utils/cardsUtils';

export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async ({ accountRs, collectionRs, specialRs }, { rejectWithValue }) => {
        try {
            const cardsData = await fetchAllCards(accountRs, collectionRs, specialRs, false);
            return cardsData;
        } catch (error) {
            console.error('🚀 ~ error:', error);
            return rejectWithValue('Unknown error fetching cards');
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
                state.error = null;
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload;
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch cards';
            });
    },
});

export const { resetCardsState, setCardsManually } = cardsSlice.actions;
export default cardsSlice.reducer;
