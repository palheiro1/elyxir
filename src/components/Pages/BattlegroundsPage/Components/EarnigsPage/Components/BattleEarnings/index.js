import { Box, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getAsset } from '../../../../../../../utils/cardsUtils';
import { fetchUserBattles } from '../../../../../../../redux/reducers/BattleReducer';
import { useDispatch, useSelector } from 'react-redux';
import locations from '../../../../assets/LocationsEnum';
import { isEmptyObject } from '../../../../../../../utils/utils';
import BattleEarningsRow from './BattleEarningsRow';
import BattleEarningsHeader from './BattleEarningsHeader';
import BattleEarningsFooter from './BattleEarningsFooter';

/**
 * @name BattlesEarnigs
 * @description Component that displays a user's battle earnings overview including a filterable list of won battles.
 * It fetches the user's battles, calculates rewards per battle considering arena costs and winner conditions,
 * and shows the battles in a scrollable list with headers and a footer summarizing total rewards.
 * Features:
 * - Fetches and listens for user battles using Redux.
 * - Calculates rewards based on arena battle costs and whether the user won with lower power.
 * - Allows filtering battles by arena.
 * - Displays rewards in GEM and WETH and shows captured cards.
 * - Responsive design adapting font sizes and container heights based on `isMobile`.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - Account info containing `accountRs`.
 * @param {Array<Object>} props.cards - List of card objects with details used to display captured cards.
 * @param {boolean} props.isMobile - Flag indicating if the display is on a mobile device.
 * @returns {JSX.Element} The rendered battle earnings component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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
            <BattleEarningsHeader
                isMobile={isMobile}
                selectedArena={selectedArena}
                setSelectedArena={setSelectedArena}
                arenas={arenas}
            />
            <Box
                height={isMobile ? '42vh' : '60vh'}
                overflowY="auto"
                bgColor={'inherit'}
                w={'90%'}
                mx={'auto'}
                borderRadius={'10px'}
                p={2}>
                {filteredBattles?.length > 0 ? (
                    filteredBattles.map(battle => (
                        <BattleEarningsRow
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
            <BattleEarningsFooter isMobile={isMobile} totalRewards={totalRewards} wonBattles={wonBattles} />
        </>
    );
};

export default BattlesEarnigs;
