import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getElyxirConfiguration, getFlaskAssets } from '../../services/Elyxir/elyxir';
import {
    ingredientNameMap,
    rawFlasks,
    rawIngredients,
    rawPotions,
    rawTools,
    realAssetIds,
} from '../../components/Pages/ElyxirPage/data';

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

export const fetchFakeAssets = createAsyncThunk(
    'Elyxir/fetchFakeAssets',
    async ({ infoAccount }, { rejectWithValue }) => {
        try {
            const flasksResponse = await getFlaskAssets();

            const ingredients = rawIngredients.map((ingredient, index) => {
                const key = typeof ingredient === 'string' ? ingredient : ingredient.key;
                const image = typeof ingredient === 'string' ? `${ingredient}.png` : ingredient.image || `${key}.png`;
                const assetId = realAssetIds[key] || `fake_ingredient_${index}`;
                const realAsset = infoAccount?.assets?.find(a => a.asset === assetId);
                const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
                const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

                return {
                    asset: assetId,
                    name:
                        ingredient.name ||
                        ingredientNameMap[key] ||
                        key
                            .replace(/_/g, ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^\w/, c => c.toUpperCase()),
                    description: 'A mystical ingredient for potion crafting',
                    quantityQNT: realQuantity,
                    totalQuantityQNT: 1,
                    unconfirmedQuantityQNT: realUnconfirmedQuantity,
                    imgUrl: `/images/elyxir/ingredients/${image}`,
                    elyxirType: 'INGREDIENT',
                    isFake: true,
                };
            });

            const tools = rawTools.map((tool, index) => {
                const assetId = realAssetIds[tool.key] || `fake_tool_${index}`;
                const realAsset = infoAccount?.assets?.find(a => a.asset === assetId);
                const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
                const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

                return {
                    asset: assetId,
                    name: tool.name,
                    description: tool.description,
                    quantityQNT: realQuantity,
                    totalQuantityQNT: 1,
                    unconfirmedQuantityQNT: realUnconfirmedQuantity,
                    imgUrl: `/images/elyxir/tools/${tool.image}`,
                    elyxirType: 'TOOL',
                    isFake: true,
                };
            });

            const flasks = rawFlasks.map((flask, index) => {
                const assetId = realAssetIds[flask.key] || `fake_flask_${index}`;
                const realAsset = infoAccount?.assets?.find(a => a.asset === assetId);
                const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
                const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
                const multiplier = flasksResponse?.[assetId] || 0;

                return {
                    asset: assetId,
                    name: flask.name,
                    description: flask.description,
                    quantityQNT: realQuantity,
                    totalQuantityQNT: 1,
                    unconfirmedQuantityQNT: realUnconfirmedQuantity,
                    imgUrl: `/images/elyxir/flasks/${flask.image}`,
                    elyxirType: 'FLASK',
                    isFake: true,
                    multiplier,
                };
            });

            const potions = rawPotions.map((potion, index) => {
                const assetId = realAssetIds[potion.key] || `fake_potion_${index}`;
                const realAsset = infoAccount?.assets?.find(a => a.asset === assetId);

                const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
                const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

                return {
                    asset: assetId,
                    name: potion.name,
                    description: potion.description,
                    quantityQNT: realQuantity,
                    totalQuantityQNT: 1,
                    unconfirmedQuantityQNT: realUnconfirmedQuantity,
                    imgUrl: `/images/elyxir/outputs/${potion.image}`,
                    elyxirType: 'CREATION',
                    isFake: true,
                };
            });

            return { ingredients, tools, flasks, potions };
        } catch (error) {
            return rejectWithValue('Failed to fetch fake elyxir assets');
        }
    }
);

export const fetchAllElyxirData = createAsyncThunk(
    'Elyxir/fetchAllElyxirData',
    async ({ infoAccount }, { dispatch, rejectWithValue }) => {
        try {
            const [config, fakeAssets] = await Promise.all([
                dispatch(fetchElyxirConfiguration()).unwrap(),
                dispatch(fetchFakeAssets({ infoAccount })).unwrap(),
            ]);

            return { config, fakeAssets };
        } catch (error) {
            return rejectWithValue('Failed to fetch all elyxir data');
        }
    }
);

const elyxirSlice = createSlice({
    name: 'elyxir',
    initialState: {
        elyxir: [],
        fakeAssets: {
            ingredients: [],
            tools: [],
            flasks: [],
            potions: [],
        },
        loading: false,
        error: null,
    },
    reducers: {
        resetElyxirState: state => {
            state.elyxir = [];
            state.fakeAssets = { ingredients: [], tools: [], flasks: [], potions: [] };
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
                state.fakeAssets = action.payload.fakeAssets;
            })
            .addCase(fetchAllElyxirData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch elyxir data';
            });
    },
});

export const { resetElyxirState, setElyxirManually } = elyxirSlice.actions;
export default elyxirSlice.reducer;
