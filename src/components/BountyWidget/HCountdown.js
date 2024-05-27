import { Box, Center, Image, SimpleGrid, Stack, Text, VStack, useColorModeValue } from '@chakra-ui/react';

/**
 * @name HCountdown
 * @description Component that shows the Bounty balance and the countdown to the next draw
 * @param {Object} bountyTimer - Object with the Bounty timer data
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const HCountdown = ({ bountyTimer, numParticipants = 0, bountyBalance = 0, bountyBalanceUSD = 0, cStyle }) => {
    const selectedColor = cStyle === 0 ? '#2f9088' : '#3b5397';
    const textColor = useColorModeValue(selectedColor, 'white');
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.35)' : 'rgba(59, 83, 151, 0.35)';

    return (
        <Center>
            <Stack direction="column" spacing={4} align="center" w="100%">
                {/*<Stack direction={{ base: 'column', lg: 'row' }} w="100%" gap={12} align={"center"}> */}
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 4 }}
                    spacing={{ base: 4, lg: 8, xl: 12 }}
                    p={{ base: 2, lg: 4, xl: 8 }}
                    color={'white'}
                    w="100%">
                    <Stack direction={{ base: 'column', xl: 'row' }}>
                        <Image src="/images/currency/weth.png" w="80px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                                {bountyBalance.wETH} WETH
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(bountyBalanceUSD.wETH).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </Stack>
                    <Stack direction={{ base: 'column', xl: 'row' }}>
                        <Image src="/images/currency/gem.png" w="80px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                                9000 GEM
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(bountyBalanceUSD.GEM).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </Stack>
                    <Stack direction={{ base: 'column', xl: 'row' }}>
                        <Image src="/images/currency/mana.png" w="80px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                                9000 MANA
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(bountyBalanceUSD.Mana).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </Stack>
                    <Stack direction={{ base: 'column', xl: 'row' }}>
                        <Image src="/images/criatures/sumanga.png" w="80px" />
                        <VStack align="flex-start">
                            <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                                7 Sumangâ
                            </Text>
                            <Text color={textColor} fontSize="md">
                                ({Number(bountyBalanceUSD.Sumanga).toFixed(2)} USD)
                            </Text>
                        </VStack>
                    </Stack>
                </SimpleGrid>
                {/*</Stack> */}
                <Center w="100%">
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} color={'white'} w="100%">
                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {bountyTimer?.days || 0}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                days
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {bountyTimer?.hours || 0}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                hours
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="100px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {bountyTimer?.minutes || 0}
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
                <Text fontSize={'sm'}>The prices of the Tokens and NFT are approximate values</Text>
            </Stack>
        </Center>
    );
};

export default HCountdown;
