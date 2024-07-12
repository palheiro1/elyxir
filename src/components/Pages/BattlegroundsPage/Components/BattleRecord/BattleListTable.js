import { Box, Image, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import { formatAddress } from '../../Utils/BattlegroundsUtils';

const BattleListTable = ({ battleDetails, handleViewDetails, cards, arenasInfo }) => {
    const [battleRewards, setBattleRewards] = useState({});

    const getBattleReward = async (arenaInfo, battle) => {
        let rewardFraction = battle.isWinnerLowerPower ? 0.9 : 0.8;
        const assets = Object.entries(arenaInfo.battleCost.asset);

        const results = await Promise.all(
            assets.map(async ([asset, price]) => {
                const assetDetails = await getAsset(asset);
                console.log('🚀 ~ assets.map ~ assetDetails:', assetDetails);
                return { name: assetDetails, price: price * rewardFraction };
            })
        );

        return results;
    };

    useEffect(() => {
        const fetchBattleRewards = async () => {
            const rewards = {};
            for (const item of battleDetails) {
                const arena = arenasInfo.find(arena => arena.id === item.arenaId);
                if (arena) {
                    const reward = await getBattleReward(arena, item);
                    rewards[item.id] = reward;
                }
            }
            setBattleRewards(rewards);
        };

        fetchBattleRewards();
    }, [battleDetails, arenasInfo]);

    return (
        <Table variant={'unstyled'} textColor={'#FFF'} w={'85%'} mx={'auto'}>
            <Thead>
                <Tr>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Date
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Opponent
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Arena
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Position
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Result
                    </Th>
                    <Th fontFamily={'Chelsea Market, System'} color={'#FFF'} fontSize={'lg'} textAlign={'center'}>
                        Rewards/ Losses
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {battleDetails.length > 0 ? (
                    battleDetails.map((item, index) => {
                        let bgColor = index % 2 === 0 ? '#DB78AA' : '#D08FB0';
                        let captured = cards.find(obj => Object.keys(item.captured.asset).includes(obj.asset));
                        let battleReward = battleRewards[item.id] || [];

                        return (
                            <Tr
                                key={index}
                                onClick={() => handleViewDetails(item.id)}
                                cursor={'pointer'}
                                _hover={{ backgroundColor: 'whiteAlpha.300' }}>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        fontFamily={'Chelsea Market, System'}
                                        h="100%"
                                        p={3}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.date}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        bgColor={bgColor}
                                        fontFamily={'Chelsea Market, System'}
                                        p={3}
                                        h="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {item.isUserDefending
                                            ? item.attackerDetails.name || formatAddress(item.attackerDetails.accountRS)
                                            : item.defenderDetails.name ||
                                              formatAddress(item.defenderDetails.accountRS)}
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
                                        justifyContent="center">
                                        {item.isUserDefending ? 'DEFENDER' : 'ATTACKER'}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Box
                                        h="100%"
                                        display="flex"
                                        p={3}
                                        alignItems="center"
                                        justifyContent="center"
                                        bgColor={item.isUserDefending === item.isDefenderWin ? '#66FA7C' : '#FF6058'}
                                        fontFamily={'Chelsea Market, System'}>
                                        {item.isUserDefending === item.isDefenderWin ? 'WON' : 'LOST'}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} p={2}>
                                    <Tooltip
                                        label={
                                            <Box>
                                                <Image src={captured.cardImgUrl} alt={captured.name} w="200px" />
                                            </Box>
                                        }
                                        aria-label={captured.name}
                                        placement="top"
                                        hasArrow>
                                        <Box
                                            bgColor={bgColor}
                                            p={3}
                                            fontFamily={'Chelsea Market, System'}
                                            h="100%"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            cursor="pointer">
                                            <Text>{captured.name}</Text>
                                            {item.isUserDefending === item.isDefenderWin &&
                                                battleReward.length > 0 &&
                                                battleReward.map((reward, rewardIndex) => (
                                                    <Text
                                                        key={rewardIndex}
                                                        color={'#FFF'}
                                                        ml={rewardIndex === 0 ? 2 : 0}>
                                                        {`+ ${reward.price / NQTDIVIDER} ${reward.name}`}
                                                    </Text>
                                                ))}
                                        </Box>
                                    </Tooltip>
                                </Td>
                            </Tr>
                        );
                    })
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
            </Tbody>
        </Table>
    );
};

export default BattleListTable;
