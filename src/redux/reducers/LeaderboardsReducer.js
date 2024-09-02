import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccount } from '../../services/Ardor/ardorInterface';
import { getLeaderboards } from '../../services/Battlegrounds/Battlegrounds';

// Thunks para obtener los leaderboards y detalles de las cuentas
export const fetchLeaderboards = createAsyncThunk('leaderboards/fetchLeaderboards', async () => {
    const res = await getLeaderboards();
    return res;
});

export const fetchAccountDetails = createAsyncThunk('leaderboards/fetchAccountDetails', async accounts => {
    let accountsWithDetails = await Promise.all(
        accounts.map(async item => {
            const accountInfo = await getAccount(item.accountId);
            return { ...item, ...accountInfo };
        })
    );
    accountsWithDetails.sort((a, b) => (b.points || b.totalPoints) - (a.points || a.totalPoints));
    return accountsWithDetails;
});

const leaderboardsSlice = createSlice({
    name: 'leaderboards',
    initialState: {
        leaderboards: null,
        viewData: false,
        data: null,
        entries: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setViewData: (state, action) => {
            state.viewData = action.payload.viewData;
            state.data = action.payload.data;
        },
        resetState: state => {
            state.viewData = false;
            state.data = null;
            state.entries = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLeaderboards.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchLeaderboards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leaderboards = action.payload;
            })
            .addCase(fetchLeaderboards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAccountDetails.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchAccountDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.entries = action.payload;
            })
            .addCase(fetchAccountDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setViewData, resetState } = leaderboardsSlice.actions;

export default leaderboardsSlice.reducer;
