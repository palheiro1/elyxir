import { useEffect, useState } from 'react';
import { Box, Center, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';

// Components
import HCountdown from './HCountdown';

// Data
import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

// Services
import { getBountyBalance, swapPriceEthtoUSD, getJackpotFormattedTickets } from '../../services/Bounty/utils';
import { getGemPrice, getManaPrice } from '../../services/Ardor/evmInterface';

import { useSelector } from 'react-redux';

/**
 * @name BountyWidget
 * @description This component is the bounty widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} cStyle - Style of the component
 * @returns {JSX.Element} - JSX element
 */
const BountyWidget = ({ cStyle = 0 }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    const [totalTickets, setTotalTickets] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);

    const [bountyTimer, setBountyTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        remainingBlocks: 'loading',
    });

    const [bountyBalance, setBountyBalance] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
        Items: 0,
    });

    const [bountyBalanceUSD, setBountyBalanceUSD] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
        Sumanga: 0,
        Items: 0,
        Total: 0,
    });

    const selectedColor = cStyle === 0 ? '#2f9088' : '#3b5397';
    const textColor = useColorModeValue(selectedColor, 'white');

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
                    Potions: 10,
                });

                const [wethUsd, cardUsd] = await Promise.all([
                    swapPriceEthtoUSD(bountyBalance),
                    swapPriceEthtoUSD(0.02),
                ]);

                const totalGem = gemPrice * 9000;
                const totalMana = manaPrice * 9000;
                const totalCard = cardUsd * 7;
                const totalPotions = 30;

                setBountyBalanceUSD({
                    wETH: wethUsd,
                    GEM: totalGem,
                    Mana: totalMana,
                    SpecialCard: totalCard, // 7 cartas
                    Potions: totalPotions,
                    Total: Number(wethUsd) + Number(totalGem) + Number(totalMana) + Number(totalCard) + totalPotions,
                });

                const { allTickets: tickets, participants } = await getJackpotFormattedTickets();
                setTotalTickets(tickets.length);
                setTotalParticipants(participants);
            } catch (error) {
                console.error('🚀 ~ file: BountyWidget.js:47 ~ fetchBountyBalance ~ error:', error);
            }
        };

        fetchBountyBalance();
    }, []);

    useEffect(() => {
        const getBountyTimer = () => {
            const modulo = prev_height % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setBountyTimer({ days, hours, minutes, remainingBlocks });
        };

        prev_height && getBountyTimer();
    }, [prev_height]);

    const borderColor = cStyle === 0 ? 'rgb(47,144,136)' : 'rgb(59,83,151)';
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.15)' : 'rgba(59, 83, 151, 0.15)';

    return (
        <Center py={4}>
            <Stack direction={'column'}>
                <Stack direction={{ base: 'column', xl: 'row' }} w="100%" gap={3}>
                    <Box
                        p={4}
                        border="1px"
                        borderColor={borderColor}
                        rounded="lg"
                        bg="blackAlpha"
                        direction="row"
                        bgColor={bgColor}>
                        <HCountdown
                            cStyle={cStyle}
                            bountyTimer={bountyTimer}
                            totalTickets={totalTickets}
                            bountyBalance={bountyBalance}
                            bountyBalanceUSD={bountyBalanceUSD}
                        />
                    </Box>
                    <Box
                        p={4}
                        border="1px"
                        borderColor={borderColor}
                        rounded="lg"
                        bg="blackAlpha"
                        direction="row"
                        bgColor={bgColor}>
                        <Center>
                            <Box h="100%">
                                <Center>
                                    <Image src="/images/currency/multicurrency.png" w="150px" />
                                </Center>
                                <Heading size="md" color={textColor} textAlign={'center'}>
                                    BOUNTY
                                </Heading>

                                <Center gap={2}>
                                    <Text
                                        textAlign={'center'}
                                        h="100%"
                                        fontWeight={'bold'}
                                        fontSize={'4xl'}
                                        color={textColor}>
                                        {bountyBalanceUSD.Total.toFixed(2)}
                                    </Text>
                                    <Text textAlign={'center'} fontSize={'xl'} color={textColor}>
                                        USD
                                    </Text>
                                </Center>
                            </Box>
                        </Center>
                    </Box>
                </Stack>
                {totalParticipants && (
                    <Box
                        px={4}
                        border="1px"
                        borderColor={borderColor}
                        rounded="lg"
                        bg="blackAlpha"
                        direction="row"
                        color={textColor}
                        bgColor={bgColor}>
                        <Stack
                            direction={{ base: 'column', md: 'row' }}
                            justifyContent={'space-between'}
                            w={'100%'}
                            p={2}>
                            <Text fontSize={'xl'} letterSpacing={1} fontWeight={500}>
                                Live status
                            </Text>
                            <Text fontSize={'xl'} letterSpacing={1} fontWeight={500}>
                                {totalParticipants} users have burned cards to win {bountyBalanceUSD.Total.toFixed(2)}{' '}
                                USD
                            </Text>
                        </Stack>
                    </Box>
                )}
            </Stack>
        </Center>
    );
};

export default BountyWidget;
