import { Box, Heading, Button, Stack } from '@chakra-ui/react';

import { useState, useMemo, useEffect } from 'react';

import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import SectionSwitch from './SectionSwitch';
import { useSelector } from 'react-redux';
import { ELYXIR_POTIONS } from '../../../data/elyxirPotions';
import { isElyxirAsset } from '../../../data/CONSTANTS';

const ItemMarket = ({ items, infoAccount, textColor }) => {
    // Only Elyxir items
    const { items: storeItems } = useSelector(state => state.items);
    const [section, setSection] = useState('INGREDIENT'); // INGREDIENT | TOOL | FLASK | RECIPE | CREATION
    
    // Option
    // 0 -> Market
    // 1 -> Orders
    // 2 -> Trades
    const [option, setOption] = useState(0);

    // Real Ardor asset IDs mapping from CSV data
    const realAssetIds = useMemo(() => ({
        // Ingredients mapping (using real Ardor asset IDs)
        'aguas_fetidas': '2795734210888256790',
        'alamorcego': '1853993309806999896',
        'alcoholbeer': '6043065774866721090',
        'araucarianresine': '7536385584787697086',
        'ash': '15102806604556354632',
        'bigfootshair': '1734749669966442838',
        'blood': '6043065774866721090',
        'bonepowder': '15102806604556354632',
        'cloud': '1571336020100556625',
        'corteza': '11436325470737709655',
        'diamantebruto': '5570219882495290440',
        'feather': '11508698419506139756',
        'flordealgodao': '10089652431946070133',
        'gardenflower': '8966516609271135665',
        'gardensoil': '11436325470737709655',
        'herbadeetiopia': '10982823421829006444',
        'holi': '1571336020100556625',
        'horndust': '10982823421829006444',
        'hymalayansnow': '10089652431946070133',
        'kangarootail': '1734749669966442838',
        'lava': '15102806604556354632',
        'lightninggg': '3607141736374727634',
        'mustardseeds': '11508698419506139756',
        'peyote': '6043065774866721090',
        'pluma': '11508698419506139756',
        'poisonherb': '10982823421829006444',
        'rainboudust': '1571336020100556625',
        'rahusaliva': '6043065774866721090',
        'sand': '11436325470737709655',
        'skin': '1734749669966442838',
        'sunlight': '8717959006135737805',
        'vampirefang': '15230533556325993984',
        'watercristaline': '10089652431946070133',
        'water_sea': '2795734210888256790',
        'wind': '65767141008711421',
        'wolfsfang': '1734749669966442838',
        'arena_del_desierto': '11436325470737709655',
        'colmillo_de_vampiro': '15230533556325993984',
        'colmillo_de_lobo': '1734749669966442838',
        
        // Tools mapping
        'bellow': '7394449015011337044',
        'cauldron': '1310229991284473521',
        'ladle': '11845481467736877036',
        'mortar': '4548364139683061814',
        
        // Flasks mapping
        'flask1': '4367881087678870632',
        'flask2': '3758988694981372970',
        'flask3': '13463846530496348131',
        'flask4': '2440735248419077208',
        'flask5': '14654561631655838842',
        
        // Recipe mapping
        'recipe1': '12936439663349626618',
        'recipe2': '7024690161218732154',
        'recipe3': '2440735248419077208',
        'recipe4': '5570219882495290440',
        'recipe5': '14654561631655838842',
        'recipe6': '1310229991284473521',
        'recipe7': '4548364139683061814',
        'recipe8': '7394449015011337044',
        
        // Created potions mapping
        'tideheart': '7582224115266007515',
        'stoneblood': '1310229991284473521',
        'coral': '7024690161218732154',
        'whispering_gale': '2440735248419077208',
        'eternal_silk': '5570219882495290440',
        'feathered_flame': '14654561631655838842',
        'forgotten_grove': '1310229991284473521',
        'shifting_dunes': '4548364139683061814',
        
        // Recipe mapping with descriptive keys
        'recipe_shifting_dunes': '12936439663349626618',
        'recipe_coral': '7024690161218732154',
        'recipe_stoneblood': '2440735248419077208',
        'recipe_tideheart': '7024690161218732154',
        'recipe_whispering_gale': '5570219882495290440',
        'recipe_eternal_silk': '14654561631655838842',
        'recipe_feathered_flame': '1310229991284473521',
        'recipe_forgotten_grove': '4548364139683061814'
    }), []);

    // Create real assets for different sections based on available images
    const fakeAssets = useMemo(() => {
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
        ].map((name, index) => ({
            asset: realAssetIds[name] || `fake_ingredient_${index}`,
            name: ingredientNameMap[name] || name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase()),
            description: `A mystical ingredient for potion crafting`,
            quantityQNT: 0,
            totalQuantityQNT: 1,
            unconfirmedQuantityQNT: 0,
            imgUrl: `/images/elyxir/ingredients/${name}.png`,
            elyxirType: 'INGREDIENT',
            isFake: true,
            askOrders: [],
            askIgnisOrders: [],
            askOmnoOrders: [],
            bidOrders: [],
            bidIgnisOrders: [],
            bidOmnoOrders: [],
            lastPrice: Math.floor(Math.random() * 100) + 10, // Random market price
            lastIgnisPrice: 0,
            lastOmnoPrice: 0,
            bonus: {
                type: 'ingredient',
                power: 0,
                value: 1
            },
        }));

        const tools = [
            { name: 'Mystical Bellows', description: 'Used to heat up potions during crafting', image: 'bellow.png', key: 'bellow' },
            { name: 'Ancient Cauldron', description: 'Essential for mixing ingredients together', image: 'cauldron.png', key: 'cauldron' },
            { name: 'Silver Ladle', description: 'For transferring potions into flasks', image: 'ladle.png', key: 'ladle' },
            { name: 'Stone Mortar', description: 'Grinds ingredients to release their full potential', image: 'mortar.png', key: 'mortar' }
        ].map((tool, index) => ({
            asset: realAssetIds[tool.key] || `fake_tool_${index}`,
            name: tool.name,
            description: tool.description,
            quantityQNT: 0,
            totalQuantityQNT: 1,
            unconfirmedQuantityQNT: 0,
            imgUrl: `/images/elyxir/tools/${tool.image}`,
            elyxirType: 'TOOL',
            isFake: true,
            askOrders: [],
            askIgnisOrders: [],
            askOmnoOrders: [],
            bidOrders: [],
            bidIgnisOrders: [],
            bidOmnoOrders: [],
            lastPrice: Math.floor(Math.random() * 200) + 50, // Random market price
            lastIgnisPrice: 0,
            lastOmnoPrice: 0,
            bonus: {
                type: 'tool',
                power: 0,
                value: 1
            },
        }));

        const flasks = [
            { name: 'Crystal Flask', description: 'Holds 1 potion portion', image: 'flask1.png', key: 'flask1' },
            { name: 'Emerald Flask', description: 'Holds 2 potion portions', image: 'flask2.png', key: 'flask2' },
            { name: 'Sapphire Flask', description: 'Holds 3 potion portions', image: 'flask3.png', key: 'flask3' },
            { name: 'Ruby Flask', description: 'Holds 4 potion portions', image: 'flask4.png', key: 'flask4' },
            { name: 'Diamond Flask', description: 'Holds 5 potion portions', image: 'flask5.png', key: 'flask5' }
        ].map((flask, index) => ({
            asset: realAssetIds[flask.key] || `fake_flask_${index}`,
            name: flask.name,
            description: flask.description,
            quantityQNT: 0,
            totalQuantityQNT: 1,
            unconfirmedQuantityQNT: 0,
            imgUrl: `/images/elyxir/flasks/${flask.image}`,
            elyxirType: 'FLASK',
            isFake: true,
            askOrders: [],
            askIgnisOrders: [],
            askOmnoOrders: [],
            bidOrders: [],
            bidIgnisOrders: [],
            bidOmnoOrders: [],
            lastPrice: Math.floor(Math.random() * 150) + 25, // Random market price
            lastIgnisPrice: 0,
            lastOmnoPrice: 0,
            bonus: {
                type: 'flask',
                power: 0,
                value: index + 1
            },
        }));

        const recipes = [
            { name: 'Recipe of the Whispering Gale Potion', description: 'Ancient formula for aerial enhancement', image: 'recipe1.png', key: 'recipe1' },
            { name: 'Recipe of the Tideheart Potion', description: 'Aquatic power brewing instructions', image: 'recipe2.png', key: 'recipe2' },
            { name: 'Recipe of the Stoneblood Potion', description: 'Terrestrial strength elixir formula', image: 'recipe1.png', key: 'recipe3' },
            { name: 'Recipe of the Eternal Silk Potion', description: 'Asiatic wisdom brewing guide', image: 'recipe2.png', key: 'recipe4' },
            { name: 'Recipe of the Coral Spirits Potion', description: 'Oceanic essence creation method', image: 'recipe1.png', key: 'recipe5' },
            { name: 'Recipe of the Feathered Flame Potion', description: 'Americas spirit brewing technique', image: 'recipe2.png', key: 'recipe6' },
            { name: 'Recipe of the Shifting Dunes Potion', description: 'African power enhancement formula', image: 'recipe1.png', key: 'recipe7' },
            { name: 'Recipe of the Forgotten Grove Potion', description: 'European strength elixir guide', image: 'recipe2.png', key: 'recipe8' }
        ].map((recipe, index) => ({
            asset: realAssetIds[recipe.key] || `fake_recipe_${index}`,
            name: recipe.name,
            description: recipe.description,
            quantityQNT: 0,
            totalQuantityQNT: 1,
            unconfirmedQuantityQNT: 0,
            imgUrl: `/images/elyxir/recipes/${recipe.image}`,
            elyxirType: 'RECIPE',
            isFake: true,
            askOrders: [],
            askIgnisOrders: [],
            askOmnoOrders: [],
            bidOrders: [],
            bidIgnisOrders: [],
            bidOmnoOrders: [],
            lastPrice: Math.floor(Math.random() * 300) + 100, // Random market price
            lastIgnisPrice: 0,
            lastOmnoPrice: 0,
            bonus: {
                type: 'recipe',
                power: 0,
                value: 1
            },
        }));

        return { ingredients, tools, flasks, recipes };
    }, [realAssetIds]);

    // Combine real items with fake assets based on section
    const allItemsForSection = useMemo(() => {
        let combinedItems = [...storeItems];
        
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
            const realPotions = storeItems.filter(item => 
                ELYXIR_POTIONS.some(potion => potion.assetId === item.asset)
            ).map(item => ({
                ...item,
                // Ensure market properties exist with random prices
                askOrders: item.askOrders || [],
                askIgnisOrders: item.askIgnisOrders || [],
                askOmnoOrders: item.askOmnoOrders || [],
                bidOrders: item.bidOrders || [],
                bidIgnisOrders: item.bidIgnisOrders || [],
                bidOmnoOrders: item.bidOmnoOrders || [],
                lastPrice: item.lastPrice || Math.floor(Math.random() * 500) + 200,
                lastIgnisPrice: item.lastIgnisPrice || 0,
                lastOmnoPrice: item.lastOmnoPrice || 0,
                unconfirmedQuantityQNT: item.unconfirmedQuantityQNT || 0,
            }));
            combinedItems = [...realPotions];
        }
        
        return combinedItems;
    }, [storeItems, section, fakeAssets]);

    // Map section to elyxirType and include fake assets
    const filterBySection = (base = allItemsForSection, sec = section) => {
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
    };

    // Get current section items (this will automatically update when section changes)
    const currentSectionItems = useMemo(() => {
        return filterBySection(allItemsForSection, section);
    }, [allItemsForSection, section]);

    // Filtered items state for SortAndFilterItems component
    const [itemsFiltered, setItemsFiltered] = useState([]);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <Box>
                    <Stack direction="row" spacing={2} mb={4}>
                        {['INGREDIENT', 'TOOL', 'FLASK', 'RECIPE', 'CREATION'].map(type => (
                            <Button
                                key={type}
                                isActive={section === type}
                                color="white"
                                _active={{ bgColor: 'rgba(59,100,151,1)', color: 'white' }}
                                bgColor={section === type ? 'rgba(59,100,151,1)' : 'rgba(59,100,151,0.5)'}
                                _hover={{ bgColor: 'rgba(59,100,151,0.7)' }}
                                size="sm"
                                fontWeight="medium"
                                fontSize="sm"
                                onClick={() => setSection(type)}
                            >
                                {type.charAt(0) + type.slice(1).toLowerCase() + (type === 'INGREDIENT' ? 's' : 's')}
                            </Button>
                        ))}
                    </Stack>
                    
                    <SortAndFilterItems
                        items={currentSectionItems}
                        setItemsFiltered={setItemsFiltered}
                        rgbColor={'59,100,151'}
                    />

                    <GridItems
                        items={itemsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        rgbColor={'59,100,151'}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Orders
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Item orders feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Trades
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Item trades feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default ItemMarket;
