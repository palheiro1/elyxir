import { Box, Center, IconButton, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GiCutDiamond } from 'react-icons/gi';

import { getJackpotBalance, getJackpotBalanceUSD } from '../../services/Jackpot/utils';

/**
 * @name VCountdown
 * @description Component that shows the Jackpot balance and the countdown to the next draw
 * @dev Used in JackpotWidget
 * @param {Object} jackpotTimer - Object with the Jackpot timer data
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const VCountdown = ({ jackpotTimer }) => {
    const [jackpotBalance, setJackpotBalance] = useState(0);
    const [jackpotBalanceUSD, setJackpotBalanceUSD] = useState(0);

    useEffect(() => {
        const fetchJackpotBalance = async () => {
            // Recover Jackpot balance - IGNIS
            const jackpotBalance = await getJackpotBalance();
            setJackpotBalance(jackpotBalance);

            // Recover Jackpot balance - USD
            const jackpotBalanceUSD = await getJackpotBalanceUSD(jackpotBalance);
            setJackpotBalanceUSD(jackpotBalanceUSD);
        };

        fetchJackpotBalance();
    }, []);

    return (
        <Box>
            <Center>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={2} align="center" p={6}>
                    <IconButton
                        icon={<GiCutDiamond />}
                        size="xl"
                        p={4}
                        mr={2}
                        fontSize="4xl"
                        bg="whiteAlpha.100"
                        color="white"
                    />
                    <VStack textAlign="center">
                        <Text color="white" fontSize="3xl" fontWeight="bold" mb={-3}>
                            {jackpotBalance} IGNIS
                        </Text>
                        <Text color="white" fontSize="md">
                            ({jackpotBalanceUSD} USD)
                        </Text>
                    </VStack>
                </Stack>
            </Center>
            <Center>
                <Stack direction="row" spacing={4} align="center">
                    <Box p={2} bg="#121D31" rounded="lg" minW="90px">
                        <Text textAlign="center" fontSize="xl" fontWeight="bold">
                            {jackpotTimer.days}
                        </Text>
                        <Text textAlign="center" fontSize="xs">
                            days
                        </Text>
                    </Box>

                    <Box p={2} bg="#121D31" rounded="lg" minW="90px">
                        <Text textAlign="center" fontSize="xl" fontWeight="bold">
                            {jackpotTimer.hours}
                        </Text>
                        <Text textAlign="center" fontSize="xs">
                            hours
                        </Text>
                    </Box>

                    <Box p={2} bg="#121D31" rounded="lg" minW="90px">
                        <Text textAlign="center" fontSize="xl" fontWeight="bold">
                            {jackpotTimer.minutes}
                        </Text>
                        <Text textAlign="center" fontSize="xs">
                            minutes
                        </Text>
                    </Box>
                </Stack>
            </Center>
        </Box>
    );
};

export default VCountdown;
