import { useEffect, useState } from 'react';
import { Box, Center, Grid, GridItem, Stack, StackDivider, Text, useColorModeValue } from '@chakra-ui/react';

// Components
import BlockInfo from './BlockInfo';
import VCountdown from './VCountdown';

import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';
import HCountdown from './HCountdown';

/**
 * @name JackpotWidget
 * @description This component is the jackpot widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} cStyle - Style of the component
 * @returns {JSX.Element} - JSX element
 * @example
 * <JackpotWidget cStyle = 1 /> // Default style - Same as the home page
 * <JackpotWidget cStyle = 2 /> // Style for the jackpot page
 */
const JackpotWidget = ({ cStyle = 1 }) => {
    const [jackpotStatus, setJackpotStatus] = useState({
        prev_height: 0,
        status: false,
        timer: 0,
    });

    const [jackpotTimer, setJackpotTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    useEffect(() => {
        const getJackpotStatus = async () => {
            const response = await getBlockchainStatus();

            if (jackpotStatus.prev_height !== response.data.numberOfBlocks) {
                setJackpotStatus({
                    prev_height: response.data.numberOfBlocks,
                    status: response.data,
                    timer: BLOCKTIME,
                });
            }
        };

        getJackpotStatus();

        const interval = setInterval(() => {
            getJackpotStatus();
        }, 12500);
        return () => clearInterval(interval);
    }, [jackpotStatus.prev_height]);

    useEffect(() => {
        const interval = setInterval(() => {
            setJackpotStatus({
                ...jackpotStatus,
                timer: jackpotStatus.timer - 1,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [jackpotStatus]);

    useEffect(() => {
        const getJackpotTimer = () => {
            const modulo = jackpotStatus.status.numberOfBlocks % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - (BLOCKTIME - jackpotStatus.timer));

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setJackpotTimer({ days, hours, minutes, remainingBlocks });
        };

        jackpotStatus.status && getJackpotTimer();
    }, [jackpotStatus]);

    const bgColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200")

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
                            direction="row"
                            divider={<StackDivider borderColor="blue.800" />}>
                            <VCountdown jackpotTimer={jackpotTimer} />

                            <BlockInfo jackpotStatus={jackpotStatus} jackpotTimer={jackpotTimer} />
                        </Stack>
                    </Center>
                </Box>
            )}
            {cStyle === 2 && (
                <Center mt={4}>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        border="1px"
                        borderColor="whiteAlpha.300"
                        rounded="lg"
                        bg="blackAlpha"
                        shadow="dark-lg"
                        direction="row">

                        <GridItem colSpan={2} p={4} borderLeftRadius="lg">
                            <HCountdown jackpotTimer={jackpotTimer} />
                        </GridItem>

                        <GridItem bgColor={bgColor} p={4} borderRightRadius="lg">
                            <BlockInfo
                                jackpotStatus={jackpotStatus}
                                jackpotTimer={jackpotTimer}
                                cStyle={cStyle}
                            />
                        </GridItem>
                    </Grid>
                </Center>
            )}
        </>
    );
};

export default JackpotWidget;
