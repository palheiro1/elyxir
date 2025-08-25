import { Box, Stack, Text } from '@chakra-ui/react';
import { getTypesLeaderboardsResetBlock } from '../../../../../../services/Battlegrounds/Battlegrounds';
import { useBlockCountdown } from '@hooks/useBlockCountDown';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name TypesLeaderboardsResetTimer
 * @description Countdown timer in blocks and seconds for types-based leaderboards. Styled with Chakra UI to match a battle-themed UI.
 * @param {boolean} isMobile - Adjust font size and spacing for mobile screens.
 * @returns {JSX.Element} Styled countdown timer.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardsResetTimer = () => {
    const timeLeft = useBlockCountdown(getTypesLeaderboardsResetBlock);
    const { isMobile } = useBattlegroundBreakpoints();
    const timeItems = [
        { label: 'days', value: timeLeft.days },
        { label: 'hours', value: timeLeft.hours },
        { label: 'minutes', value: timeLeft.minutes },
        { label: 'seconds', value: timeLeft.seconds },
    ];

    return (
        <Stack align="end" fontFamily="Chelsea Market, system-ui">
            <Text color="white" textTransform="uppercase" letterSpacing="wide" fontSize={isMobile ? 'sm' : 'md'}>
                Reset leaderboards in
            </Text>

            <Stack direction={'row'} spacing={isMobile ? 2 : 4}>
                {timeItems.map((item, idx) => (
                    <Box
                        key={idx}
                        bg="#2b2b2b"
                        px={isMobile ? 3 : 5}
                        py={isMobile ? 1 : 3}
                        borderRadius="lg"
                        textAlign="center"
                        minW={isMobile ? '50px' : '60px'}>
                        <Text color="white" fontSize={isMobile ? 'sm' : 'lg'} fontWeight="bold">
                            {item.value.toString().padStart(2, '0')}
                        </Text>
                        <Text color="whiteAlpha.700" fontSize={isMobile ? '2xs' : 'xs'}>
                            {item.label}
                        </Text>
                    </Box>
                ))}
            </Stack>
        </Stack>
    );
};

export default TypesLeaderboardsResetTimer;
