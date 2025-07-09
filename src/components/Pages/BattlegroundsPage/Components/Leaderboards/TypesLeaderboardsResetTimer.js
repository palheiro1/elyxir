import { Box, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTypesLeaderboardsResetBlock } from '../../../../../services/Battlegrounds/Battlegrounds';
import { useSelector } from 'react-redux';
import { BLOCKTIME } from '../../../../../data/CONSTANTS';

/**
 * @name TypesLeaderboardsResetTimer
 * @description Countdown timer in blocks and seconds for types-based leaderboards. Styled with Chakra UI to match a battle-themed UI.
 * @param {boolean} isMobile - Adjust font size and spacing for mobile screens.
 * @returns {JSX.Element} Styled countdown timer.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardsResetTimer = ({ isMobile }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        let interval;

        const calculate = async () => {
            const resetBlock = await getTypesLeaderboardsResetBlock();
            const getDelta = () => {
                const remainingBlocks = resetBlock - prev_height;
                return remainingBlocks * BLOCKTIME;
            };

            const update = () => {
                const delta = getDelta();
                const days = Math.floor(delta / (24 * 3600));
                const hours = Math.floor((delta % (24 * 3600)) / 3600);
                const minutes = Math.floor((delta % 3600) / 60);
                const seconds = Math.floor(delta % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            };

            update();
            interval = setInterval(update, 1000);
        };

        if (prev_height) calculate();

        return () => clearInterval(interval);
    }, [prev_height]);

    const timeItems = [
        { label: 'days', value: timeLeft.days },
        { label: 'hours', value: timeLeft.hours },
        { label: 'minutes', value: timeLeft.minutes },
        { label: 'seconds', value: timeLeft.seconds },
    ];

    return (
        <Stack align="end" fontFamily="Chelsea Market, system-ui">
            <Text color="white" textTransform="uppercase" letterSpacing="wide">
                Reset leaderboards in
            </Text>

            <Stack direction={'row'} spacing={isMobile ? 2 : 4}>
                {timeItems.map((item, idx) => (
                    <Box
                        key={idx}
                        bg="#2b2b2b"
                        px={isMobile ? 3 : 5}
                        py={isMobile ? 2 : 3}
                        borderRadius="lg"
                        textAlign="center"
                        minW={isMobile ? '50px' : '60px'}>
                        <Text color="white" fontSize={isMobile ? 'md' : 'lg'} fontWeight="bold">
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
