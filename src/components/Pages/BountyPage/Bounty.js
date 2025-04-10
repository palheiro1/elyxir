import { Box, Button, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import Inventory from './Components/Inventory/Inventory';
import Tickets from './Components/Tickets/Tickets';
import Rewards from './Components/Rewards/Rewards';
import { useSelector } from 'react-redux';
import { BLOCKTIME, FREQUENCY } from '../../../data/CONSTANTS';
import { useEffect } from 'react';

/**
 * @name Bounty
 * @description Bounty page
 * @param {object} infoAccount - Account info
 * @param {array} cards - All cards
 * @returns {JSX.Element} - JSX to display
 * @author Dario Maza Berdugo
 * @version 1.0
 */
const Bounty = ({ infoAccount, cards = [] }) => {
    const [openInventory, setOpenInventory] = useState(false);
    const [option, setOption] = useState(1);

    const handleCloseInventory = () => {
        setOpenInventory(false);
    };

    const handleOpenInventory = () => {
        cards && setOpenInventory(true);
    };

    const { prev_height } = useSelector(state => state.blockchain);
    const [bountyTimer, setBountyTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    useEffect(() => {
        const getBountyTimer = () => {
            const modulo = prev_height % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setBountyTimer({ days, hours, minutes, remainingBlocks });
        };

        prev_height && getBountyTimer();
    }, [prev_height]);

    const [isMobile] = useMediaQuery('(max-width: 1190px)');

    return (
        <Box bgColor={'#202323'} borderRadius={'25px'}>
            {option === 1 && <Tickets accountRs={infoAccount.accountRs} isMobile={isMobile} setOption={setOption} />}
            {option === 2 && <Rewards account={infoAccount.accountRs} />}
            <Stack
                mx={2}
                w={'100%'}
                direction={'row'}
                justifyContent={option === 2 ? 'space-between' : 'flex-end'}
                p={4}
                px={4}>
                {option === 2 && (
                    <Button
                        color={'#B2496C'}
                        bgColor={'#FFF'}
                        borderRadius={'full'}
                        letterSpacing={1}
                        fontFamily={'Chelsea Market, System UI'}
                        fontWeight={500}
                        px={4}
                        py={2}
                        onClick={() => setOption(1)}>
                        MY TICKETS
                    </Button>
                )}
                <Stack direction={'row'} fontFamily={'Chelsea Market, System UI'}>
                    {option === 2 && (
                        <Stack direction={'row'} my={'auto'} mx={2}>
                            <Text fontSize={'md'}>NEXT BOUNTY IN: </Text>
                            <Text fontSize={'md'} color={'#39D5D5'}>
                                {bountyTimer.days}D {bountyTimer.hours}H {bountyTimer.minutes}MIN
                            </Text>
                        </Stack>
                    )}
                    <Button
                        color={'#FFF'}
                        bgColor={'#B2496C'}
                        borderRadius={'full'}
                        justifySelf={'flex-end'}
                        letterSpacing={1.5}
                        fontSize={'lg'}
                        fontWeight={500}
                        onClick={() => handleOpenInventory()}>
                        PARTICIPATE
                    </Button>
                </Stack>
            </Stack>
            {openInventory && (
                <Inventory
                    infoAccount={infoAccount}
                    cards={cards}
                    handleCloseInventory={handleCloseInventory}
                    isMobile={isMobile}
                />
            )}
        </Box>
    );
};

export default Bounty;
