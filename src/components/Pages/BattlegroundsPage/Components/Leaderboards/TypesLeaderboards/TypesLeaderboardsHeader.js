import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { Grid, GridItem, Text } from '@chakra-ui/react';

/**
 * @name TypesLeaderboardsHeader
 * @description Displays the column headers for the leaderboard table, adapting layout and typography for mobile and desktop views.
 * Uses a 7-column grid to represent leaderboard categories such as position, name, lands conquered, and more.
 * @param {Object} props - Component props.
 * @param {string} props.color - Hex color used for border and background styling of the header.
 * @returns {JSX.Element} A styled and responsive header row for the leaderboard.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardsHeader = ({ color }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Grid
            templateColumns="repeat(7, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={isMobile ? 0 : 3}
            p={2}
            borderRadius={'10px'}
            border={`2px solid ${color}`}
            color={'#000'}
            bgColor={color}
            position="sticky"
            top="0"
            zIndex={1}>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    POSITION
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    NAME/ ADDRESS
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    LANDS CONQUERED
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    SUCCESSFUL DEFENSES
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    BATTLE EFFICIENCY
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    DEFENSE DURATION
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'xs' : 'md'}>
                    TOTAL POINTS
                </Text>
            </GridItem>
        </Grid>
    );
};

export default TypesLeaderboardsHeader;
