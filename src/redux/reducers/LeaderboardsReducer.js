import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccount } from '../../services/Ardor/ardorInterface';
import { getLeaderboards } from '../../services/Battlegrounds/Battlegrounds';

export const fetchLeaderboards = createAsyncThunk('leaderboards/fetchLeaderboards', async (_, { rejectWithValue }) => {
    try {
        const res = await getLeaderboards();
        return res;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch leaderboards');
    }
});

export const fetchAccountDetails = createAsyncThunk(
    'leaderboards/fetchAccountDetails',
    async ({ accounts, arenas }, { rejectWithValue }) => {
        try {
            let accountsWithDetails = await Promise.all(
                accounts.map(async item => {
                    const accountInfo = await getAccount(item.accountId);

                    const conqueredArenas = arenas.filter(arena => arena.defender?.account === item.accountId);
                    const conqueredTerrestrialArenas = conqueredArenas.filter(a => a.mediumId === 1).length;
                    const conqueredAerialArenas = conqueredArenas.filter(a => a.mediumId === 2).length;
                    const conqueredAquaticArenas = conqueredArenas.filter(a => a.mediumId === 3).length;
                    const totalArenasConquered = conqueredArenas.length;

                    const conquestStats = {
                        general: totalArenasConquered,
                        terrestrial: conqueredTerrestrialArenas,
                        aerial: conqueredAerialArenas,
                        aquatic: conqueredAquaticArenas,
                    };

                    return {
                        ...item,
                        ...accountInfo,
                        conqueredArenas: conquestStats,
                    };
                })
            );
            accountsWithDetails.sort((a, b) => (b.points || b.totalPoints) - (a.points || a.totalPoints));
            return accountsWithDetails;
        } catch (error) {
            console.error('🚀 ~ error:', error);
            return rejectWithValue('Failed to fetch account details');
        }
    }
);

const leaderboardsSlice = createSlice({
    name: 'leaderboards',
    initialState: {
        leaderboards: null,
        viewData: true,
        data: { type: null, info: [] },
        rewardsByOption: {},
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
            state.viewData = true;
            state.data = { type: null, info: [] };
            state.entries = null;
            state.status = 'idle';
            state.error = null;
        },
        setLeaderboardRewards: (state, action) => {
            const { option, rewards } = action.payload;
            if (!state.rewardsByOption[option]) {
                state.rewardsByOption[option] = rewards;
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLeaderboards.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLeaderboards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leaderboards = action.payload.length === 0 ? [] : action.payload;
            })
            .addCase(fetchLeaderboards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message || 'Unknown error';
            })
            .addCase(fetchAccountDetails.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAccountDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.entries = action.payload.length === 0 ? [] : action.payload;
            })
            .addCase(fetchAccountDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message || 'Unknown error';
            });
    },
});

export const { setViewData, resetState, setLeaderboardRewards } = leaderboardsSlice.actions;

export default leaderboardsSlice.reducer;
