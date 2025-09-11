import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Heading, Text, Box, Stack, Button, Image, Tooltip, HStack, Tag, Badge, Progress, Wrap, WrapItem, useColorModeValue } from '@chakra-ui/react';
import GridCards from '../../Cards/GridCards';

// Full set of example potion recipes
const RECIPES = [
    {
        id: 'whispering_gale',
        name: 'Whispering Gale',
        ingredients: [
            { name: 'Cloud Essence', quantity: 1 },
            { name: 'Wind Essence', quantity: 2 },
            { name: 'Himalayan Snow', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.8,
        result: 'Whispering Gale',
    },
    {
        id: 'tideheart',
        name: 'Tideheart',
        ingredients: [
            { name: 'Sea Water', quantity: 2 },
            { name: 'Crystal Water', quantity: 1 },
            { name: 'Rainbow Dust', quantity: 1 },
        ],
        tools: ['Silver Ladle', 'Ancient Cauldron'],
        successRate: 0.75,
        result: 'Tideheart',
    },
    {
        id: 'stoneblood',
        name: 'Stoneblood',
        ingredients: [
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Raw Diamond', quantity: 1 },
            { name: 'Desert Sand', quantity: 2 },
        ],
        tools: ['Stone Mortar', 'Mystical Bellows'],
        successRate: 0.82,
        result: 'Stoneblood',
    },
    {
        id: 'feathered_flame',
        name: 'Feathered Flame',
        ingredients: [
            { name: 'Feather', quantity: 2 },
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Lightning Essence', quantity: 1 },
        ],
        tools: ['Mystical Bellows', 'Silver Ladle'],
        successRate: 0.7,
        result: 'Feathered Flame',
    },
    {
        id: 'eternal_silk',
        name: 'Eternal Silk',
        ingredients: [
            { name: 'Cotton Flower', quantity: 1 },
            { name: 'Garden Flower', quantity: 2 },
            { name: 'Bottled Sunlight', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.77,
        result: 'Eternal Silk',
    },
    {
        id: 'coral',
        name: 'Coral',
        ingredients: [
            { name: 'Sea Water', quantity: 2 },
            { name: 'Rainbow Dust', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Silver Ladle'],
        successRate: 0.74,
        result: 'Coral',
    },
];

const Elyxir = ({ infoAccount }) => {
    const { items } = useSelector(state => state.items);
    const [message, setMessage] = useState('');
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [craftDuration, setCraftDuration] = useState(300); // default 5 min
    const [craftingProgress, setCraftingProgress] = useState(0); // percent
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');

    // Create assets using real Ardor asset IDs from the blockchain (same as Inventory and Market)
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
            'vampirefang': '1853993309806999896',
            'wolfsfang': '1734749669966442838',
            'araucarianresine': '9146455733851008946',
            'ash': '15102806604556354632',
            'bonepowder': '10982823421829006444',
            'diamantebruto': '5570219882495290440',
            'gardensoil': '11508698419506139756',
            'horndust': '10089652431946070133',
            'hymalayansnow': '2603114092541070832',
            'pluma': '15230533556325993984',
            'skin': '11436325470737709655',
            'sand': '6043065774866721090',
            'rahusaliva': '1571336020100556625',
            'rainboudust': '7891814295348826088',
            'holi': '13446501052073878899',
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
        };

        // Mapping of image file names to proper names (matching Inventory and Market)
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
        };

        const ingredients = [
            'aguas_fetidas', 'alamorcego', 'alcoholbeer', 'araucarianresine', 'ash', 'bigfootshair', 'blood', 
            'bonepowder', 'cloud', 'corteza', 'diamantebruto', 'feather', 'flordealgodao', 'gardenflower',
            'gardensoil', 'herbadeetiopia', 'holi', 'horndust', 'hymalayansnow', 'kangarootail', 'lava',
            'lightninggg', 'mustardseeds', 'peyote', 'pluma', 'poisonherb', 'rainboudust', 'rahusaliva',
            'sand', 'skin', 'sunlight', 'vampirefang', 'watercristaline', 'water_sea', 'wind', 'wolfsfang'
        ].map((name, index) => {
            const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
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
            };
        });

        const potions = [
            { name: 'Whispering Gale Potion', description: 'Harnesses the power of wind and storms', image: 'whispering_gale.png', key: 'whispering_gale' },
            { name: 'Tideheart Potion', description: 'Contains the essence of ocean tides', image: 'tideheart.png', key: 'tideheart' },
            { name: 'Stoneblood Potion', description: 'Infused with the strength of mountains', image: 'stoneblood.png', key: 'stoneblood' },
            { name: 'Eternal Silk Potion', description: 'Woven with ancient Asian wisdom', image: 'eternal_silk.png', key: 'eternal_silk' },
            { name: 'Coral Spirits Potion', description: 'Blessed by oceanic guardians', image: 'coral_spirits.png', key: 'coral_spirits' },
            { name: 'Feathered Flame Potion', description: 'Burns with the spirit of the Americas', image: 'feathered_flame.png', key: 'feathered_flame' },
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
            };
        });

        return { ingredients, tools, flasks, potions };
    }, [infoAccount?.assets]);

    // Use the properly formatted assets instead of raw Redux items
    const allElyxirItems = useMemo(() => {
        return [
            ...fakeAssets.ingredients,
            ...fakeAssets.tools,
            ...fakeAssets.flasks,
            ...fakeAssets.potions
        ];
    }, [fakeAssets]);

    // Group items by type for recipe checking
    const grouped = useMemo(() => {
        const result = {};
        allElyxirItems.forEach(item => {
            const type = item.elyxirType.toLowerCase() + 's';
            if (!result[type]) result[type] = [];
            result[type].push(item);
        });
        return result;
    }, [allElyxirItems]);

    // Get missing items for recipe crafting (updated to use new data structure)
    const getMissingItems = useCallback(
        recipe => {
            const missing = [];
            if (recipe.ingredients) {
                recipe.ingredients.forEach(req => {
                    const item = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                    const have = item ? Number(item.quantityQNT) : 0;
                    if (have < req.quantity) missing.push(`${req.quantity - have}x ${req.name}`);
                });
            }
            if (recipe.tools) {
                recipe.tools.forEach(name => {
                    if (!grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            return missing;
        },
        [grouped]
    );

    return (
        <Box maxW={'100%'} px={4} py={6}>
            {/* Header */}
            <Heading size="lg" mb={6} textAlign="center">
                🧪 Elyxir Alchemy Workshop
            </Heading>

            {/* Workshop Tabs */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6} justify="center">
                <Button
                    size="sm"
                    variant={message === 'workshop' ? 'solid' : 'outline'}
                    colorScheme="purple"
                    onClick={() => setMessage('workshop')}
                    data-elyxir-tab="workshop">
                    Workshop
                </Button>
                <Button
                    size="sm"
                    variant={message === 'inventory' ? 'solid' : 'outline'}
                    colorScheme="purple"
                    onClick={() => setMessage('inventory')}>
                    Inventory
                </Button>
                <Button
                    size="sm"
                    variant={message === 'recipes' ? 'solid' : 'outline'}
                    colorScheme="purple"
                    onClick={() => setMessage('recipes')}>
                    Recipes
                </Button>
            </Stack>

            {/* Content based on selected tab */}
            {(() => {
                if (message === 'inventory') {
                    return (
                        <Box bg={sectionBg} p={4} borderRadius="md">
                            <Heading size="md" mb={4}>Your Elyxir Inventory</Heading>
                            <GridCards 
                                cards={allElyxirItems} 
                                infoAccount={infoAccount}
                                isMarket={false}
                            />
                        </Box>
                    );
                }

                if (message === 'recipes') {
                    return (
                        <Box bg={sectionBg} p={4} borderRadius="md">
                            <Heading size="md" mb={4}>Potion Recipes</Heading>
                            <Stack spacing={4}>
                                {RECIPES.map((recipe, idx) => {
                                    const missing = getMissingItems(recipe);
                                    const canCraft = missing.length === 0;
                                    
                                    return (
                                        <Box key={idx} p={4} border="1px" borderColor="gray.300" borderRadius="md">
                                            <HStack justify="space-between" mb={2}>
                                                <Heading size="sm">{recipe.name}</Heading>
                                                <Badge colorScheme={canCraft ? 'green' : 'red'}>
                                                    {canCraft ? 'Can Craft' : 'Missing Items'}
                                                </Badge>
                                            </HStack>
                                            
                                            <Text fontSize="sm" color="gray.600" mb={2}>
                                                Success Rate: {Math.round(recipe.successRate * 100)}%
                                            </Text>
                                            
                                            <Stack spacing={2}>
                                                <Text fontWeight="bold">Ingredients:</Text>
                                                <Wrap>
                                                    {recipe.ingredients.map((ing, i) => (
                                                        <WrapItem key={i}>
                                                            <Tag size="sm" colorScheme="blue">
                                                                {ing.quantity}x {ing.name}
                                                            </Tag>
                                                        </WrapItem>
                                                    ))}
                                                </Wrap>
                                                
                                                <Text fontWeight="bold">Tools:</Text>
                                                <Wrap>
                                                    {recipe.tools.map((tool, i) => (
                                                        <WrapItem key={i}>
                                                            <Tag size="sm" colorScheme="orange">
                                                                {tool}
                                                            </Tag>
                                                        </WrapItem>
                                                    ))}
                                                </Wrap>
                                                
                                                {missing.length > 0 && (
                                                    <>
                                                        <Text fontWeight="bold" color="red.500">Missing:</Text>
                                                        <Wrap>
                                                            {missing.map((item, i) => (
                                                                <WrapItem key={i}>
                                                                    <Tag size="sm" colorScheme="red">
                                                                        {item}
                                                                    </Tag>
                                                                </WrapItem>
                                                            ))}
                                                        </Wrap>
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    );
                }

                // Workshop (default)
                return (
                    <Box bg={sectionBg} p={4} borderRadius="md">
                        <Heading size="md" mb={4}>Potion Crafting Workshop</Heading>
                        
                        {/* Recipe Selection */}
                        <Stack spacing={4} mb={6}>
                            <Text fontWeight="bold">Select Recipe:</Text>
                            <Wrap>
                                {RECIPES.map((recipe, idx) => {
                                    const missing = getMissingItems(recipe);
                                    const canCraft = missing.length === 0;
                                    
                                    return (
                                        <WrapItem key={idx}>
                                            <Button
                                                size="sm"
                                                variant={selectedRecipeIdx === idx ? 'solid' : 'outline'}
                                                colorScheme={canCraft ? 'green' : 'gray'}
                                                onClick={() => setSelectedRecipeIdx(idx)}
                                                isDisabled={!canCraft}>
                                                {recipe.name}
                                            </Button>
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        </Stack>

                        {/* Selected Recipe Details */}
                        {RECIPES[selectedRecipeIdx] && (
                            <Box p={4} border="1px" borderColor="purple.300" borderRadius="md" mb={4}>
                                <Heading size="sm" mb={2}>{RECIPES[selectedRecipeIdx].name}</Heading>
                                <Text fontSize="sm" mb={2}>
                                    Success Rate: {Math.round(RECIPES[selectedRecipeIdx].successRate * 100)}%
                                </Text>
                                
                                <Stack spacing={2}>
                                    <Text fontWeight="bold">Required:</Text>
                                    <Wrap>
                                        {RECIPES[selectedRecipeIdx].ingredients.map((ing, i) => (
                                            <WrapItem key={i}>
                                                <Tag size="sm" colorScheme="blue">
                                                    {ing.quantity}x {ing.name}
                                                </Tag>
                                            </WrapItem>
                                        ))}
                                        {RECIPES[selectedRecipeIdx].tools.map((tool, i) => (
                                            <WrapItem key={i}>
                                                <Tag size="sm" colorScheme="orange">
                                                    {tool}
                                                </Tag>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                </Stack>
                            </Box>
                        )}

                        {/* Crafting Controls */}
                        <Stack spacing={4}>
                            <HStack>
                                <Text>Craft Duration (minutes):</Text>
                                <Button size="sm" onClick={() => setCraftDuration(Math.max(60, craftDuration - 60))}>-</Button>
                                <Text minW="60px" textAlign="center">{Math.round(craftDuration / 60)}</Text>
                                <Button size="sm" onClick={() => setCraftDuration(craftDuration + 60)}>+</Button>
                            </HStack>
                            
                            {craftingProgress > 0 && (
                                <Box>
                                    <Text mb={2}>Crafting Progress:</Text>
                                    <Progress value={craftingProgress} colorScheme="purple" />
                                </Box>
                            )}
                            
                            <Button
                                colorScheme="purple"
                                size="lg"
                                isDisabled={getMissingItems(RECIPES[selectedRecipeIdx]).length > 0 || craftingProgress > 0}
                                onClick={() => {
                                    // Start crafting simulation
                                    setCraftingProgress(0);
                                    const interval = setInterval(() => {
                                        setCraftingProgress(prev => {
                                            if (prev >= 100) {
                                                clearInterval(interval);
                                                return 0;
                                            }
                                            return prev + (100 / (craftDuration / 1000));
                                        });
                                    }, 1000);
                                }}>
                                {craftingProgress > 0 ? 'Crafting...' : 'Start Crafting'}
                            </Button>
                        </Stack>
                    </Box>
                );
            })()}
        </Box>
    );
};

export default Elyxir;
