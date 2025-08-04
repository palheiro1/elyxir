import { Grid } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../../../data/CONSTANTS';
import CapturedCardCell from './CapturedCardCell';
import CustomCell from '../../../CustomCell';

/**
 * @name BattleEarningsRow
 * @description Renders a single row representing the battle earnings for a specific date and arena.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Whether it's a mobile view.
 * @param {string} props.date - Date string of the battle.
 * @param {string} props.arenaName - Arena name.
 * @param {Object} props.capturedAsset - Object with captured card asset keys.
 * @param {Array<Object>} props.rewards - Array of reward objects with `name` and `price`.
 * @param {Array<Object>} props.cards - List of card objects with metadata.
 * @returns {JSX.Element} A grid row showing date, arena, rewards and captured card info.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleEarningsRow = ({ isMobile, date, arenaName, capturedAsset, rewards, cards }) => {
    const GemRewards = rewards?.find(item => item.name === 'GEM');
    const WethRewards = rewards?.find(item => item.name === 'WETH');
    const ObtainedCard = cards.find(card => capturedAsset[card.asset]);

    const GemRewardsPrice = GemRewards ? (isNaN(GemRewards.price) ? 0 : GemRewards.price / NQTDIVIDER) : 0;
    const WethRewardsPrice = WethRewards ? (isNaN(WethRewards.price) ? 0 : WethRewards.price / NQTDIVIDER) : 0;

    return (
        <Grid templateColumns="repeat(5, 1fr)" gap={4} w="100%" mx="auto" mt={2} borderRadius="10px" color="#FFF">
            <CustomCell value={date} isMobile={isMobile} />
            <CustomCell value={arenaName} isMobile={isMobile} />
            <CustomCell value={GemRewardsPrice} isMobile={isMobile} isUppercase />
            <CustomCell value={WethRewardsPrice} isMobile={isMobile} />
            <CapturedCardCell card={ObtainedCard} isMobile={isMobile} />
        </Grid>
    );
};

export default BattleEarningsRow;
