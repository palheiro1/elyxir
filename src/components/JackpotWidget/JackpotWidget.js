import { useEffect, useState } from 'react';
import { Box, Center, Stack, StackDivider, Text } from '@chakra-ui/react';

// Components
import BlockInfo from './BlockInfo';
import Countdown from './Countdown';

import { BLOCKTIME, FREQUENCY, NODEURL } from '../../data/CONSTANTS';

import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';

/**
 * @name JackpotWidget
 * @description This component is the jackpot widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} style - Style of the component
 */
const JackpotWidget = ({ style = 1 }) => {
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
            const response = await getBlockchainStatus(NODEURL);

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

    return (
        <>
            {style === 1 && (
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
                            <Countdown jackpotTimer={jackpotTimer} />

                            <BlockInfo jackpotStatus={jackpotStatus} jackpotTimer={jackpotTimer} />
                        </Stack>
                    </Center>
                </Box>
            )}
            {style === 2 && (
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
                            <Countdown jackpotTimer={jackpotTimer} />

                            <BlockInfo jackpotStatus={jackpotStatus} jackpotTimer={jackpotTimer} />
                        </Stack>
                    </Center>
                </Box>
            )}
        </>
    );
};

export default JackpotWidget;
