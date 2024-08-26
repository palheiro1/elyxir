import { Box, Image, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import { formatAddress, isEmptyObject } from '../../Utils/BattlegroundsUtils';

const BattleListTable = ({ battleDetails, handleViewDetails, cards, arenasInfo, isMobile }) => {
    const [battleRewards, setBattleRewards] = useState({});
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
        };

        fetchBattleRewards();
    }, [battleDetails, arenasInfo, getBattleReward]);

    const renderBattleRow = useCallback(
        (item, index) => {
            const bgColor = index % 2 === 0 ? '#DB78AA' : '#D08FB0';
            const captured = cards.find(obj => Object.keys(item.capturedAsset).includes(obj.asset));
            const battleReward = battleRewards[item.battleId] || [];

            return (
                <Tr
                    key={item.battleId}
                    onClick={() => handleViewDetails(item.battleId)}
                    cursor={'pointer'}
                    _hover={{ backgroundColor: 'whiteAlpha.300' }}>
                    <Td textAlign={'center'} p={2}>
                        <Box
                            bgColor={bgColor}
                            fontFamily={'Chelsea Market, System'}
                            h="100%"
                            p={3}
                            display="flex"
                            maxH={'45px'}
                            fontSize={isMobile ? 'xs' : 'md'}
                            alignItems="center"
                            justifyContent="center">
                            {item.date}
                        </Box>
                    </Td>
                    <Td textAlign={'center'} p={2}>
                        <Tooltip
                            label={
                                item.isUserDefending ? item.attackerDetails.accountRS : item.defenderDetails.accountRS
                            }
                            hasArrow
                            placement="bottom">
                            <Box
                                bgColor={bgColor}
                                fontFamily={'Chelsea Market, System'}
                                p={3}
                                fontSize={isMobile ? 'xs' : 'md'}
                                h="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {item.isUserDefending
                                    ? item.attackerDetails.name || formatAddress(item.attackerDetails.accountRS)
                                    : item.defenderDetails.name || formatAddress(item.defenderDetails.accountRS)}
                            </Box>
                        </Tooltip>
                    </Td>
                    <Td textAlign={'center'} p={2}>
                        <Box
                            bgColor={bgColor}
                            p={3}
                            maxH={'45px'}
                            fontFamily={'Chelsea Market, System'}
                            h="100%"
                            fontSize={isMobile ? 'xs' : 'md'}
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {item.arenaName}
                        </Box>
                    </Td>
                    <Td textAlign={'center'} p={2}>
                        <Box
                            bgColor={bgColor}
                            p={3}
                            fontFamily={'Chelsea Market, System'}
                            h="100%"
                            display="flex"
                            alignItems="center"
                            fontSize={isMobile ? 'xs' : 'md'}
                            justifyContent="center">
                            {item.isUserDefending ? 'GUARDIAN' : 'ATTACKER'}
                        </Box>
                    </Td>
                    <Td textAlign={'center'} p={2}>
                        <Box
                            h="100%"
                            display="flex"
                            fontSize={isMobile ? 'xs' : 'md'}
                            p={3}
                            alignItems="center"
                            justifyContent="center"
                            bgColor={item.isUserDefending === item.isDefenderWin ? '#66FA7C' : '#FF6058'}
                            fontFamily={'Chelsea Market, System'}>
                            {item.isUserDefending === item.isDefenderWin ? 'WON' : 'LOST'}
                        </Box>
                    </Td>
                    {cards && cards.length > 0 && (
                        <Td textAlign={'center'} p={2}>
                            <Tooltip
                                label={
                                    <Box>
                                        <Image src={captured?.cardImgUrl} alt={captured?.name} w="200px" />
                                    </Box>
                                }
                                aria-label={captured?.name}
                                placement="top"
                                hasArrow>
                                <Box
                                    bgColor={bgColor}
                                    p={3}
                                    fontFamily={'Chelsea Market, System'}
                                    h="100%"
                                    display="flex"
                                    fontSize={isMobile ? 'xs' : 'md'}
                                    alignItems="center"
                                    maxH={'45px'}
                                    justifyContent="center"
                                    cursor="pointer">
                                    <Text color={'#FFF'}>
                                        {captured?.name}
                                        {item.isUserDefending === item.isDefenderWin &&
                                            battleReward.length > 0 &&
                                            battleReward.map(({ price, name }) => ` + ${price / NQTDIVIDER} ${name}`)}
                                    </Text>
                                </Box>
                            </Tooltip>
                        </Td>
                    )}
                </Tr>
            );
        },
        [cards, battleRewards, isMobile, handleViewDetails]
    );

    const tableRows = useMemo(() => battleDetails.map(renderBattleRow), [battleDetails, renderBattleRow]);

    return (
        <Table variant={'unstyled'} textColor={'#FFF'} w={'85%'} mx={'auto'}>
            <Thead>
                <Tr>
                    <Th
                        fontFamily={'Chelsea Market, System'}
                        color={'#FFF'}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        textAlign={'center'}>
                        Date
                    </Th>
                    <Th
                        fontFamily={'Chelsea Market, System'}
                        color={'#FFF'}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        textAlign={'center'}>
                        Opponent
                    </Th>
                    <Th
                        fontFamily={'Chelsea Market, System'}
                        color={'#FFF'}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        textAlign={'center'}>
                        Land
                    </Th>
                    <Th
                        fontFamily={'Chelsea Market, System'}
                        color={'#FFF'}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        textAlign={'center'}>
                        Position
                    </Th>
                    <Th
                        fontFamily={'Chelsea Market, System'}
                        color={'#FFF'}
                        fontSize={isMobile ? 'sm' : 'lg'}
                        textAlign={'center'}>
                        Result
                    </Th>
                    {cards && cards.length > 0 && (
                        <Th
                            fontFamily={'Chelsea Market, System'}
                            color={'#FFF'}
                            fontSize={isMobile ? 'sm' : 'lg'}
                            textAlign={'center'}>
                            Rewards/ Losses
                        </Th>
                    )}
                </Tr>
            </Thead>

            {battleDetails.length > 0 ? (
                <Tbody>{tableRows}</Tbody>
            ) : (
                <Text
                    position={'absolute'}
                    fontFamily={'Chelsea Market, system-ui'}
                    color={'#FFF'}
                    fontSize={'large'}
                    top={'50%'}
                    left={'50%'}
                    transform={'translate(-50%, -50%)'}>
                    You have not yet fought any battle
                </Text>
            )}
        </Table>
    );
};

export default BattleListTable;
