import { useEffect, useState } from 'react';
import { Box, Center, Stack, StackDivider, Text, useColorModeValue } from '@chakra-ui/react';

// Components
// import BlockInfo from './BlockInfo';
import VCountdown from './VCountdown';
import HCountdown from './HCountdown';

// Data
import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

// Services
//import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';
import { getJackpotBalance, getJackpotBalanceUSD } from '../../services/Jackpot/utils';

/**
 * @name JackpotWidget
 * @description This component is the jackpot widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} cStyle - Style of the component
 * @param {Number} numParticipants - Number of participants in the jackpot
 * @param {Object} blockchainStatus - Blockchain status
 * @returns {JSX.Element} - JSX element
 * @example
 * <JackpotWidget cStyle = 1 /> // Default style - Same as the home page
 * <JackpotWidget cStyle = 2 /> // Style for the jackpot page
 */
const JackpotWidget = ({ cStyle = 1, numParticipants = 0, blockchainStatus = {} }) => {
    const [jackpotTimer, setJackpotTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

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

    useEffect(() => {
        const getJackpotTimer = () => {
            const modulo = blockchainStatus.prev_height % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            //const delta = Number(remainingSecs - (BLOCKTIME - blockchainStatus.timer));
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setJackpotTimer({ days, hours, minutes, remainingBlocks });
        };

        blockchainStatus && getJackpotTimer();
    }, [blockchainStatus]);

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <>
            {cStyle === 1 && (
                <Box alignContent="center">
                    <Text mb={4} fontSize="2xl" textAlign="center" fontWeight="bolder">
                        Jackpot
                    </Text>
                    <Center>
                        <Stack
                            bg="#1A273D"
                            shadow="dark-lg"
                            rounded="lg"
                            p={4}
                            direction={{ base: 'column', lg: 'row' }}
                            divider={<StackDivider borderColor="blue.800" />}>
                            <VCountdown
                                jackpotTimer={jackpotTimer}
                                jackpotBalance={jackpotBalance}
                                jackpotBalanceUSD={jackpotBalanceUSD}
                            />
                        </Stack>
                    </Center>
                </Box>
            )}
            {cStyle === 2 && (
                <Center my={4} mb={8}>
                    <Box
                        p={4}
                        border="1px"
                        borderColor={borderColor}
                        rounded="lg"
                        bg="blackAlpha"
                        shadow="dark-lg"
                        direction="row">
                            <HCountdown
                                jackpotTimer={jackpotTimer}
                                numParticipants={numParticipants}
                                jackpotBalance={jackpotBalance}
                                jackpotBalanceUSD={jackpotBalanceUSD}
                            />
                    </Box>
                </Center>
            )}
        </>
    );
};

export default JackpotWidget;
