import { Box, Center, HStack, IconButton, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { GiCutDiamond } from 'react-icons/gi';

/**
 * @name HCountdown
 * @description Component that shows the Jackpot balance and the countdown to the next draw
 * @param {Object} jackpotTimer - Object with the Jackpot timer data
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const HCountdown = ({ jackpotTimer, numParticipants, jackpotBalance, jackpotBalanceUSD }) => {
    const textColor = useColorModeValue('black', 'white');
    const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

    return (
        <Center>
            <Stack direction="column">
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center">
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
                            {jackpotBalance} WETH
                        </Text>
                        <Text color={textColor} fontSize="md">
                            ({jackpotBalanceUSD} USD)
                        </Text>
                    </VStack>
                    <Center pl={{ base: 0, md: 4 }} w={{ base: '100%', md: 'auto' }}>
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
                </Stack>
                <Box py={2} bg={bgColor} rounded="lg" minW="90px" w="100%">
                    <Text textAlign="center">
                        Total claims in this round: <strong>{numParticipants}</strong>
                    </Text>
                </Box>
            </Stack>
        </Center>
    );
};

export default HCountdown;
