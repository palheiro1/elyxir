import { useEffect, useState } from 'react';
import { Box, Center, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';

// Components
import HCountdown from './HCountdown';

// Data
import { BLOCKTIME, FREQUENCY } from '../../data/CONSTANTS';

// Services
//import { getBlockchainStatus } from '../../services/Ardor/ardorInterface';
import { getBountyBalance, swapPriceEthtoUSD, getBountyParticipants } from '../../services/Bounty/utils';
import { getGemPrice, getManaPrice } from '../../services/Ardor/evmInterface';

/**
 * @name BountyWidget
 * @description This component is the bounty widget
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Number} cStyle - Style of the component
 * @param {Number} numParticipants - Number of participants in the bounty
 * @param {Object} blockchainStatus - Blockchain status
 * @returns {JSX.Element} - JSX element
 * @example <BountyWidget cStyle={0} numParticipants={0} blockchainStatus={{}} /> --> Home page
 * @example <BountyWidget cStyle={1} numParticipants={0} blockchainStatus={{}} /> --> Bounty page
 */
const BountyWidget = ({ blockchainStatus = {}, cStyle = 0 }) => {
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
    });

    const [bountyBalanceUSD, setBountyBalanceUSD] = useState({
        wETH: 0,
        GEM: 0,
        Mana: 0,
        Sumanga: 0,
        Total: 0,
    });
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [] });

    useEffect(() => {
        const fetchBountyBalance = async () => {
            try {
                const [bountyBalance, responseParticipants, gemPrice, manaPrice] = await Promise.all([
                    getBountyBalance(),
                    getBountyParticipants(),
                    getGemPrice(),
                    getManaPrice(),
                ]);

                setBountyBalance({
                    wETH: bountyBalance,
                    GEM: 9000,
                    Mana: 9000,
                });

                // const wETHinUSD = await swapPriceEthtoUSD(bountyBalance);
                const [wethUsd, sumangaUsd] = await Promise.all([
                    swapPriceEthtoUSD(bountyBalance),
                    swapPriceEthtoUSD(0.02),
                ]);

                const totalGem = gemPrice * 9000;
                const totalMana = manaPrice * 9000;
                const totalSumanga = sumangaUsd * 7;

                setBountyBalanceUSD({
                    wETH: wethUsd,
                    GEM: totalGem,
                    Mana: totalMana,
                    Sumanga: totalSumanga, // 7 cartas
                    Total: Number(wethUsd) + Number(totalGem) + Number(totalMana) + Number(totalSumanga),
                });

                let auxParticipants = [];
                let numParticipants = 0;
                Object.entries(responseParticipants).forEach(entry => {
                    const [key, value] = entry;
                    if (value > 0) {
                        auxParticipants.push({ account: key, quantity: value });
                        numParticipants += value;
                    }
                });
                setParticipants({ numParticipants, participants: auxParticipants });
            } catch (error) {
                console.error('🚀 ~ file: BountyWidget.js:47 ~ fetchBountyBalance ~ error:', error);
            }
        };

        fetchBountyBalance();
    }, []);

    useEffect(() => {
        const getBountyTimer = () => {
            const modulo = blockchainStatus.prev_height % FREQUENCY;
            const remainingBlocks = FREQUENCY - modulo;
            const remainingSecs = remainingBlocks * BLOCKTIME;
            const delta = Number(remainingSecs - BLOCKTIME);

            const days = Math.floor(delta / (24 * 60 * 60));
            const hours = Math.floor((delta % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((delta % (60 * 60)) / 60);

            setBountyTimer({ days, hours, minutes, remainingBlocks });
        };

        blockchainStatus && getBountyTimer();
    }, [blockchainStatus]);

    const borderColor = cStyle === 0 ? 'rgb(47,144,136)' : 'rgb(59,83,151)';
    const bgColor = cStyle === 0 ? 'rgba(47, 144, 136 ,0.15)' : 'rgba(59, 83, 151, 0.15)';

    return (
        <Center py={4}>
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" gap={3}>
                <Box
                    p={6}
                    border="1px"
                    borderColor={borderColor}
                    rounded="lg"
                    bg="blackAlpha"
                    direction="row"
                    bgColor={bgColor}>
                    <HCountdown
                        cStyle={cStyle}
                        bountyTimer={bountyTimer}
                        numParticipants={participants.numParticipants}
                        bountyBalance={bountyBalance}
                        bountyBalanceUSD={bountyBalanceUSD}
                    />
                </Box>
                <Box
                    p={6}
                    border="1px"
                    borderColor={borderColor}
                    rounded="lg"
                    bg="blackAlpha"
                    direction="row"
                    bgColor={bgColor}>
                    <Center>
                        <Image src="/images/currency/multicurrency.png" w="100px" />
                    </Center>
                    <Heading size="md" color="white" textAlign={"center"}>
                        BOUNTY
                    </Heading>

                    <Flex align={'center'} gap={2}>
                        <Text textAlign={'center'} h="100%" fontWeight={'bold'} fontSize={'4xl'}>
                            {bountyBalanceUSD.Total.toFixed(2)}
                        </Text>
                        <Text textAlign={'center'} fontSize={'xl'}>
                            USD
                        </Text>
                    </Flex>
                </Box>
            </Stack>
        </Center>
    );
};

export default BountyWidget;
