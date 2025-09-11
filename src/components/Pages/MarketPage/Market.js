import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import ElyxirMarket from '../ElyxirPage/ElyxirMarket';

/**
 * @name Market
 * @description Elyxir-only Market page
 * @returns {JSX.Element} - JSX element
 */
const Market = ({ infoAccount }) => {
    // Get items from Redux store (same as Inventory)
    const { items } = useSelector(state => state.items);

    // Create fake assets using the same logic as Inventory page
    const fakeAssets = useMemo(() => {
        // Real Ardor Asset IDs mapping (from CSV file)
        const realAssetIds = {
            // Ingredients
            'aguas_fetidas': '7536385584787697086',
            'alcoholbeer': '2795734210888256790',
            'blood': '16326649816730553703',
            'watercristaline': '10917692030112170713',
            'water_sea': '10444425886085847503',
            'cloud': '18101012326255288772',
            'lightninggg': '3607141736374727634',
            'wind': '65767141008711421',
            'sunlight': '8717959006135737805',
            'lava': '488367278629756964',
            'flordealgodao': '6086151229884242778',
            'gardenflower': '8966516609271135665',
            'corteza': '1941380340903453000',
            'herbadeetiopia': '5528548442683058721',
            'poisonherb': '524790161704873898',
            'mustardseeds': '583958094572828441',
            'peyote': '12313032092046113556',
            'alamorcego': '8825927167203958938',
            'bigfootshair': '4735490741705855799',
            'feather': '15284691712437925618',
            'kangarootail': '16412049206728355506',
            'skin': '609721796834652174',
            'vampirefang': '9057629654312953814',
            'wolfsfang': '3865726407233803673',
            'araucarianresine': '13430257599807483745',
            'ash': '374078224198142471',
            'bonepowder': '17472981396773816914',
            'horndust': '1479526493428793943',
            'sand': '10229749181769297696',
            'gardensoil': '465570788961452184',
            'holi': '13446501052073878899',
            'rainboudust': '7891814295348826088',
            'hymalayansnow': '2603114092541070832',
            'rahusaliva': '8821500247715349893',
            // Tools
            'bellow': '7394449015011337044',
            'cauldron': '1310229991284473521',
            'ladle': '9451976923053037726',
            'mortar': '188493294393002400',
            // Flasks
            'conical_flask': '4367881087678870632',
            'pear_flask': '3758988694981372970',
            'kjeldahl_flask': '1328293559375692481',
            'florence_flask': '8026549983053279231',
            'round_flask': '9118586585609900793',
            // Potions (Creations)
            'whispering_gale': '6485210212239811',
            'tideheart': '7582224115266007515',
            'stoneblood': '10474636406729395731',
            'eternal_silk': '5089659721388119266',
            'coral_spirits': '8693351662911145147',
            'feathered_flame': '11206437400477435454',
            'shifting_dunes': '12861522637067934750',
            'forgotten_grove': '3858707486313568681',
            // Recipes
            'recipe_whispering_gale': '12936439663349626618',
            'recipe_tideheart': '7024690161218732154',
            'recipe_stoneblood': '11654119158397769364',
            'recipe_eternal_silk': '1462047204733593633',
            'recipe_coral_spirits': '6864800023593094679',
            'recipe_feathered_flame': '1770779863759720918',
            'recipe_shifting_dunes': '10956456574154580310',
            'recipe_forgotten_grove': '7535070915409870441'
        };

        // Mapping of image file names to proper names
        const ingredientNameMap = {
            'aguas_fetidas': 'Fetid Waters',
            'alamorcego': 'Bat Wing',
            'alcoholbeer': 'Alcohol Beer',
            'araucarianresine': 'Araucarian Resine',
            'ash': 'Volcanic Ash',
            'bigfootshair': 'Bigfoot Hair',
            'blood': 'Blood',
            'bonepowder': 'Bone Powder',
            'cloud': 'Cloud Essence',
            'corteza': 'Tree Bark',
            'diamantebruto': 'Raw Diamond',
            'feather': 'Feather',
            'flordealgodao': 'Cotton Flower',
            'gardenflower': 'Garden Flower',
            'gardensoil': 'Garden Soil',
            'herbadeetiopia': 'Ethiopian Herb',
            'holi': 'Holi Powder',
            'horndust': 'Horn Dust',
            'hymalayansnow': 'Himalayan Snow',
            'kangarootail': 'Kangaroo Tail',
            'lava': 'Volcano Lava',
            'lightninggg': 'Lightning Essence',
            'mustardseeds': 'Mustard Seeds',
            'peyote': 'Peyote',
            'pluma': 'Feather',
            'poisonherb': 'Poison Herb',
            'rainboudust': 'Rainbow Dust',
            'rahusaliva': 'Rahu Saliva',
            'sand': 'Desert Sand',
            'skin': 'Snake Skin',
            'sunlight': 'Bottled Sunlight',
            'vampirefang': 'Vampire Blood',
            'watercristaline': 'Crystal Water',
            'water_sea': 'Sea Water',
            'wind': 'Wind Essence',
            'wolfsfang': 'Wolf Fang',
            'arena_del_desierto': 'Desert Sand',
            'colmillo_de_vampiro': 'Vampire Blood',
            'colmillo_de_lobo': 'Wolf Fang'
        };

        const ingredients = [
            'aguas_fetidas', 'alamorcego', 'alcoholbeer', 'araucarianresine', 'ash', 'bigfootshair', 'blood', 
            'bonepowder', 'cloud', 'corteza', 'diamantebruto', 'feather', 'flordealgodao', 'gardenflower',
            'gardensoil', 'herbadeetiopia', 'holi', 'horndust', 'hymalayansnow', 'kangarootail', 'lava',
            'lightninggg', 'mustardseeds', 'peyote', 'pluma', 'poisonherb', 'rainboudust', 'rahusaliva',
            'sand', 'skin', 'sunlight', 'vampirefang', 'watercristaline', 'water_sea', 'wind', 'wolfsfang'
        ].map((name, index) => {
            const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
            // Find the real balance for this asset from infoAccount
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: ingredientNameMap[name] || name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase()),
                description: `A mystical ingredient for potion crafting`,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/ingredients/${name}.png`,
                elyxirType: 'INGREDIENT',
                isFake: true,
                askOrders: [],
                askIgnisOrders: [],
                askOmnoOrders: [],
                bidOrders: [],
                bidIgnisOrders: [],
                bidOmnoOrders: [],
                lastPrice: 0,
                lastIgnisPrice: 0,
                lastOmnoPrice: 0,
                bonus: {
                    type: 'ingredient',
                    power: 0,
                    value: 1
                },
            };
        });

        const tools = [
            { name: 'Mystical Bellows', description: 'Used to heat up potions during crafting', image: 'bellow.png', key: 'bellow' },
            { name: 'Ancient Cauldron', description: 'Essential for mixing ingredients together', image: 'cauldron.png', key: 'cauldron' },
            { name: 'Silver Ladle', description: 'For transferring potions into flasks', image: 'ladle.png', key: 'ladle' },
            { name: 'Stone Mortar', description: 'Grinds ingredients to release their full potential', image: 'mortar.png', key: 'mortar' }
        ].map((tool, index) => {
            const assetId = realAssetIds[tool.key] || `fake_tool_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
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
                askOrders: [],
                askIgnisOrders: [],
                askOmnoOrders: [],
                bidOrders: [],
                bidIgnisOrders: [],
                bidOmnoOrders: [],
                lastPrice: 0,
                lastIgnisPrice: 0,
                lastOmnoPrice: 0,
                bonus: {
                    type: 'tool',
                    power: 0,
                    value: 1
                },
            };
        });

        const flasks = [
            { name: 'Conical Flask', description: 'Specialized conical laboratory flask', image: 'flask1.png', key: 'conical_flask' },
            { name: 'Pear-Shaped Flask', description: 'Unique pear-shaped distillation flask', image: 'flask2.png', key: 'pear_flask' },
            { name: 'Kjeldahl Flask', description: 'Professional analytical flask', image: 'flask3.png', key: 'kjeldahl_flask' },
            { name: 'Florence Flask', description: 'Classic round-bottom florence flask', image: 'flask4.png', key: 'florence_flask' },
            { name: 'Round-Bottom Flask', description: 'Standard round-bottom flask', image: 'flask5.png', key: 'round_flask' }
        ].map((flask, index) => {
            const assetId = realAssetIds[flask.key] || `fake_flask_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
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
                askOrders: [],
                askIgnisOrders: [],
                askOmnoOrders: [],
                bidOrders: [],
                bidIgnisOrders: [],
                bidOmnoOrders: [],
                lastPrice: 0,
                lastIgnisPrice: 0,
                lastOmnoPrice: 0,
                bonus: {
                    type: 'flask',
                    power: 0,
                    value: 1
                },
            };
        });

        const recipes = [
            { name: 'Recipe of the Whispering Gale Potion', description: 'Ancient formula for aerial enhancement', image: 'recipe1.png', key: 'recipe_whispering_gale' },
            { name: 'Recipe of the Tideheart Potion', description: 'Aquatic power brewing instructions', image: 'recipe2.png', key: 'recipe_tideheart' },
            { name: 'Recipe of the Stoneblood Potion', description: 'Terrestrial strength elixir formula', image: 'recipe1.png', key: 'recipe_stoneblood' },
            { name: 'Recipe of the Eternal Silk Potion', description: 'Asiatic wisdom brewing guide', image: 'recipe2.png', key: 'recipe_eternal_silk' },
            { name: 'Recipe of the Coral Spirits Potion', description: 'Oceanic essence creation method', image: 'recipe1.png', key: 'recipe_coral_spirits' },
            { name: 'Recipe of the Feathered Flame Potion', description: 'Americas spirit brewing technique', image: 'recipe2.png', key: 'recipe_feathered_flame' },
            { name: 'Recipe of the Shifting Dunes Potion', description: 'African power enhancement formula', image: 'recipe1.png', key: 'recipe_shifting_dunes' },
            { name: 'Recipe of the Forgotten Grove Potion', description: 'European strength elixir guide', image: 'recipe2.png', key: 'recipe_forgotten_grove' }
        ].map((recipe, index) => {
            const assetId = realAssetIds[recipe.key] || `fake_recipe_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: recipe.name,
                description: recipe.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/recipes/${recipe.image}`,
                elyxirType: 'RECIPE',
                isFake: true,
                askOrders: [],
                askIgnisOrders: [],
                askOmnoOrders: [],
                bidOrders: [],
                bidIgnisOrders: [],
                bidOmnoOrders: [],
                lastPrice: 0,
                lastIgnisPrice: 0,
                lastOmnoPrice: 0,
                bonus: {
                    type: 'recipe',
                    power: 0,
                    value: 1
                },
            };
        });

        const potions = [
            { name: 'Whispering Gale Potion', description: 'Harnesses the power of wind and storms', image: 'whispering_gale.png', key: 'whispering_gale' },
            { name: 'Tideheart Potion', description: 'Contains the essence of ocean tides', image: 'tideheart.png', key: 'tideheart' },
            { name: 'Stoneblood Potion', description: 'Infused with the strength of mountains', image: 'stoneblood.png', key: 'stoneblood' },
            { name: 'Eternal Silk Potion', description: 'Woven with ancient Asian wisdom', image: 'eternal_silk.png', key: 'eternal_silk' },
            { name: 'Coral Spirits Potion', description: 'Blessed by oceanic guardians', image: 'coral_spirits.png', key: 'coral_spirits' },
            { name: 'Feathered Flame Potion', description: 'Burns with the spirit of the Americas', image: 'feathered_flame.png', key: 'feathered_flame' },
            { name: 'Shifting Dunes Potion', description: 'Holds the mystery of African deserts', image: 'shifting_dunes.png', key: 'shifting_dunes' },
            { name: 'Forgotten Grove Potion', description: 'Remembers ancient European forests', image: 'forgotten_grove.png', key: 'forgotten_grove' }
        ].map((potion, index) => {
            const assetId = realAssetIds[potion.key] || `fake_potion_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
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
                askOrders: [],
                askIgnisOrders: [],
                askOmnoOrders: [],
                bidOrders: [],
                bidIgnisOrders: [],
                bidOmnoOrders: [],
                lastPrice: 0,
                lastIgnisPrice: 0,
                lastOmnoPrice: 0,
                bonus: {
                    type: 'potion',
                    power: 0,
                    value: 1
                },
            };
        });

        return { ingredients, tools, flasks, recipes, potions };
    }, [infoAccount?.assets]);

    // Use only the properly formatted fake assets with real balances
    const allItems = useMemo(() => {
        // Return only the fake assets which already include real balances from infoAccount
        return [
            ...fakeAssets.ingredients,
            ...fakeAssets.tools,
            ...fakeAssets.flasks,
            ...fakeAssets.recipes,
            ...fakeAssets.potions
        ];
    }, [fakeAssets]);

    return (
        <Box maxW={{ base: '100%', lg: '70vw', xl: '77.5vw', '2xl': '100%' }}>
            <ElyxirMarket items={allItems} infoAccount={infoAccount} />
        </Box>
    );
};

export default Market;
