import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getGiftzRewardQNT, getLeaderboardsResetBlock } from '../../../../../services/Battlegrounds/Battlegrounds';
import { useSelector } from 'react-redux';
import { BLOCKTIME } from '../../../../../data/CONSTANTS';

/**
 * @name CombativityResetTimer
 * @description Styled countdown showing time until leaderboard reset + GIFTZ reward. Inspired by "blocky" timer layout.
 * @param {boolean} isMobile - Whether to render mobile-friendly sizing.
 * @param {object} rest - Extra props passed to Stack container.
 * @returns {JSX.Element} Stylized countdown timer with reward.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CombativityResetTimer = ({ isMobile, ...rest }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    const [giftzRewardQNT, setGiftzRewardQNT] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const reward = await getGiftzRewardQNT();
            setGiftzRewardQNT(reward);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let interval;

        const calculate = async () => {
            const resetBlock = await getLeaderboardsResetBlock();
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
                setLoading(false);
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
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            align="center"
            spacing={3}
            fontFamily="Chelsea Market, system-ui"
            fontSize={isMobile ? 'xs' : 'md'}
            {...rest}>
            {!loading ? (
                <>
                    <Stack direction={'column'} spacing={2} justify="center">
                        <Text color="white">REWARD</Text>
                        <Stack
                            direction="row"
                            align="start"
                            fontFamily="Inter, system"
                            fontSize={isMobile ? 'xs' : 'md'}
                            w="100%"
                            justifyContent={'space-between'}
                            fontWeight={700}
                            bgColor={'#FFF'}
                            py={2}
                            p={4}
                            borderRadius={'20px'}>
                            <Image
                                src={'/images/currency/giftz.png'}
                                alt="GIFTZ Icon"
                                boxSize={isMobile ? '25px' : '35px'}
                                mt={-1}
                            />
                            <Text textTransform={'uppercase'} color={'#5A679B'}>
                                {giftzRewardQNT}
                            </Text>
                        </Stack>
                    </Stack>

                    <Stack alignItems={'end'}>
                        <Text color="white" textTransform="uppercase">
                            Reseting combativity leaderboard in
                        </Text>
                        <Stack direction={'row'} spacing={isMobile ? 2 : 4}>
                            {timeItems.map(({ value, label }, idx) => (
                                <Box
                                    key={idx}
                                    bg="#2b2b2b"
                                    px={isMobile ? 3 : 5}
                                    py={isMobile ? 2 : 3}
                                    borderRadius="lg"
                                    textAlign="center"
                                    minW={isMobile ? '50px' : '60px'}>
                                    <Text color="white" fontSize={isMobile ? 'md' : 'lg'} fontWeight="bold">
                                        {value.toString().padStart(2, '0')}
                                    </Text>
                                    <Text color="whiteAlpha.700" fontSize={isMobile ? '2xs' : 'xs'}>
                                        {label}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </>
            ) : (
                <Text color="#FFF">Loading...</Text>
            )}
        </Stack>
    );
};

export default CombativityResetTimer;
