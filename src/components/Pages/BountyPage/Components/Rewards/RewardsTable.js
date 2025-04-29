import { Box, Center, Grid, GridItem, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { prepareTableData } from '../../../../../services/Bounty/utils';
import { GEMASSET, MANAASSET, SEASONSPECIALCARDASSET, WETHASSET } from '../../../../../data/CONSTANTS';

const RewardsTableRow = ({ index, data, isMobile, account, filter, getCurrencyImage }) => {
    const { address, accountName, quantity, ticketNumber, assetId } = data;
    const assetDetails = JSON.parse(data.assetDetails.description);
    const { name } = assetDetails;

    const bg = filter
        ? index % 2 === 0
            ? '#323636'
            : '#202323'
        : account === address
        ? '#73DDE8'
        : index % 2 === 0
        ? '#323636'
        : '#202323';

    const color = filter ? '#7FC0BE' : account === address ? '#193235' : '#7FC0BE';

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px" p={2}>
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
                    #{ticketNumber}
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
                    {account === address ? 'You' : accountName || address}
                </Text>
            </GridItem>
            <GridItem colSpan={1} justifyContent="center" display={'flex'}>
                <Box
                    h={assetId === SEASONSPECIALCARDASSET ? '20px' : '30px'}
                    w={assetId === SEASONSPECIALCARDASSET ? '20px' : '30px'}
                    mr={2}
                    my={'auto'}>
                    <Image src={getCurrencyImage(assetId)} w={'100%'} />
                </Box>
                <Text
                    p={1}
                    maxH={'45px'}
                    my={'auto'}
                    fontFamily={'Inter, System'}
                    fontWeight={500}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    color={color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">{`x${quantity} ${name}`}</Text>
            </GridItem>
        </Grid>
    );
};

const RewardsTable = ({ rewards, isMobile, account, filter }) => {
    const [rewardsData, setRewardsData] = useState(null);
    const [userRewards, setUserRewards] = useState(null);

    const getCurrencyImage = assetId => {
        switch (assetId) {
            case GEMASSET:
                return '/images/currency/gem.png';
            case WETHASSET:
                return '/images/currency/weth.png';
            case MANAASSET:
                return '/images/currency/mana.png';
            case '15052794016100653835':
                return 'https://media.mythicalbeings.io/sm/mythical62.jpg';
            default:
                return '/images/currency/multicurrency.png';
        }
    };

    useEffect(() => {
        if (!rewards) return;

        let filteredRewards;
        if (filter === 1 && account) {
            filteredRewards = rewards[account] ? { [account]: rewards[account] } : null;
        } else {
            filteredRewards = rewards;
        }
        if (filteredRewards) {
            setRewardsData(prepareTableData(filteredRewards));
        } else {
            setRewardsData([]);
        }

        setUserRewards(prepareTableData(filteredRewards));
    }, [rewards, filter, account]);
    return (
        <>
            {userRewards && userRewards.length > 0 && (
                <Stack direction={'column'} w={'100%'}>
                    <Text
                        mx={'auto'}
                        textAlign={'center'}
                        fontFamily={'Chelsea market, system-ui'}
                        fontWeight={500}
                        fontSize={isMobile ? 'md' : 'xl'}
                        p={1}
                        px={3}
                        color={'#000'}
                        letterSpacing={1.5}
                        borderRadius={'25px'}
                        w={'fit-content'}
                        bgColor={'#73DDE8'}>
                        YOU ARE A WINNER OF
                    </Text>
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        justifyContent={'space-between'}
                        w={'80%'}
                        p={4}
                        mx={'auto'}
                        textAlign={'center'}>
                        {userRewards.map(({ assetId, quantity, name }, index) => (
                            <Stack direction={'column'} key={index}>
                                <Box w={assetId === SEASONSPECIALCARDASSET ? '80px' : '100px'} h={'100px'} mx={'auto'}>
                                    <Image boxSize={'100%'} src={getCurrencyImage(assetId)} />
                                </Box>
                                <Text
                                    fontFamily={'Chelsea market, system-ui'}
                                    fontWeight={500}
                                    textTransform={'uppercase'}
                                    fontSize={isMobile ? 'md' : 'xl'}>
                                    {`x${quantity} ${name}`}
                                </Text>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            )}
            <Stack className="custom-scrollbar" spacing={4}>
                {rewardsData === null ? (
                    <Center w="100%" py={10}>
                        <Spinner color="#FFF" w={10} h={10} />
                    </Center>
                ) : rewardsData.length === 0 ? (
                    <Center w="100%" py={10}>
                        <Text fontFamily="Chelsea Market, System" fontWeight={100} fontSize="medium" color="#FFF">
                            There are no rewards yet
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
                            border={`2px solid #B2496C`}
                            color={'#FFF'}
                            bgColor={'#B2496C'}
                            position="sticky"
                            top="0"
                            zIndex={1}>
                            <GridItem colSpan={1} textAlign="center">
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                    TICKET
                                </Text>
                            </GridItem>
                            <GridItem colSpan={1} textAlign="center">
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                    NAME / ADDRESS
                                </Text>
                            </GridItem>
                            <GridItem colSpan={1} textAlign="center">
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                                    REWARD EARNED
                                </Text>
                            </GridItem>
                        </Grid>

                        <Box maxHeight={'55vh'} overflowY="auto" w={'100%'} mx={'auto'} borderRadius={'10px'}>
                            {rewardsData.map((entry, index) => (
                                <RewardsTableRow
                                    key={index}
                                    index={index}
                                    data={entry}
                                    isMobile={isMobile}
                                    account={account}
                                    filter={filter === 1}
                                    getCurrencyImage={getCurrencyImage}
                                />
                            ))}
                        </Box>
                    </>
                )}
            </Stack>
        </>
    );
};

export default RewardsTable;
