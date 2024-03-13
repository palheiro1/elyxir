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
const HCountdown = ({ jackpotTimer, numParticipants = 0, jackpotBalance = 0, jackpotBalanceUSD = 0, cStyle }) => {
    // const textColor = useColorModeValue('black', 'white');
    const selectedColor = cStyle === 0 ? '#2f9088' : '#3b5397';
    const textColor = useColorModeValue(selectedColor, 'white');
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.35)' : 'rgba(59, 83, 151, 0.35)';

    return (
        <Center>
            <Stack direction="column" spacing={4} align="center">
                <Stack direction={{ base: 'column', md: 'row' }} w="100%" gap={6}>
                    <HStack>
                        <Image src="/images/currency/weth.png" w="50px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                {jackpotBalance.wETH} WETH
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(jackpotBalanceUSD.wETH).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack>
                        <Image src="/images/currency/gem.png" w="50px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                9000 GEM
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(jackpotBalanceUSD.GEM).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack>
                        <Image src="/images/currency/mana.png" w="50px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                9000 MANA
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(jackpotBalanceUSD.Mana).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack>
                        <Image src="/images/criatures/sumanga.png" w="50px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={-3}>
                                7 Sumangâ
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(jackpotBalanceUSD.Sumanga).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </HStack>
                </Stack>
                <Center w="100%">
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} color={"white"} w="100%">
                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer?.days || 0}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                days
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer?.hours || 0}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                hours
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer?.minutes || 0}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                minutes
                            </Text>
                        </Box>
                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {numParticipants}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                Total claims in this round
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Center>
                <Text fontSize={"sm"}>
                    The prices of the Tokens and NFT are approximate values
                </Text>
            </Stack>
        </Center>
    );
};

export default HCountdown;
