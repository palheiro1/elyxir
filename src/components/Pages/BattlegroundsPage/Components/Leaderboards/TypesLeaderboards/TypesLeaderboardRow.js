import { Grid, GridItem, Text } from '@chakra-ui/react';
import { formatAddress } from '../../../Utils/BattlegroundsUtils';

/**
 * @name TypesLeaderboardRow
 * @description Renders a leaderboard row with detailed scoring categories for a user.
 * Highlights top ranks differently depending on the leaderboard type ('general' or others).
 * @param {Object} props - Component props.
 * @param {number} props.index - The zero-based rank index.
 * @param {Object} props.data - User data object containing points and account info.
 * @param {string} props.data.accountRS - User account identifier.
 * @param {number} props.data.totalPoints - Total points scored.
 * @param {string} [props.data.name] - Optional user display name.
 * @param {number} props.data.landsConqueredPoints - Points from lands conquered.
 * @param {number} props.data.successfullDefensesPoints - Points from successful defenses.
 * @param {number} props.data.battleEfficiencyPoints - Points from battle efficiency.
 * @param {number} props.data.defenseDurationPoints - Points from defense duration.
 * @param {boolean} props.isMobile - Flag to adjust styling for mobile.
 * @param {string} props.type - Leaderboard type, e.g., 'general'.
 * @returns {JSX.Element|null} The leaderboard row or null if totalPoints is zero or less.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardRow = ({ index, data, isMobile, type }) => {
    const {
        accountRS,
        totalPoints,
        name,
        landsConqueredPoints,
        successfullDefensesPoints,
        battleEfficiencyPoints,
        defenseDurationPoints,
    } = data;

    const bg = index % 2 === 0 ? '#2A2E2E' : '#323636';
    const fiveWinners = index < 5 ? '#D597B2' : '#FFF';
    const oneWiner = index === 0 ? '#D597B2' : '#FFF';
    const color = type === 'general' ? fiveWinners : oneWiner;

    return (
        totalPoints > 0 && (
            <Grid templateColumns="repeat(7, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        color={color}
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
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        color={color}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        textTransform={'uppercase'}
                        justifyContent="center">
                        {name ? name : formatAddress(accountRS)}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {landsConqueredPoints ? (landsConqueredPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {successfullDefensesPoints
                            ? (successfullDefensesPoints * 1000).toFixed(0).toLocaleString('de-DE')
                            : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {battleEfficiencyPoints
                            ? (battleEfficiencyPoints * 1000).toFixed(0).toLocaleString('de-DE')
                            : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        {defenseDurationPoints ? (defenseDurationPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
                <GridItem colSpan={1} textAlign="center">
                    <Text
                        p={1}
                        maxH={'45px'}
                        fontFamily={'Inter, System'}
                        fontWeight={700}
                        h="100%"
                        fontSize={isMobile ? 'xs' : 'md'}
                        display="flex"
                        alignItems="center"
                        color={'#7FC0BE'}
                        justifyContent="center">
                        {totalPoints ? (totalPoints * 1000).toFixed(0).toLocaleString('de-DE') : 0}
                    </Text>
                </GridItem>
            </Grid>
        )
    );
};

export default TypesLeaderboardRow;
