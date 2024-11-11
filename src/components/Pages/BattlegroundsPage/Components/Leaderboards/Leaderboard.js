import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Spinner, Stack, Grid, GridItem, Text } from '@chakra-ui/react';

const LeaderboardRow = ({ index, accountRS, points, name, isMobile }) => {
    const color = index < 1 ? '#39D5D5' : '#FFF';

    return (
        points > 0 && (
            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" mx="auto" mt={0} borderRadius="10px" color={color}>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
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
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        textTransform={'uppercase'}
                        justifyContent="center">
                        {name ? name : accountRS}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {points ? Math.floor(points).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
            </Grid>
        )
    );
};

const Leaderboard = ({ isMobile }) => {
    const { entries, data } = useSelector(state => state.leaderboards);

    const color = () => {
        switch (data.type) {
            case 'terrestrial':
                return '#866678';
            case 'aquatic':
                return '#393CC1';
            case 'aerial':
                return '#5E67A2';
            case 'combativity':
                return '#FF4B85';
            default:
                return null;
        }
    };
    console.log('🚀 ~ Leaderboard ~ data:', data);

    return (
        <Stack overflowY="auto" className="custom-scrollbar" maxHeight="80vh" w="100%">
            {entries === null ? (
                <Box
                    h="100%"
                    position="absolute"
                    color="#FFF"
                    alignContent="center"
                    top="50%"
                    left="50%"
                    w="100%"
                    textAlign="center"
                    transform="translate(-50%, -50%)">
                    <Spinner color="#FFF" w={20} h={20} />
                </Box>
            ) : !entries || entries.length === 0 ? (
                <Box
                    h="100%"
                    position="absolute"
                    color="#FFF"
                    alignContent="center"
                    top="50%"
                    left="50%"
                    w="100%"
                    textAlign="center"
                    transform="translate(-50%, -50%)">
                    <Text fontFamily="Chelsea Market, System" fontWeight={100} fontSize="medium">
                        No participants yet
                    </Text>
                </Box>
            ) : (
                <>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        w="90%"
                        mx="auto"
                        mt={3}
                        p={5}
                        borderRadius="10px"
                        bgColor={color}>
                        <GridItem colSpan={1} textAlign="center" my="auto">
                            <Text
                                fontFamily="Inter, System"
                                fontWeight={700}
                                color="#FFF"
                                fontSize={isMobile ? 'sm' : 'md'}>
                                POSITION
                            </Text>
                        </GridItem>
                        <GridItem colSpan={1} textAlign="center" my="auto">
                            <Text
                                fontFamily="Inter, System"
                                fontWeight={700}
                                color="#FFF"
                                fontSize={isMobile ? 'sm' : 'md'}>
                                NAME/ ADDRESS
                            </Text>
                        </GridItem>
                        <GridItem colSpan={1} textAlign="center" my="auto">
                            <Text
                                fontFamily="Inter, System"
                                fontWeight={700}
                                color="#FFF"
                                fontSize={isMobile ? 'sm' : 'md'}>
                                POINTS
                            </Text>
                        </GridItem>
                    </Grid>
                    <Box maxHeight="55vh" overflowY="auto" w="90%" mx="auto" borderRadius="10px" p={2}>
                        {entries.map((entry, index) => (
                            <LeaderboardRow key={index} index={index} {...entry} isMobile={isMobile} />
                        ))}
                    </Box>
                </>
            )}
        </Stack>
    );
};

export default Leaderboard;
