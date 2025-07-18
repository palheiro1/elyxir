import { Grid } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import CustomCell from '../../CustomCell';

/**
 * @name CombativityLeaderboardRow
 * @description Renders a single row in the leaderboard with rank, user name (or accountRS), and points. Highlights the top rank with a special color.
 * @param {Object} props - Component props.
 * @param {number} props.index - The rank index of the user.
 * @param {string} props.accountRS - The account identifier string.
 * @param {number} props.points - The points scored by the user.
 * @param {string} [props.name] - The display name of the user (optional).
 * @returns {JSX.Element|null} The combativity leaderboard row or null if points are zero or less.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CombativityLeaderboardRow = ({ index, accountRS, points, name }) => {
    const color = index < 1 ? '#39D5D5' : '#FFF';

    const { isMobile } = useBattlegroundBreakpoints();
    return (
        points > 0 && (
            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%" mx="auto" mt={0} borderRadius="10px" color={color}>
                <CustomCell value={`#${index + 1}`} isMobile={isMobile} />
                <CustomCell value={name ? name : accountRS} isMobile={isMobile} />
                <CustomCell value={points ? Math.floor(points).toLocaleString('de-DE') : 0} isMobile={isMobile} />
            </Grid>
        )
    );
};

export default CombativityLeaderboardRow;
