import { Box, Center, Image, SimpleGrid, Stack, Text, VStack, useColorModeValue } from '@chakra-ui/react';

/**
 * @name HCountdown
 * @description Component that shows the Bounty balance and the countdown to the next draw
 * @param {Object} bountyTimer - Object with the Bounty timer data
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const HCountdown = ({ bountyTimer, totalTickets = 0, bountyBalance = 0, bountyBalanceUSD = 0, cStyle }) => {
    const selectedColor = cStyle === 0 ? '#2f9088' : '#3b5397';
    const textColor = useColorModeValue(selectedColor, 'white');
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.35)' : 'rgba(59, 83, 151, 0.35)';

    const CurrencyBounty = ({ currencyName, specialCard }) => {
        if (currencyName && !specialCard) {
            const currencyLower = currencyName.toLowerCase();
            return (
                <Stack direction={{ base: 'column', xl: 'row' }} margin={{ base: 'auto', lg: 'unset' }}>
                    <Image
                        src={`/images/currency/${currencyLower}.png`}
                        w="80px"
                        margin={{ base: 'auto', lg: 'unset' }}
                    />
                    <VStack align="flex-start">
                        <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                            {bountyBalance[currencyName]} {currencyName.toUpperCase()}
                        </Text>
                        <Text color={textColor} fontSize="md" margin={{ base: 'auto', lg: 'unset' }}>
                            ({Number(bountyBalanceUSD[currencyName]).toFixed(2)} USD)
                        </Text>
                    </VStack>
                </Stack>
            );
        }

        const specialCardLower = specialCard.toLowerCase();

        return (
            <Stack direction={{ base: 'column', xl: 'row' }} margin={{ base: 'auto', lg: 'unset' }}>
                <Image
                    src={`/images/criatures/${specialCardLower}.webp`}
                    w="80px"
                    margin={{ base: 'auto', lg: 'unset' }}
                />
                <VStack align="flex-start">
                    <Text color={textColor} fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="bold" mb={-3}>
                        7 {specialCard.toUpperCase()}
                    </Text>
                    <Text color={textColor} fontSize="md" margin={{ base: 'auto', lg: 'unset' }}>
                        ({Number(bountyBalanceUSD.SpecialCard).toFixed(2)} USD)
                    </Text>
                </VStack>
            </Stack>
        );
    };

    const Countdown = () => {
        return (
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
                            {totalTickets}
                        </Text>
                        <Text textAlign="center" fontSize="xs">
                            Total tickets for this bounty
                        </Text>
                    </Box>
                </SimpleGrid>
            </Center>
        );
    };

    return (
        <Center>
            <Stack direction="column" spacing={4} align="center" w="100%">
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 4 }}
                    spacing={{ base: 4, lg: 8, xl: 12 }}
                    p={{ base: 2, lg: 4, xl: 8 }}
                    color={'white'}
                    w="100%">
                    <CurrencyBounty currencyName={'wETH'} />
                    <CurrencyBounty currencyName={'GEM'} />
                    <CurrencyBounty currencyName={'Mana'} />
                    <CurrencyBounty specialCard={'Garuda'} />
                </SimpleGrid>

                <Countdown />
                <Text fontSize={'xs'}>The prices listed are approximate.</Text>
            </Stack>
        </Center>
    );
};

export default HCountdown;
