import { useEffect } from 'react';
import { useState } from 'react';
import { getBountyBalance, swapPriceEthtoUSD } from '../../../../../services/Bounty/utils';
import { getGemPrice, getManaPrice } from '../../../../../services/Ardor/evmInterface';
import { Image, Stack, Text } from '@chakra-ui/react';

export const RewardsDisplay = () => {
    const [bountyBalance, setBountyBalance] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
    });

    const [bountyBalanceUSD, setBountyBalanceUSD] = useState({
        Total: 0,
    });

    useEffect(() => {
        const fetchBountyBalance = async () => {
            try {
                const [bountyBalance, gemPrice, manaPrice] = await Promise.all([
                    getBountyBalance(),
                    getGemPrice(),
                    getManaPrice(),
                ]);

                setBountyBalance({
                    wETH: bountyBalance,
                    GEM: 9000,
                    Mana: 9000,
                });

                const [wethUsd, cardUsd] = await Promise.all([
                    swapPriceEthtoUSD(bountyBalance),
                    swapPriceEthtoUSD(0.02),
                ]);

                const totalGem = gemPrice * 9000;
                const totalMana = manaPrice * 9000;
                const totalCard = cardUsd * 7;

                setBountyBalanceUSD({
                    Total: Number(wethUsd) + Number(totalGem) + Number(totalMana) + Number(totalCard),
                });
            } catch (error) {
                console.error('🚀 ~ file: BountyWidget.js:47 ~ fetchBountyBalance ~ error:', error);
            }
        };

        fetchBountyBalance();
    }, []);

    const rewardsData = [
        {
            key: 'wETH',
            image: 'images/currency/weth.png',
            alt: 'wETH Icon',
            value: bountyBalance.wETH,
            label: 'WETH',
        },
        {
            key: 'Mana',
            image: 'images/currency/mana.png',
            alt: 'mana Icon',
            value: bountyBalance.Mana,
            label: 'MANA',
        },
        {
            key: 'GEM',
            image: 'images/currency/gem.png',
            alt: 'gem Icon',
            value: bountyBalance.GEM,
            label: 'GEMs',
        },
        {
            key: 'cards',
            image: 'https://media.mythicalbeings.io/sm/mythical62.jpg',
            alt: 'special cards Icon',
            value: 7,
            label: 'SPECIAL CARDS',
            customSize: { h: '40px' },
        },
        {
            key: 'total',
            image: '/images/currency/multicurrency.png',
            alt: 'total bounty Icon',
            value: bountyBalanceUSD.Total.toFixed(2),
            label: 'USD TOTAL BOUNTY',
        },
    ];

    return (
        <Stack
            direction={'column'}
            align="center"
            justifyContent={'space-between'}
            fontFamily="Inter, system"
            fontSize="md"
            w="100%"
            color={'#FFF'}
            px={4}>
            <Text fontFamily={'Chelsea market, system-ui'} fontWeight={500}>
                TOTAL ACCUMULATED IN THIS BOUNTY
            </Text>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align="center"
                justifyContent={'space-between'}
                mt={3}
                w="100%">
                {rewardsData.map(reward => (
                    <Stack key={reward.key} direction={'row'} align="center" mx={4}>
                        <Image
                            my="auto"
                            src={reward.image}
                            alt={reward.alt}
                            w={reward.customSize?.w || '40px'}
                            h={reward.customSize?.h || '40px'}
                            mt={-2}
                        />
                        <Text my="auto" textTransform={'uppercase'} fontWeight={300}>
                            {reward.value} {reward.label}
                        </Text>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};
