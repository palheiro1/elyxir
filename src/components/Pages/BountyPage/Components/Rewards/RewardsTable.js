import { Box, Center, Grid, GridItem, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { prepareTableData } from '../../../../../services/Bounty/utils';

const RewardsTableRow = ({ index, data, isMobile, account, filter }) => {
    const { address, accountName, quantity, ticketNumber } = data;
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

    const color = filter ? '#FFF' : account === address ? '#193235' : '#FFF';

    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
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
                    {index + 1}
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
                    {accountName || address}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={1}
                    maxH={'45px'}
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
    }, [rewards, filter, account]);
    return (
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
                        templateColumns="repeat(4, 1fr)"
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
                                POSITION
                            </Text>
                        </GridItem>
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
                            />
                        ))}
                    </Box>
                </>
            )}
        </Stack>
    );
};

export default RewardsTable;
