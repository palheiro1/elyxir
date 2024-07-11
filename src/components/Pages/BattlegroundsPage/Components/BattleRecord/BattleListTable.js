import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

const BattleListTable = ({ battleDetails, handleViewDetails }) => {
    return (
        <Table variant={'unstyled'} textColor={'#FFF'} w={'85%'} mx={'auto'}>
            <Thead>
                <Tr>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Date
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Opponent
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Arena
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Position
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Result
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {battleDetails.length > 0 ? (
                    battleDetails.map((item, index) => {
                        let bgColor = index % 2 === 0 ? '#DB78AA' : '#D08FB0';
                        return (
                            <Tr
                                key={index}
                                onClick={() => handleViewDetails(item.id)}
                                cursor={'pointer'}
                                _hover={{ backgroundColor: 'whiteAlpha.300' }}>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        fontFamily={'Chelsea Market, System'}
                                        h="100%"
                                        p={3}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.date}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        fontFamily={'Chelsea Market, System'}
                                        p={3}
                                        h="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.isUserDefending
                                            ? item.attackerDetails.name || item.attackerDetails.accountRS
                                            : item.defenderDetails.name || item.defenderDetails.accountRS}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        p={3}
                                        fontFamily={'Chelsea Market, System'}
                                        h="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.arenaName}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        p={3}
                                        fontFamily={'Chelsea Market, System'}
                                        h="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.isUserDefending ? 'DEFENDER' : 'ATTACKER'}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        h="100%"
                                        display="flex"
                                        p={3}
                                        alignItems="center"
                                        justifyContent="center"
                                        bgColor={item.isUserDefending === item.isDefenderWin ? '#66FA7C' : '#FF6058'}
                                        fontFamily={'Chelsea Market, System'}>
                                        {item.isUserDefending === item.isDefenderWin ? 'WON' : 'LOST'}
                                    </Box>
                                </Td>
                            </Tr>
                        );
                    })
                ) : (
                    <Text
                        position={'absolute'}
                        fontFamily={'Chelsea Market, system-ui'}
                        color={'#FFF'}
                        fontSize={'large'}
                        top={'50%'}
                        left={'50%'}
                        transform={'translate(-50%, -50%)'}>
                        You have not yet fought any battle
                    </Text>
                )}
            </Tbody>
        </Table>
    );
};

export default BattleListTable;
