import { Box, Center, Grid, GridItem, Image, Spinner, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { prepareTableData } from '../../../../../services/Bounty/utils';
import { GEMASSET, MANAASSET, NQTDIVIDER, SEASONSPECIALCARDASSET, WETHASSET } from '../../../../../data/CONSTANTS';
import { formatAddress } from '../../../BattlegroundsPage/Utils/BattlegroundsUtils';

const RewardsTableRow = ({ index, data, accountRs, filter, getCurrencyImage }) => {
    const { address, accountName, quantity, ticketNumber, assetId, assetName } = data;
    let assetDetails = null;
    let name = null;
    let formattedQNT = quantity;
    try {
        assetDetails = JSON.parse(data.assetDetails.description);
        name = assetDetails.name;
    } catch (error) {
        name = assetName;
        formattedQNT = quantity / NQTDIVIDER;
    }

    const bg = filter
        ? index % 2 === 0
            ? '#323636'
            : '#202323'
        : accountRs === address
        ? '#73DDE8'
        : index % 2 === 0
        ? '#323636'
        : '#202323';

    const color = filter ? '#7FC0BE' : accountRs === address ? '#193235' : '#7FC0BE';
    const formattedAddress = useBreakpointValue({
        base: formatAddress(address),
        md: address,
    });

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
                    fontSize={{ base: 'xs', md: 'md' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {Number(ticketNumber) === 0 ? 'Distribution' : `#${ticketNumber}`}
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
                    fontSize={{ base: 'xs', md: 'md' }}
                    display="flex"
                    alignItems="center"
                    textTransform={'capitalize'}
                    justifyContent="center">
                    {accountRs === address ? 'You' : accountName || formattedAddress}
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
                    fontSize={{ base: 'xs', md: 'md' }}
                    color={color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">{`x${formattedQNT} ${name}`}</Text>
            </GridItem>
        </Grid>
    );
};

const RewardsTable = ({ rewards, accountRs, filter }) => {
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

        const userEntries = rewards[accountRs] ?? [];
        const hasUserRewards = userEntries.length > 0;
        const userData = hasUserRewards ? prepareTableData({ [accountRs]: userEntries }) : [];

        setUserRewards(userData);
        setRewardsData(filter === 1 ? userData : prepareTableData(rewards));
    }, [rewards, filter, accountRs]);

    return (
        <>
            {userRewards && userRewards.length > 0 && (
                <Stack direction={'column'} w={'100%'}>
                    <Text
                        mx={'auto'}
                        textAlign={'center'}
                        fontFamily={'Chelsea market, system-ui'}
                        fontWeight={500}
                        fontSize={{ base: 'md', md: 'xl' }}
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
                        {userRewards.map(({ assetId, quantity, assetName }, index) => {
                            const isDivisible = [MANAASSET, WETHASSET, GEMASSET].includes(assetId);
                            const formattedQNT = isDivisible ? Number(quantity) / NQTDIVIDER : quantity;

                            return (
                                <Stack direction={'column'} key={index}>
                                    <Box
                                        w={assetId === SEASONSPECIALCARDASSET ? '80px' : '100px'}
                                        h={'100px'}
                                        mx={'auto'}>
                                        <Image boxSize={'100%'} src={getCurrencyImage(assetId)} />
                                    </Box>
                                    <Text
                                        fontFamily={'Chelsea market, system-ui'}
                                        fontWeight={500}
                                        textTransform={'uppercase'}
                                        fontSize={{ base: 'md', md: 'xl' }}>
                                        {`x${formattedQNT} ${assetName}`}
                                    </Text>
                                </Stack>
                            );
                        })}
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
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={{ base: 'sm', md: 'md' }}>
                                    TICKET
                                </Text>
                            </GridItem>
                            <GridItem colSpan={1} textAlign="center">
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={{ base: 'sm', md: 'md' }}>
                                    NAME / ADDRESS
                                </Text>
                            </GridItem>
                            <GridItem colSpan={1} textAlign="center">
                                <Text fontFamily="Inter, System" fontWeight={700} fontSize={{ base: 'sm', md: 'md' }}>
                                    REWARD EARNED
                                </Text>
                            </GridItem>
                        </Grid>

                        <Box maxHeight={{ md: '55vh' }} overflowY="auto" w={'100%'} mx={'auto'} borderRadius={'10px'}>
                            {rewardsData.map((entry, index) => (
                                <RewardsTableRow
                                    key={index}
                                    index={index}
                                    data={entry}
                                    accountRs={accountRs}
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
