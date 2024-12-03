import { Box, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getAccumulatedBounty, getLeaderboardsRewards } from '../../../../../services/Battlegrounds/Battlegrounds';
import { isEmptyObject } from '../../Utils/BattlegroundsUtils';
import { getAsset } from '../../../../../services/Ardor/ardorInterface';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';

const LeaderboardsRewards = ({ option }) => {
    const [rewards, setRewards] = useState(null);

    useEffect(() => {
        const fetchAccumulatedBounty = async () => {
            try {
                const accumulatedBounty = await getAccumulatedBounty();
                const rewards = await getLeaderboardsRewards();
                if (accumulatedBounty && !isEmptyObject(accumulatedBounty) && rewards && !isEmptyObject(rewards)) {
                    const assets = Object.entries(accumulatedBounty.asset);
                    const results = await Promise.all(
                        assets.map(async ([asset, price]) => {
                            const assetDetails = await getAsset(asset);
                            return { ...assetDetails, price };
                        })
                    );
                    const generalTributePercetage = rewards.GeneralLeaderboard.totalRewards.tributePercentage;
                    const tributePercetage = rewards.TerrestrialLeaderboard.top1.tributePercentage;

                    const reward = () => {
                        switch (option) {
                            case 1:
                                return {
                                    cards: rewards.GeneralLeaderboard.totalRewards.specialCards,
                                    mana: rewards.GeneralLeaderboard.totalRewards.manaQNT,
                                    weth:
                                        Number(results.find(item => item.name === 'wETH').price) *
                                        generalTributePercetage,
                                    gem:
                                        Number(results.find(item => item.name === 'GEM').price) *
                                        generalTributePercetage,
                                };
                            default:
                                return {
                                    cards: rewards.TerrestrialLeaderboard.top1.specialCards,
                                    mana: rewards.TerrestrialLeaderboard.top1.manaQNT,
                                    weth: Number(results.find(item => item.name === 'wETH').price) * tributePercetage,
                                    gem: Number(results.find(item => item.name === 'GEM').price) * tributePercetage,
                                };
                        }
                    };

                    setRewards(reward);
                }
            } catch (error) {
                console.error('Error fetching accumulated bounty or rewards:', error);
            }
        };

        fetchAccumulatedBounty();
    }, [option]);

    const getCurrencyImage = key => {
        const path = 'images/currency/';
        switch (key) {
            case 'weth':
                return `${path}weth.png`;
            case 'gem':
                return `${path}gem.png`;
            case 'mana':
                return `${path}mana.png`;
            default:
                return null;
        }
    };

    return rewards ? (
        <Stack direction="row" align="center" fontFamily="Inter, system" fontSize="md" w="100%" fontWeight={700}>
            <Text>REWARDS:</Text>
            {Object.entries(rewards).map(([key, value], index) => {
                const formattedValue =
                    key === 'weth'
                        ? (value / NQTDIVIDER).toFixed(4)
                        : key === 'gem' || key === 'mana'
                        ? (value / NQTDIVIDER).toFixed(0)
                        : value;

                const showImage = key !== 'cards';

                return (
                    <Stack key={index} direction="row" align="center" mx={4}>
                        <Text my="auto" textTransform={'uppercase'}>
                            {formattedValue}
                            {!showImage && ` ${key}`}
                        </Text>
                        {showImage && (
                            <Image
                                my="auto"
                                src={getCurrencyImage(key)}
                                alt={`${key} Icon`}
                                w="40px"
                                h="40px"
                                mt={-2}
                            />
                        )}
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
