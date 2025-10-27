import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getElyxirConfiguration } from '../../services/Elyxir/elyxir';

export const fetchElyxirConfiguration = createAsyncThunk(
    'Elyxir/fetchElyxirConfiguration',
    async (_, { rejectWithValue }) => {
        try {
            const config = await getElyxirConfiguration();
            return config;
        } catch (error) {
            return rejectWithValue('Unknown error fetching elyxir configuration');
        }
    }
);

export const fetchAllElyxirData = createAsyncThunk(
    'Elyxir/fetchAllElyxirData',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const config = await dispatch(fetchElyxirConfiguration()).unwrap();
            return { config };
        } catch (error) {
            return rejectWithValue('Failed to fetch all elyxir data');
        }
    }
);

const elyxirSlice = createSlice({
    name: 'elyxir',
    initialState: {
        elyxir: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetElyxirState: state => {
            state.elyxir = [];
            state.loading = false;
            state.error = null;
        },
        setElyxirManually: (state, action) => {
            state.elyxir = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllElyxirData.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllElyxirData.fulfilled, (state, action) => {
                state.loading = false;
                state.elyxir = action.payload.config;
            })
            .addCase(fetchAllElyxirData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch elyxir data';
            });
    },
});

export const { resetElyxirState, setElyxirManually } = elyxirSlice.actions;
export default elyxirSlice.reducer;
