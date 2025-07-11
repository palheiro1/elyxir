import { useEffect } from 'react';
import { useState } from 'react';
import { getBountyBalance, swapPriceEthtoUSD } from '../../../../../services/Bounty/utils';
import { getGemPrice, getManaPrice } from '../../../../../services/Ardor/evmInterface';
import { Image, Stack, Text, SimpleGrid, Box } from '@chakra-ui/react';

export const RewardsDisplay = () => {
    const [bountyBalance, setBountyBalance] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
        Items: 0, // Added items to bounty balance
    });

    const [bountyBalanceUSD, setBountyBalanceUSD] = useState({
        Total: 0,
    });

    // Mock potions in bounty pool
    const bountyPotions = [
        { name: 'Terrestrial Elixir', image: '/images/items/Lava copia.png', quantity: 5 },
        { name: 'Power Surge Potion', image: '/images/items/Holi Water2 copia.png', quantity: 2 },
        { name: 'Asian Spirit Brew', image: '/images/items/Blood copia.png', quantity: 3 },
    ];

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
                    Items: bountyPotions.reduce((total, potion) => total + potion.quantity, 0),
                });

                const [wethUsd, cardUsd] = await Promise.all([
                    swapPriceEthtoUSD(bountyBalance),
                    swapPriceEthtoUSD(0.02),
                ]);

                const totalGem = gemPrice * 9000;
                const totalMana = manaPrice * 9000;
                const totalCard = cardUsd * 7;
                const totalItems = bountyPotions.length * 10; // Mock item value

                setBountyBalanceUSD({
                    Total: Number(wethUsd) + Number(totalGem) + Number(totalMana) + Number(totalCard) + Number(totalItems),
                });
            } catch (error) {
                console.error('🚀 ~ file: BountyWidget.js:47 ~ fetchBountyBalance ~ error:', error);
            }
        };

        fetchBountyBalance();
    }, [bountyPotions]);

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
            key: 'items',
            image: '/images/items/WaterCristaline copia.png',
            alt: 'potions Icon',
            value: bountyBalance.Items,
            label: 'POTIONS',
        },
        {
            key: 'total',
            image: '/images/items/WaterCristaline copia.png',
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
            
            {/* Display available potions in bounty pool */}
            <Box mt={4} p={4} bg="rgba(255,255,255,0.1)" borderRadius="md" w="100%">
                <Text fontFamily={'Chelsea market, system-ui'} fontWeight={500} textAlign="center" mb={2}>
                    POTIONS IN BOUNTY POOL
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                    {bountyPotions.map((potion, index) => (
                        <Stack key={index} direction={'row'} align="center" justify="center">
                            <Image
                                src={potion.image}
                                alt={potion.name}
                                w="30px"
                                h="30px"
                            />
                            <Text fontSize="sm">
                                {potion.quantity}x {potion.name}
                            </Text>
                        </Stack>
                    ))}
                </SimpleGrid>
            </Box>
        </Stack>
    );
};
