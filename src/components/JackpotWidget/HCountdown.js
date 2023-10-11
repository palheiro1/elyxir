import {
    Box,
    Center,
    HStack,
    Image,
    SimpleGrid,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';

/**
 * @name HCountdown
 * @description Component that shows the Jackpot balance and the countdown to the next draw
 * @param {Object} jackpotTimer - Object with the Jackpot timer data
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const HCountdown = ({ jackpotTimer, numParticipants, jackpotBalance, jackpotBalanceUSD, cStyle }) => {
    // const textColor = useColorModeValue('black', 'white');
    const selectedColor = cStyle === 0 ? '#2f9088' : '#3b5397';
    const textColor = useColorModeValue(selectedColor, 'white');
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.35)' : 'rgba(59, 83, 151, 0.35)';

    return (
        <Center>
            <Stack direction="column">
                <Stack direction={{ base: 'column', md: 'column' }} spacing={4} align="center">
                    <Stack direction={{ base: 'column', md: 'row' }} w="100%">
                        <Center w="100%">
                            <HStack w="100%">
                                <Image src="/images/currency/weth.png" w="50px" mr={2} />
                                <VStack align="flex-start">
                                    <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                        {jackpotBalance} WETH
                                    </Text>
                                    <Text color={textColor} fontSize="md">
                                        ({Number(jackpotBalanceUSD).toFixed(2)} USD)
                                    </Text>
                                </VStack>
                            </HStack>
                        </Center>
                        <HStack w="100%">
                            <Image src="/images/currency/mana.png" w="55px" mr={2} mb={1} />
                            <VStack align="flex-start">
                                <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                    9375 MANA
                                </Text>
                                <Text color={textColor} fontSize="md">
                                    (SOON)
                                </Text>
                            </VStack>
                        </HStack>
                    </Stack>
                    <Center w={{ base: '100%', md: 'auto' }}>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} color={textColor}>
                            <Box p={2} bg={bgColor} rounded="lg" minW={{ base: '100px', lg: '150px' }}>
                                <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                    {jackpotTimer.days}
                                </Text>
                                <Text textAlign="center" fontSize="xs">
                                    days
                                </Text>
                            </Box>

                            <Box p={2} bg={bgColor} rounded="lg" minW={{ base: '100px', lg: '150px' }}>
                                <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                    {jackpotTimer.hours}
                                </Text>
                                <Text textAlign="center" fontSize="xs">
                                    hours
                                </Text>
                            </Box>

                            <Box p={2} bg={bgColor} rounded="lg" minW={{ base: '100px', lg: '150px' }}>
                                <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                    {jackpotTimer.minutes}
                                </Text>
                                <Text textAlign="center" fontSize="xs">
                                    minutes
                                </Text>
                            </Box>
                            <Box p={2} bg={bgColor} rounded="lg" minW={{ base: '100px', lg: '150px' }}>
                                <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                    {numParticipants}
                                </Text>
                                <Text textAlign="center" fontSize="xs">
                                    Total claims in this round
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Center>
                </Stack>
            </Stack>
        </Center>
    );
};

export default HCountdown;
