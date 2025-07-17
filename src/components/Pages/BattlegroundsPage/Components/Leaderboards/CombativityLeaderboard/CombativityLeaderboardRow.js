import { Grid, GridItem, Text } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';

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
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {`#${index + 1}`}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        textTransform={'uppercase'}
                        justifyContent="center">
                        {name ? name : accountRS}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={3}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {points ? Math.floor(points).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
            </Grid>
        )
    );
};

export default CombativityLeaderboardRow;
