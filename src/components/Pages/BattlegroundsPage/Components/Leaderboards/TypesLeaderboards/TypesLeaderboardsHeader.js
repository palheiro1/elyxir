import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { Grid } from '@chakra-ui/react';
import ColumnLabel from '../../ColumnLabel';
import { TypesLeaderboardsHeaders } from '../data';

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
            templateColumns={`repeat(${TypesLeaderboardsHeaders.length}, 1fr)`}
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
            {TypesLeaderboardsHeaders.map(item => (
                <ColumnLabel label={item} isMobile={isMobile} />
            ))}
        </Grid>
    );
};

export default TypesLeaderboardsHeader;
