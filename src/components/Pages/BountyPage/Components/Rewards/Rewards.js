import { Box, Image, Select, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import RewardsTable from './RewardsTable';
import { getJackpotInfo, getJackpotRewards } from '../../../../../services/Bounty/utils';
import { RewardsDisplay } from './RewardsDisplay';

const Rewards = ({ account }) => {
    const [rewards, setRewards] = useState(null);
    const [jackpotInfo, setJackpotInfo] = useState(null);
    const [filterRewards, setFilterRewards] = useState(false);

    useEffect(() => {
        const fetchRewards = async () => {
            const [info, rewards] = await Promise.all([getJackpotInfo(), getJackpotRewards()]);
            setRewards(rewards);
            setJackpotInfo(info);
        };
        fetchRewards();
    }, []);

    return (
        <>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                w={{ base: '100%', lg: '80%' }}
                align="center"
                px={4}
                py={2}
                mx={'auto'}>
                <Box
                    w={{ base: '100%', lg: '33%' }}
                    display="flex"
                    justifyContent={{ base: 'center', lg: 'flex-start' }}>
                    <Image src="/images/jackpot/jackpotHand.png" boxSize="30%" background="transparent" color="#FFF" />
                </Box>
                <Box w={{ base: '100%', lg: '33%' }} display="flex" justifyContent="center" color={'#FFF'}>
                    <Stack direction="column">
                        <Text fontSize="2xl" fontFamily="Chelsea Market, System-ui" letterSpacing={1.5}>
                            PREVIOUS BOUNTY WINNERS
                        </Text>
                        <Stack direction="row" mt={-2}>
                            <Text fontSize="md" letterSpacing={1.5} fontWeight={400}>
                                BOUNTY BLOCK:
                            </Text>
                            <Text
                                fontSize="md"
                                letterSpacing={1.5}
                                fontWeight={400}
                                color="#73DDE8"
                                textDecoration="underline">
                                {jackpotInfo && jackpotInfo.lastJackpotHeight}
                            </Text>
                        </Stack>
                    </Stack>
                </Box>

                <Box w={{ base: '100%', lg: '33%' }} display="flex" justifyContent={{ base: 'center', lg: 'flex-end' }}>
                    <Select
                        value={filterRewards}
                        onChange={e => setFilterRewards(parseInt(e.target.value))}
                        color="#000"
                        bgColor="#FFF"
                        zIndex={10}
                        fontFamily="Chelsea Market, System-ui"
                        _hover={{ borderColor: '#555' }}
                        maxW="150px">
                        <option value={0} style={{ backgroundColor: '#FFF' }}>
                            ALL PLAYERS
                        </option>
                        <option value={1} style={{ backgroundColor: '#FFF' }}>
                            ONLY ME
                        </option>
                    </Select>
                </Box>
            </Stack>
            <Box px={4} py={2}>
                <RewardsTable rewards={rewards} account={account} filter={filterRewards} />
            </Box>
            {filterRewards ? '' : <RewardsDisplay />}
        </>
    );
};

export default Rewards;
