import { Image, Skeleton, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatLeaderboardRewards, getCurrencyImage } from '../../../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../../../data/CONSTANTS';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import { CURRENCY_PRECISION } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaderboardRewards } from '../../../../../../redux/reducers/LeaderboardsReducer';

/**
 * @name TypesLeaderboardsRewards
 * @description Displays formatted leaderboard rewards for a given leaderboard option.
 * It fetches and displays reward quantities along with corresponding currency icons.
 * Supports formatting for GEM, MANA, and wETH amounts based on `NQTDIVIDER`.
 * @param {number} option - The leaderboard option to fetch rewards for (used internally by `formatLeaderboardRewards`).
 * @returns {JSX.Element} A Chakra UI `Stack` with reward amounts and icons or a loading spinner.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const TypesLeaderboardsRewards = ({ option }) => {
    const [rewards, setRewards] = useState(null);
    const { isMobile } = useBattlegroundBreakpoints();
    const dispatch = useDispatch();

    const { rewardsByOption } = useSelector(state => state.leaderboards);
    const cachedRewards = rewardsByOption?.[option];

    useEffect(() => {
        const getRewards = async () => {
            if (cachedRewards) {
                setRewards(cachedRewards);
                return;
            }

            try {
                const data = await formatLeaderboardRewards(option);
                setRewards(data);
                dispatch(setLeaderboardRewards({ option, rewards: data }));
            } catch (error) {
                console.error('Error fetching leaderboard rewards:', error);
            }
        };

        getRewards();
    }, [option, cachedRewards, dispatch]);

    const formatValue = (key, value) => {
        const precision = CURRENCY_PRECISION[key];
        return precision !== undefined ? (value / NQTDIVIDER).toFixed(precision) : value;
    };

    const rewardEntries = rewards && Object.entries(rewards).reverse();

    return (
        <Stack w="100%" align="start" maxW="500px">
            <Text
                fontFamily="Chelsea Market, system-ui"
                color="#FFF"
                fontWeight={500}
                fontSize={isMobile ? 'sm' : 'md'}>
                REWARDS
            </Text>

            {rewards ? (
                <Stack
                    direction="row"
                    align="center"
                    fontFamily="Inter, system-ui"
                    fontSize={isMobile ? 'xs' : 'md'}
                    w="100%"
                    justify="space-between"
                    fontWeight={700}
                    bg="#FFF"
                    py={2}
                    px={4}
                    borderRadius="20px">
                    {rewardEntries.map(([key, value]) => {
                        const formatted = formatValue(key, value);
                        const icon = getCurrencyImage(key);

                        return (
                            <Stack key={key} direction="row" align="center">
                                <Image src={icon} alt={`${key} Icon`} boxSize={isMobile ? '30px' : '50px'} />
                                <Text textTransform="uppercase" color="#5A679B">
                                    {formatted}
                                </Text>
                            </Stack>
                        );
                    })}
                </Stack>
            ) : (
                <Stack
                    direction="row"
                    align="center"
                    fontSize={isMobile ? 'xs' : 'md'}
                    w="100%"
                    justify="space-between"
                    fontWeight={700}
                    bg="#FFF"
                    py={2}
                    px={4}
                    borderRadius="20px">
                    {[1, 2, 3].map(i => (
                        <Stack key={i} direction="row" align="center">
                            <Skeleton boxSize={isMobile ? '30px' : '50px'} borderRadius="full" />
                            <SkeletonText noOfLines={1} width={isMobile ? '40px' : '60px'} />
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

export default TypesLeaderboardsRewards;
