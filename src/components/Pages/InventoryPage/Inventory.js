import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';

import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import { useSelector } from 'react-redux';
import { ELYXIR_POTIONS } from '../../../data/elyxirPotions';

/**
 * Inventory component
 * @name Inventory
 * @description This component is the inventory page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - All cards
 * @returns {JSX.Element} - Inventory component
 */

const Inventory = ({ infoAccount }) => {
    // Only Elyxir items
    const { items } = useSelector(state => state.items);
    const [section, setSection] = useState('INGREDIENT'); // INGREDIENT | TOOL | FLASK | RECIPE | CREATION
    const [itemsFiltered, setItemsFiltered] = useState([]);

    // Debug: Let's see what's in infoAccount
    console.log('Inventory - infoAccount:', infoAccount);
    console.log('Inventory - infoAccount.assets:', infoAccount?.assets);

    // Create assets using real Ardor asset IDs from the blockchain
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

        // Mapping of image file names to proper names (matching Airdrop page)
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
            
            console.log(`Ingredient ${name} (${assetId}):`, { realQuantity, realUnconfirmedQuantity, realAsset });
            
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
            
            console.log(`Tool ${tool.key} (${assetId}):`, { realQuantity, realUnconfirmedQuantity, realAsset });
            
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
            
            console.log(`Flask ${flask.key} (${assetId}):`, { realQuantity, realUnconfirmedQuantity, realAsset });
            
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
                    value: index + 1
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
            
            console.log(`Recipe ${recipe.key} (${assetId}):`, { realQuantity, realUnconfirmedQuantity, realAsset });
            
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

        return { ingredients, tools, flasks, recipes };
    }, [infoAccount?.assets]);

    // Combine real items with fake assets based on section
    const allItemsForSection = useMemo(() => {
        let combinedItems = [...items];
        
        // Add fake assets for current section
        if (section === 'INGREDIENT') {
            // Only show fake ingredients in INGREDIENT section
            combinedItems = [...fakeAssets.ingredients];
        } else if (section === 'TOOL') {
            combinedItems = [...fakeAssets.tools];
        } else if (section === 'FLASK') {
            combinedItems = [...fakeAssets.flasks];
        } else if (section === 'RECIPE') {
            combinedItems = [...fakeAssets.recipes];
        } else if (section === 'CREATION') {
            // Real potions should appear in CREATION section
            const realPotions = items.filter(item => 
                ELYXIR_POTIONS.some(potion => potion.assetId === item.asset)
            ).map(item => ({
                ...item,
                // Ensure market properties exist
                askOrders: item.askOrders || [],
                askIgnisOrders: item.askIgnisOrders || [],
                askOmnoOrders: item.askOmnoOrders || [],
                bidOrders: item.bidOrders || [],
                bidIgnisOrders: item.bidIgnisOrders || [],
                bidOmnoOrders: item.bidOmnoOrders || [],
                lastPrice: item.lastPrice || 0,
                lastIgnisPrice: item.lastIgnisPrice || 0,
                lastOmnoPrice: item.lastOmnoPrice || 0,
                unconfirmedQuantityQNT: item.unconfirmedQuantityQNT || 0,
            }));
            combinedItems = [...realPotions];
        }
        
        return combinedItems;
    }, [items, section, fakeAssets]);

    // Map section to elyxirType and include fake assets
    const filterBySection = useCallback((base = allItemsForSection, sec = section) => {
        if (sec === 'INGREDIENT') {
            // Show only fake ingredients in INGREDIENT section
            return base;
        } else if (sec === 'CREATION') {
            // Show real potions in CREATION section
            return base;
        } else {
            // For TOOL, FLASK, RECIPE show only items matching that type
            return base.filter(it => (it.elyxirType || '').toUpperCase() === sec);
        }
    }, [allItemsForSection, section]);

    // Initialize itemsFiltered with section data
    useEffect(() => {
        const initialItems = filterBySection(allItemsForSection, section);
        setItemsFiltered(initialItems);
    }, [allItemsForSection, section, filterBySection]);

    return (
        <Box mb={2}>
            <Stack direction="row" spacing={2} mb={4}>
                {['INGREDIENT', 'TOOL', 'FLASK', 'RECIPE', 'CREATION'].map(type => (
                    <Button
                        key={type}
                        isActive={section === type}
                        color="white"
                        _active={{ bgColor: 'rgba(47,129,144,1)', color: 'white' }}
                        bgColor={section === type ? 'rgba(47,129,144,1)' : 'rgba(47,129,144,0.5)'}
                        _hover={{ bgColor: 'rgba(47,129,144,0.7)' }}
                        size="sm"
                        fontWeight="medium"
                        fontSize="sm"
                        onClick={() => {
                            setSection(type);
                        }}
                    >
                        {type.charAt(0) + type.slice(1).toLowerCase() + (type === 'INGREDIENT' ? 's' : 's')}
                    </Button>
                ))}
            </Stack>
            <SortAndFilterItems 
                originalItems={filterBySection(allItemsForSection, section)} 
                setItemsFiltered={setItemsFiltered} 
                rgbColor={'47,129,144'} 
            />
            <GridItems items={itemsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
        </Box>
    );
};

export default Inventory;
