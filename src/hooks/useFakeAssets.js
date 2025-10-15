import { useMemo, useState, useEffect } from 'react';
import { getFlaskAssets } from '../services/Elyxir/elyxir';
import { ingredientNameMap } from '../components/Pages/ElyxirPage/data';

const useFakeAssets = ({ infoAccount, realAssetIds, rawIngredients, rawTools, rawFlasks, rawPotions }) => {
    const [fakeAssets, setFakeAssets] = useState({ ingredients: [], tools: [], flasks: [], potions: [] });

    useEffect(() => {
        const fetchData = async () => {
            const flasksResponse = await getFlaskAssets();

            const ingredients = rawIngredients.map((name, index) => {
                const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
                const realAsset = infoAccount?.assets?.find(a => a.asset === assetId);
                const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
                const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

                return {
                    asset: assetId,
                    name:
                        ingredientNameMap[name] ||
                        name
                            .replace(/_/g, ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^\w/, c => c.toUpperCase()),
                    description: 'A mystical ingredient for potion crafting',
                    quantityQNT: realQuantity,
                    totalQuantityQNT: 1,
                    unconfirmedQuantityQNT: realUnconfirmedQuantity,
                    imgUrl: `/images/elyxir/ingredients/${name}.png`,
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
                    imgUrl: `/images/elyxir/potions/${potion.image}`,
                    elyxirType: 'CREATION',
                    isFake: true,
                };
            });

            setFakeAssets({ ingredients, tools, flasks, potions });
        };

        fetchData();
    }, [infoAccount?.assets, realAssetIds, rawIngredients, rawTools, rawFlasks, rawPotions]);

    return fakeAssets;
};

export default useFakeAssets;
