import { Box, Center, Grid, GridItem, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getUserParticipations } from '../../../../../services/Bounty/utils';

const TicketsRow = ({ index, data, isMobile }) => {
    const [, info] = data;
    const { burned, tickets, rarity } = info;

    const bg = index % 2 === 0 ? '#323636' : '#202323';

    const color = '#FFF';

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    color={color}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {rarity}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    color={color}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    textTransform={'uppercase'}
                    justifyContent="center">
                    {burned}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {tickets}
                </Text>
            </GridItem>
        </Grid>
    );
};

const TicketsTable = ({ isMobile, accountRs }) => {
    const color = '#B2496C';

    const [entries, setEntries] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            const tickets = await getUserParticipations(accountRs);

            setEntries(tickets.tickets);
            setTotalTickets(tickets.totalTickets);
        };
        fetchTickets();
    }, [accountRs]);

    return (
        <Stack className="custom-scrollbar" spacing={4}>
            {entries === null ? (
                <Center w="100%" py={10}>
                    <Spinner color="#FFF" w={10} h={10} />
                </Center>
            ) : Object.entries(entries).every(entry => entry.burned === 0) ? (
                <Center w="100%" py={10}>
                    <Text fontFamily="Chelsea Market, System" fontWeight={100} fontSize="medium" color="#FFF">
                        You don’t have any tickets yet.
                    </Text>
                </Center>
            ) : (
                <>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        w="100%"
                        mx="auto"
                        mt={3}
                        p={2}
                        borderRadius="10px"
                        border={`2px solid ${color}`}
                        color={'#FFF'}
                        bgColor={color}
                        position="sticky"
                        top="0"
                        zIndex={1}>
                        <GridItem colSpan={1} textAlign="center">
                            <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                RARITY
                            </Text>
                        </GridItem>
                        <GridItem colSpan={1} textAlign="center">
                            <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                BURNED CARDS
                            </Text>
                        </GridItem>
                        <GridItem colSpan={1} textAlign="center">
                            <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                TICKETS OBTAINED
                            </Text>
                        </GridItem>
                    </Grid>

                    <Box maxHeight={'55vh'} overflowY="auto" w={'100%'} mx={'auto'} borderRadius={'10px'}>
                        {Object.entries(entries).map((entry, index) => (
                            <TicketsRow key={index} index={index} data={entry} isMobile={isMobile} />
                        ))}
                    </Box>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        w={'100%'}
                        mx={'auto'}
                        p={2}
                        borderRadius={'10px'}
                        border={'2px solid #7FC0BE'}
                        color={'#000'}
                        bgColor={' #73DDE8'}
                        position="sticky"
                        top="0"
                        zIndex={1}>
                        <GridItem my={'auto'} textAlign={'center'}>
                            <Text fontWeight={500} fontSize={isMobile ? 'sm' : 'lg'}>
                                TOTAL
                            </Text>
                        </GridItem>
                        <GridItem my={'auto'} textAlign={'center'} />

                        <GridItem my={'auto'} textAlign={'center'}>
                            <Text fontWeight={700} fontSize={isMobile ? 'sm' : 'lg'}>
                                {totalTickets}
                            </Text>
                        </GridItem>
                    </Grid>
                </>
            )}
        </Stack>
    );
};

export default TicketsTable;
