import { Center, Flex, Grid, GridItem, Spinner, Stack, Text } from '@chakra-ui/react';

const TicketsTable = ({ tickets, totalTickets }) => {
    return (
        <Stack className="custom-scrollbar" spacing={4}>
            {tickets === null ? (
                <Center w="100%" py={10}>
                    <Spinner color="#FFF" w={10} h={10} />
                </Center>
            ) : tickets.length === 0 ? (
                <Center w="100%" py={10}>
                    <Text fontFamily="Chelsea Market, System" fontWeight={100} fontSize="medium" color="#FFF">
                        There are no participants yet.
                    </Text>
                </Center>
            ) : (
                <>
                    <Flex
                        direction={'row'}
                        maxHeight={'55vh'}
                        overflowY="auto"
                        w={'100%'}
                        mx={'auto'}
                        px={4}
                        flexFlow={'row wrap'}
                        borderRadius={'10px'}
                        bgColor={'#404040'}>
                        {tickets.map(({ ticket, color }, index) => {
                            return (
                                <Flex key={index} w={'40px'} h={'30px'} m={3} bgColor={color} color={'#FFF'}>
                                    <Text fontFamily={'Chelsea market, system-ui'} m={'auto'}>
                                        {ticket}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        w={'100%'}
                        mx={'auto'}
                        p={2}
                        borderRadius={'10px'}
                        border={'2px solid #7FC0BE'}
                        color={'#000'}
                        fontFamily={'Chelsea market, system-ui'}
                        bgColor={'#73DDE8'}
                        fontSize={{ base: 'md', md: 'xl' }}
                        position="sticky"
                        top="0"
                        zIndex={1}>
                        <GridItem my={'auto'} textAlign={'center'}>
                            <Text fontWeight={500}>CURRENT TOTAL</Text>
                        </GridItem>
                        <GridItem my={'auto'} textAlign={'center'} />

                        <GridItem my={'auto'} textAlign={'center'}>
                            <Text fontWeight={700}>{totalTickets}</Text>
                        </GridItem>
                    </Grid>
                </>
            )}
        </Stack>
    );
};

export default TicketsTable;
