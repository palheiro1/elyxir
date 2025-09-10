import { Box, Heading, Button, Stack } from '@chakra-ui/react';

import { useState, useMemo, useEffect } from 'react';

import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import SectionSwitch from './SectionSwitch';
import { useSelector } from 'react-redux';
import { ELYXIR_POTIONS } from '../../../data/elyxirPotions';

const ItemMarket = ({ items, infoAccount, textColor }) => {
    // Only Elyxir items
    const { items: storeItems } = useSelector(state => state.items);
    const [section, setSection] = useState('INGREDIENT'); // INGREDIENT | TOOL | FLASK | RECIPE | CREATION
    
    // Option
    // 0 -> Market
    // 1 -> Orders
    // 2 -> Trades
    const [option, setOption] = useState(0);

    // Create fake assets for different sections based on available images (same as Inventory)
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
            asset: `fake_ingredient_${index}`,
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
            { name: 'Mystical Bellows', description: 'Used to heat up potions during crafting', image: 'bellow.png' },
            { name: 'Ancient Cauldron', description: 'Essential for mixing ingredients together', image: 'cauldron.png' },
            { name: 'Silver Ladle', description: 'For transferring potions into flasks', image: 'ladle.png' },
            { name: 'Stone Mortar', description: 'Grinds ingredients to release their full potential', image: 'mortar.png' }
        ].map((tool, index) => ({
            asset: `fake_tool_${index}`,
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
            { name: 'Crystal Flask', description: 'Holds 1 potion portion', image: 'flask1.png' },
            { name: 'Emerald Flask', description: 'Holds 2 potion portions', image: 'flask2.png' },
            { name: 'Sapphire Flask', description: 'Holds 3 potion portions', image: 'flask3.png' },
            { name: 'Ruby Flask', description: 'Holds 4 potion portions', image: 'flask4.png' },
            { name: 'Diamond Flask', description: 'Holds 5 potion portions', image: 'flask5.png' }
        ].map((flask, index) => ({
            asset: `fake_flask_${index}`,
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
            { name: 'Recipe of the Whispering Gale Potion', description: 'Ancient formula for aerial enhancement', image: 'recipe1.png' },
            { name: 'Recipe of the Tideheart Potion', description: 'Aquatic power brewing instructions', image: 'recipe2.png' },
            { name: 'Recipe of the Stoneblood Potion', description: 'Terrestrial strength elixir formula', image: 'recipe1.png' },
            { name: 'Recipe of the Eternal Silk Potion', description: 'Asiatic wisdom brewing guide', image: 'recipe2.png' },
            { name: 'Recipe of the Coral Spirits Potion', description: 'Oceanic essence creation method', image: 'recipe1.png' },
            { name: 'Recipe of the Feathered Flame Potion', description: 'Americas spirit brewing technique', image: 'recipe2.png' },
            { name: 'Recipe of the Shifting Dunes Potion', description: 'African power enhancement formula', image: 'recipe1.png' },
            { name: 'Recipe of the Forgotten Grove Potion', description: 'European strength elixir guide', image: 'recipe2.png' }
        ].map((recipe, index) => ({
            asset: `fake_recipe_${index}`,
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
    }, []);

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
