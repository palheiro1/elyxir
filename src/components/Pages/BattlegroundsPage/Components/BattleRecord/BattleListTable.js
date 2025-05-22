import { Box, Image, Grid, GridItem, Tooltip, Text, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import { formatAddress, isEmptyObject } from '../../Utils/BattlegroundsUtils';
import defeatIcon from '../../assets/icons/defeat_icon.svg';
import victoryIcon from '../../assets/icons/victory_icon.svg';

const BattleListTable = ({ battleDetails, handleViewDetails, cards, arenasInfo, isMobile }) => {
    const [battleRewards, setBattleRewards] = useState({});

    const getBattleReward = useCallback(async (arenaInfo, battle) => {
        try {
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
        } catch (error) {
            console.error('🚀 ~ getBattleReward ~ error:', error);
        }
    }, []);

    useEffect(() => {
        const fetchBattleRewards = async () => {
            try {
                const rewards = {};
                await Promise.all(
                    battleDetails.map(async item => {
                        const arena = arenasInfo.find(arena => arena.id === item.arenaId);
                        if (arena) {
                            const reward = await getBattleReward(arena, item);
                            rewards[item.battleId] = reward;
                        }
                    })
                );
                setBattleRewards(rewards);
            } catch (error) {
                console.error('🚀 ~ fetchBattleRewards ~ error:', error);
            }
        };

        fetchBattleRewards();
    }, [battleDetails, arenasInfo, getBattleReward]);

    const renderBattleRow = useCallback(
        item => {
            if (!item) return null;

            const bgColor = 'transparent';
            const captured =
                item?.capturedAsset && cards?.length
                    ? cards.find(obj => Object.keys(item.capturedAsset || {}).includes(obj.asset))
                    : null;
            const battleReward = battleRewards?.[item?.battleId] || [];

            const attackerName = item?.attackerDetails?.name || formatAddress(item?.attackerDetails?.accountRS || '');
            const defenderName = item?.defenderDetails?.name || formatAddress(item?.defenderDetails?.accountRS || '');
            const participantName = item?.isUserDefending ? attackerName : defenderName;

            const isWin = item?.isUserDefending === item?.isDefenderWin;

            return (
                <Grid
                    color="#FFF"
                    key={item?.battleId || Math.random()}
                    templateColumns="repeat(6, 1fr)"
                    p={3}
                    alignItems="center"
                    bg="transparent"
                    cursor="pointer"
                    _hover={{ backgroundColor: 'whiteAlpha.300', borderRadius: '25px' }}
                    onClick={() => item?.battleId && handleViewDetails(item.battleId)}>
                    <GridItem textAlign="center">
                        <Box
                            bgColor={bgColor}
                            fontFamily="Inter, System"
                            fontWeight="700"
                            fontSize="sm"
                            p={3}
                            maxH="45px"
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {item?.date || 'N/A'}
                        </Box>
                    </GridItem>

                    <GridItem textAlign="center">
                        <Tooltip
                            label={
                                item?.isUserDefending
                                    ? item?.attackerDetails?.accountRS
                                    : item?.defenderDetails?.accountRS
                            }
                            hasArrow
                            placement="bottom">
                            <Box
                                bgColor={bgColor}
                                fontFamily="Inter, System"
                                fontWeight="700"
                                fontSize={isMobile ? 'xs' : 'md'}
                                p={3}
                                h="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {participantName}
                            </Box>
                        </Tooltip>
                    </GridItem>

                    <GridItem textAlign="center">
                        <Box
                            bgColor={bgColor}
                            fontFamily="Inter, System"
                            fontWeight="700"
                            fontSize={isMobile ? 'xs' : 'md'}
                            p={3}
                            ml={3}
                            maxH="45px"
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {item?.arenaName || 'Unknown Arena'}
                        </Box>
                    </GridItem>

                    <GridItem textAlign="center">
                        <Box
                            bgColor={bgColor}
                            p={3}
                            fontFamily="Inter, System"
                            fontWeight="700"
                            ml={3}
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Image
                                src={`/images/battlegrounds/${
                                    item?.isUserDefending ? 'defense_icon.svg' : 'attack_icon.svg'
                                }`}
                                boxSize="45px"
                            />
                        </Box>
                    </GridItem>

                    <GridItem textAlign="center">
                        <Box
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="Inter, System"
                            ml={4}
                            p={3}
                            fontSize={isMobile ? 'xs' : 'md'}>
                            <Image src={isWin ? victoryIcon : defeatIcon} boxSize="45px" />
                        </Box>
                    </GridItem>

                    {cards?.length > 0 && (
                        <GridItem textAlign="center">
                            <Tooltip
                                label={
                                    captured?.cardImgUrl && (
                                        <Box>
                                            <Image
                                                src={captured.cardImgUrl}
                                                alt={captured?.name || 'Captured Card'}
                                                w="200px"
                                            />
                                        </Box>
                                    )
                                }
                                aria-label={captured?.name || 'Captured'}
                                placement="top"
                                hasArrow>
                                <Box
                                    bgColor={bgColor}
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
                                        color={isWin ? '#7FC0BE' : '#D597B2'}
                                        border="2px solid white"
                                        p={2}
                                        borderRadius="20px"
                                        w="130px"
                                        textAlign="center"
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        textOverflow="ellipsis">
                                        {captured?.name || 'No Reward'}
                                        {isWin &&
                                            battleReward.length > 0 &&
                                            battleReward.map(({ price = 0, name = '' }, i) => (
                                                <React.Fragment key={i}>
                                                    {' + '}
                                                    {price / NQTDIVIDER} {name}
                                                </React.Fragment>
                                            ))}
                                    </Text>
                                </Box>
                            </Tooltip>
                        </GridItem>
                    )}
                </Grid>
            );
        },
        [cards, battleRewards, isMobile, handleViewDetails]
    );

    const gridRows = useMemo(
        () => battleDetails && battleDetails.map(renderBattleRow),
        [battleDetails, renderBattleRow]
    );

    if (!battleDetails) {
        return (
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
        );
    }

    return battleDetails.length > 0 ? (
        <Box w="85%" mx="auto">
            <Grid
                templateColumns="repeat(6, 1fr)"
                border="2px solid #DB78AA"
                p={3}
                py={1}
                borderRadius="20px"
                position="relative"
                bg="inherit"
                zIndex={1}>
                <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                    DATE
                </GridItem>
                <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                    OPPONENT
                </GridItem>
                <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                    LAND
                </GridItem>
                <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                    POSITION
                </GridItem>
                <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                    RESULT
                </GridItem>
                {cards && cards.length > 0 && (
                    <GridItem fontWeight="700" fontSize="md" textAlign="center" color="#FFF">
                        REWARDS/ LOSSES
                    </GridItem>
                )}
            </Grid>
            <Box maxHeight="700px" overflowY="auto" borderBottomRadius={'20px'}>
                {gridRows}
            </Box>
        </Box>
    ) : (
        <Box
            h="100%"
            position="absolute"
            color="#FFF"
            alignContent="center"
            top="50%"
            left="50%"
            w="100%"
            fontSize="lg"
            fontFamily="Chelsea Market, System"
            textAlign="center"
            transform="translate(-50%, -50%)">
            You have not yet fought any battle
        </Box>
    );
};

export default BattleListTable;
