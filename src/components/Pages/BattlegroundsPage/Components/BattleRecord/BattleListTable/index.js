import { Box } from '@chakra-ui/react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import BattleListRow from './Components/BattleListRow';
import LoadingState from './Components/LoadingState';
import BattleListHeader from './Components/BattleListHeader';
import EmptyState from './Components/EmptyState';
import { isEmptyObject } from '../../../../../../utils/utils';
import { getAsset } from '../../../../../../utils/cardsUtils';

/**
 * @name BattleListTable
 * @description Displays a table of completed battles with details like cards used, results, and calculated rewards based on arena configuration and power comparison. It handles fetching and caching of battle rewards and renders responsive rows with reward breakdowns.
 * @param {Array<Object>} battleDetails - List of battle records to display.
 * @param {Function} handleViewDetails - Callback triggered when clicking to view battle details.
 * @param {Array<Object>} cards - List of user's available cards for matching by asset.
 * @param {Array<Object>} arenasInfo - Arena metadata used to determine battle costs and rewards.
 * @param {boolean} isMobile - Flag to determine mobile-friendly layout and behavior.
 * @returns {JSX.Element} A table of battles, including loading and empty states, with per-battle reward information.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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

    const gridRows = useMemo(
        () =>
            battleDetails?.map(item => (
                <BattleListRow
                    key={item.battleId}
                    item={item}
                    handleViewDetails={handleViewDetails}
                    cards={cards}
                    isMobile={isMobile}
                    battleReward={battleRewards[item?.battleId] || []}
                />
            )),
        [battleDetails, battleRewards, isMobile, cards, handleViewDetails]
    );

    if (!battleDetails) return <LoadingState />;

    return battleDetails.length > 0 ? (
        <Box w="85%" mx="auto">
            <BattleListHeader cards={cards} isMobile={isMobile} />
            <Box maxHeight="700px" overflowY="auto" borderBottomRadius="20px">
                {gridRows}
            </Box>
        </Box>
    ) : (
        <EmptyState />
    );
};

export default BattleListTable;
