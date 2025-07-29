import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { Grid } from '@chakra-ui/react';
import ColumnLabel from '../../ColumnLabel';
import { CombativityLeaderboardHeaders } from '../data';

/**
 * @name CombativityLeaderboardHeader
 * @description Renders the header section of the Combativity Leaderboard with three columns: Position, Name/Address, and Points.
 * The component adjusts font size based on screen size and applies dynamic background color.
 * @param {Object} props - Component props.
 * @param {string} props.color - Background color used for the header row.
 * @returns {JSX.Element} A styled header grid for the combativity leaderboard.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CombativityLeaderboardHeader = ({ color }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Grid
            templateColumns={`repeat(${CombativityLeaderboardHeaders.length}, 1fr)`}
            gap={4}
            w="90%"
            mx="auto"
            mt={3}
            p={5}
            borderRadius="10px"
            bgColor={color}>
            {CombativityLeaderboardHeaders.map((lb, index) => (
                <ColumnLabel key={index} label={lb} color="#FFF" isMobile={isMobile} />
            ))}
        </Grid>
    );
};

export default CombativityLeaderboardHeader;
