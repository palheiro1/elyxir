import { Box, Center, IconButton, Stack, Text, VStack } from '@chakra-ui/react';
import { GiCutDiamond } from 'react-icons/gi';

/**
 * @name VCountdown
 * @description Component that shows the Jackpot balance and the countdown to the next draw
 * @dev Used in JackpotWidget
 * @param {Object} jackpotTimer - Object with the Jackpot timer data
 * @param {Number} jackpotBalance - Jackpot balance in IGNIS
 * @param {Number} jackpotBalanceUSD - Jackpot balance in USD
 * @returns {JSX.Element} - JSX Element with the component
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const VCountdown = ({ jackpotTimer, jackpotBalance, jackpotBalanceUSD }) => {

    const useEffect = (() => {
        console.log("Estoy useffect")
        const getGemPrice = async () => {
            const test = await fetch("https://interface.gateway.uniswap.org/v2/quote", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
                    "Accept": "*/*",
                    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "text/plain;charset=UTF-8",
                    "x-request-source": "uniswap-web",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site"
                },
                "referrer": "https://app.uniswap.org/",
                "body": "{\"tokenInChainId\":137,\"tokenIn\":\"0x5F790ffA0695967A2d711872EcB4c7553e24794D\",\"tokenOutChainId\":137,\"tokenOut\":\"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619\",\"amount\":\"9000000000000000000000\",\"sendPortionEnabled\":true,\"type\":\"EXACT_INPUT\",\"intent\":\"quote\",\"configs\":[{\"protocols\":[\"V2\",\"V3\",\"MIXED\"],\"enableUniversalRouter\":true,\"routingType\":\"CLASSIC\",\"enableFeeOnTransferFeeFetching\":true}]}",
                "method": "POST",
                "mode": "cors"
            });
            console.log("🚀 ~ getGemPrice ~ test:", test)

        }

        getGemPrice();
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
                            {jackpotBalance} WETH
                        </Text>
                        <Text color="white" fontSize="md">
                            ({jackpotBalanceUSD} USD)
                        </Text>
                    </VStack>
                </Stack>
            </Center>
            <Center>
                <Stack direction="row" spacing={4} align="center" color="white">
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
