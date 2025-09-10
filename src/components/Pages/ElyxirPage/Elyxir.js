import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Heading, Text, Box, Stack, Button, Image, Tooltip, HStack, Tag, Badge, Progress, Wrap, WrapItem, useColorModeValue } from '@chakra-ui/react';
import GridCards from '../../Cards/GridCards';

// Map item names to image paths (fix for lowercase/underscores)
const imageFor = (name, type) => {
    if (!name) return '';
    const n = name.toLowerCase().replace(/ /g, '_');
    if (type === 'ingredients') return `/images/elyxir/ingredients/${n}.png`;
    if (type === 'tools') return `/images/elyxir/tools/${n.replace(/bellows/, 'bellow')}.png`;
    if (type === 'flasks') return `/images/elyxir/flasks/flask${n.match(/(conical|pear|kjeldahl|florence|round)/) ? ['conical','pear','kjeldahl','florence','round'].findIndex(f=>n.includes(f))+1 : 1}.png`;
    if (type === 'recipes') return `/images/elyxir/${n}.png`;
    if (type === 'outputs') return `/images/elyxir/outputs/${n}.png`;
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


// Full set of example potion recipes, each with a matching output name and image
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
            { name: 'Crystal Water', quantity: 2 },
            { name: 'Sea Water', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Silver Ladle', 'Ancient Cauldron'],
        successRate: 0.75,
        result: 'Tideheart',
    },
    {
        id: 'stoneblood',
        name: 'Stoneblood',
        ingredients: [
            { name: 'Bone Powder', quantity: 1 },
            { name: 'Garden Soil', quantity: 2 },
            { name: 'Raw Diamond', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Mystical Bellows'],
        successRate: 0.7,
        result: 'Stoneblood',
    },
    {
        id: 'shifting_dunes',
        name: 'Shifting Dunes',
        ingredients: [
            { name: 'Desert Sand', quantity: 2 },
            { name: 'Volcanic Ash', quantity: 1 },
            { name: 'Bottled Sunlight', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Mystical Bellows'],
        successRate: 0.68,
        result: 'Shifting Dunes',
    },
    {
        id: 'forgotten_grove',
        name: 'Forgotten Grove',
        ingredients: [
            { name: 'Healing Herb', quantity: 2 },
            { name: 'Garden Flower', quantity: 1 },
            { name: 'Tree Bark', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Silver Ladle'],
        successRate: 0.72,
        result: 'Forgotten Grove',
    },
    {
        id: 'feathered_flame',
        name: 'Feathered Flame',
        ingredients: [
            { name: 'Magic Pollen', quantity: 2 },
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Thunder Essence', quantity: 1 },
        ],
        tools: ['Mystical Bellows', 'Silver Ladle'],
        successRate: 0.7,
        result: 'Feathered Flame',
    },
    {
        id: 'eternal_silk',
        name: 'Eternal Silk',
        ingredients: [
            { name: 'Magic Dust', quantity: 1 },
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
            { name: 'Stardust', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Silver Ladle'],
        successRate: 0.74,
        result: 'Coral',
    },
];


const Elyxir = () => {
    const { items } = useSelector(state => state.items);
    const [message, setMessage] = useState('');
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [craftDuration, setCraftDuration] = useState(300); // default 5 min
    const [craftingProgress, setCraftingProgress] = useState(0); // percent
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');


    // Define all possible items for each type (should be expanded as needed)
    // Ingredient names from normalized image filenames
    const { ALL_ITEMS, filteredIngredients } = useMemo(() => {
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

        // Map image filenames to display names to match the Airdrop page names
        function filenameToName(filename) {
            const nameMap = {
                'aguas_fetidas.png': 'Fetid Waters',
                'arena_del_desierto.png': 'Desert Sand',
                'araucarianresine.png': 'Araucarian Resine',
                'ash.png': 'Volcanic Ash',
                'bonepowder.png': 'Bone Powder',
                'cloud.png': 'Cloud Essence',
                'diamantebruto.png': 'Raw Diamond',
                'dientes_de_dragon.png': 'Dragon Teeth',
                'elixir_rarity.png': 'Elixir Rarity',
                'ether.png': 'Ethereal Mist',
                'gardenflower.png': 'Garden Flower',
                'gardensoil.png': 'Garden Soil',
                'hierba_curandera.png': 'Healing Herb',
                'hierro.png': 'Iron Ore',
                'hueso_de_ballena.png': 'Whale Bone',
                'hymalayansnow.png': 'Himalayan Snow',
                'ice.png': 'Pristine Ice',
                'magic_dust.png': 'Magic Dust',
                'medusahair.png': 'Medusa Hair',
                'moonstone.png': 'Moonstone',
                'mushroom_luminous.png': 'Luminous Mushroom',
                'piel_de_serpiente.png': 'Snake Skin',
                'pollen_magico.png': 'Magic Pollen',
                'rare_crystal.png': 'Rare Crystal',
                'raiz_de_ent.png': 'Ent Root',
                'ruby.png': 'Ruby Gem',
                'salmon_teeth.png': 'Salmon Teeth',
                'semilla_de_arbol_magico.png': 'Magic Tree Seed',
                'stardust.png': 'Stardust',
                'sunlight.png': 'Bottled Sunlight',
                'thunder.png': 'Thunder Essence',
                'tree_bark.png': 'Tree Bark',
                'unicorn_horn.png': 'Unicorn Horn',
                'vampire_blood.png': 'Vampire Blood',
                'volcano_lava.png': 'Volcano Lava',
                'water_cristalina.png': 'Crystal Water',
                'water_sea.png': 'Sea Water',
                'wind.png': 'Wind Essence'
            };
            
            return nameMap[filename] || filename
                .replace('.png', '')
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        const ALL_ITEMS = {
            ingredients: INGREDIENT_IMAGE_FILES.map(f => ({ name: filenameToName(f), image: `/images/elyxir/ingredients/${f}` })),
            tools: [
                { name: 'Stone Mortar' },
                { name: 'Ancient Cauldron' },
                { name: 'Mystical Bellows' },
                { name: 'Silver Ladle' },
            ],
            flasks: [
                { name: 'Crystal Flask' },
                { name: 'Emerald Flask' },
                { name: 'Sapphire Flask' },
                { name: 'Ruby Flask' },
                { name: 'Diamond Flask' },
            ],
            recipes: [
                { name: 'Recipe of the Coral Potion' },
                { name: 'Recipe of the Stoneblood Potion' },
            ],
            creations: [
                { name: 'Whispering Gale Potion' },
                { name: 'Tideheart Potion' },
                { name: 'Stoneblood Potion' },
            ],
        };

        // Return all ingredients as filtered ingredients (no search functionality)
        const filteredIngredients = ALL_ITEMS.ingredients;

        return { ALL_ITEMS, filteredIngredients };
    }, []);

    // Group owned items by type
    const grouped = useMemo(() => groupItemsByType(items), [items]);

    // For each type, merge ALL_ITEMS with owned items, marking quantityQNT = 0 if not owned
    // ...existing code... (remove unused mergedItems)

    // Show all recipes in the workshop, even if user doesn't own any
    // ...existing code... (remove unused availableRecipes)
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
    // Map recipe result to real output image filenames
    const outputImageMap = {
        'Whispering Gale': 'PotionWhisperingGale.png',
        'Tideheart': 'PotionTideheart.png',
        'Stoneblood': 'PotionStoneblood .png',
        'Shifting Dunes': 'Potion of the Shifting Dunes.png',
        'Forgotten Grove': 'PotionoftheForgottenGrove.png',
        'Feathered Flame': 'PotionoftheFeatheredFlame.png',
        'Eternal Silk': 'PotionofheEternalSilk.png',
        'Coral': 'PotionCoral.png',
    };
    const recipeCards = RECIPES.map((r, idx) => {
        const outputImg = r.result && outputImageMap[r.result]
            ? `/images/elyxir/outputs/${outputImageMap[r.result]}`
            : '';
        return {
            ...r,
            cardImgUrl: outputImg,
            name: r.name,
            description: `${Math.round(r.successRate * 100)}% success`,
            setSelectedRecipeIdx,
            idx,
            isSelected: selectedRecipeIdx === idx,
            burnedQuantity: 0,
            totalQuantityQNT: 1,
            quantityQNT: 1,
            asset: undefined,
            rarity: 'Recipe',
            tools: r.tools,
            ingredients: r.ingredients.map(i => ({
                ...i,
                image: imageFor(i.name, 'ingredients'),
            })),
            flasks: [],
            outputImg,
        };
    });

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
                                    <Image src={recipeCards[selectedRecipeIdx]?.outputImg || ''} alt={r.name} boxSize="90px" rounded="lg" shadow="md" />
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