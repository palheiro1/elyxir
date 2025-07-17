import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { Grid, GridItem, Text } from '@chakra-ui/react';

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
            templateColumns="repeat(3, 1fr)"
            gap={4}
            w="90%"
            mx="auto"
            mt={3}
            p={5}
            borderRadius="10px"
            bgColor={color}>
            <GridItem colSpan={1} textAlign="center" my="auto">
                <Text fontFamily="Inter, System" fontWeight={700} color="#FFF" fontSize={isMobile ? 'sm' : 'md'}>
                    POSITION
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my="auto">
                <Text fontFamily="Inter, System" fontWeight={700} color="#FFF" fontSize={isMobile ? 'sm' : 'md'}>
                    NAME/ ADDRESS
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my="auto">
                <Text fontFamily="Inter, System" fontWeight={700} color="#FFF" fontSize={isMobile ? 'sm' : 'md'}>
                    POINTS
                </Text>
            </GridItem>
        </Grid>
    );
};

export default CombativityLeaderboardHeader;
