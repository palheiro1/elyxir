import { Grid, Stack, Text } from '@chakra-ui/react';
import { formatAddress } from '../../../Utils/BattlegroundsUtils';
import CustomCell from '../../CustomCell';
import FilterLandsCell from './FilterLandsCell';
import ResponsiveTooltip from '../../../../../ui/ReponsiveTooltip';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { rewardsTextByType } from '../data';

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
    const fiveWinnersColor = index < 5 ? '#D597B2' : '#FFF';
    const oneWinnerColor = index === 0 ? '#D597B2' : '#FFF';
    const color = type === 'general' ? fiveWinnersColor : oneWinnerColor;

    const winnersNumbers = type === 'general' ? 5 : 1;

    const displayName = name || formatAddress(accountRS);

    const formatPoints = points => (points ? (points * 1000).toFixed(0).toLocaleString('de-DE') : 0);

    const conquered = formatPoints(landsConqueredPoints);
    const defenses = formatPoints(successfullDefensesPoints);
    const efficiency = formatPoints(battleEfficiencyPoints);
    const duration = formatPoints(defenseDurationPoints);
    const total = formatPoints(totalPoints);

    const rewardText = rewardsTextByType?.[type]?.[index];

    return (
        <Grid templateColumns="repeat(8, 1fr)" gap={4} w="100%" mx="auto" mt={0} bgColor={bg} borderRadius="10px">
            <CustomCell isMobile={isMobile} color={color} padding={1}>
                <Stack direction="row" my={'auto'} ml={index < 5 && -5}>
                    {index < winnersNumbers && (
                        <ResponsiveTooltip label={rewardText} mr={2} mt={-1}>
                            <span>
                                <InfoOutlineIcon cursor="pointer" color={'#C3C3C3'} />
                            </span>
                        </ResponsiveTooltip>
                    )}
                    <Text>#{index + 1}</Text>
                </Stack>
            </CustomCell>
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
