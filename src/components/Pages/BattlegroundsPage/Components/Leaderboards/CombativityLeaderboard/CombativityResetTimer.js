import { Box, Image, Skeleton, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getGiftzRewardQNT, getLeaderboardsResetBlock } from '../../../../../../services/Battlegrounds/Battlegrounds';
import { useBlockCountdown } from '../../../../../../hooks/useBlockCountDown';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaderboardRewards } from '../../../../../../redux/reducers/LeaderboardsReducer';

/**
 * @name CombativityResetTimer
 * @description Styled countdown showing time until leaderboard reset + GIFTZ reward. Inspired by "blocky" timer layout.
 * @param {Object} props - Component props.
 * @param {number} props.option - Leaderboard option to store rewards.
 * @param {object} rest - Extra props passed to Stack container.
 * @returns {JSX.Element} Stylized countdown timer with reward.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CombativityResetTimer = ({ option, ...rest }) => {
    const [giftzRewardQNT, setGiftzRewardQNT] = useState(null);
    const timeLeft = useBlockCountdown(getLeaderboardsResetBlock);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const { isMobile } = useBattlegroundBreakpoints();

    const { rewardsByOption } = useSelector(state => state.leaderboards);
    const cachedRewards = rewardsByOption?.[option];

    useEffect(() => {
        try {
            if (cachedRewards) {
                setGiftzRewardQNT(cachedRewards);
                return;
            }
            const fetchData = async () => {
                const reward = await getGiftzRewardQNT();
                setGiftzRewardQNT(reward);
                dispatch(setLeaderboardRewards({ option, rewards: reward }));
            };
            fetchData();
        } catch (error) {
            console.error('🚀 ~ useEffect ~ error:', error);
        } finally {
            setLoading(false);
        }
    }, [cachedRewards, dispatch, option]);

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
                        {giftzRewardQNT ? (
                            <Stack
                                direction="row"
                                align="start"
                                fontFamily="Inter, system"
                                fontSize={isMobile ? 'xs' : 'md'}
                                w="100%"
                                justifyContent={'space-between'}
                                fontWeight={700}
                                bgColor={'#FFF'}
                                px={isMobile ? 3 : 4}
                                py={isMobile ? 2 : 4}
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
                        ) : (
                            <Stack
                                direction="row"
                                align="start"
                                fontFamily="Inter, system"
                                fontSize={isMobile ? 'xs' : 'md'}
                                w="100%"
                                justifyContent="space-between"
                                fontWeight={700}
                                bgColor="#FFF"
                                px={isMobile ? 3 : 4}
                                py={isMobile ? 2 : 4}
                                borderRadius="20px">
                                <Skeleton boxSize={isMobile ? '25px' : '35px'} mt={-1} borderRadius="full" />
                                <SkeletonText noOfLines={1} width={isMobile ? '20px' : '30px'} my={'auto'} />
                            </Stack>
                        )}
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
                                    px={isMobile ? 3 : 4}
                                    py={isMobile ? 2 : 4}
                                    borderRadius="lg"
                                    textAlign="center"
                                    minW={isMobile ? '50px' : '60px'}>
                                    <Text color="white" fontSize={isMobile ? 'sm' : 'lg'} fontWeight="bold">
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
