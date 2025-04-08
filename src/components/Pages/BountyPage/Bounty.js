import { Box, Button, Center, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import BountyWidget from '../../BountyWidget/BountyWidget';
import Inventory from './Components/Inventory/Inventory';
import Tickets from './Components/Tickets/Tickets';

/**
 * @name Bounty
 * @description Bounty page
 * @param {object} infoAccount - Account info
 * @param {array} cards - All cards
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Bounty = ({ infoAccount, cards = [] }) => {
    const [openInventory, setOpenInventory] = useState(false);
    // const [participations, setParticipations] = useState(null);
    // const [userParticipations, setUserParticipations] = useState(null);

    // useEffect(() => {
    //     const fetchJackpotParticipants = async () => {
    //         const response = await getJackpotParticipants();
    //         setParticipations(response.participants);

    //         for await (const [key, value] of Object.entries(response.participants)) {
    //             const accountId = addressToAccountId(infoAccount.accountRs);
    //             if (key === accountId) setUserParticipations(value);
    //         }
    //         getBountyTransactions();
    //     };
    //     fetchJackpotParticipants();
    // }, []);

    const handleCloseInventory = () => {
        setOpenInventory(false);
    };

    const handleOpenInventory = () => {
        cards && setOpenInventory(true);
    };

    const [isMobile] = useMediaQuery('(max-width: 1190px)');

    return (
        <Box bgColor={'#202323'} borderRadius={'25px'} fontFamily={'Chelsea Market, System UI'}>
            <Center flexDirection={'column'}>
                <Stack mx={2} w={'100%'} direction={'row'} justifyContent={'space-between'} p={4} px={6}>
                    <Text fontSize="4xl">BOUNTY</Text>
                    <Button
                        m={4}
                        color={'#B2496C'}
                        bgColor={'#FFF'}
                        borderRadius={'full'}
                        letterSpacing={1}
                        fontWeight={500}>
                        PREVIUS BOUNTIES
                    </Button>
                </Stack>
                <BountyWidget cStyle={2} />
            </Center>
            <Stack mx={2} w={'100%'} direction={'row'} justifyContent={'space-between'} p={4} px={4}>
                <Text fontSize="xl" mt={4} mb={-2}>
                    MY TICKETS
                </Text>
            </Stack>
            <Box px={4} pb={6}>
                <Tickets isMobile={isMobile} accountRs={infoAccount.accountRs} />
            </Box>
            <Stack mx={2} w={'100%'} direction={'row'} justifyContent={'flex-end'} p={4} px={4}>
                <Button
                    m={4}
                    mt={-2}
                    color={'#FFF'}
                    bgColor={'#B2496C'}
                    borderRadius={'full'}
                    letterSpacing={1}
                    fontWeight={500}
                    onClick={() => handleOpenInventory()}>
                    PARTICIPATE
                </Button>
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
