import { Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getGiftzRewardQNT, getLeaderboardsResetBlock } from '../../../../../services/Battlegrounds/Battlegrounds';
import { useSelector } from 'react-redux';
import { BLOCKTIME } from '../../../../../data/CONSTANTS';

const CombativityResetTimer = ({ isMobile, ...rest }) => {
    const [leaderboardResetTimer, setLeaderboardResetTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    const { prev_height } = useSelector(state => state.blockchain);
    const [timeString, setTimeString] = useState(null);
    const [giftzRewardQNT, setGiftzRewardQNT] = useState(null);
    useEffect(() => {
        const calculateLeaderboardsResetTime = async () => {
            const resetBlock = await getLeaderboardsResetBlock();
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
        const fetchGiftzRewardQNT = async () => {
            const qnt = await getGiftzRewardQNT();
            setGiftzRewardQNT(qnt);
        };
        fetchGiftzRewardQNT();
    }, []);
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
        <Stack fontFamily="Chelsea market, System" fontSize={isMobile ? 'xs' : 'md'} {...rest}>
            {leaderboardResetTimer.remainingBlocks !== 'loading' ? (
                <Stack direction={'column'}>
                    <Stack direction={'row'} mx={'auto'}>
                        <Text>REWARD: {giftzRewardQNT}</Text>{' '}
                        <Image
                            my="auto"
                            src={'images/currency/giftz.png'}
                            alt={'GIFTZ Icon (˘･_･˘)'}
                            boxSize={isMobile ? '30px' : '40px'}
                            mt={-2}
                        />
                    </Stack>
                    <Text color="#FFF" fontFamily="Chelsea market, System" textTransform={'uppercase'}>
                        Reseting combativity leaderboard in {timeString}.
                    </Text>
                </Stack>
            ) : (
                <Text color="#FFF">Loading...</Text>
            )}
        </Stack>
    );
};

export default CombativityResetTimer;
