import { Center, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatLeaderboardRewards, getCurrencyImage } from '../Utils/BattlegroundsUtils';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';

/**
 * @name Rewards
 * @description Displays the current accumulated leaderboard rewards for the Battlegrounds game. Fetches data from the blockchain and presents a split layout with reward values and corresponding icons. Includes a loading spinner while fetching.
 * @param {Object} props - Chakra UI-compatible style and layout props passed to the root container.
 * @returns {JSX.Element} A styled container showing formatted reward values with currency or item icons. Handles loading and data formatting internally.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const Rewards = ({ ...props }) => {
    const [rewards, setRewards] = useState(null);
    useEffect(() => {
        const fetchAccumulatedBounty = async () => {
            try {
                const reward = await formatLeaderboardRewards('gen');
                setRewards(reward);
            } catch (error) {
                console.error('Error fetching accumulated bounty or rewards:', error);
            }
        };

        fetchAccumulatedBounty();
    }, []);
    return (
        <Stack boxSize={'200px'} borderRadius={'12px'} p={'12px'} color={'#000'} bgColor={'#FFF'} {...props}>
            <Text textDecoration={'underline'} fontSize={'2xl'} fontFamily={'Chelsea Market, system-ui'} mx={'auto'}>
                REWARDS
            </Text>
            {!rewards ? (
                <Center>
                    <Spinner color="#000" />
                </Center>
            ) : (
                <Stack direction={'row'} w={'100%'} mx={'auto'} pl={2}>
                    <Stack direction="column" w={'60%'}>
                        {Object.entries(rewards)
                            .reverse()
                            .slice(0, -1)
                            .map(([key, value], index) => {
                                const formattedValue =
                                    key === 'weth'
                                        ? (value / NQTDIVIDER).toFixed(3)
                                        : key === 'gem' || key === 'mana'
                                        ? (value / NQTDIVIDER).toFixed(0)
                                        : value;

                                return (
                                    <Stack
                                        key={index}
                                        direction="row"
                                        justifyContent="space-between"
                                        align="center"
                                        w="100%">
                                        <Text
                                            my="auto"
                                            textTransform={'uppercase'}
                                            fontSize={'sm'}
                                            fontWeight={'bold'}
                                            w={'50px'}>
                                            {formattedValue}
                                        </Text>
                                        <Image
                                            src={getCurrencyImage(key)}
                                            my="auto"
                                            alt={`${key} Icon`}
                                            w="35px"
                                            h="35px"
                                        />
                                    </Stack>
                                );
                            })}
                    </Stack>
                    <Stack direction="column">
                        {Object.entries(rewards)
                            .reverse()
                            .slice(-1)
                            .map(([key, value], index) => {
                                return (
                                    <Stack key={`last-${index}`} direction="column" align="center" mx={4} my={'auto'}>
                                        <Image
                                            my="auto"
                                            src={getCurrencyImage(key)}
                                            alt={`${key} Icon`}
                                            w="60px"
                                            h="60px"
                                            mt={-2}
                                        />

                                        <Text my="auto" textTransform={'uppercase'} fontSize={'sm'} fontWeight={'bold'}>
                                            {value}
                                        </Text>
                                    </Stack>
                                );
                            })}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};

export default Rewards;
