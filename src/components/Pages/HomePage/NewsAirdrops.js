import { 
    Box, 
    Heading, 
    Text, 
    VStack, 
    HStack, 
    Button, 
    Badge, 
    Image, 
    Grid, 
    GridItem, 
    Select, 
    Stack,
    Divider,
    Checkbox,
    useColorModeValue
} from '@chakra-ui/react';
import { useState, useMemo, useEffect, useCallback } from 'react';

const NewsAirdrops = () => {
    const [typeFilter, setTypeFilter] = useState('all');
    const [chainFilter, setChainFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [claimFilter, setClaimFilter] = useState('all');
    const [claimedAirdrops, setClaimedAirdrops] = useState(new Set());

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // Load claimed airdrops from localStorage on component mount
    useEffect(() => {
        const savedClaimed = localStorage.getItem('claimedAirdrops');
        if (savedClaimed) {
            try {
                const claimedArray = JSON.parse(savedClaimed);
                setClaimedAirdrops(new Set(claimedArray));
            } catch (error) {
                console.error('Error loading claimed airdrops:', error);
            }
        }
    }, []);

    // Save claimed airdrops to localStorage whenever the set changes
    useEffect(() => {
        localStorage.setItem('claimedAirdrops', JSON.stringify([...claimedAirdrops]));
    }, [claimedAirdrops]);

    // Toggle claimed status for an airdrop
    const toggleClaimed = useCallback((airdropId) => {
        setClaimedAirdrops(prev => {
            const newSet = new Set(prev);
            if (newSet.has(airdropId)) {
                newSet.delete(airdropId);
            } else {
                newSet.add(airdropId);
            }
            return newSet;
        });
    }, []);

    // Real airdrops data using actual Ardor asset IDs
    const airdrops = useMemo(() => [
        // INGREDIENTS (using real Ardor asset IDs)
        { id: '7536385584787697086', name: 'Araucarian Resine', type: 'ingredient', chain: 'Ardor', active: true, description: 'Araucarian Resine is being airdropped weekly to the holders of the Caaporá card', image: '/images/elyxir/ingredients/araucarianresine.png', requirement: 'Hold Caaporá card', method: 'Weekly automatic distribution' },
        { id: '2795734210888256790', name: 'Fetid Waters', type: 'ingredient', chain: 'Ardor', active: true, description: 'Complete swamp exploration quests to earn this rare ingredient', image: '/images/elyxir/ingredients/aguas_fetidas.png', requirement: 'Complete swamp quests', method: 'Quest rewards' },
        { id: '1853993309806999896', name: 'Bat Wing', type: 'ingredient', chain: 'Ardor', active: true, description: 'Participate in nighttime events to collect bat wings', image: '/images/elyxir/ingredients/alamorcego.png', requirement: 'Join night events', method: 'Event participation' },
        { id: '10089652431946070133', name: 'Crystalline Water', type: 'ingredient', chain: 'Ardor', active: false, description: 'Seasonal airdrop for early adopters of the platform', image: '/images/elyxir/ingredients/watercristaline.png', requirement: 'Early adopter badge', method: 'Seasonal distribution' },
        { id: '10982823421829006444', name: 'Horn Dust', type: 'ingredient', chain: 'Ardor', active: true, description: 'Defeat legendary creatures to obtain their horn dust', image: '/images/elyxir/ingredients/horndust.png', requirement: 'Defeat legendary creatures', method: 'Battle rewards' },
        { id: '11508698419506139756', name: 'Feather', type: 'ingredient', chain: 'Ardor', active: true, description: 'Daily login rewards include rare feathers', image: '/images/elyxir/ingredients/pluma.png', requirement: 'Daily login streak', method: 'Login rewards' },
        { id: '15230533556325993984', name: 'Vampire Fang', type: 'ingredient', chain: 'Ardor', active: true, description: 'Halloween special airdrop for vampire hunters', image: '/images/elyxir/ingredients/colmillo_de_vampiro.png', requirement: 'Halloween event', method: 'Seasonal event' },
        { id: '1734749669966442838', name: 'Wolf Fang', type: 'ingredient', chain: 'Ardor', active: false, description: 'Winter solstice airdrop for pack members', image: '/images/elyxir/ingredients/colmillo_de_lobo.png', requirement: 'Pack membership', method: 'Solstice distribution' },
        { id: '3607141736374727634', name: 'Lightning Essence', type: 'ingredient', chain: 'Ardor', active: true, description: 'Capture lightning during thunderstorms', image: '/images/elyxir/ingredients/lightninggg.png', requirement: 'Storm events', method: 'Weather-based' },
        { id: '11436325470737709655', name: 'Desert Sand', type: 'ingredient', chain: 'Ardor', active: true, description: 'Explore the mystical desert regions', image: '/images/elyxir/ingredients/arena_del_desierto.png', requirement: 'Desert exploration', method: 'Location rewards' },
        { id: '6043065774866721090', name: 'Blood', type: 'ingredient', chain: 'Ardor', active: true, description: 'Ritual participation grants sacred blood', image: '/images/elyxir/ingredients/blood.png', requirement: 'Ritual participation', method: 'Ceremonial rewards' },
        { id: '15102806604556354632', name: 'Bone Powder', type: 'ingredient', chain: 'Ardor', active: false, description: 'Graveyard expeditions yield bone powder', image: '/images/elyxir/ingredients/bonepowder.png', requirement: 'Graveyard exploration', method: 'Expedition rewards' },
        { id: '1571336020100556625', name: 'Cloud Essence', type: 'ingredient', chain: 'Ardor', active: true, description: 'Sky realm access grants cloud essence', image: '/images/elyxir/ingredients/cloud.png', requirement: 'Sky realm access', method: 'Realm exploration' },
        { id: '8717959006135737805', name: 'Sunlight Essence', type: 'ingredient', chain: 'Ardor', active: true, description: 'Dawn ceremony participants receive sunlight', image: '/images/elyxir/ingredients/sunlight.png', requirement: 'Dawn ceremony', method: 'Ceremonial rewards' },
        { id: '5570219882495290440', name: 'Raw Diamond', type: 'ingredient', chain: 'Ardor', active: false, description: 'Mine deep caverns for precious diamonds', image: '/images/elyxir/ingredients/diamantebruto.png', requirement: 'Deep mining', method: 'Mining rewards' },

        // TOOLS (using real Ardor asset IDs)
        { id: '7394449015011337044', name: 'Mystical Bellows', type: 'tool', chain: 'Ardor', active: true, description: 'Master crafters receive enchanted bellows', image: '/images/elyxir/tools/bellow.png', requirement: 'Master crafter rank', method: 'Rank achievement' },
        { id: '1310229991284473521', name: 'Ancient Cauldron', type: 'tool', chain: 'Ardor', active: true, description: 'Guild leaders are granted ancient cauldrons', image: '/images/elyxir/tools/cauldron.png', requirement: 'Guild leadership', method: 'Leadership rewards' },
        { id: '11845481467736877036', name: 'Silver Ladle', type: 'tool', chain: 'Ardor', active: false, description: 'Alchemist apprentices receive silver ladles', image: '/images/elyxir/tools/ladle.png', requirement: 'Apprentice completion', method: 'Training rewards' },
        { id: '4548364139683061814', name: 'Stone Mortar', type: 'tool', chain: 'Ardor', active: true, description: 'Herb gathering competitions award stone mortars', image: '/images/elyxir/tools/mortar.png', requirement: 'Herb competition', method: 'Competition prizes' },

        // FLASKS (using real Ardor asset IDs)
        { id: '4367881087678870632', name: 'Small Flask (1 portion)', type: 'flask', chain: 'Ardor', active: true, description: 'Participate in the Galxe awareness campaign to get airdropped flasks', image: '/images/elyxir/flasks/flask1.png', requirement: 'Galxe campaign', method: 'Social campaign' },
        { id: '3758988694981372970', name: 'Medium Flask (2 portions)', type: 'flask', chain: 'Ardor', active: true, description: 'Community voting participants receive medium flasks', image: '/images/elyxir/flasks/flask2.png', requirement: 'Community voting', method: 'Governance participation' },
        { id: '13463846530496348131', name: 'Large Flask (3 portions)', type: 'flask', chain: 'Ardor', active: false, description: 'Beta testers are rewarded with large flasks', image: '/images/elyxir/flasks/flask3.png', requirement: 'Beta testing', method: 'Testing rewards' },
        { id: '2440735248419077208', name: 'Extra Large Flask (4 portions)', type: 'flask', chain: 'Ardor', active: true, description: 'Tournament winners receive extra large flasks', image: '/images/elyxir/flasks/flask4.png', requirement: 'Tournament victory', method: 'Competition rewards' },
        { id: '14654561631655838842', name: 'Giant Flask (5 portions)', type: 'flask', chain: 'Ardor', active: false, description: 'Legendary achievers get giant flasks', image: '/images/elyxir/flasks/flask5.png', requirement: 'Legendary achievement', method: 'Achievement rewards' },

        // RECIPES (using real Ardor asset IDs)
        { id: '12936439663349626618', name: 'Recipe of the Shifting Dunes Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Desert expedition leaders discover shifting dunes recipes', image: '/images/elyxir/recipes/recipe1.png', requirement: 'Desert expedition', method: 'Discovery rewards' },
        { id: '7024690161218732154', name: 'Recipe of the Coral Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Publish mythical content on IG and claim your coral potion recipe', image: '/images/elyxir/recipes/recipe2.png', requirement: 'Instagram content', method: 'Social media campaign' },
        { id: '2440735248419077208', name: 'Recipe of the Stoneblood Potion', type: 'recipe', chain: 'Ardor', active: false, description: 'Mountain climbers uncover stoneblood recipes', image: '/images/elyxir/recipes/recipe1.png', requirement: 'Mountain climbing', method: 'Exploration rewards' },
        { id: '5570219882495290440', name: 'Recipe of the Tideheart Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Ocean explorers find tideheart recipes', image: '/images/elyxir/recipes/recipe2.png', requirement: 'Ocean exploration', method: 'Maritime discovery' },
        { id: '14654561631655838842', name: 'Recipe of the Whispering Gale Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Wind walkers receive whispering gale recipes', image: '/images/elyxir/recipes/recipe1.png', requirement: 'Wind walking', method: 'Elemental mastery' },
        { id: '1310229991284473521', name: 'Recipe of the Eternal Silk Potion', type: 'recipe', chain: 'Ardor', active: false, description: 'Silk weavers craft eternal silk recipes', image: '/images/elyxir/recipes/recipe2.png', requirement: 'Silk weaving', method: 'Craft mastery' },
        { id: '4548364139683061814', name: 'Recipe of the Feathered Flame Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Fire dancers master feathered flame recipes', image: '/images/elyxir/recipes/recipe1.png', requirement: 'Fire dancing', method: 'Dance mastery' },
        { id: '7394449015011337044', name: 'Recipe of the Forgotten Grove Potion', type: 'recipe', chain: 'Ardor', active: true, description: 'Grove keepers protect forgotten recipes', image: '/images/elyxir/recipes/recipe2.png', requirement: 'Grove keeping', method: 'Guardian rewards' }
    ], []);

    const filteredAirdrops = useMemo(() => {
        return airdrops.filter(airdrop => {
            const typeMatch = typeFilter === 'all' || airdrop.type === typeFilter;
            const chainMatch = chainFilter === 'all' || airdrop.chain === chainFilter;
            const statusMatch = statusFilter === 'all' || 
                (statusFilter === 'active' && airdrop.active) || 
                (statusFilter === 'inactive' && !airdrop.active);
            const claimMatch = claimFilter === 'all' ||
                (claimFilter === 'claimed' && claimedAirdrops.has(airdrop.id)) ||
                (claimFilter === 'unclaimed' && !claimedAirdrops.has(airdrop.id));
            
            return typeMatch && chainMatch && statusMatch && claimMatch;
        });
    }, [airdrops, typeFilter, chainFilter, statusFilter, claimFilter, claimedAirdrops]);

    const getChainColor = (chain) => {
        return chain === 'Ardor' ? 'purple' : 'blue';
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'ingredient': return 'green';
            case 'tool': return 'orange';
            case 'flask': return 'cyan';
            case 'recipe': return 'pink';
            default: return 'gray';
        }
    };

    return (
        <Box p={6}>
            <VStack spacing={6} align="stretch">


                {/* Filters */}
                <Box bg={bgColor} p={3} borderRadius="md" border="1px" borderColor={borderColor}>
                    <Text fontWeight="bold" mb={2} fontSize="sm" color="white">Filter Airdrops</Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                        <Box minW="120px">
                            <Text fontSize="xs" mb={1} color="gray.300">Type</Text>
                            <Select 
                                size="sm"
                                value={typeFilter} 
                                onChange={(e) => setTypeFilter(e.target.value)}
                                bg="gray.700"
                                color="white"
                                borderColor="gray.600"
                            >
                                <option value="all">All Types</option>
                                <option value="ingredient">Ingredients</option>
                                <option value="tool">Tools</option>
                                <option value="flask">Flasks</option>
                                <option value="recipe">Recipes</option>
                            </Select>
                        </Box>
                        <Box minW="120px">
                            <Text fontSize="xs" mb={1} color="gray.300">Chain</Text>
                            <Select 
                                size="sm"
                                value={chainFilter} 
                                onChange={(e) => setChainFilter(e.target.value)}
                                bg="gray.700"
                                color="white"
                                borderColor="gray.600"
                            >
                                <option value="all">All Chains</option>
                                <option value="Ardor">Ardor</option>
                                <option value="Polygon">Polygon</option>
                            </Select>
                        </Box>
                        <Box minW="120px">
                            <Text fontSize="xs" mb={1} color="gray.300">Status</Text>
                            <Select 
                                size="sm"
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                bg="gray.700"
                                color="white"
                                borderColor="gray.600"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select>
                        </Box>
                        <Box minW="120px">
                            <Text fontSize="xs" mb={1} color="gray.300">Claimed</Text>
                            <Select 
                                size="sm"
                                value={claimFilter} 
                                onChange={(e) => setClaimFilter(e.target.value)}
                                bg="gray.700"
                                color="white"
                                borderColor="gray.600"
                            >
                                <option value="all">All</option>
                                <option value="claimed">Claimed</option>
                                <option value="unclaimed">Unclaimed</option>
                            </Select>
                        </Box>
                    </Stack>
                </Box>

                {/* Results count */}
                <Text color="gray.400" fontSize="sm">
                    Showing {filteredAirdrops.length} of {airdrops.length} airdrops
                </Text>

                {/* Airdrops Grid */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    {filteredAirdrops.map((airdrop) => (
                        <GridItem key={airdrop.id}>
                            <Box 
                                bg={bgColor} 
                                p={5} 
                                borderRadius="lg" 
                                border="1px" 
                                borderColor={borderColor}
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                            >
                                <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between" align="start">
                                        <Image 
                                            src={airdrop.image} 
                                            alt={airdrop.name}
                                            boxSize="50px"
                                            objectFit="contain"
                                            fallbackSrc="/images/icons/placeholder.png"
                                        />
                                        <VStack spacing={1} align="end">
                                            <Badge colorScheme={getChainColor(airdrop.chain)} size="sm">
                                                {airdrop.chain}
                                            </Badge>
                                            <Badge 
                                                colorScheme={airdrop.active ? 'green' : 'red'} 
                                                size="sm"
                                            >
                                                {airdrop.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </VStack>
                                    </HStack>

                                    <HStack justify="space-between" align="center">
                                        <VStack spacing={1} align="start" flex="1">
                                            <Badge colorScheme={getTypeColor(airdrop.type)} size="sm">
                                                {airdrop.type.charAt(0).toUpperCase() + airdrop.type.slice(1)}
                                            </Badge>
                                        </VStack>
                                        <Checkbox
                                            isChecked={claimedAirdrops.has(airdrop.id)}
                                            onChange={() => toggleClaimed(airdrop.id)}
                                            colorScheme="teal"
                                            size="md"
                                        >
                                            <Text fontSize="xs" color="gray.400" ml={1}>
                                                Claimed
                                            </Text>
                                        </Checkbox>
                                    </HStack>
                                        
                                    <VStack spacing={2} align="stretch">
                                        <Heading size="sm" color="white" noOfLines={2}>
                                            {airdrop.name}
                                        </Heading>
                                        
                                        <Text fontSize="sm" color="gray.300" noOfLines={3}>
                                            {airdrop.description}
                                        </Text>
                                    </VStack>

                                    <Divider />

                                    <VStack spacing={2} align="stretch" fontSize="xs">
                                        <HStack justify="space-between">
                                            <Text color="gray.400">Requirement:</Text>
                                            <Text color="gray.200" textAlign="right">{airdrop.requirement}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text color="gray.400">Method:</Text>
                                            <Text color="gray.200" textAlign="right">{airdrop.method}</Text>
                                        </HStack>
                                    </VStack>

                                    {airdrop.active && (
                                        <Button 
                                            size="sm" 
                                            colorScheme="teal" 
                                            variant="outline"
                                            _hover={{ bg: 'teal.500', color: 'white' }}
                                        >
                                            Learn More
                                        </Button>
                                    )}
                                </VStack>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>

                {filteredAirdrops.length === 0 && (
                    <Box textAlign="center" py={8}>
                        <Text color="gray.400">No airdrops match your current filters.</Text>
                        <Button 
                            mt={4} 
                            variant="outline" 
                            colorScheme="teal"
                            onClick={() => {
                                setTypeFilter('all');
                                setChainFilter('all');
                                setStatusFilter('all');
                                setClaimFilter('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default NewsAirdrops;
