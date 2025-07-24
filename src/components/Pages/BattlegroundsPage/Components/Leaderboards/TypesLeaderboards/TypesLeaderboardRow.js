import { Grid } from '@chakra-ui/react';
import { formatAddress } from '../../../Utils/BattlegroundsUtils';
import CustomCell from '../../CustomCell';
import FilterLandsCell from './FilterLandsCell';

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
const TypesLeaderboardRow = ({ index, data, isMobile, type, handleSetDefenderFilter }) => {
    const {
        accountRS,
        totalPoints,
        name,
        landsConqueredPoints,
        successfullDefensesPoints,
        battleEfficiencyPoints,
        defenseDurationPoints,
        conqueredArenas,
        accountId,
    } = data;
    if (totalPoints <= 0) return null;

    const bg = index % 2 === 0 ? '#2A2E2E' : '#323636';
    const fiveWinners = index < 5 ? '#D597B2' : '#FFF';
    const oneWinner = index === 0 ? '#D597B2' : '#FFF';
    const color = type === 'general' ? fiveWinners : oneWinner;

    const displayName = name || formatAddress(accountRS);

    const formatPoints = points => (points ? (points * 1000).toFixed(0).toLocaleString('de-DE') : 0);

    const conquered = formatPoints(landsConqueredPoints);
    const defenses = formatPoints(successfullDefensesPoints);
    const efficiency = formatPoints(battleEfficiencyPoints);
    const duration = formatPoints(defenseDurationPoints);
    const total = formatPoints(totalPoints);

    return (
        <Grid templateColumns="repeat(8, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
            <CustomCell value={`#${index + 1}`} isMobile={isMobile} color={color} padding={1} />
            <CustomCell value={displayName} isMobile={isMobile} color={color} padding={1} isUppercase />
            <FilterLandsCell
                value={conqueredArenas[type]}
                isMobile={isMobile}
                padding={1}
                onclick={() => handleSetDefenderFilter(accountId)}
            />
            <CustomCell value={conquered} isMobile={isMobile} padding={1} />
            <CustomCell value={defenses} isMobile={isMobile} padding={1} />
            <CustomCell value={efficiency} isMobile={isMobile} padding={1} />
            <CustomCell value={duration} isMobile={isMobile} padding={1} />
            <CustomCell value={total} isMobile={isMobile} padding={1} color={'#7FC0BE'} />
        </Grid>
    );
};

export default TypesLeaderboardRow;
