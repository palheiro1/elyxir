import { useEffect, useState } from 'react';
import { Box, Center } from '@chakra-ui/react';

// Components
import HCountdown from './HCountdown';

// Data
import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

// Services
//import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';
import { getJackpotBalance, getJackpotBalanceUSD, getJackpotParticipants } from '../../services/Jackpot/utils';

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
const JackpotWidget = ({ numParticipants = 0, blockchainStatus = {}, cStyle = 0 }) => {
    const [jackpotTimer, setJackpotTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    const [jackpotBalance, setJackpotBalance] = useState(0);
    const [jackpotBalanceUSD, setJackpotBalanceUSD] = useState(0);
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [] });

    useEffect(() => {
        const fetchJackpotBalance = async () => {
            try {
                const [jackpotBalance, jackpotBalanceUSD, responseParticipants] = await Promise.all([
                    getJackpotBalance(),
                    getJackpotBalanceUSD(),
                    getJackpotParticipants(),
                ]);
                setJackpotBalance(jackpotBalance);
                setJackpotBalanceUSD(jackpotBalanceUSD);

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
            //const delta = Number(remainingSecs - (BLOCKTIME - blockchainStatus.timer));
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setJackpotTimer({ days, hours, minutes, remainingBlocks });
        };

        blockchainStatus && getJackpotTimer();
    }, [blockchainStatus]);

    const borderColor = cStyle === 0 ? '#2f9088' : '#3b5397';

    return (
        <Center mb={4}>
            <Box p={4} border="1px" borderColor={borderColor} rounded="lg" bg="blackAlpha" direction="row">
                <HCountdown
                    cStyle={cStyle}
                    jackpotTimer={jackpotTimer}
                    numParticipants={participants.numParticipants || numParticipants}
                    jackpotBalance={jackpotBalance}
                    jackpotBalanceUSD={jackpotBalanceUSD}
                />
            </Box>
        </Center>
    );
};

export default JackpotWidget;
