import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import BattleListRow from './Components/BattleListRow';
import LoadingState from './Components/LoadingState';
import BattleListHeader from './Components/BattleListHeader';
import EmptyState from './Components/EmptyState';

/**
 * @name BattleListTable
 * @description Displays a table of completed battles with details like cards used, results, and calculated rewards. Purely presentational.
 * @param {Array<Object>} battleDetails - List of battle records to display.
 * @param {Function} handleViewDetails - Callback triggered when clicking to view battle details.
 * @param {Array<Object>} cards - List of user's available cards.
 * @param {boolean} isMobile - Whether the layout should be mobile-friendly.
 * @param {Object} battleRewards - Pre-calculated rewards per battle.
 * @returns {JSX.Element} Rendered list of battles or fallback states.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleListTable = ({ battleDetails, handleViewDetails, cards, isMobile, battleRewards }) => {
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
