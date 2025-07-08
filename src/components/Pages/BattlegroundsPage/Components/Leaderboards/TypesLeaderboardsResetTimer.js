import { Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTypesLeaderboardsResetBlock } from '../../../../../services/Battlegrounds/Battlegrounds';
import { useSelector } from 'react-redux';
import { BLOCKTIME } from '../../../../../data/CONSTANTS';

/**
 * @name TypesLeaderboardsResetTimer
 * @description Displays a countdown timer showing how much time is left until the **types-based leaderboards** reset.
 * It calculates the time based on the current blockchain height (`prev_height`) and the reset block obtained from `getTypesLeaderboardsResetBlock`.
 * The countdown is shown in a human-readable format like "2 days, 4 hours and 15 minutes".
 * @param {boolean} isMobile - If true, applies smaller font size for mobile display.
 * @param {object} rest - Additional props to spread into the Chakra `Stack` container.
 * @returns {JSX.Element} A countdown timer or loading indicator, rendered with Chakra UI.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardsResetTimer = ({ isMobile, ...rest }) => {
    const [leaderboardResetTimer, setLeaderboardResetTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    const { prev_height } = useSelector(state => state.blockchain);
    const [timeString, setTimeString] = useState(null);
    useEffect(() => {
        const calculateLeaderboardsResetTime = async () => {
            const resetBlock = await getTypesLeaderboardsResetBlock();
            const remainingBlocks = resetBlock - prev_height;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setLeaderboardResetTimer({ days, hours, minutes, remainingBlocks });
        };

        prev_height && calculateLeaderboardsResetTime();
    }, [prev_height]);

    useEffect(() => {
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
        let timeRes;
        if (timeParts.length > 1) {
            timeRes = timeParts.slice(0, -1).join(', ') + ' and ' + timeParts[timeParts.length - 1];
        } else {
            timeRes = timeParts[0] || 'less than a minute';
        }
        setTimeString(timeRes);
    }, [leaderboardResetTimer.days, leaderboardResetTimer.hours, leaderboardResetTimer.minutes]);

    return (
        <Stack fontFamily="Chelsea market, System" {...rest}>
            {leaderboardResetTimer.remainingBlocks !== 'loading' ? (
                <Stack direction={'column'}>
                    <Text
                        color="#FFF"
                        fontFamily="Chelsea market, System"
                        textTransform={'uppercase'}
                        fontSize={isMobile ? 'xs' : 'md'}>
                        Reseting leaderboards in {timeString}.
                    </Text>
                </Stack>
            ) : (
                <Text color="#FFF">Loading...</Text>
            )}
        </Stack>
    );
};

export default TypesLeaderboardsResetTimer;
