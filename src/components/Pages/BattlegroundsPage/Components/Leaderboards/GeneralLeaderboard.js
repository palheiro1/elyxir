import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Grid, GridItem, Text } from '@chakra-ui/react';
import { formatAddress } from '../../Utils/BattlegroundsUtils';

const LeaderboardRow = ({ index, data, isMobile }) => {
    const {
        accountRS,
        totalPoints,
        name,
        landsConqueredPoints,
        successfullDefensesPoints,
        battleEfficiencyPoints,
        defenseDurationPoints,
    } = data;

    const bg = index % 2 === 0 ? '#2A2E2E' : '#323636';
    const color = index < 5 ? '#D597B2' : '#FFF';

    return (
        <Grid templateColumns="repeat(7, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    color={color}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {`#${index + 1}`}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    color={color}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    textTransform={'uppercase'}
                    justifyContent="center">
                    {name ? name : formatAddress(accountRS)}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {landsConqueredPoints || 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {successfullDefensesPoints || 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {battleEfficiencyPoints || 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {defenseDurationPoints || 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    color={'#7FC0BE'}
                    justifyContent="center">
                    {totalPoints?.toFixed(1)}
                </Text>
            </GridItem>
        </Grid>
    );
};

const GeneralLeaderboard = ({ isMobile }) => {
    const { entries } = useSelector(state => state.leaderboards);
    return (
        <Stack overflowY={'scroll'} className="custom-scrollbar">
            {entries === null ? (
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
                    {entries.length > 0 ? (
                        <>
                            <Grid
                                templateColumns="repeat(7, 1fr)"
                                gap={4}
                                w={'90%'}
                                mx={'auto'}
                                mt={3}
                                p={2}
                                borderRadius={'10px'}
                                border={'2px solid #5A679B'}>
                                {/* Header Row */}
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        POSITION
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        NAME/ ADDRESS
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        LANDS CONQUERED
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        SUCCESSFUL DEFENSES
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        BATTLE EFFICIENCY
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        DEFESE DURATION
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        color={'#FFF'}
                                        fontSize={isMobile ? 'sm' : 'md'}>
                                        TOTAL POINTS
                                    </Text>
                                </GridItem>
                            </Grid>
                            <Box bgColor={'#323636'} w={'90%'} mx={'auto'} borderRadius={'10px'} p={2}>
                                {entries.map((entry, index) => (
                                    <LeaderboardRow key={index} index={index} data={entry} isMobile={isMobile} />
                                ))}
                            </Box>
                        </>
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
                                No participants yet
                            </Text>
                        </Box>
                    )}
                </>
            )}
        </Stack>
    );
};

export default GeneralLeaderboard;
