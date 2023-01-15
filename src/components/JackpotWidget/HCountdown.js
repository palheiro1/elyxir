import { Box, Center, HStack, IconButton, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GiCutDiamond } from 'react-icons/gi';

import { getJackpotBalance, getJackpotBalanceUSD, getJackpotParticipants } from '../../services/Jackpot/utils';

const HCountdown = ({ jackpotTimer }) => {
    const [jackpotBalance, setJackpotBalance] = useState(0);
    const [jackpotBalanceUSD, setJackpotBalanceUSD] = useState(0);
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: []});

    useEffect(() => {
        const fetchJackpotBalance = async () => {
            // Recover Jackpot balance - IGNIS
            const jackpotBalance = await getJackpotBalance();
            setJackpotBalance(jackpotBalance);

            // Recover Jackpot balance - USD
            const jackpotBalanceUSD = await getJackpotBalanceUSD(jackpotBalance);
            setJackpotBalanceUSD(jackpotBalanceUSD);

            // Get participants
            const response = await getJackpotParticipants();
            let auxParticipants = [];
            let numParticipants = 0;
            Object.entries(response).forEach(entry => {
                const [key, value] = entry;
                if(value > 0) {
                    auxParticipants.push(key);
                    numParticipants += value;
                }
            });
            setParticipants({ numParticipants, participants: auxParticipants });
        };

        fetchJackpotBalance();
    }, []);

    const textColor = useColorModeValue('black', 'white');
    const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

    return (
        <Center>
            <VStack>
            <HStack>
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
            <Text color="gray" fontSize="md">
                Total tickets in this round: <strong>{participants.numParticipants}</strong>
            </Text>
            </VStack>
        </Center>
    );
};

export default HCountdown;
