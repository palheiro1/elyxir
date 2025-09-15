import React, { useMemo, useState, useCallback } from 'react';
import { 
    Heading, 
    Text, 
    Box, 
    Stack, 
    Button, 
    HStack, 
    Badge, 
    Progress, 
    Wrap, 
    WrapItem, 
    useColorModeValue 
} from '@chakra-ui/react';
import { ELYXIR_PROCESSES } from '../../../data/elyxirProcesses';

// Map creation asset IDs to human-friendly creation names
const PROCESS_NAME_MAP = {
    '6485210212239811': 'Whispering Gale',
    '7582224115266007515': 'Tideheart',
    '10474636406729395731': 'Stoneblood',
    '5089659721388119266': 'Eternal Silk',
    '8693351662911145147': 'Coral Spirits',
    '11206437400477435454': 'Feathered Flame',
    '12861522637067934750': 'Shifting Dunes',
    '3858707486313568681': 'Forgotten Grove'
};

const Elyxir = ({ infoAccount }) => {
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [selectedFlaskIdx, setSelectedFlaskIdx] = useState(0);
    const [craftDuration, setCraftDuration] = useState(1); // default 1 day
    const [craftingProgress, setCraftingProgress] = useState(0); // percent
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');

    // Calculate success rate based on craft duration (parabolic curve)
    const calculateSuccessRate = (days) => {
        // Parabolic formula: y = 20 + 75 * (1 - (1/(1 + 0.5*x))^2)
        // At day 1: ~20%, at day 7: ~95%, asymptotic to 100%
        const baseRate = 20;
        const maxIncrease = 75;
        const factor = 0.5;
        return Math.min(95, baseRate + maxIncrease * (1 - Math.pow(1 / (1 + factor * days), 2)));
    };

    // Flask multipliers for ingredient quantities
    const flaskMultipliers = [1, 2, 3, 4, 5]; // x1 to x5

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

    // After fakeAssets declaration and before grouped usage, create a fast lookup for assetId->display name
    const assetIdNameMap = useMemo(() => {
        const map = {};
        allElyxirItems.forEach(item => {
            map[item.asset] = item.name;
        });
        return map;
    }, [allElyxirItems]);

    // Build UI recipes from processes once we know item names
    const RECIPES = useMemo(() => {
        return ELYXIR_PROCESSES.recipes.map(p => ({
            id: p.recipeAssetId,
            name: PROCESS_NAME_MAP[p.creationAssetId] || p.creationAssetId,
            ingredients: p.ingredients.map(ing => ({
                assetId: ing.assetId,
                quantity: ing.qtyQNT,
                name: assetIdNameMap[ing.assetId] || ing.assetId
            })),
            tools: p.tools // asset IDs
        }));
    }, [assetIdNameMap]);

    // Get missing items for recipe crafting (assetId-based)
    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];
            if (recipe?.ingredients) {
                recipe.ingredients.forEach(req => {
                    const item = grouped.ingredients?.find(i => i.asset === req.assetId);
                    const have = item ? Number(item.quantityQNT) : 0;
                    const needed = req.quantity * flaskMultiplier;
                    if (have < needed) missing.push(`${needed - have}x ${req.name}`);
                });
            }
            if (recipe?.tools) {
                recipe.tools.forEach(toolAssetId => {
                    if (!grouped.tools?.some(t => t.asset === toolAssetId)) {
                        const toolName = assetIdNameMap[toolAssetId] || toolAssetId;
                        missing.push(toolName);
                    }
                });
            }
            return missing;
        },
        [grouped, assetIdNameMap]
    );

    return (
        <Box maxW={'100%'} px={4} py={6}>
            {/* Header */}


            <Box bg={sectionBg} p={6} borderRadius="md">
                {/* Recipe Selection */}
                <Stack spacing={6} mb={8}>
                    <Text fontWeight="bold" fontSize="lg">Select Recipe:</Text>
                    <Wrap spacing={4}>
                        {RECIPES.map((recipe, idx) => {
                            const currentMultiplier = flaskMultipliers[selectedFlaskIdx];
                            const missing = getMissingItems(recipe, currentMultiplier);
                            const canCraft = missing.length === 0;
                            
                            return (
                                <WrapItem key={idx}>
                                    <Button
                                        size="md"
                                        variant={selectedRecipeIdx === idx ? 'solid' : 'outline'}
                                        colorScheme={canCraft ? 'green' : 'gray'}
                                        onClick={() => setSelectedRecipeIdx(idx)}
                                        isDisabled={!canCraft}
                                        h="60px"
                                        px={6}>
                                        {recipe.name}
                                    </Button>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </Stack>

                {/* Flask Selection */}
                <Stack spacing={6} mb={8}>
                    <Text fontWeight="bold" fontSize="lg">Select Flask (Potion Quantity):</Text>
                    <Wrap spacing={4}>
                        {fakeAssets.flasks.map((flask, idx) => (
                            <WrapItem key={idx}>
                                <Button
                                    variant={selectedFlaskIdx === idx ? 'solid' : 'outline'}
                                    colorScheme="blue"
                                    onClick={() => setSelectedFlaskIdx(idx)}
                                    h="120px"
                                    w="120px"
                                    flexDirection="column"
                                    p={2}>
                                    <Box
                                        w="60px"
                                        h="60px"
                                        backgroundImage={`url(${flask.imgUrl})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                        mb={2}
                                    />
                                    <Text fontSize="xs" textAlign="center">
                                        {flask.name}
                                    </Text>
                                    <Badge colorScheme="blue" fontSize="xs">
                                        x{flaskMultipliers[idx]} potions
                                    </Badge>
                                </Button>
                            </WrapItem>
                        ))}
                    </Wrap>
                </Stack>

                {/* Selected Recipe Details with Visual Ingredients */}
                {RECIPES[selectedRecipeIdx] && (
                    <Box p={6} border="2px" borderColor="purple.300" borderRadius="md" mb={8}>
                        <Heading size="md" mb={4}>{RECIPES[selectedRecipeIdx].name}</Heading>
                        <Text fontSize="md" mb={4} color="purple.600" fontWeight="bold">
                            Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                        </Text>
                        
                        <Stack spacing={6}>
                            {/* Ingredients with Images */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Required Ingredients:</Text>
                                <Wrap spacing={6}>
                                    {RECIPES[selectedRecipeIdx].ingredients.map((ing, i) => {
                                        const ingredient = grouped.ingredients?.find(item => item.asset === ing.assetId);
                                        const requiredQty = ing.quantity * flaskMultipliers[selectedFlaskIdx];
                                        const have = ingredient ? Number(ingredient.quantityQNT) : 0;
                                        const hasEnough = have >= requiredQty;
                                        
                                        return (
                                            <WrapItem key={i}>
                                                <Box 
                                                    p={4}
                                                    border="2px"
                                                    borderColor={hasEnough ? "green.300" : "red.300"}
                                                    borderRadius="md"
                                                    textAlign="center"
                                                    w="140px">
                                                    {ingredient && (
                                                        <Box
                                                            w="60px"
                                                            h="60px"
                                                            backgroundImage={`url(${ingredient.imgUrl})`}
                                                            backgroundSize="contain"
                                                            backgroundRepeat="no-repeat"
                                                            backgroundPosition="center"
                                                            mx="auto"
                                                            mb={2}
                                                        />
                                                    )}
                                                    <Text fontSize="sm" fontWeight="bold" mb={1}>
                                                        {ing.name}
                                                    </Text>
                                                    <Badge 
                                                        colorScheme={hasEnough ? "green" : "red"}
                                                        fontSize="xs">
                                                        {requiredQty} needed
                                                    </Badge>
                                                    <Text fontSize="xs" color="gray.600">
                                                        ({have} available)
                                                    </Text>
                                                </Box>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>
                            </Box>

                            {/* Tools with Images */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Required Tools:</Text>
                                <Wrap spacing={6}>
                                    {RECIPES[selectedRecipeIdx].tools.map((toolAssetId, i) => {
                                        const tool = grouped.tools?.find(item => item.asset === toolAssetId);
                                        const hasTool = !!tool;
                                        
                                        return (
                                            <WrapItem key={i}>
                                                <Box 
                                                    p={4}
                                                    border="2px"
                                                    borderColor={hasTool ? "green.300" : "red.300"}
                                                    borderRadius="md"
                                                    textAlign="center"
                                                    w="140px">
                                                    {tool && (
                                                        <Box
                                                            w="60px"
                                                            h="60px"
                                                            backgroundImage={`url(${tool.imgUrl})`}
                                                            backgroundSize="contain"
                                                            backgroundRepeat="no-repeat"
                                                            backgroundPosition="center"
                                                            mx="auto"
                                                            mb={2}
                                                        />
                                                    )}
                                                    <Text fontSize="sm" fontWeight="bold" mb={1}>
                                                        {tool ? tool.name : (assetIdNameMap[toolAssetId] || toolAssetId)}
                                                    </Text>
                                                    <Badge 
                                                        colorScheme={hasTool ? "green" : "red"}
                                                        fontSize="xs">
                                                        {hasTool ? "Available" : "Missing"}
                                                    </Badge>
                                                </Box>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/* Crafting Controls */}
                <Stack spacing={6}>
                    <HStack spacing={8}>
                        <Text fontWeight="bold" fontSize="lg">Craft Duration:</Text>
                        <HStack>
                            <Button 
                                size="md" 
                                onClick={() => setCraftDuration(Math.max(1, craftDuration - 1))}
                                colorScheme="purple"
                                variant="outline">
                                -
                            </Button>
                            <Text minW="80px" textAlign="center" fontSize="lg" fontWeight="bold">
                                {craftDuration} {craftDuration === 1 ? 'day' : 'days'}
                            </Text>
                            <Button 
                                size="md" 
                                onClick={() => setCraftDuration(craftDuration + 1)}
                                colorScheme="purple"
                                variant="outline">
                                +
                            </Button>
                        </HStack>
                        <Text fontSize="md" color="purple.600" fontWeight="bold">
                            Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                        </Text>
                    </HStack>
                    
                    {craftingProgress > 0 && (
                        <Box>
                            <Text mb={2} fontWeight="bold">Crafting Progress:</Text>
                            <Progress value={craftingProgress} colorScheme="purple" size="lg" />
                        </Box>
                    )}
                    
                    <Button
                        colorScheme="purple"
                        size="lg"
                        h="60px"
                        fontSize="lg"
                        isDisabled={getMissingItems(RECIPES[selectedRecipeIdx], flaskMultipliers[selectedFlaskIdx]).length > 0 || craftingProgress > 0}
                        onClick={() => {
                            // Start crafting simulation
                            setCraftingProgress(0);
                            const interval = setInterval(() => {
                                setCraftingProgress(prev => {
                                    if (prev >= 100) {
                                        clearInterval(interval);
                                        return 0;
                                    }
                                    return prev + (100 / (craftDuration * 10)); // Simulate days
                                });
                            }, 100);
                        }}>
                        {craftingProgress > 0 ? 'Crafting...' : `Start Crafting (${flaskMultipliers[selectedFlaskIdx]} potions)`}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Elyxir;
