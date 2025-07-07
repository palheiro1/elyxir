import { Box, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatLeaderboardRewards, getCurrencyImage } from '../../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';

const LeaderboardsRewards = ({ option, isMobile }) => {
    const [rewards, setRewards] = useState(null);

    useEffect(() => {
        const fetchAccumulatedBounty = async () => {
            try {
                const reward = await formatLeaderboardRewards(option);
                setRewards(reward);
            } catch (error) {
                console.error('Error fetching accumulated bounty or rewards:', error);
            }
        };

        fetchAccumulatedBounty();
    }, [option]);

    return rewards ? (
        <Stack
            direction="row"
            align="center"
            fontFamily="Inter, system"
            fontSize={isMobile ? 'xs' : 'md'}
            w="100%"
            fontWeight={700}
            bgColor={'#FFF'}
            p={2}
            borderRadius={'20px'}>
            <Text fontFamily={'Chelsea Market, System-ui'} color={'#D597B2'} fontWeight={500}>
                REWARDS:
            </Text>
            {Object.entries(rewards)
                .reverse()
                .map(([key, value], index) => {
                    const formattedValue =
                        key === 'weth'
                            ? (value / NQTDIVIDER).toFixed(4)
                            : key === 'gem' || key === 'mana'
                            ? (value / NQTDIVIDER).toFixed(0)
                            : value;

                    return (
                        <Stack key={index} direction="row" align="center" mx={4}>
                            <Text my="auto" textTransform={'uppercase'} color={'#5A679B'}>
                                {formattedValue}
                            </Text>
                            <Image
                                my="auto"
                                src={getCurrencyImage(key)}
                                alt={`${key} Icon`}
                                mt={-2}
                                boxSize={isMobile ? '30px' : '50px'}
                            />
                        </Stack>
                    );
                })}
        </Stack>
    ) : (
        <Box mx="auto">
            <Spinner />
        </Box>
    );
};

export default LeaderboardsRewards;
