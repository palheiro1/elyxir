import { Box, Button, Center, Flex, Image, Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import BountyWidget from '../../../../BountyWidget/BountyWidget';
import TicketsTable from './TicketsTable';
import { useState } from 'react';
import { getJackpotFormattedTickets } from '../../../../../services/Bounty/utils';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';

const Tickets = ({ accountRs, isMobile, setOption }) => {
    const [entries, setEntries] = useState(null);
    const [userTickets, setUserTickets] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);
    const [participants, setParticipants] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            const { allTickets: tickets, participants } = await getJackpotFormattedTickets();
            setEntries(tickets);
            setTotalTickets(tickets.length);
            setParticipants(participants);
            const accountId = await addressToAccountId(accountRs);
            const userTickets = tickets.filter(ticket => ticket.account === accountId);
            setUserTickets({ totalTickets: userTickets.length, color: userTickets[0]?.color });
        };
        fetchTickets();
    }, [accountRs]);

    return (
        <>
            <Center flexDirection={'column'}>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    w={{ base: '100%', md: '80%' }}
                    align="center"
                    px={4}
                    py={2}>
                    <Box
                        w={{ base: '100%', md: '33%' }}
                        display="flex"
                        justifyContent={{ base: 'center', md: 'flex-start' }}>
                        <Image
                            src="/images/currency/multicurrency.png"
                            boxSize="25%"
                            background="transparent"
                            color="#FFF"
                        />
                    </Box>
                    <Box w={{ base: '100%', md: '33%' }} display="flex" justifyContent="center">
                        <Text fontSize="2xl" fontFamily="Chelsea Market, System-ui" letterSpacing={1.5} color={'#FFF'}>
                            BOUNTY
                        </Text>
                    </Box>
                    <Box
                        w={{ base: '100%', md: '33%' }}
                        display="flex"
                        justifyContent={{ base: 'center', md: 'flex-end' }}>
                        <Button
                            m={4}
                            color={'#B2496C'}
                            bgColor={'#FFF'}
                            borderRadius={'full'}
                            letterSpacing={1}
                            fontFamily={'Chelsea Market, System UI'}
                            fontWeight={500}
                            onClick={() => setOption(2)}>
                            PREVIOUS BOUNTY
                        </Button>
                    </Box>
                </Stack>
                <BountyWidget cStyle={2} totalParticipants={participants} />
            </Center>
            <Stack
                mx={2}
                w={'100%'}
                direction={{ base: 'column', md: 'row' }}
                justifyContent={'space-between'}
                p={4}
                color={'#FFF'}>
                <Stack direction={'row'} justifyContent={'space-between'} w={'100%'} p={2}>
                    <Text
                        fontSize="xl"
                        mb={-2}
                        fontFamily={'Chelsea Market, System UI'}
                        letterSpacing={1.5}
                        color={'#FFF'}
                        fontWeight={500}>
                        YOUR TICKETS:
                    </Text>
                    {userTickets && (
                        <Flex w={'45px'} h={'30px'} bgColor={userTickets.color} borderRadius={'5px'}>
                            <Text fontFamily={'Chelsea market, system-ui'} m={'auto'}>
                                {userTickets.totalTickets}
                            </Text>
                        </Flex>
                    )}
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'} w={'100%'} p={2}>
                    <Text
                        fontSize="xl"
                        mb={-2}
                        fontFamily={'Chelsea Market, System UI'}
                        letterSpacing={1.5}
                        fontWeight={500}>
                        USERS PARTICIPATING:
                    </Text>
                    {userTickets && (
                        <Flex w={'45px'} h={'30px'} bgColor={'#5BB249'} borderRadius={'5px'}>
                            <Text fontFamily={'Chelsea market, system-ui'} m={'auto'}>
                                {participants}
                            </Text>
                        </Flex>
                    )}
                </Stack>
            </Stack>
            <Box px={4} pb={6}>
                <TicketsTable isMobile={isMobile} tickets={entries} totalTickets={totalTickets} />
            </Box>
        </>
    );
};

export default Tickets;
