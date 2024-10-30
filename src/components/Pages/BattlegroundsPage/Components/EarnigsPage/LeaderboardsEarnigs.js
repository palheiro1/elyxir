import { Box, Grid, GridItem, Image, Stack, Text } from '@chakra-ui/react';
import React from 'react';

const LeaderboardsEarnigs = ({ isMobile }) => {
    return (
        <>
            <Grid
                templateColumns="repeat(5, 1fr)"
                gap={4}
                w={'90%'}
                mx={'auto'}
                mt={3}
                p={1}
                borderRadius={'10px'}
                border={'2px solid #7FC0BE'}
                color={'#FFF'}
                bgColor={'inherit'}
                position="sticky"
                top="0"
                zIndex={1}>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        DATE
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        PHANTEON
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                        <Text
                            fontFamily={'Inter, System'}
                            my={'auto'}
                            fontWeight={700}
                            fontSize={isMobile ? 'sm' : 'md'}>
                            GEM
                        </Text>
                        <Image src="/images/currency/gem.png" boxSize={'30px'} />
                    </Stack>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                        <Text
                            fontFamily={'Inter, System'}
                            my={'auto'}
                            fontWeight={700}
                            fontSize={isMobile ? 'sm' : 'md'}>
                            WETH
                        </Text>
                        <Image src="/images/currency/weth.png" boxSize={'30px'} />
                    </Stack>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        SPECIAL CARDS
                    </Text>
                </GridItem>
            </Grid>
            <Box height={'60vh'} overflowY="auto" bgColor={'inherit'} w={'90%'} mx={'auto'} borderRadius={'10px'} p={2}>
                {
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
                        <Text>You have not won any reward yet</Text>
                    </Box>
                }
            </Box>
            <Grid
                templateColumns="repeat(5, 1fr)"
                gap={4}
                w={'90%'}
                mx={'auto'}
                mt={3}
                p={2}
                borderRadius={'10px'}
                border={'2px solid #7FC0BE'}
                color={'#FFF'}
                bgColor={' #7FC0BE'}
                position="sticky"
                top="0"
                zIndex={1}>
                <GridItem colSpan={2} my={'auto'} ml={5}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        ALL TIME TOTAL
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}></Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}></Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}></Text>
                </GridItem>
            </Grid>
        </>
    );
};

export default LeaderboardsEarnigs;
