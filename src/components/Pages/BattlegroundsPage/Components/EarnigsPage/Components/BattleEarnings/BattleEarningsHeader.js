import { Grid } from '@chakra-ui/react';
import ArenaSelect from './ArenaSelect';
import RewardColumn from '../RewardColumn';
import ColumnLabel from '../../../ColumnLabel';

/**
 * @name BattleEarningsHeader
 * @description Renders the header section for the battle earnings display, including
 * columns for date, arena selection, and reward types (GEM, WETH, and Cards).
 * Provides a responsive layout that adjusts font sizes based on the
 * `isMobile` flag. Allows the user to select an arena from a dropdown,
 * triggering the `setSelectedArena` callback when changed.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag to apply mobile-specific styles.
 * @param {number} props.selectedArena - Currently selected arena ID.
 * @param {function} props.setSelectedArena - Setter function for arena selection.
 * @param {Array<Object>} props.arenas - List of arena objects with `arenaId` and `name`.
 * @returns {JSX.Element} The header grid with labeled columns and arena selector.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleEarningsHeader = ({ isMobile, selectedArena, setSelectedArena, arenas }) => {
    return (
        <Grid
            templateColumns="repeat(5, 1fr)"
            gap={4}
            w="90%"
            mx="auto"
            mt={3}
            p={1}
            borderRadius="10px"
            border="2px solid #C1A34C"
            color="#FFF"
            bgColor="inherit"
            position="sticky"
            top="0"
            zIndex={1}>
            <ColumnLabel label="DATE" isMobile={isMobile} />
            <ArenaSelect
                selectedArena={selectedArena}
                setSelectedArena={setSelectedArena}
                arenas={arenas}
                isMobile={isMobile}
            />
            <RewardColumn label="GEM" imageSrc="/images/currency/gem.png" isMobile={isMobile} />
            <RewardColumn label="WETH" imageSrc="/images/currency/weth.png" isMobile={isMobile} />
            <ColumnLabel label="CARDS" isMobile={isMobile} />
        </Grid>
    );
};

export default BattleEarningsHeader;
