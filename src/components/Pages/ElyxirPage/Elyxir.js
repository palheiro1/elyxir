import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Text, Box, Stack, Button, Image, Tooltip, Divider, SimpleGrid, HStack, Tag, Badge, Progress, Wrap, WrapItem, useColorModeValue } from '@chakra-ui/react';
import ElyxirMarket from './ElyxirMarket';
import GridCards from '../../Cards/GridCards';

// Map item names to image paths
const imageFor = (name, type) => {
    if (!name) return '';
    const n = name.toLowerCase();
    if (type === 'ingredients') return `/images/elyxir/ingredients/${name}.png`;
    if (type === 'tools') return `/images/elyxir/tools/${n.replace(/ /g, '').replace(/bellows/, 'bellow')}.png`;
    if (type === 'flasks') return `/images/elyxir/flasks/flask${n.match(/(conical|pear|kjeldahl|florence|round)/) ? ['conical','pear','kjeldahl','florence','round'].findIndex(f=>n.includes(f))+1 : 1}.png`;
    if (type === 'recipes') return `/images/elyxir/recipes/recipe1.png`;
    if (type === 'outputs') return `/images/elyxir/outputs/${name}.png`;
    return '';
};

const classifyItem = name => {
    if (!name) return 'others';
    const n = name.toLowerCase();
    if (n.includes('recipe')) return 'recipes';
    if (["herb", "mushroom", "flower", "shard"].some(k => n.includes(k))) return 'ingredients';
    if (["bellows", "cauldron", "mortar", "ladle"].some(k => n.includes(k))) return 'tools';
    if (n.includes('flask')) return 'flasks';
    return 'others';
};

const groupItemsByType = items =>
    items.reduce((acc, item) => {
        const type = classifyItem(item.name);
        acc[type] = acc[type] || [];
        acc[type].push(item);
        return acc;
    }, {});


// Two example recipes, each with multiple tools and ingredients from the ingredients folder
const RECIPES = [
    {
        id: 'elixir_of_clouds',
        name: 'Elixir of Clouds',
        ingredients: [
            { name: 'Cloud', quantity: 1, file: 'cloud.png' },
            { name: 'Water Cristaline', quantity: 2, file: 'watercristaline.png' },
            { name: 'Hymalayansnow', quantity: 1, file: 'hymalayansnow.png' },
        ],
        tools: ['Mortar', 'Cauldron'],
        // Flasks are not required by the recipe
        successRate: 0.8,
        result: 'Elixir of Clouds',
        parchment: '/images/elyxir/parchment1.png', // will use provided parchment image
    },
    {
        id: 'draught_of_the_wild',
        name: 'Draught of the Wild',
        ingredients: [
            { name: 'Bonepowder', quantity: 1, file: 'bonepowder.png' },
            { name: 'Colmillo De Lobo', quantity: 1, file: 'colmillo_de_lobo.png' },
            { name: 'Herba De Etiopia', quantity: 2, file: 'herba_de_etiopia.png' },
        ],
        tools: ['Ladle', 'Bellows'],
        successRate: 0.65,
        result: 'Draught of the Wild',
        parchment: '/images/elyxir/parchment2.png', // will use provided scroll image
    },
];


const Elyxir = () => {
    const { items } = useSelector(state => state.items);
    const [tabIndex, setTabIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [viewMode, setViewMode] = useState('ingredients');
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [craftDuration, setCraftDuration] = useState(300); // default 5 min
    const [craftingProgress, setCraftingProgress] = useState(0); // percent
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');


    // Define all possible items for each type (should be expanded as needed)
    // Ingredient names from normalized image filenames
    const INGREDIENT_IMAGE_FILES = [
        'aguas_fetidas.png',
        'alamorcego.png',
        'alcoholbeer.png',
        'araucarianresine.png',
        'arena_del_desierto.png',
        'ash.png',
        'blood.png',
        'bonepowder.png',
        'cedrepinenute.png',
        'cloud.png',
        'colmillo_de_lobo.png',
        'colmillo_de_vampiro.png',
        'corteza.png',
        'cucumberleftover.png',
        'diamantebruto.png',
        'escama_de_trasca.png',
        'flor_de_algodon.png',
        'gardenflower.png',
        'gardensoil.png',
        'guijarros.png',
        'herba_de_etiopia.png',
        'holi_water2.png',
        'horndust.png',
        'hymalayansnow.png',
        'kangurhair.png',
        'lava.png',
        'lightninggg.png',
        'medicinalstone.png',
        'mustard_seeds.png',
        'pelosasquatch.png',
        'peyote.png',
        'pluma.png',
        'rainboudust.png',
        'salivaderahu.png',
        'skin.png',
        'sunlight.png',
        'watercristaline.png',
        'water_sea.png',
        'wind.png',
    ];

    // Convert filenames to display names (e.g., 'aguas_fetidas.png' => 'Aguas fetidas')
    function filenameToName(filename) {
        return filename
            .replace('.png', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    const ALL_ITEMS = {
        ingredients: INGREDIENT_IMAGE_FILES.map(f => ({ name: filenameToName(f), image: `/images/elyxir/ingredients/${f}` })),
        tools: [
            { name: 'Mortar' },
            { name: 'Cauldron' },
            { name: 'Bellows' },
            { name: 'Ladle' },
        ],
        flasks: [
            { name: 'Conical flask' },
            { name: 'Pear flask' },
            { name: 'Kjeldahl flask' },
            { name: 'Florence flask' },
            { name: 'Round flask' },
        ],
        recipes: [
            { name: 'Strength Potion' },
        ],
        creations: [
            { name: 'Potion of Power' },
            { name: 'Magic Shield' },
            { name: 'Enchanted Sword' },
        ],
        };

    // Group owned items by type
    const grouped = useMemo(() => groupItemsByType(items), [items]);

    // For each type, merge ALL_ITEMS with owned items, marking quantityQNT = 0 if not owned
    const mergedItems = useMemo(() => {
        const result = {};
        Object.keys(ALL_ITEMS).forEach(type => {
            result[type] = ALL_ITEMS[type].map(base => {
                const owned = grouped[type]?.find(i => i.name.toLowerCase() === base.name.toLowerCase());
                // For ingredients, preserve the image path from ALL_ITEMS
                if (type === 'ingredients') {
                    return owned ? { ...owned, image: base.image } : { ...base, quantityQNT: 0, asset: base.name };
                }
                return owned ? { ...owned } : { ...base, quantityQNT: 0, asset: base.name };
            });
        });
        return result;
    }, [grouped, ALL_ITEMS]);

    // Show all recipes in the workshop, even if user doesn't own any
    const availableRecipes = RECIPES;
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
            // Flasks are optional; only check if present
            if (recipe.flasks && Array.isArray(recipe.flasks)) {
                recipe.flasks.forEach(name => {
                    if (!grouped.flasks?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            return missing;
        },
        [grouped]
    );
    const handleCraft = recipe => {
        const missing = getMissingItems(recipe);
        if (missing.length) {
            setMessage(`Missing: ${missing.join(', ')}`);
            return;
        }
        const success = Math.random() < recipe.successRate;
        if (success) {
            setMessage(`Success! You created ${recipe.result}.`);
        } else {
            const incident = Math.random() < 0.5 ? 'Failure' : 'Explosion';
            if (incident === 'Failure')
                setMessage('Failure: ingredients lost but tools and flasks remain.');
            else setMessage('Explosion: all items consumed!');
        }
    };
    // Prepare recipe cards for GridCards, removing burning info and asset fields
    const recipeCards = RECIPES.map((r, idx) => ({
        ...r,
        cardImgUrl: idx === 0 ? '/images/elyxir/parchment1.png' : '/images/elyxir/parchment2.png',
        name: r.name,
        description: `${Math.round(r.successRate * 100)}% success`,
        onClick: () => setSelectedRecipeIdx(idx),
        isSelected: selectedRecipeIdx === idx,
        burnedQuantity: 0,
        totalQuantityQNT: 1,
        quantityQNT: 1,
        asset: undefined,
        rarity: 'Recipe',
        // For GridCards, add tools and ingredients for display
        tools: r.tools,
        ingredients: r.ingredients.map(i => ({
            ...i,
            image: `/images/elyxir/ingredients/${i.file || i.name.toLowerCase().replace(/ /g,'_')}.png`,
        })),
        flasks: [],
    }));

    return (
        <Box p={4}>
            <Heading size="sm" color="purple.200" mb={2}>Available Recipes</Heading>
            <GridCards
                cards={recipeCards}
                isMarket={false}
                onlyBuy={false}
                infoAccount={{}}
                market={''}
                rgbColor="128, 90, 213"
            />
            {/* Detail panel for selected recipe */}
            {RECIPES[selectedRecipeIdx] && (() => {
                const r = RECIPES[selectedRecipeIdx];
                const missing = getMissingItems(r);

                // Only tools and ingredients are required
                const makeReqData = () => {
                    return {
                        tools: r.tools.map(name => {
                            const owned = grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase());
                            return { name, owned, image: imageFor(name, 'tools'), type: 'Tool' };
                        }),
                        ingredients: r.ingredients.map(req => {
                            const owned = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                            const have = owned ? owned.quantityQNT : 0;
                            return {
                                name: req.name,
                                owned: have >= req.quantity,
                                have,
                                need: req.quantity,
                                image: imageFor(req.name, 'ingredients'),
                                type: 'Ingredient',
                            };
                        }),
                    };
                };
                const req = makeReqData();

                const Chip = ({ item }) => {
                    const border = item.owned ? 'green.400' : 'red.400';
                    const bg = item.owned ? 'green.900' : 'red.900';
                    return (
                        <Tooltip label={`${item.type}` + (item.need ? ` | Need ${item.need}` : '')}>
                            <Box
                                borderWidth="1px"
                                borderColor={border}
                                bg={bg}
                                p={2}
                                rounded="md"
                                minW="90px"
                                textAlign="center"
                                display="flex"
                                flexDir="column"
                                gap={1}
                            >
                                <Image src={item.image} alt={item.name} boxSize="42px" mx="auto" />
                                <Text fontSize="2xs" fontWeight="bold" noOfLines={1}>{item.name}</Text>
                                {item.need ? (
                                    <Badge colorScheme={item.owned ? 'green' : 'red'} fontSize="0.6rem">
                                        {item.have}/{item.need}
                                    </Badge>
                                ) : (
                                    <Badge colorScheme={item.owned ? 'green' : 'red'} fontSize="0.6rem">
                                        {item.owned ? 'Owned' : 'Missing'}
                                    </Badge>
                                )}
                            </Box>
                        </Tooltip>
                    );
                };

                const Group = ({ title, color, items }) => (
                    <Box flex={1} minW={{ base: '100%', md: '30%' }}>
                        <HStack mb={2} spacing={2}>
                            <Box w="6px" h="20px" bg={color} rounded="sm" />
                            <Text fontSize="sm" fontWeight="bold" letterSpacing="wide">{title}</Text>
                            <Badge colorScheme={items.every(i => i.owned) ? 'green' : 'orange'}>
                                {items.filter(i => i.owned).length}/{items.length}
                            </Badge>
                        </HStack>
                        <Wrap spacing={3}>
                            {items.map(i => (
                                <WrapItem key={i.name}><Chip item={i} /></WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                );

                return (
                    <Box
                        className="alchemy-detail"
                        position="relative"
                        mt={10}
                        rounded="xl"
                        px={{ base: 4, md: 8 }}
                        py={6}
                        overflow="hidden"
                        bg={sectionBg}
                    >
                        <Stack direction={{ base: 'column', lg: 'row' }} spacing={8} align="flex-start">
                            {/* Left summary */}
                            <Box flex={1} minW={{ base: '100%', lg: '260px' }}>
                                <HStack spacing={4} align="flex-start" mb={4}>
                                    <Image src={selectedRecipeIdx === 0 ? '/images/elyxir/parchment1.png' : '/images/elyxir/parchment2.png'} alt={r.name} boxSize="90px" rounded="lg" shadow="md" />
                                    <Stack spacing={2} flex={1}>
                                        <Heading size="md" color="purple.300">{r.name}</Heading>
                                        <HStack spacing={2} wrap="wrap">
                                            <Tag size="sm" colorScheme="purple">{Math.round(r.successRate * 100)}% success</Tag>
                                            <Tag size="sm" colorScheme={missing.length ? 'red' : 'green'}>
                                                {missing.length ? `${missing.length} missing` : 'All requirements met'}
                                            </Tag>
                                        </HStack>
                                    </Stack>
                                </HStack>
                                {/* Start process section restored */}
                                <Box mt={2}>
                                    <Text fontSize="xs" mb={1} color="gray.500">Craft duration</Text>
                                    <HStack spacing={3} align="center">
                                        <input
                                            type="range"
                                            min="60"
                                            max="600"
                                            step="60"
                                            value={craftDuration}
                                            onChange={e => setCraftDuration(Number(e.target.value))}
                                            style={{ width: '100%' }}
                                        />
                                        <Tag size="sm" variant="subtle" colorScheme="purple">
                                            {Math.floor(craftDuration / 60)}m
                                        </Tag>
                                    </HStack>
                                </Box>
                                <Box mt={4}>
                                    <Button
                                        w="100%"
                                        colorScheme="purple"
                                        size="md"
                                        onClick={() => handleCraft(r)}
                                        isDisabled={!!missing.length}
                                    >
                                        {missing.length ? 'Missing Items' : 'Start Craft'}
                                    </Button>
                                </Box>
                                <Box mt={4}>
                                    <Progress value={craftingProgress} size="sm" colorScheme="purple" rounded="full" />
                                </Box>
                                {message && (
                                    <Text mt={3} fontSize="sm" color="purple.300">{message}</Text>
                                )}
                                {!!missing.length && (
                                    <Text mt={2} fontSize="xs" color="red.300">Missing: {missing.join(', ')}</Text>
                                )}
                            </Box>
                            {/* Right requirements */}
                            <Stack flex={2} spacing={8} width="100%">
                                <Stack spacing={6}>
                                    <Group title="Tools" color="#3B7197" items={req.tools} />
                                    <Group title="Ingredients" color="#7E9246" items={req.ingredients} />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                );
            })()}
        </Box>
    );
};

export default Elyxir;