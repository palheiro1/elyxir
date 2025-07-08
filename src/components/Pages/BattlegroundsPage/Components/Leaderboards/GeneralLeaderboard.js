import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Grid, GridItem, Text } from '@chakra-ui/react';
import { formatAddress } from '../../Utils/BattlegroundsUtils';

const LeaderboardRow = ({ index, data, isMobile, type }) => {
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
    const fiveWinners = index < 5 ? '#D597B2' : '#FFF';
    const oneWiner = index === 0 ? '#D597B2' : '#FFF';
    const color = type === 'general' ? fiveWinners : oneWiner;

    return (
        totalPoints > 0 && (
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
                        {landsConqueredPoints ? (landsConqueredPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
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
                        {successfullDefensesPoints
                            ? (successfullDefensesPoints * 1000).toFixed(0).toLocaleString('de-DE')
                            : 0}
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
                        {battleEfficiencyPoints
                            ? (battleEfficiencyPoints * 1000).toFixed(0).toLocaleString('de-DE')
                            : 0}
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
                        {defenseDurationPoints ? (defenseDurationPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
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
                        {totalPoints ? (totalPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
            </Grid>
        )
    );
};

const GeneralLeaderboard = ({ isMobile, color }) => {
    const { entries, data } = useSelector(state => state.leaderboards);
    return (
        <Stack className="custom-scrollbar">
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
                            {/* Header fijo */}
                            <Grid
                                templateColumns="repeat(7, 1fr)"
                                gap={4}
                                w={'90%'}
                                mx={'auto'}
                                mt={isMobile ? 0 : 3}
                                p={2}
                                borderRadius={'10px'}
                                border={`2px solid ${color}`}
                                color={'#000'}
                                bgColor={color}
                                position="sticky"
                                top="0"
                                zIndex={1}>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        POSITION
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        NAME/ ADDRESS
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        LANDS CONQUERED
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        SUCCESSFUL DEFENSES
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        BATTLE EFFICIENCY
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        DEFENSE DURATION
                                    </Text>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                                    <Text
                                        fontFamily={'Inter, System'}
                                        fontWeight={700}
                                        fontSize={isMobile ? 'xs' : 'md'}>
                                        TOTAL POINTS
                                    </Text>
                                </GridItem>
                            </Grid>
                            <Box
                                maxHeight={isMobile ? '30vh' : '45vh'}
                                overflowY="auto"
                                bgColor={'#323636'}
                                w={'90%'}
                                mx={'auto'}
                                borderRadius={'10px'}
                                p={2}>
                                {entries.map((entry, index) => (
                                    <LeaderboardRow
                                        key={index}
                                        index={index}
                                        data={entry}
                                        isMobile={isMobile}
                                        type={data.type}
                                    />
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
