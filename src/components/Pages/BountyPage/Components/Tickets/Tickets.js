import { Box, Center, Grid, GridItem, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getBurnTransactions } from '../../../../../utils/cardsUtils';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';

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

const Tickets = ({ isMobile, accountRs }) => {
    const color = '#B2496C';

    const [entries, setEntries] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            const res = await getBurnTransactions(accountRs);
            const tickets = {
                common: { burned: 0, multiplier: 1 },
                rare: { burned: 0, multiplier: 8 },
                epic: { burned: 0, multiplier: 25 },
            };
            for await (const tx of res) {
                const { attachment } = tx;
                if (attachment.asset) {
                    const card = await getAsset(attachment.asset);
                    const description = JSON.parse(card.description);
                    switch (description.rarity) {
                        case 'common':
                            tickets.common.burned += 1;
                            break;
                        case 'rare':
                            tickets.rare.burned += 1;
                            break;
                        case 'epic':
                            tickets.epic.burned += 1;
                            break;
                        default:
                            break;
                    }
                }
            }

            const structured = {
                common: {
                    rarity: 'Common',
                    burned: tickets.common.burned,
                    tickets: tickets.common.burned * tickets.common.multiplier,
                },
                rare: {
                    rarity: 'Rare',
                    burned: tickets.rare.burned,
                    tickets: tickets.rare.burned * tickets.rare.multiplier,
                },
                epic: {
                    rarity: 'Epic',
                    burned: tickets.epic.burned,
                    tickets: tickets.epic.burned * tickets.epic.multiplier,
                },
            };

            const total = structured.common.tickets + structured.rare.tickets + structured.epic.tickets;

            setEntries(structured);
            setTotalTickets(total);
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

export default Tickets;
