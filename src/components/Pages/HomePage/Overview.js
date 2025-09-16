import React, { useMemo } from 'react';
import { 
    Box, Center, Heading, Stack, Text, useColorModeValue, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
    Badge, VStack, HStack, Icon, Progress, Divider, Avatar, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Wrap, WrapItem, Flex
} from '@chakra-ui/react';
import { ACTUAL_SEASON, IS_BOUNTY_ENABLED } from '../../../data/CONSTANTS';
import { FaFlask, FaFire, FaLeaf, FaGem, FaClock, FaUsers, FaCoins, FaTrophy } from 'react-icons/fa';
import { GiCauldron, GiMagicPotion, GiScrollQuill, GiCrystalBall, GiMagicSwirl } from 'react-icons/gi';
import { extractElyxirCollections, getRecentCreations, getRecentIngredientTrades, summarizeElyxirPortfolio } from '../../../utils/elyxirAssets';

const Overview = ({ infoAccount, trades }) => {
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const headingColor = useColorModeValue('teal.800', 'teal.200');
    const accentColor = useColorModeValue('pink.600', 'pink.300');
    const alchemyGold = useColorModeValue('yellow.600', 'yellow.300');
    const mysticPurple = useColorModeValue('purple.600', 'purple.300');
    const earthGreen = useColorModeValue('green.600', 'green.300');

    const panelBg = useColorModeValue('white', 'gray.750');
    const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
    const gradientBg = useColorModeValue('linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(245,255,250,0.7) 100%)','linear-gradient(135deg, rgba(26,32,44,0.6) 0%, rgba(44,82,99,0.4) 100%)');
    const radialBg = useColorModeValue(
        'radial-gradient(circle at 20% 30%, rgba(129,230,217,0.4), transparent 60%), radial-gradient(circle at 80% 70%, rgba(214,188,250,0.4), transparent 55%)',
        'radial-gradient(circle at 20% 30%, rgba(76,81,191,0.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(129,230,217,0.15), transparent 55%)'
    );
    const insetPanelBg = useColorModeValue('gray.50','gray.700');

    // Derive Elyxir buckets & stats
    const elyxirBuckets = useMemo(() => extractElyxirCollections(infoAccount?.assets || []), [infoAccount?.assets]);
    const portfolioSummary = useMemo(() => summarizeElyxirPortfolio(elyxirBuckets), [elyxirBuckets]);
    const creationTrades = useMemo(() => getRecentCreations(trades || [], 5), [trades]);
    const ingredientTrades = useMemo(() => getRecentIngredientTrades(trades || [], 5), [trades]);

    // Placeholder craft timeline (until real crafting state exists)
    const ongoingCrafts = useMemo(() => [
        { name: 'Whispering Gale', progress: 60, timeLeft: '1d 4h', rarity: 'Rare' },
        { name: 'Feathered Flame', progress: 25, timeLeft: '3d 2h', rarity: 'Epic' }
    ], []);

    // Recent activity merges trades & placeholder crafts
    const recentActivities = useMemo(() => {
        const mappedCreations = creationTrades.map(t => ({
            action: 'Trade', item: t?.name || t?.asset, value: t?.priceNQT ? `${(t.priceNQT/1e8).toFixed(2)} IGNIS` : '—', time: '—'
        }));
        return mappedCreations.slice(0,5);
    }, [creationTrades]);

    return (
        <Box position="relative" overflow="hidden" py={4}>
          <Box position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.15} pointerEvents="none" bgImage={radialBg} />

            <Stack spacing={6} position="relative">
                {/* Hero */}
                <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={{ base:4, md:8 }} bg={gradientBg} backdropFilter="blur(5px)" boxShadow="lg" position="relative" overflow="hidden">
                    <Icon as={GiMagicSwirl} position="absolute" top="3" right="3" boxSize={14} color={mysticPurple} opacity={0.25} />
                    <VStack spacing={3}>
                        <HStack spacing={3} flexWrap="wrap" justify="center">
                            <Icon as={GiCauldron} color={alchemyGold} boxSize={10} />
                            <Heading textAlign="center" fontWeight="semibold" fontSize={{ base:'2xl', md:'3xl'}} color={headingColor}>
                                Elyxir Overview
                            </Heading>
                            <Icon as={GiMagicPotion} color={earthGreen} boxSize={10} />
                        </HStack>
                        <Text fontSize={{ base:'sm', md:'md'}} maxW="900px" textAlign="center" color={textColor}>
                            Track your alchemical journey: assets, creations, ingredient flow and crafting momentum in one unified dashboard.
                        </Text>
                        <HStack spacing={2} flexWrap="wrap" justify="center">
                            <Badge colorScheme="purple" px={2} py={1}><Icon as={FaFlask} mr={1}/>Lab Ready</Badge>
                            <Badge colorScheme="green" px={2} py={1}><Icon as={FaLeaf} mr={1}/>Ingredients {portfolioSummary.ingredients}</Badge>
                            <Badge colorScheme="yellow" px={2} py={1}><Icon as={FaGem} mr={1}/>Creations {portfolioSummary.creations}</Badge>
                        </HStack>
                    </VStack>
                </Box>

                {/* Stats Grid */}
                <SimpleGrid columns={{ base:2, md:4, lg:6 }} gap={4}>
                    {[
                        { label:'Ingredients', value: portfolioSummary.ingredients, color: earthGreen },
                        { label:'Tools', value: portfolioSummary.tools, color: mysticPurple },
                        { label:'Flasks', value: portfolioSummary.flasks, color: accentColor },
                        { label:'Creations', value: portfolioSummary.creations, color: alchemyGold },
                        { label:'Recipes', value: portfolioSummary.recipes, color: textColor },
                        { label:'Trades (recent)', value: trades?.length || 0, color: headingColor }
                    ].map((s,i) => (
                        <Stat key={i} bg={panelBg} borderWidth="1px" borderColor={borderColor} rounded="lg" p={3}>
                            <StatLabel fontSize="xs" color={subtleTextColor}>{s.label}</StatLabel>
                            <StatNumber fontSize="lg" color={s.color}>{s.value || 0}</StatNumber>
                        </Stat>
                    ))}
                </SimpleGrid>

                {/* Responsive Sections using Accordion on mobile */}
                <Accordion allowMultiple display={{ base:'block', md:'none' }}>
                    <AccordionItem border="none">
                        <AccordionButton _expanded={{ bg: 'purple.500', color:'white' }}>
                            <HStack flex="1" textAlign="left"><Icon as={FaClock} /> Ongoing Crafts</HStack>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                                {ongoingCrafts.map((craft, idx) => (
                                    <Box key={idx} p={3} borderWidth="1px" borderColor={borderColor} rounded="md" bg={panelBg}>
                                        <HStack justify="space-between" mb={1}>
                                            <Text fontWeight="semibold" fontSize="sm" color={textColor}>{craft.name}</Text>
                                            <Badge colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue':'green'}>{craft.rarity}</Badge>
                                        </HStack>
                                        <Progress value={craft.progress} size="xs" colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue':'green'} mb={1} />
                                        <Text fontSize="xs" color={subtleTextColor}>{craft.progress}% • {craft.timeLeft}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border="none">
                        <AccordionButton _expanded={{ bg: 'pink.500', color:'white' }}>
                            <HStack flex="1" textAlign="left"><Icon as={FaFire} /> Recent Activity</HStack>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <VStack spacing={3} align="stretch">
                                {recentActivities.map((a,i) => (
                                    <Box key={i} p={3} borderWidth="1px" borderColor={borderColor} rounded="md" bg={panelBg}>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color={textColor} fontWeight="semibold">{a.action} {a.item}</Text>
                                            <Badge colorScheme={a.value.includes('IGNIS') ? 'green':'purple'}>{a.value}</Badge>
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                {/* Desktop layout for crafts & activity */}
                <SimpleGrid columns={{ base:1, md:2 }} gap={6} display={{ base:'none', md:'grid' }}>
                    <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={5} bg={panelBg}>
                        <HStack mb={4} spacing={2}>
                            <Icon as={FaClock} color={earthGreen} />
                            <Heading size="md" color={headingColor}>Ongoing Crafts</Heading>
                        </HStack>
                        <VStack spacing={4} align="stretch">
                            {ongoingCrafts.map((craft, idx) => (
                                <Box key={idx} p={4} borderWidth="1px" borderColor={borderColor} rounded="lg" bg={insetPanelBg}>
                                    <HStack justify="space-between" mb={1}>
                                        <Text fontWeight="semibold" fontSize="sm" color={textColor}>{craft.name}</Text>
                                        <Badge colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue':'green'}>{craft.rarity}</Badge>
                                    </HStack>
                                    <Progress value={craft.progress} size="sm" colorScheme={craft.rarity === 'Epic' ? 'purple' : craft.rarity === 'Rare' ? 'blue':'green'} mb={1} />
                                    <Text fontSize="xs" color={subtleTextColor}>{craft.progress}% • {craft.timeLeft}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                    <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={5} bg={panelBg}>
                        <HStack mb={4} spacing={2}>
                            <Icon as={FaFire} color={accentColor} />
                            <Heading size="md" color={headingColor}>Recent Activity</Heading>
                        </HStack>
                        <VStack spacing={3} align="stretch">
                            {recentActivities.map((a,i) => (
                                <Box key={i} p={3} borderWidth="1px" borderColor={borderColor} rounded="md" bg={insetPanelBg}>
                                    <HStack justify="space-between" mb={1}>
                                        <Text fontSize="sm" color={textColor} fontWeight="semibold">{a.action} {a.item}</Text>
                                        <Badge colorScheme={a.value.includes('IGNIS') ? 'green':'purple'}>{a.value}</Badge>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </SimpleGrid>

                {/* Ingredient & Creation Trades */}
                <SimpleGrid columns={{ base:1, md:2 }} gap={6}>
                    <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={5} bg={panelBg}>
                        <HStack mb={4} spacing={2}><Icon as={FaLeaf} color={earthGreen} /><Heading size="sm" color={headingColor}>Recent Ingredient Trades</Heading></HStack>
                        <VStack spacing={3} align="stretch">
                            {ingredientTrades.map((t,i) => (
                                <HStack key={i} justify="space-between" p={2} borderWidth="1px" borderColor={borderColor} rounded="md" bg={insetPanelBg}>
                                    <Text fontSize="xs" color={textColor}>{t?.name || t?.asset}</Text>
                                    <Badge colorScheme="green" fontSize="0.6rem">{t?.quantityQNT || t?.quantity || 1}</Badge>
                                </HStack>
                            ))}
                            {ingredientTrades.length === 0 && <Text fontSize="xs" color={subtleTextColor}>No recent ingredient trades.</Text>}
                        </VStack>
                    </Box>
                    <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={5} bg={panelBg}>
                        <HStack mb={4} spacing={2}><Icon as={FaGem} color={alchemyGold} /><Heading size="sm" color={headingColor}>Recent Creation Trades</Heading></HStack>
                        <VStack spacing={3} align="stretch">
                            {creationTrades.map((t,i) => (
                                <HStack key={i} justify="space-between" p={2} borderWidth="1px" borderColor={borderColor} rounded="md" bg={insetPanelBg}>
                                    <Text fontSize="xs" color={textColor}>{t?.name || t?.asset}</Text>
                                    <Badge colorScheme="yellow" fontSize="0.6rem">{t?.quantityQNT || t?.quantity || 1}</Badge>
                                </HStack>
                            ))}
                            {creationTrades.length === 0 && <Text fontSize="xs" color={subtleTextColor}>No recent creation trades.</Text>}
                        </VStack>
                    </Box>
                </SimpleGrid>

                {/* Call to Action */}
                {!IS_BOUNTY_ENABLED && (
                    <Box borderWidth="1px" borderColor={borderColor} rounded="xl" p={6} textAlign="center" bg={panelBg}>
                        <Icon as={GiCrystalBall} color={mysticPurple} boxSize={14} mb={2} />
                        <Heading size="md" color={headingColor} mb={2}>Season {ACTUAL_SEASON} Chronicles</Heading>
                        <Text fontSize="sm" color={textColor} mb={3}>Stay attuned to arcane market shifts and recipe discoveries. New lore awaits.</Text>
                        <HStack spacing={3} justify="center" flexWrap="wrap">
                            <Badge as="a" href="https://x.com/BeingsMythical" target="_blank" rel="noreferrer" colorScheme="twitter" cursor="pointer">Twitter</Badge>
                            <Badge as="a" href="https://discord.gg/JyPugMEC5y" target="_blank" rel="noreferrer" colorScheme="purple" cursor="pointer">Discord</Badge>
                        </HStack>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default Overview;
