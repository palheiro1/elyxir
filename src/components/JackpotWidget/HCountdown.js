import { Box, Center, HStack, IconButton, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GiCutDiamond } from 'react-icons/gi';

import { JACKPOTACCOUNT, JACKPOTHALF, NODEURL, NQTDIVIDER } from '../../data/CONSTANTS';

import { getIgnisBalance } from '../../services/Ardor/ardorInterface';

const HCountdown = ({ jackpotTimer }) => {
    const [jackpotBalance, setJackpotBalance] = useState(0);
    const [jackpotBalanceUSD, setJackpotBalanceUSD] = useState(0);

    useEffect(() => {
        const getJackpotBalance = async () => {
            // Recover Jackpot balance - IGNIS
            const response = await getIgnisBalance(NODEURL, JACKPOTACCOUNT);
            const balance = response.balanceNQT / NQTDIVIDER;
            const jackpotBalance = (JACKPOTHALF ? balance / 2 : balance).toFixed(2);
            setJackpotBalance(jackpotBalance);

            // Recover Jackpot balance - USD
            const responseUSD = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=ignis&vs_currencies=usd'
            );
            const data = await responseUSD.json();
            const jackpotBalanceUSD = (
                (JACKPOTHALF ? balance / 2 : balance) * data.ignis.usd
            ).toFixed(2);
            setJackpotBalanceUSD(jackpotBalanceUSD);
        };

        getJackpotBalance();
    }, []);

    const textColor = useColorModeValue('black', 'white');
    const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

    return (
        <Center>
            <HStack>
                s
                <IconButton
                    icon={<GiCutDiamond />}
                    size="xl"
                    p={4}
                    mr={2}
                    fontSize="4xl"
                    bg={bgColor}
                    color={textColor}
                />
                <VStack align="flex-start">
                    <Text color={textColor} fontSize="3xl" fontWeight="bold" mb={-3}>
                        {jackpotBalance} IGNIS
                    </Text>
                    <Text color={textColor} fontSize="md">
                        ({jackpotBalanceUSD} USD)
                    </Text>
                </VStack>
                <Center px={4}>
                    <HStack spacing={4} color={textColor}>
                        <Box p={2} bg={bgColor} rounded="lg" minW="90px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer.days}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                days
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="90px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer.hours}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                hours
                            </Text>
                        </Box>

                        <Box p={2} bg={bgColor} rounded="lg" minW="90px">
                            <Text textAlign="center" fontSize="xl" fontWeight="bold">
                                {jackpotTimer.minutes}
                            </Text>
                            <Text textAlign="center" fontSize="xs">
                                minutes
                            </Text>
                        </Box>
                    </HStack>
                </Center>
            </HStack>
        </Center>
    );
};

export default HCountdown;
