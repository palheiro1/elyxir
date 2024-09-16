import { Stack, Text } from '@chakra-ui/react';

const CombativityResetTimer = ({ leaderboardResetTimer }) => {
    const timeParts = [];

    if (leaderboardResetTimer?.days) {
        timeParts.push(`${leaderboardResetTimer.days} day${leaderboardResetTimer.days > 1 ? 's' : ''}`);
    }

    if (leaderboardResetTimer?.hours) {
        timeParts.push(`${leaderboardResetTimer.hours} hour${leaderboardResetTimer.hours > 1 ? 's' : ''}`);
    }

    if (leaderboardResetTimer?.minutes) {
        timeParts.push(`${leaderboardResetTimer.minutes} minute${leaderboardResetTimer.minutes > 1 ? 's' : ''}`);
    }

    let timeString = '';

    if (timeParts.length > 1) {
        timeString = timeParts.slice(0, -1).join(', ') + ' and ' + timeParts[timeParts.length - 1];
    } else {
        timeString = timeParts[0] || 'less than a minute';
    }

    return (
        <Stack fontFamily="Chelsea market, System">
            {leaderboardResetTimer.remainingBlocks !== 'loading' ? (
                <Text color="#FFF" fontFamily="Chelsea market, System">
                    Reseting combativity leaderboard in {timeString}.
                </Text>
            ) : (
                <Text color="#FFF">Loading...</Text>
            )}
        </Stack>
    );
};

export default CombativityResetTimer;
