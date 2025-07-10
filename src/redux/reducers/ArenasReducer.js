import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getArenas } from '../../services/Battlegrounds/Battlegrounds';
import locations from '../../components/Pages/BattlegroundsPage/assets/LocationsEnum';

export const fetchArenasInfo = createAsyncThunk('arena/fetchArenasInfo', async (_, { rejectWithValue }) => {
    try {
        const arenas = await getArenas();
        const arenasInfo = arenas.arena.map(arena => {
            const location = locations.find(loc => loc.id === arena.id);
            return {
                ...arena,
                ...location,
            };
        });

        return arenasInfo;
    } catch (error) {
        return rejectWithValue('Failed to fetch arenas info');
    }
});

const arenaSlice = createSlice({
    name: 'arena',
    initialState: {
        arenasInfo: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetArenasState: state => {
            state.arenasInfo = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchArenasInfo.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArenasInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.arenasInfo = action.payload;
            })
            .addCase(fetchArenasInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetArenasState } = arenaSlice.actions;
export default arenaSlice.reducer;
