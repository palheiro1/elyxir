import { Box, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { formatLeaderboardRewards, getCurrencyImage } from '../../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';

const LeaderboardsRewards = ({ option }) => {
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
            fontSize="md"
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
                                w="50px"
                                h="50px"
                                mt={-2}
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
