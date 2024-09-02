import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Spinner, Stack, Table, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';
import { formatAddress } from '../../Utils/BattlegroundsUtils';

const GeneralLeaderboard = ({ handleGoBack, isMobile }) => {
    const { entries, status } = useSelector(state => state.leaderboards);

    return (
        <Stack>
            <Heading mx={'auto'} mt={4} fontFamily={'Chelsea Market, System'} fontWeight={100}>
                General leaderboard
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
                                        Tribute won
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Lands conquered
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Successfull defenses
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Battle efficiency
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Defense duration
                                    </Td>
                                    <Td
                                        fontFamily={'Chelsea Market, System'}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'lg'}
                                        textAlign={'center'}>
                                        Total points
                                    </Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {entries.map(
                                    (
                                        {
                                            accountRS,
                                            totalPoints,
                                            name,
                                            tributeWonPoints,
                                            landsConqueredPoints,
                                            successfullDefensesPoints,
                                            battleEfficiencyPoints,
                                            defenseDurationPoints,
                                        },
                                        index
                                    ) => {
                                        let bg = () => {
                                            switch (index) {
                                                case 0:
                                                    return 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)';
                                                case 1:
                                                    return 'linear-gradient(45deg,#999 5%,#fff 10%,#ccc 30%,#ddd 50%,#ccc 70%,#fff 80%,#999 95%)';
                                                case 2:
                                                    return 'linear-gradient(45deg, #8c5e3c, #b08d57, #d6c3a1)';
                                                default:
                                                    return '#DB78AA';
                                            }
                                        };
                                        return (
                                            <Tr key={index} p={2}>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {`#${index + 1}`}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {name ? name : formatAddress(accountRS)}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {tributeWonPoints || 0}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {landsConqueredPoints || 0}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {successfullDefensesPoints || 0}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {battleEfficiencyPoints || 0}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {defenseDurationPoints || 0}
                                                    </Text>
                                                </Td>
                                                <Td textAlign={'center'} p={2}>
                                                    <Text
                                                        bg={bg}
                                                        p={3}
                                                        maxH={'45px'}
                                                        fontFamily={'Chelsea Market, System'}
                                                        h="100%"
                                                        fontSize={isMobile ? 'xs' : 'md'}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center">
                                                        {totalPoints?.toFixed(1)}
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        );
                                    }
                                )}
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

export default GeneralLeaderboard;
