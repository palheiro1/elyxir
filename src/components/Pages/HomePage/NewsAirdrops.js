import {
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    SimpleGrid,
    Stack,
    Stat,
    StatLabel,
    StatNumber,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableContainer,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiArchive, FiBox, FiClock, FiSearch, FiShoppingBag, FiTool } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { IMGURL, IMG_THUMB_PATH } from '../../../data/CONSTANTS';
import monsters from '../../../data/monsters.json';

const WALLET_SECTIONS = {
    inventory: 1,
    market: 3,
    alchemy: 10,
};

const RARITY_RULES = [
    { rarity: 'COMMON', ratio: 10, colorScheme: 'gray', label: '1 ingredient per 10 cards' },
    { rarity: 'RARE', ratio: 5, colorScheme: 'blue', label: '1 ingredient per 5 cards' },
    { rarity: 'EPIC', ratio: 2, colorScheme: 'orange', label: '1 ingredient per 2 cards' },
    { rarity: 'SPECIAL', ratio: 1, colorScheme: 'green', label: '1 ingredient per 1 card' },
];

const CATEGORY_GUIDES = [
    {
        key: 'ingredients',
        title: 'Ingredients',
        status: 'Incubation + Market',
        colorScheme: 'green',
        image: '/images/elyxir/ingredients/araucariar.png',
        body: 'Stake eligible cards in Wallet Inventory. After one 5 040-block cycle, harvest cards plus ingredient yield.',
        action: 'Open Inventory',
        section: WALLET_SECTIONS.inventory,
    },
    {
        key: 'flasks',
        title: 'Flasks',
        status: 'Bounty + Collection + Market',
        colorScheme: 'cyan',
        image: '/images/elyxir/flasks/conicalfl.png',
        body: 'Bounty grants the Canonical Flask. Full card collection prizes grant larger flasks from the wallet claim flow.',
        action: 'Open Inventory',
        section: WALLET_SECTIONS.inventory,
    },
    {
        key: 'tools',
        title: 'Tools',
        status: 'Rotating campaigns + Market',
        colorScheme: 'orange',
        image: '/images/elyxir/tools/cauldron.png',
        body: 'Social task campaigns change over time. Campaign rewards are announced periodically and tools can trade on Market.',
        action: 'Open Market',
        section: WALLET_SECTIONS.market,
    },
    {
        key: 'recipes',
        title: 'Recipes',
        status: 'Giftz + Market',
        colorScheme: 'pink',
        image: '/images/elyxir/recipes/recipe1.png',
        body: 'Recipes are random rewards from opening Giftz packs. They are not directly airdropped.',
        action: 'Open Inventory',
        section: WALLET_SECTIONS.inventory,
    },
    {
        key: 'potions',
        title: 'Potions',
        status: 'Alchemy + Market',
        colorScheme: 'purple',
        image: '/images/elyxir/outputs/PotionCoral.png',
        body: 'Potions are never airdropped. Craft them in Elyxir Alchemy or buy them from Market.',
        action: 'Open Alchemy',
        section: WALLET_SECTIONS.alchemy,
        targetTab: '[data-elyxir-tab="workshop"]',
    },
];

const FLASK_SOURCES = [
    {
        title: 'Canonical Flask',
        subtitle: '1 potion capacity',
        source: 'Bounty prize',
        route: 'Wallet / Airdrops / Bounty',
        image: '/images/elyxir/flasks/conicalfl.png',
    },
    {
        title: 'Full collection prizes',
        subtitle: 'Set of larger flasks',
        source: 'Claim full collection prizes',
        route: 'Wallet / Inventory',
        image: '/images/elyxir/flasks/roundbtmf.png',
    },
    {
        title: 'Market',
        subtitle: 'Buy or sell flasks',
        source: 'Player-to-player market',
        route: 'Wallet / Market',
        image: '/images/elyxir/flasks/kjeldahlf.png',
    },
];

const TOOL_EXAMPLES = [
    { name: 'Bellows', image: '/images/elyxir/tools/bellow.png' },
    { name: 'Cauldron', image: '/images/elyxir/tools/cauldron.png' },
    { name: 'Ladle', image: '/images/elyxir/tools/ladle.png' },
    { name: 'Mortar', image: '/images/elyxir/tools/mortar.png' },
];

const RECIPE_OPTIONS = [
    {
        title: 'Open Giftz',
        body: 'Giftz packs can drop a random recipe when opened.',
        route: 'Wallet / Inventory / Giftz',
        image: '/images/currency/giftz.png',
    },
    {
        title: 'Market',
        body: 'Recipes can be bought or sold like other Elyxir items.',
        route: 'Wallet / Market',
        image: '/images/elyxir/recipes/recipe2.png',
    },
];

const POTION_OPTIONS = [
    {
        title: 'Craft in Alchemy',
        body: 'Use recipe, ingredients, tools, flasks and GEM in Play Hub / Elyxir.',
        route: 'Play Hub / Elyxir / Alchemy',
        image: '/images/elyxir/outputs/PotionTideheart.png',
    },
    {
        title: 'Market',
        body: 'Potions can be traded after crafting.',
        route: 'Wallet / Market',
        image: '/images/elyxir/outputs/PotionoftheFeatheredFlame.png',
    },
];

const RECIPES = [
    {
        name: 'Whispering Gale',
        ingredients: [
            '13321324699537252353',
            '9093191442487829960',
            '11386383170019744285',
            '9627155908350599600',
        ],
    },
    {
        name: 'Tideheart',
        ingredients: [
            '7464041035414516620',
            '15521713672709080827',
            '2380273644117095987',
            '2820535047226119418',
            '15080124236445648438',
        ],
    },
    {
        name: 'Stoneblood',
        ingredients: [
            '12308228721908498397',
            '12210617625866540653',
            '9422436625653721006',
            '7879802689430656608',
            '14451010716011965584',
        ],
    },
    {
        name: 'Eternal Silk',
        ingredients: ['12308228721908498397', '9422436625653721006', '17969181894960429964', '9859593227468066316'],
    },
    {
        name: 'Coral',
        ingredients: ['16876168465973703622', '18140737140039335538', '9289482442465517140', '955451625820789680'],
    },
    {
        name: 'Feathered Flame',
        ingredients: ['13321324699537252353', '11386383170019744285', '9289482442465517140', '7081966488954575750'],
    },
    {
        name: 'Shifting Dunes',
        ingredients: ['16876168465973703622', '3042874600616626102', '7384993574556043649'],
    },
    {
        name: 'Forgotten Grove',
        ingredients: ['16876168465973703622', '10290172289119183466', '1748542894784204097', '7563318252261495089'],
    },
];

const INCUBATION_MAPPINGS = [
    {
        cardName: '/Kaggen',
        cardId: '8825927167203958938',
        minCards: 10,
        ingredientName: 'Garden flower',
        ingredientId: '7879802689430656608',
        ingredientImage: '/images/elyxir/ingredients/gardeflow.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Adaro',
        cardId: '18101012326255288772',
        minCards: 10,
        ingredientName: 'Rainbow shred',
        ingredientId: '18140737140039335538',
        ingredientImage: '/images/elyxir/ingredients/rainbowshd.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Caaporá',
        cardId: '8717959006135737805',
        minCards: 10,
        ingredientName: 'Araucaria resin',
        ingredientId: '7081966488954575750',
        ingredientImage: '/images/elyxir/ingredients/araucariar.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Catoblepas',
        cardId: '15284691712437925618',
        minCards: 10,
        ingredientName: 'Poison herb',
        ingredientId: '15080124236445648438',
        ingredientImage: '/images/elyxir/ingredients/poisonherb.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Dhampir',
        cardId: '609721796834652174',
        minCards: 10,
        ingredientName: 'Vampire fang',
        ingredientId: '14451010716011965584',
        ingredientImage: '/images/elyxir/ingredients/vampirefng.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Droemerdene',
        cardId: '10444425886085847503',
        minCards: 10,
        ingredientName: 'Kangaroo hair',
        ingredientId: '1748542894784204097',
        ingredientImage: '/images/elyxir/ingredients/kangaroohr.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Dudugera',
        cardId: '12936439663349626618',
        minCards: 5,
        ingredientName: 'Cloud',
        ingredientId: '15521713672709080827',
        ingredientImage: '/images/elyxir/ingredients/cloud.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Dybbuk',
        cardId: '9118586585609900793',
        minCards: 2,
        ingredientName: 'Holy water',
        ingredientId: '12308228721908498397',
        ingredientImage: '/images/elyxir/ingredients/holiwater.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Grootslang',
        cardId: '14906207210027210012',
        minCards: 1,
        ingredientName: 'Diamond',
        ingredientId: '7384993574556043649',
        ingredientImage: '/images/elyxir/ingredients/diamond.png',
        rarity: 'SPECIAL',
    },
    {
        cardName: 'Haechi',
        cardId: '11654119158397769364',
        minCards: 5,
        ingredientName: 'Ash',
        ingredientId: '12210617625866540653',
        ingredientImage: '/images/elyxir/ingredients/ash.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Karkadann',
        cardId: '7536385584787697086',
        minCards: 10,
        ingredientName: 'Horn dust',
        ingredientId: '9093191442487829960',
        ingredientImage: '/images/elyxir/ingredients/horndust.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Kel Essuf',
        cardId: '12313032092046113556',
        minCards: 10,
        ingredientName: 'Desert sand',
        ingredientId: '3042874600616626102',
        ingredientImage: '/images/elyxir/ingredients/desentsand.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Macihuatli',
        cardId: '6086151229884242778',
        minCards: 10,
        ingredientName: 'Mustard seeds',
        ingredientId: '2820535047226119418',
        ingredientImage: '/images/elyxir/ingredients/mustardsd.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Nei Tituaabine',
        cardId: '10917692030112170713',
        minCards: 10,
        ingredientName: 'Lightning',
        ingredientId: '9289482442465517140',
        ingredientImage: '/images/elyxir/ingredients/lightning.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Ninki Nanka',
        cardId: '1328293559375692481',
        minCards: 2,
        ingredientName: 'Fetid water',
        ingredientId: '7464041035414516620',
        ingredientImage: '/images/elyxir/ingredients/fetidwater.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Pele',
        cardId: '15778342868690621160',
        minCards: 2,
        ingredientName: 'Lava',
        ingredientId: '955451625820789680',
        ingredientImage: '/images/elyxir/ingredients/lava.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Pua Tu Tahi',
        cardId: '2795734210888256790',
        minCards: 10,
        ingredientName: 'Sea water',
        ingredientId: '16876168465973703622',
        ingredientImage: '/images/elyxir/ingredients/seawater.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Rahu',
        cardId: '9451976923053037726',
        minCards: 10,
        ingredientName: "Rahu's saliva",
        ingredientId: '17969181894960429964',
        ingredientImage: '/images/elyxir/ingredients/rahussaliv.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Rompo',
        cardId: '374078224198142471',
        minCards: 10,
        ingredientName: 'Bone powder',
        ingredientId: '10290172289119183466',
        ingredientImage: '/images/elyxir/ingredients/bonepowder.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Sasquatch',
        cardId: '8504616031553931056',
        minCards: 1,
        ingredientName: 'Bigfoot hair',
        ingredientId: '2380273644117095987',
        ingredientImage: '/images/elyxir/ingredients/bigfoothr.png',
        rarity: 'SPECIAL',
    },
    {
        cardName: 'Şahmaran',
        cardId: '1770779863759720918',
        minCards: 5,
        ingredientName: 'Garden soil',
        ingredientId: '9422436625653721006',
        ingredientImage: '/images/elyxir/ingredients/gardensoil.png',
        rarity: 'RARE',
    },
    {
        cardName: 'Tsenahale',
        cardId: '3758988694981372970',
        minCards: 2,
        ingredientName: 'Feather',
        ingredientId: '11386383170019744285',
        ingredientImage: '/images/elyxir/ingredients/feather.png',
        rarity: 'EPIC',
    },
    {
        cardName: 'Tupilaq',
        cardId: '488367278629756964',
        minCards: 10,
        ingredientName: 'Skin',
        ingredientId: '9627155908350599600',
        ingredientImage: '/images/elyxir/ingredients/skin.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Werewolf',
        cardId: '13430257599807483745',
        minCards: 10,
        ingredientName: 'Wolf fang',
        ingredientId: '7563318252261495089',
        ingredientImage: '/images/elyxir/ingredients/wolffang.png',
        rarity: 'COMMON',
    },
    {
        cardName: 'Yeti',
        cardId: '7891814295348826088',
        minCards: 10,
        ingredientName: 'Himalayan snow',
        ingredientId: '9859593227468066316',
        ingredientImage: '/images/elyxir/ingredients/himalayasn.png',
        rarity: 'COMMON',
    },
];

const getCardImage = cardName => {
    const monster = monsters.find(item => item.name === cardName);
    return monster?.assetname ? `${IMGURL}${IMG_THUMB_PATH}${monster.assetname}.jpg` : '/images/cards/card.png';
};

const getRarityColor = rarity => RARITY_RULES.find(item => item.rarity === rarity)?.colorScheme || 'gray';

const getRouteButtonIcon = section => {
    if (section === WALLET_SECTIONS.market) return <FiShoppingBag />;
    if (section === WALLET_SECTIONS.alchemy) return <FiArchive />;
    return <FiBox />;
};

const NewsAirdrops = ({ goToSection }) => {
    const [search, setSearch] = useState('');
    const [rarityFilter, setRarityFilter] = useState('all');
    const [recipeFilter, setRecipeFilter] = useState('all');
    const { items = [] } = useSelector(state => state.items);

    const surface = useColorModeValue('white', '#151A1E');
    const subtleSurface = useColorModeValue('gray.50', 'whiteAlpha.100');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

    const canNavigate = typeof goToSection === 'function';

    const ingredientCopiesByAsset = useMemo(
        () =>
            items.reduce((copiesByAsset, item) => {
                copiesByAsset[item.asset] = Number(item.quantityQNT) || 0;
                return copiesByAsset;
            }, {}),
        [items]
    );

    const navigateToSection = (section, targetTab) => {
        if (!canNavigate) return;
        goToSection(section);

        if (targetTab) {
            window.setTimeout(() => {
                const tab = document.querySelector(targetTab);
                if (tab) tab.click();
            }, 100);
        }
    };

    const filteredIncubation = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const selectedRecipe = RECIPES.find(recipe => recipe.name === recipeFilter);
        return INCUBATION_MAPPINGS.filter(item => {
            const matchesRarity = rarityFilter === 'all' || item.rarity === rarityFilter;
            const matchesRecipe = !selectedRecipe || selectedRecipe.ingredients.includes(item.ingredientId);
            const matchesSearch =
                !normalizedSearch ||
                item.cardName.toLowerCase().includes(normalizedSearch) ||
                item.ingredientName.toLowerCase().includes(normalizedSearch);

            return matchesRarity && matchesRecipe && matchesSearch;
        });
    }, [search, rarityFilter, recipeFilter]);

    return (
        <Box px={{ base: 2, lg: 4 }} py={3} color={textColor}>
            <VStack align="stretch" spacing={7}>
                <Flex
                    align={{ base: 'flex-start', lg: 'center' }}
                    justify="space-between"
                    direction={{ base: 'column', lg: 'row' }}
                    gap={4}>
                    <Box>
                        <HStack spacing={2} mb={2} wrap="wrap">
                            <Badge colorScheme="purple">Play Hub / Elyxir</Badge>
                            <Badge colorScheme="teal">Wallet actions</Badge>
                            <Badge colorScheme="gray">Ardor assets</Badge>
                        </HStack>
                        <Heading size={{ base: 'lg', md: 'xl' }}>Airdrops & acquisition paths</Heading>
                        <Text mt={2} maxW="860px" color={mutedTextColor}>
                            Elyxir runs inside the Play Hub, which lives in the wallet. Most rewards start from wallet
                            actions such as Inventory, Incubation, Bounty, Giftz opening and Market.
                        </Text>
                    </Box>

                    <HStack spacing={2}>
                        <Button
                            size="sm"
                            leftIcon={<FiBox />}
                            colorScheme="teal"
                            onClick={() => navigateToSection(WALLET_SECTIONS.inventory)}
                            isDisabled={!canNavigate}>
                            Inventory
                        </Button>
                        <Button
                            size="sm"
                            leftIcon={<FiShoppingBag />}
                            variant="outline"
                            colorScheme="pink"
                            onClick={() => navigateToSection(WALLET_SECTIONS.market)}
                            isDisabled={!canNavigate}>
                            Market
                        </Button>
                    </HStack>
                </Flex>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    <StatCard label="Incubation pairs" value={INCUBATION_MAPPINGS.length} surface={subtleSurface} />
                    <StatCard label="Cycle length" value="5 040" suffix="blocks" surface={subtleSurface} />
                    <StatCard label="Direct potion drops" value="0" surface={subtleSurface} />
                    <StatCard label="Tool campaigns" value="Rotating" surface={subtleSurface} />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} spacing={3}>
                    {CATEGORY_GUIDES.map(category => (
                        <Box
                            key={category.key}
                            bg={surface}
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                            p={4}>
                            <HStack align="flex-start" spacing={3}>
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    boxSize="46px"
                                    objectFit="contain"
                                    fallbackSrc="/images/icons/placeholder.png"
                                />
                                <Box minW={0}>
                                    <Heading size="sm" noOfLines={1}>
                                        {category.title}
                                    </Heading>
                                    <Badge mt={1} colorScheme={category.colorScheme}>
                                        {category.status}
                                    </Badge>
                                </Box>
                            </HStack>
                            <Text mt={3} minH={{ base: 'auto', xl: '88px' }} fontSize="sm" color={mutedTextColor}>
                                {category.body}
                            </Text>
                            <Button
                                mt={4}
                                size="sm"
                                width="100%"
                                variant="outline"
                                colorScheme={category.colorScheme}
                                leftIcon={getRouteButtonIcon(category.section)}
                                onClick={() => navigateToSection(category.section, category.targetTab)}
                                isDisabled={!canNavigate}>
                                {category.action}
                            </Button>
                        </Box>
                    ))}
                </SimpleGrid>

                <Tabs colorScheme="teal" variant="soft-rounded" isLazy>
                    <TabList overflowX="auto" pb={1}>
                        <Tab flexShrink={0}>Ingredients</Tab>
                        <Tab flexShrink={0}>Flasks</Tab>
                        <Tab flexShrink={0}>Tools</Tab>
                        <Tab flexShrink={0}>Recipes</Tab>
                        <Tab flexShrink={0}>Potions</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel px={0}>
                            <VStack align="stretch" spacing={5}>
                                <Box bg={subtleSurface} borderRadius="md" p={4}>
                                    <HStack spacing={2} mb={3}>
                                        <FiClock />
                                        <Heading size="md">Incubation</Heading>
                                    </HStack>
                                    <Text color={mutedTextColor}>
                                        Stake cards from Wallet / Inventory / Incubation for one cycle of 5 040 blocks.
                                        Harvest returns the staked cards plus ingredient yield. Yield equals staked
                                        quantity divided by the rarity ratio, and quantity must be a positive multiple
                                        of that ratio.
                                    </Text>
                                </Box>

                                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3}>
                                    {RARITY_RULES.map(rule => (
                                        <Box
                                            key={rule.rarity}
                                            bg={surface}
                                            border="1px"
                                            borderColor={borderColor}
                                            borderRadius="md"
                                            p={4}>
                                            <Badge colorScheme={rule.colorScheme}>{rule.rarity}</Badge>
                                            <Heading mt={2} size="md">
                                                {rule.ratio} cards
                                            </Heading>
                                            <Text mt={1} fontSize="sm" color={mutedTextColor}>
                                                {rule.label}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>

                                <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FiSearch />
                                        </InputLeftElement>
                                        <Input
                                            value={search}
                                            onChange={event => setSearch(event.target.value)}
                                            placeholder="Search card or ingredient"
                                            bg={surface}
                                            borderColor={borderColor}
                                        />
                                    </InputGroup>
                                    <Select
                                        maxW={{ base: '100%', md: '240px' }}
                                        value={recipeFilter}
                                        onChange={event => setRecipeFilter(event.target.value)}
                                        bg={surface}
                                        borderColor={borderColor}>
                                        <option value="all">All recipes</option>
                                        {RECIPES.map(recipe => (
                                            <option key={recipe.name} value={recipe.name}>
                                                {recipe.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        maxW={{ base: '100%', md: '220px' }}
                                        value={rarityFilter}
                                        onChange={event => setRarityFilter(event.target.value)}
                                        bg={surface}
                                        borderColor={borderColor}>
                                        <option value="all">All rarities</option>
                                        {RARITY_RULES.map(rule => (
                                            <option key={rule.rarity} value={rule.rarity}>
                                                {rule.rarity}
                                            </option>
                                        ))}
                                    </Select>
                                </Stack>

                                <TableContainer
                                    bg={surface}
                                    border="1px"
                                    borderColor={borderColor}
                                    borderRadius="md">
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Ingredient</Th>
                                                <Th>Card to incubate</Th>
                                                <Th>Card rarity</Th>
                                                <Th isNumeric>Owned</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredIncubation.map(item => (
                                                <Tr key={`${item.cardId}:${item.ingredientId}`}>
                                                    <Td>
                                                        <HStack spacing={3}>
                                                            <Image
                                                                src={item.ingredientImage}
                                                                alt={item.ingredientName}
                                                                boxSize="36px"
                                                                objectFit="contain"
                                                                fallbackSrc="/images/icons/placeholder.png"
                                                            />
                                                            <Text>{item.ingredientName}</Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td>
                                                        <HStack spacing={3}>
                                                            <Image
                                                                src={getCardImage(item.cardName)}
                                                                alt={item.cardName}
                                                                boxSize="42px"
                                                                objectFit="cover"
                                                                borderRadius="md"
                                                                fallbackSrc="/images/cards/card.png"
                                                            />
                                                            <Box>
                                                                <Text fontWeight="semibold">{item.cardName}</Text>
                                                            </Box>
                                                        </HStack>
                                                    </Td>
                                                    <Td>
                                                        <Badge colorScheme={getRarityColor(item.rarity)}>
                                                            {item.rarity}
                                                        </Badge>
                                                    </Td>
                                                    <Td isNumeric>
                                                        <Badge
                                                            colorScheme={
                                                                ingredientCopiesByAsset[item.ingredientId] ? 'green' : 'gray'
                                                            }>
                                                            {ingredientCopiesByAsset[item.ingredientId] || 0}
                                                        </Badge>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </VStack>
                        </TabPanel>

                        <TabPanel px={0}>
                            <SourceGrid
                                items={FLASK_SOURCES}
                                surface={surface}
                                borderColor={borderColor}
                                mutedTextColor={mutedTextColor}
                            />
                            <Text mt={4} color={mutedTextColor}>
                                Special cards are not included in the full collection prize requirement.
                            </Text>
                        </TabPanel>

                        <TabPanel px={0}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <Box bg={surface} border="1px" borderColor={borderColor} borderRadius="md" p={5}>
                                    <HStack mb={3}>
                                        <FiTool />
                                        <Heading size="md">Rotating social tasks</Heading>
                                    </HStack>
                                    <Text color={mutedTextColor}>
                                        Tools are distributed through occasional campaigns with changing tasks, formats
                                        and reward rules. The current campaign details should be taken from the active
                                        wallet or social announcement.
                                    </Text>
                                    <SimpleGrid mt={5} columns={4} spacing={3}>
                                        {TOOL_EXAMPLES.map(tool => (
                                            <VStack key={tool.name} spacing={2}>
                                                <Image src={tool.image} alt={tool.name} boxSize="56px" objectFit="contain" />
                                                <Text fontSize="xs" textAlign="center" color={mutedTextColor}>
                                                    {tool.name}
                                                </Text>
                                            </VStack>
                                        ))}
                                    </SimpleGrid>
                                </Box>
                                <Box bg={surface} border="1px" borderColor={borderColor} borderRadius="md" p={5}>
                                    <HStack mb={3}>
                                        <FiShoppingBag />
                                        <Heading size="md">Market</Heading>
                                    </HStack>
                                    <Text color={mutedTextColor}>
                                        Tools can also be acquired from other users in Market, independent of whether a
                                        social campaign is currently active.
                                    </Text>
                                    <Button
                                        mt={5}
                                        size="sm"
                                        colorScheme="pink"
                                        leftIcon={<FiShoppingBag />}
                                        onClick={() => navigateToSection(WALLET_SECTIONS.market)}
                                        isDisabled={!canNavigate}>
                                        Open Market
                                    </Button>
                                </Box>
                            </SimpleGrid>
                        </TabPanel>

                        <TabPanel px={0}>
                            <SourceGrid
                                items={RECIPE_OPTIONS}
                                surface={surface}
                                borderColor={borderColor}
                                mutedTextColor={mutedTextColor}
                            />
                        </TabPanel>

                        <TabPanel px={0}>
                            <Box bg={subtleSurface} borderRadius="md" p={4} mb={4}>
                                <Badge colorScheme="purple" mb={2}>
                                    Not airdropped
                                </Badge>
                                <Text color={mutedTextColor}>
                                    Potions only enter circulation through Alchemy crafting or Market trades.
                                </Text>
                            </Box>
                            <SourceGrid
                                items={POTION_OPTIONS}
                                surface={surface}
                                borderColor={borderColor}
                                mutedTextColor={mutedTextColor}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Box>
    );
};

const StatCard = ({ label, value, suffix, surface }) => (
    <Stat bg={surface} borderRadius="md" px={4} py={3}>
        <StatLabel color="gray.400">{label}</StatLabel>
        <HStack align="baseline" spacing={2}>
            <StatNumber fontSize={{ base: 'xl', md: '2xl' }}>{value}</StatNumber>
            {suffix && (
                <Text fontSize="sm" color="gray.400">
                    {suffix}
                </Text>
            )}
        </HStack>
    </Stat>
);

const SourceGrid = ({ items, surface, borderColor, mutedTextColor }) => (
    <SimpleGrid columns={{ base: 1, md: items.length > 2 ? 3 : 2 }} spacing={4}>
        {items.map(item => (
            <Box key={item.title} bg={surface} border="1px" borderColor={borderColor} borderRadius="md" p={5}>
                <HStack align="flex-start" spacing={4}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        boxSize="64px"
                        objectFit="contain"
                        fallbackSrc="/images/icons/placeholder.png"
                    />
                    <Box minW={0}>
                        <Heading size="sm">{item.title}</Heading>
                        <Text fontSize="sm" color={mutedTextColor}>
                            {item.subtitle || item.body}
                        </Text>
                    </Box>
                </HStack>
                <Divider my={4} />
                <Stack spacing={1}>
                    {item.source && (
                        <Text fontSize="sm" color={mutedTextColor}>
                            Source: {item.source}
                        </Text>
                    )}
                    <Text fontSize="sm" color={mutedTextColor}>
                        Location: {item.route}
                    </Text>
                </Stack>
            </Box>
        ))}
    </SimpleGrid>
);

export default NewsAirdrops;
