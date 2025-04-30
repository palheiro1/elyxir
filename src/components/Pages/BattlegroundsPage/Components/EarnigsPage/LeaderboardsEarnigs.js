import { Box, Grid, GridItem, Image, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GEMASSET, GIFTZASSET, MANAASSET, NQTDIVIDER, WETHASSET } from '../../../../../data/CONSTANTS';
import { formatTimeStamp } from '../../Utils/BattlegroundsUtils';

const Row = ({ isMobile, leaderboardData, cards, setAllTimeRewards }) => {
    const [rewards, setRewards] = useState({
        giftzReward: 0,
        gemReward: 0,
        wethReward: 0,
        manaReward: 0,
    });

    const [cardsRewards, setCardsRewards] = useState(null);

    const leaderboardsMapping = {
        combativity: 'Combativeness',
        terrestrial: 'Lands',
        aerial: 'Sky',
        aquatic: 'Oceans',
        general: 'Champions',
    };

    const rewardsInfo = leaderboardData.reduce((groups, transaction) => {
        const asset = transaction.attachment?.asset;
        if (!asset) return groups;

        if (!groups[asset]) {
            groups[asset] = [];
        }
        groups[asset].push(transaction);

        return groups;
    }, {});

    useEffect(() => {
        const calculateRewards = asset =>
            rewardsInfo[asset]?.reduce((sum, item) => sum + Number(item.attachment.quantityQNT), 0) || 0;

        const giftzs = calculateRewards(GIFTZASSET);
        const gems = calculateRewards(GEMASSET);
        const weth = calculateRewards(WETHASSET);
        const mana = calculateRewards(MANAASSET);

        setRewards(prevState => {
            const newRewards = {
                giftzReward: giftzs,
                gemReward: gems,
                wethReward: weth,
                manaReward: mana,
            };

            if (JSON.stringify(prevState) !== JSON.stringify(newRewards)) {
                return newRewards;
            }
            return prevState;
        });

        const card = cards.find(card => Object.keys(rewardsInfo).includes(card.asset));
        setCardsRewards(card);

        setAllTimeRewards(prevState => {
            const newGiftz = prevState.giftz + giftzs;
            const newGem = prevState.gem + gems;
            const newWeth = prevState.weth + weth;
            const newMana = prevState.mana + mana;
            const newCards = prevState.cards + (card ? card.length : 0);

            const newRewardsState = {
                giftz: newGiftz,
                gem: newGem,
                weth: newWeth,
                mana: newMana,
                cards: newCards,
            };

            if (JSON.stringify(prevState) !== JSON.stringify(newRewardsState)) {
                return newRewardsState;
            }
            return prevState;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid templateColumns="repeat(7, 1fr)" gap={4} w="100%" mx="auto" mt={2} borderRadius="10px" color={'#FFF'}>
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
                    {formatTimeStamp(leaderboardData[0].timestamp)}
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
                    {leaderboardsMapping[leaderboardData[0].leaderboardType]}
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
                    {rewards.gemReward > 0 ? rewards.gemReward / NQTDIVIDER : 0}
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
                    {rewards.wethReward > 0 ? rewards.wethReward / NQTDIVIDER : 0}
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
                    {rewards.manaReward > 0 ? rewards.manaReward / NQTDIVIDER : 0}
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
                    {rewards.giftzReward}
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
                    {cardsRewards && cardsRewards.length > 0
                        ? cardsRewards.map(card => <Text>{card.name}</Text>)
                        : ' - '}
                </Text>
            </GridItem>
        </Grid>
    );
};

const LeaderboardsEarnigs = ({ infoAccount, cards, isMobile }) => {
    const { transactions } = infoAccount;
    const [filteredTransactions, setFilteredTransactions] = useState(null);
    const [allTimeRewards, setAllTimeRewards] = useState({
        giftz: 0,
        gem: 0,
        weth: 0,
        mana: 0,
        cards: 0,
    });
    useEffect(() => {
        const filterTransactions = transactions
            .filter(transaction => {
                try {
                    const messageObj = JSON.parse(transaction.attachment.message);
                    return messageObj.leaderboardType ? true : false;
                } catch (error) {
                    return false;
                }
            })
            .map(transaction => {
                const messageObj = JSON.parse(transaction.attachment.message);
                return {
                    ...transaction,
                    leaderboardType: messageObj.leaderboardType,
                    leaderboardEndBlock: messageObj.leaderboardEndBlock,
                };
            })
            .reduce((groups, transaction) => {
                const endBlock = transaction.leaderboardEndBlock;

                if (!groups[endBlock]) {
                    groups[endBlock] = [];
                }
                groups[endBlock].push(transaction);
                return groups;
            }, {});

        setFilteredTransactions(filterTransactions);
    }, [transactions]);
    return (
        <>
            <Grid
                templateColumns="repeat(7, 1fr)"
                gap={4}
                w={'90%'}
                mx={'auto'}
                mt={3}
                p={1}
                borderRadius={'10px'}
                border={'2px solid #BBC4D3'}
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
                    <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                        <Text
                            fontFamily={'Inter, System'}
                            my={'auto'}
                            fontWeight={700}
                            fontSize={isMobile ? 'sm' : 'md'}>
                            MANA
                        </Text>
                        <Image src="/images/currency/mana.png" boxSize={'30px'} />
                    </Stack>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Stack direction={'row'} w={'fit-content'} mx={'auto'}>
                        <Text
                            fontFamily={'Inter, System'}
                            my={'auto'}
                            fontWeight={700}
                            fontSize={isMobile ? 'sm' : 'md'}>
                            GIFTZ
                        </Text>
                        <Image src="/images/currency/giftz.png" boxSize={'30px'} />
                    </Stack>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        SPECIAL CARDS
                    </Text>
                </GridItem>
            </Grid>
            <Box height={'60vh'} overflowY="auto" bgColor={'inherit'} w={'90%'} mx={'auto'} borderRadius={'10px'} p={2}>
                {filteredTransactions && Object.values(filteredTransactions).length > 0 ? (
                    Object.values(filteredTransactions).map((data, index) => (
                        <Row
                            key={index}
                            isMobile={isMobile}
                            cards={cards}
                            leaderboardData={data}
                            setAllTimeRewards={setAllTimeRewards}
                        />
                    ))
                ) : (
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
                )}
            </Box>
            <Grid
                templateColumns="repeat(7, 1fr)"
                gap={4}
                w={'90%'}
                mx={'auto'}
                mt={3}
                p={2}
                borderRadius={'10px'}
                border={'2px solid #BBC4D3'}
                color={'#000'}
                bgColor={'#BBC4D3'}
                position="sticky"
                top="0"
                zIndex={1}>
                <GridItem colSpan={2} my={'auto'} ml={5}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        ALL TIME TOTAL
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {allTimeRewards.gem}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {allTimeRewards.weth}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {allTimeRewards.mana}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {allTimeRewards.giftz}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {allTimeRewards.cards}
                    </Text>
                </GridItem>
            </Grid>
        </>
    );
};

export default LeaderboardsEarnigs;
