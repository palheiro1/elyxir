import { Box, Grid, GridItem, Image, Select, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { isEmptyObject } from '../../Utils/BattlegroundsUtils';
import { getAsset } from '../../../../../utils/cardsUtils';
import { fetchUserBattles } from '../../../../../redux/reducers/BattleReducer';
import { useDispatch, useSelector } from 'react-redux';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import locations from '../../assets/LocationsEnum';

const EarningsRow = ({ isMobile, date, arenaName, capturedAsset, rewards, cards }) => {
    const GemRewards = rewards?.find(item => item.name === 'GEM');
    const WethRewads = rewards?.find(item => item.name === 'WETH');
    const ObtainedCard = cards.find(card => capturedAsset[card.asset]);

    return (
        <Grid templateColumns="repeat(5, 1fr)" gap={4} w="100%" mx="auto" mt={2} borderRadius="10px">
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
                    {date}
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
                    {arenaName}
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
                    {GemRewards ? (isNaN(GemRewards.price) ? 0 : GemRewards.price / NQTDIVIDER) : 0}
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
                    {WethRewads ? (isNaN(WethRewads.price) ? 0 : WethRewads.price / NQTDIVIDER) : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text>
                    <Tooltip
                        label={
                            <Box>
                                <Image src={ObtainedCard?.cardImgUrl} alt={ObtainedCard?.name} w="200px" />
                            </Box>
                        }
                        aria-label={ObtainedCard?.name}
                        placement="top"
                        hasArrow>
                        <Box
                            p={3}
                            fontFamily="Inter, System"
                            fontWeight="700"
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            maxH="45px"
                            fontSize={isMobile ? 'xs' : 'md'}>
                            <Text
                                border="2px solid white"
                                borderRadius="20px"
                                w="150px"
                                p={3}
                                maxH={'45px'}
                                fontFamily={'Inter, System'}
                                color={'#7FC0BE'}
                                fontWeight={700}
                                h="100%"
                                fontSize={isMobile ? 'xs' : 'md'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {ObtainedCard?.name}
                            </Text>
                        </Box>
                    </Tooltip>
                </Text>
            </GridItem>
        </Grid>
    );
};
const BattlesEarnigs = ({ infoAccount, cards, isMobile }) => {
    const dispatch = useDispatch();
    const { accountRs } = infoAccount;

    useEffect(() => {
        accountRs && dispatch(fetchUserBattles(accountRs));
    }, [accountRs, dispatch]);

    const [battleRewards, setBattleRewards] = useState(null);
    const [wonBattles, setWonBattles] = useState(null);
    const [totalRewards, setTotalRewards] = useState({ gem: 0, weth: 0 });
    const [selectedArena, setSelectedArena] = useState(-1);

    const { arenasInfo, userBattles } = useSelector(state => state.battle);

    const getBattleReward = useCallback(async (arenaInfo, battle) => {
        let rewardFraction = battle.isWinnerLowerPower ? 0.9 : 0.8;
        if (!isEmptyObject(arenaInfo.battleCost)) {
            const assets = Object.entries(arenaInfo.battleCost.asset);
            const results = await Promise.all(
                assets.map(async ([asset, price]) => {
                    const assetDetails = await getAsset(asset);
                    return { name: assetDetails, price: price * rewardFraction };
                })
            );

            return results;
        }
    }, []);

    useEffect(() => {
        const fetchBattleRewards = async () => {
            const rewards = {};
            const wonBattlesList = [];
            let totalGem = 0;
            let totalWeth = 0;

            if (userBattles) {
                await Promise.all(
                    userBattles
                        .filter(
                            item =>
                                (item.isUserDefending && item.isDefenderWin) ||
                                (!item.isUserDefending && !item.isDefenderWin)
                        )
                        .map(async item => {
                            const arena = arenasInfo.find(arena => arena.id === item.arenaId);
                            if (arena) {
                                const reward = await getBattleReward(arena, item);
                                wonBattlesList.push({ ...item, ...arena });
                                if (reward) {
                                    rewards[item.battleId] = reward;

                                    reward.forEach(r => {
                                        if (r.name === 'GEM') totalGem += r.price;
                                        if (r.name === 'WETH') totalWeth += r.price;
                                    });
                                }
                            }
                        })
                );
            }
            wonBattlesList.sort((a, b) => b.battleId - a.battleId);
            setBattleRewards(rewards);
            setWonBattles(wonBattlesList);
            setTotalRewards({ gem: totalGem, weth: totalWeth });
        };

        fetchBattleRewards();
    }, [userBattles, arenasInfo, getBattleReward]);

    const arenas = arenasInfo && [
        { arenaId: -1, name: 'All Lands' },
        ...arenasInfo
            .filter(arena => wonBattles?.some(battle => battle.arenaId === arena.id))
            .map(arena => ({ arenaId: arena.id, name: locations[arena.id - 1].name })),
    ];

    const filteredBattles =
        selectedArena === -1 ? wonBattles : wonBattles?.filter(battle => battle.arenaId === selectedArena);
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
                border={'2px solid #0056F5'}
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
                    <Select
                        variant={'unstyled'}
                        value={selectedArena}
                        onChange={e => setSelectedArena(Number(e.target.value))}
                        textAlign={'center'}
                        textTransform={'uppercase'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        fontSize={isMobile ? 'sm' : 'md'}
                        mx="auto">
                        {arenas
                            ? arenas.map(arena => (
                                  <option
                                      key={arena.arenaId}
                                      value={arena.arenaId}
                                      style={{
                                          backgroundColor: '#FFF',
                                          color: '#000',
                                      }}>
                                      {arena.name}
                                  </option>
                              ))
                            : 'ALL LANDS'}
                    </Select>
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
                        CARDS
                    </Text>
                </GridItem>
            </Grid>
            <Box height={'60vh'} overflowY="auto" bgColor={'inherit'} w={'90%'} mx={'auto'} borderRadius={'10px'} p={2}>
                {filteredBattles?.length > 0 ? (
                    filteredBattles.map(battle => (
                        <EarningsRow
                            key={battle.battleId}
                            isMobile={isMobile}
                            {...battle}
                            rewards={battleRewards[battle.battleId]}
                            cards={cards}
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
                templateColumns="repeat(5, 1fr)"
                gap={4}
                w={'90%'}
                mx={'auto'}
                mt={3}
                p={2}
                borderRadius={'10px'}
                border={'2px solid #0056F5'}
                color={'#FFF'}
                bgColor={' #0056F5'}
                position="sticky"
                top="0"
                zIndex={1}>
                <GridItem colSpan={2} my={'auto'} ml={5}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        SEASON TOTAL
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {totalRewards.gem > 0 ? totalRewards.gem / NQTDIVIDER : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {totalRewards.weth > 0 ? totalRewards.weth / NQTDIVIDER : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center" my={'auto'}>
                    <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                        {wonBattles && wonBattles.length}
                    </Text>
                </GridItem>
            </Grid>
        </>
    );
};

export default BattlesEarnigs;
