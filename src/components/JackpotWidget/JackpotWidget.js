import { useEffect, useState } from 'react';
import { AbsoluteCenter, Box, Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';

// Components
import HCountdown from './HCountdown';

// Data
import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

// Services
//import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';
import { getJackpotBalance, swapPriceEthtoUSD, getJackpotParticipants } from '../../services/Jackpot/utils';
import { getGemPrice, getManaPrice } from '../../services/Ardor/evmInterface';

/**
 * @name JackpotWidget
 * @description This component is the jackpot widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} cStyle - Style of the component
 * @param {Number} numParticipants - Number of participants in the jackpot
 * @param {Object} blockchainStatus - Blockchain status
 * @returns {JSX.Element} - JSX element
 * @example <JackpotWidget cStyle={0} numParticipants={0} blockchainStatus={{}} /> --> Home page
 * @example <JackpotWidget cStyle={1} numParticipants={0} blockchainStatus={{}} /> --> Jackpot page
 */
const JackpotWidget = ({ blockchainStatus = {}, cStyle = 0 }) => {
    const [jackpotTimer, setJackpotTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    const [jackpotBalance, setJackpotBalance] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0
    });

    const [jackpotBalanceUSD, setJackpotBalanceUSD] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
        Sumanga: 0,
        Total: 0,
    });
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [] });

    useEffect(() => {
        const fetchJackpotBalance = async () => {
            try {
                const [jackpotBalance, responseParticipants, gemPrice, manaPrice] = await Promise.all([
                    getJackpotBalance(),
                    getJackpotParticipants(),
                    getGemPrice(),
                    getManaPrice()
                ]);

                setJackpotBalance({
                    wETH: jackpotBalance,
                    GEM: 9000,
                    Mana: 9000
                });

                // const wETHinUSD = await swapPriceEthtoUSD(jackpotBalance);
                const [wethUsd, gemUsd, manaUsd, sumangaUsd] = await Promise.all([
                    swapPriceEthtoUSD(jackpotBalance),
                    swapPriceEthtoUSD(gemPrice),
                    swapPriceEthtoUSD(manaPrice),
                    swapPriceEthtoUSD(0.25)
                ]);
                setJackpotBalanceUSD({
                    wETH: wethUsd,
                    GEM: gemUsd,
                    Mana: manaUsd,
                    Sumanga: sumangaUsd,
                    Total: Number(wethUsd) + Number(gemUsd) + Number(manaUsd) + Number(sumangaUsd)
                });

                let auxParticipants = [];
                let numParticipants = 0;
                Object.entries(responseParticipants).forEach(entry => {
                    const [key, value] = entry;
                    if (value > 0) {
                        auxParticipants.push({ account: key, quantity: value });
                        numParticipants += value;
                    }
                });
                setParticipants({ numParticipants, participants: auxParticipants });
            } catch (error) {
                console.error('🚀 ~ file: JackpotWidget.js:47 ~ fetchJackpotBalance ~ error:', error);
            }
        };

        fetchJackpotBalance();
    }, []);

    useEffect(() => {
        const getJackpotTimer = () => {
            const modulo = blockchainStatus.prev_height % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setJackpotTimer({ days, hours, minutes, remainingBlocks });
        };

        blockchainStatus && getJackpotTimer();
    }, [blockchainStatus]);

    const borderColor = cStyle === 0 ? 'rgb(47,144,136)' : 'rgb(59,83,151)';
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.15)' : 'rgba(59, 83, 151, 0.15)';

    return (
        <Center py={4}>
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" gap={3}>
                <Box p={6} border="1px" borderColor={borderColor} rounded="lg" bg="blackAlpha" direction="row" bgColor={bgColor}>
                    <HCountdown
                        cStyle={cStyle}
                        jackpotTimer={jackpotTimer}
                        numParticipants={participants.numParticipants}
                        jackpotBalance={jackpotBalance}
                        jackpotBalanceUSD={jackpotBalanceUSD}
                    />
                </Box>
                <Box p={6} border="1px" borderColor={borderColor} rounded="lg" bg="blackAlpha" direction="row" bgColor={bgColor}>
                    <Heading as="h3" size="lg" color="white">
                        JACKPOT
                    </Heading>
                    <Box position={"relative"} w={"100%"} h={"100%"}>
                        <AbsoluteCenter>
                            <Flex align={"center"} gap={2}>
                                <Text textAlign={"center"} h="100%" fontWeight={"bold"} fontSize={"3xl"}>
                                    {(jackpotBalanceUSD.Total).toFixed(2)}
                                </Text>
                                <Text textAlign={"center"} fontSize={"xl"}>
                                    USD
                                </Text>
                            </Flex>
                        </AbsoluteCenter>
                    </Box>
                </Box>
            </Stack>
        </Center>
    );
};

export default JackpotWidget;
