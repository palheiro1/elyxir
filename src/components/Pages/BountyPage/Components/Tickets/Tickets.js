import { Box, Button, Center, Image, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import BountyWidget from '../../../../BountyWidget/BountyWidget';
import TicketsTable from './TicketsTable';

const Tickets = ({ accountRs, isMobile, setOption }) => {
    return (
        <>
            <Center flexDirection={'column'}>
                <Stack direction="row" w="80%" align="center" px={4} py={2}>
                    <Box w="33%" display="flex" justifyContent="flex-start">
                        <Image
                            src="/images/currency/multicurrency.png"
                            boxSize="25%"
                            background="transparent"
                            color="#FFF"
                        />
                    </Box>
                    <Box w="33%" display="flex" justifyContent="center">
                        <Text fontSize="2xl" fontFamily="Chelsea Market, System-ui" letterSpacing={1.5}>
                            BOUNTY
                        </Text>
                    </Box>
                    <Box w="33%" display="flex" justifyContent="flex-end">
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
                <BountyWidget cStyle={2} />
            </Center>
            <Stack mx={2} w={'100%'} direction={'row'} justifyContent={'space-between'} p={4} px={4}>
                <Text
                    fontSize="xl"
                    mt={4}
                    mb={-2}
                    fontFamily={'Chelsea Market, System UI'}
                    letterSpacing={1.5}
                    fontWeight={500}>
                    MY TICKETS
                </Text>
            </Stack>
            <Box px={4} pb={6}>
                <TicketsTable isMobile={isMobile} accountRs={accountRs} />
            </Box>
        </>
    );
};

export default Tickets;
