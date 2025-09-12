import { 
    Box, 
    Center, 
    Heading, 
    Stack, 
    Text, 
    useColorModeValue, 
    SimpleGrid, 
    Stat, 
    StatLabel, 
    StatNumber, 
    StatHelpText,
    Badge,
    VStack,
    HStack,
    Icon,
    Progress,
    Flex,
    Spacer,
    Image,
    Divider,
    Avatar,
    AvatarGroup
} from '@chakra-ui/react';
import { ACTUAL_SEASON, IS_BOUNTY_ENABLED } from '../../../data/CONSTANTS';
import { FaFlask, FaFire, FaLeaf, FaGem, FaClock, FaUsers, FaCoins, FaTrophy } from 'react-icons/fa';
import { GiCauldron, GiMagicPotion, GiScrollQuill, GiCrystalBall, GiMagicSwirl } from 'react-icons/gi';

const Overview = () => {
    const textColor = useColorModeValue('#2D5A27', '#E8F5E8');
    const headingColor = useColorModeValue('#1A365D', '#63B3ED');
    const accentColor = useColorModeValue('#B83280', '#F687B3');
    const alchemyGold = useColorModeValue('#D69E2E', '#F6E05E');
    const mysticPurple = useColorModeValue('#553C9A', '#B794F6');
    const earthGreen = useColorModeValue('#2F855A', '#68D391');

    const borderColor = useColorModeValue('rgba(139, 69, 19, 0.3)', 'rgba(205, 133, 63, 0.4)');
    const bgColor = useColorModeValue('rgba(245, 245, 220, 0.6)', 'rgba(45, 55, 72, 0.8)');
    const cardBg = useColorModeValue('rgba(255, 248, 220, 0.9)', 'rgba(26, 32, 44, 0.9)');
    const statBg = useColorModeValue('rgba(240, 248, 255, 0.8)', 'rgba(45, 55, 72, 0.9)');
    const subtleTextColor = useColorModeValue('gray.600', 'gray.400');

    // Mock data for demonstration
    const globalStats = {
        totalCrafters: 1247,
        activeAlchemists: 892,
        totalCreations: 15632,
        rareDiscoveries: 234,
        marketVolume: "2,847 GEM",
        mostPopularIngredient: "Dragon's Blood"
    };

    const personalStats = {
        craftsCompleted: 23,
        currentCrafts: 3,
        marketValue: "156.8 GEM",
        rarestItem: "Philosopher's Stone",
        craftingLevel: 7,
        achievements: 12
    };

    const ongoingCrafts = [
        { name: "Elixir of Vitality", progress: 75, timeLeft: "2h 34m", rarity: "Rare" },
        { name: "Mystic Brew", progress: 45, timeLeft: "5h 12m", rarity: "Epic" },
        { name: "Healing Potion", progress: 90, timeLeft: "45m", rarity: "Common" }
    ];

    const recentActivity = [
        { action: "Crafted", item: "Phoenix Feather Tincture", time: "2 hours ago", value: "12.5 GEM" },
        { action: "Sold", item: "Moonstone Powder", time: "1 day ago", value: "8.3 GEM" },
        { action: "Discovered", item: "Ancient Recipe", time: "3 days ago", value: "Legendary" }
    ];

    return (
        <Box minH="100vh" position="relative" overflow="hidden">
            {/* Mystical background pattern */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity="0.05"
                bgImage="radial-gradient(circle at 25% 25%, #553C9A 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2F855A 0%, transparent 50%)"
            />
            
            <Stack spacing={6} position="relative" zIndex={1}>
                {/* Hero Section */}
                <Box
                    border="2px solid"
                    borderColor={borderColor}
                    bgColor={bgColor}
                    rounded="xl"
                    p={8}
                    background="linear-gradient(135deg, rgba(245, 245, 220, 0.9) 0%, rgba(240, 248, 255, 0.8) 100%)"
                    boxShadow="xl"
                    position="relative"
                    overflow="hidden">
                    
                    {/* Decorative elements */}
                    <Icon as={GiMagicSwirl} position="absolute" top="4" right="4" size="2xl" color={mysticPurple} opacity="0.3" />
                    <Icon as={GiCrystalBall} position="absolute" bottom="4" left="4" size="xl" color={accentColor} opacity="0.2" />
                    
                    <VStack spacing={4}>
                        <HStack spacing={2} justify="center">
                            <Icon as={GiCauldron} color={alchemyGold} size="2xl" />
                            <Heading
                                textAlign="center"
                                fontWeight="light"
                                fontSize={{ base: '2xl', lg: '3xl', xl: '4xl' }}
                                color={headingColor}
                                fontFamily="serif">
                                Welcome to the
                            </Heading>
                            <Heading
                                textAlign="center"
                                fontWeight="bold"
                                fontSize={{ base: '2xl', lg: '3xl', xl: '4xl' }}
                                color={mysticPurple}
                                fontFamily="serif">
                                Elyxir Realm
                            </Heading>
                            <Icon as={GiMagicPotion} color={earthGreen} size="2xl" />
                        </HStack>
                        
                        <Text 
                            maxW="3xl" 
                            textAlign="center" 
                            fontSize={{ base: 'md', lg: 'lg' }}
                            color={textColor}
                            lineHeight="tall"
                            fontStyle="italic">
                            Embark on an mystical journey through the ancient art of alchemy. 
                            Gather rare ingredients from mythical realms, master legendary recipes, 
                            and craft powerful elixirs that hold the secrets of the universe. 
                            Your laboratory awaits, Master Alchemist.
                        </Text>
                        
                        <HStack spacing={4} wrap="wrap" justify="center">
                            <Badge colorScheme="purple" px={3} py={1} rounded="full" fontSize="sm">
                                <Icon as={FaFlask} mr={1} />
                                Alchemy Mastery
                            </Badge>
                            <Badge colorScheme="green" px={3} py={1} rounded="full" fontSize="sm">
                                <Icon as={FaLeaf} mr={1} />
                                Rare Ingredients
                            </Badge>
                            <Badge colorScheme="yellow" px={3} py={1} rounded="full" fontSize="sm">
                                <Icon as={FaGem} mr={1} />
                                Legendary Creations
                            </Badge>
                        </HStack>
                    </VStack>
                </Box>

                {/* Global Statistics */}
                <Box
                    border="2px solid"
                    borderColor={borderColor}
                    bgColor={cardBg}
                    rounded="xl"
                    p={6}
                    boxShadow="lg">
                    
                    <HStack mb={4} spacing={2}>
                        <Icon as={FaUsers} color={mysticPurple} size="lg" />
                        <Heading size="lg" color={headingColor} fontFamily="serif">
                            Realm Statistics
                        </Heading>
                        <Icon as={GiScrollQuill} color={alchemyGold} />
                    </HStack>
                    
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Active Alchemists</StatLabel>
                            <StatNumber color={mysticPurple} fontSize="2xl">{globalStats.activeAlchemists}</StatNumber>
                            <StatHelpText color={earthGreen}>+127 this week</StatHelpText>
                        </Stat>
                        
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Total Creations</StatLabel>
                            <StatNumber color={accentColor} fontSize="2xl">{globalStats.totalCreations.toLocaleString()}</StatNumber>
                            <StatHelpText color={earthGreen}>+89 today</StatHelpText>
                        </Stat>
                        
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Rare Discoveries</StatLabel>
                            <StatNumber color={alchemyGold} fontSize="2xl">{globalStats.rareDiscoveries}</StatNumber>
                            <StatHelpText color={earthGreen}>+3 this week</StatHelpText>
                        </Stat>
                        
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Market Volume</StatLabel>
                            <StatNumber color={earthGreen} fontSize="2xl">{globalStats.marketVolume}</StatNumber>
                            <StatHelpText color={accentColor}>24h volume</StatHelpText>
                        </Stat>
                        
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Master Crafters</StatLabel>
                            <StatNumber color={mysticPurple} fontSize="2xl">{globalStats.totalCrafters}</StatNumber>
                            <StatHelpText color={alchemyGold}>Legendary status</StatHelpText>
                        </Stat>
                        
                        <Stat bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                            <StatLabel color={textColor}>Popular Ingredient</StatLabel>
                            <StatNumber color={accentColor} fontSize="lg">{globalStats.mostPopularIngredient}</StatNumber>
                            <StatHelpText color={earthGreen}>Most traded</StatHelpText>
                        </Stat>
                    </SimpleGrid>
                </Box>

                {/* Personal Dashboard */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Personal Stats */}
                    <Box
                        border="2px solid"
                        borderColor={borderColor}
                        bgColor={cardBg}
                        rounded="xl"
                        p={6}
                        boxShadow="lg">
                        
                        <HStack mb={4} spacing={2}>
                            <Icon as={FaTrophy} color={alchemyGold} size="lg" />
                            <Heading size="lg" color={headingColor} fontFamily="serif">
                                Your Alchemical Journey
                            </Heading>
                        </HStack>
                        
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between">
                                <Text color={textColor} fontWeight="semibold">Crafting Level</Text>
                                <Badge colorScheme="purple" fontSize="lg" px={3} py={1}>
                                    Level {personalStats.craftingLevel}
                                </Badge>
                            </HStack>
                            
                            <HStack justify="space-between">
                                <Text color={textColor}>Completed Crafts</Text>
                                <Text color={mysticPurple} fontWeight="bold">{personalStats.craftsCompleted}</Text>
                            </HStack>
                            
                            <HStack justify="space-between">
                                <Text color={textColor}>Portfolio Value</Text>
                                <Text color={earthGreen} fontWeight="bold">{personalStats.marketValue}</Text>
                            </HStack>
                            
                            <HStack justify="space-between">
                                <Text color={textColor}>Rarest Possession</Text>
                                <Text color={alchemyGold} fontWeight="bold" fontSize="sm">{personalStats.rarestItem}</Text>
                            </HStack>
                            
                            <HStack justify="space-between">
                                <Text color={textColor}>Achievements</Text>
                                <HStack>
                                    <Text color={accentColor} fontWeight="bold">{personalStats.achievements}</Text>
                                    <Icon as={FaTrophy} color={alchemyGold} />
                                </HStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Ongoing Crafts */}
                    <Box
                        border="2px solid"
                        borderColor={borderColor}
                        bgColor={cardBg}
                        rounded="xl"
                        p={6}
                        boxShadow="lg">
                        
                        <HStack mb={4} spacing={2}>
                            <Icon as={FaClock} color={earthGreen} size="lg" />
                            <Heading size="lg" color={headingColor} fontFamily="serif">
                                Active Transmutations
                            </Heading>
                        </HStack>
                        
                        <VStack spacing={4} align="stretch">
                            {ongoingCrafts.map((craft, index) => (
                                <Box key={index} bg={statBg} p={4} rounded="lg" border="1px solid" borderColor={borderColor}>
                                    <HStack justify="space-between" mb={2}>
                                        <Text color={textColor} fontWeight="semibold" fontSize="sm">{craft.name}</Text>
                                        <Badge 
                                            colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue' : 'green'}
                                            size="sm">
                                            {craft.rarity}
                                        </Badge>
                                    </HStack>
                                    
                                    <Progress 
                                        value={craft.progress} 
                                        colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue' : 'green'}
                                        size="sm" 
                                        rounded="full"
                                        mb={2} />
                                    
                                    <HStack justify="space-between">
                                        <Text fontSize="xs" color={textColor}>{craft.progress}% Complete</Text>
                                        <Text fontSize="xs" color={accentColor} fontWeight="bold">
                                            <Icon as={FaClock} mr={1} />
                                            {craft.timeLeft}
                                        </Text>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </SimpleGrid>

                {/* Recent Activity */}
                <Box
                    border="2px solid"
                    borderColor={borderColor}
                    bgColor={cardBg}
                    rounded="xl"
                    p={6}
                    boxShadow="lg">
                    
                    <HStack mb={4} spacing={2}>
                        <Icon as={FaFire} color={accentColor} size="lg" />
                        <Heading size="lg" color={headingColor} fontFamily="serif">
                            Recent Alchemical Activities
                        </Heading>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                        {recentActivity.map((activity, index) => (
                            <Box key={index}>
                                <HStack justify="space-between" align="center" py={3}>
                                    <HStack spacing={3}>
                                        <Avatar 
                                            size="sm" 
                                            bg={activity.action === 'Crafted' ? earthGreen : activity.action === 'Sold' ? alchemyGold : mysticPurple}
                                            icon={<Icon as={activity.action === 'Crafted' ? GiMagicPotion : activity.action === 'Sold' ? FaCoins : GiScrollQuill} />}
                                        />
                                        <VStack align="start" spacing={0}>
                                            <Text color={textColor} fontWeight="semibold" fontSize="sm">
                                                {activity.action} {activity.item}
                                            </Text>
                                            <Text fontSize="xs" color={subtleTextColor}>
                                                {activity.time}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    
                                    <Badge 
                                        colorScheme={activity.value === 'Legendary' ? 'purple' : 'green'}
                                        px={3} py={1}>
                                        {activity.value}
                                    </Badge>
                                </HStack>
                                {index < recentActivity.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </VStack>
                </Box>

                {/* Call to Action */}
                {!IS_BOUNTY_ENABLED && (
                    <Box
                        border="2px solid"
                        borderColor={mysticPurple}
                        bgColor={cardBg}
                        rounded="xl"
                        p={6}
                        textAlign="center"
                        background="linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(85, 60, 154, 0.1) 100%)"
                        boxShadow="lg">
                        
                        <Icon as={GiCrystalBall} color={mysticPurple} size="3xl" mb={4} />
                        
                        <Heading size="lg" color={headingColor} mb={2} fontFamily="serif">
                            The Ancient Grimoires Await
                        </Heading>
                        
                        <Text color={textColor} mb={4} fontSize="lg">
                            New legendary recipes have been discovered in the depths of forgotten libraries. 
                            Master these arcane formulas to unlock untold alchemical power.
                        </Text>
                        
                        <HStack justify="center" spacing={4}>
                            <Text fontSize="sm" color={textColor}>
                                Follow our mystical channels:
                            </Text>
                            <a href="https://x.com/BeingsMythical" target="_blank" rel="noreferrer">
                                <Badge colorScheme="blue" px={3} py={1} cursor="pointer" _hover={{ transform: 'scale(1.05)' }}>
                                    Twitter Oracle
                                </Badge>
                            </a>
                            <a href="https://discord.gg/JyPugMEC5y" target="_blank" rel="noreferrer">
                                <Badge colorScheme="purple" px={3} py={1} cursor="pointer" _hover={{ transform: 'scale(1.05)' }}>
                                    Discord Sanctuary
                                </Badge>
                            </a>
                        </HStack>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default Overview;
