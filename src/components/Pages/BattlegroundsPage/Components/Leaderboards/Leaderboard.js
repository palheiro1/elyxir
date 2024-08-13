import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Spinner, Stack, Table, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';
import { capitalize } from '../../Utils/BattlegroundsUtils';

const Leaderboard = ({ data, handleGoBack, isMobile }) => {
    const { entries, status } = useSelector(state => state.leaderboards);
    const { type } = data;

    return (
        <Stack>
            <Heading mx={'auto'} mt={4} fontFamily={'Chelsea Market, System'} fontWeight={100}>
                {capitalize(type)} leaderboard
            </Heading>
            <IconButton
                background={'transparent'}
                color={'#FFF'}
                icon={<ChevronLeftIcon />}
                _hover={{ background: 'transparent' }}
                position="fixed"
                top={2}
                left={3}
                fontSize="2rem"
                zIndex={999}
                onClick={handleGoBack}
            />
            {status === 'loading' ? (
                <Box
                    h={'100%'}
                    position={'absolute'}
                    color={'#FFF'}
                    alignContent={'center'}
                    top={'50%'}
                    left={'50%'}
                    w={'100%'}
                    textAlign={'center'}
                    transform={'translate(-50%, -50%)'}>
                    <Spinner color="#FFF" w={20} h={20} />
                </Box>
            ) : (
                <>
                    {entries && entries.length > 0 ? (
                        <Table w={'80%'} mx={'auto'}>
                            <Thead>
                                <Tr>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Position
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Name/ Address
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Points
                                    </Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {entries.map(({ accountRS, points, name }, index) => (
                                    <Tr
                                        key={index}
                                        bgColor={() => {
                                            switch (index) {
                                                case 0:
                                                    return '#FFD700';
                                                case 1:
                                                    return '#C0C0C0';
                                                case 2:
                                                    return '#CD7F32';
                                                default:
                                                    return '#DB78AA';
                                            }
                                        }}>
                                        <Td
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            py={2}
                                            textAlign={'center'}>{`#${index + 1}`}</Td>
                                        <Td
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            py={2}
                                            textAlign={'center'}>
                                            {name ? name : accountRS}
                                        </Td>
                                        <Td
                                            fontFamily={'Chelsea Market, System'}
                                            color={'#FFF'}
                                            py={2}
                                            textAlign={'center'}>
                                            {points}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Box
                            h={'100%'}
                            position={'absolute'}
                            color={'#FFF'}
                            alignContent={'center'}
                            top={'50%'}
                            left={'50%'}
                            w={'100%'}
                            textAlign={'center'}
                            transform={'translate(-50%, -50%)'}>
                            <Text fontFamily={'Chelsea Market, System'} fontWeight={100} fontSize={'medium'}>
                                Any participants yet
                            </Text>
                        </Box>
                    )}
                </>
            )}
        </Stack>
    );
};

export default Leaderboard;
