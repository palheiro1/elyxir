import { Grid, GridItem, Text } from '@chakra-ui/react';
import { GEMASSET, GIFTZASSET, MANAASSET, NQTDIVIDER, WETHASSET } from '../../../../../../../data/CONSTANTS';
import { formatTimeStamp } from '../../../../Utils/BattlegroundsUtils';
import { useEffect, useState } from 'react';

/**
 * @name LeaderboardEarningsRow
 * @description Renders a single row in the leaderboard earnings table showing the rewards
 * for a specific leaderboard period. It calculates and displays the rewards
 * earned in GEM, WETH, MANA, GIFTZ, and any special cards won by the user
 * during that leaderboard cycle.
 * The component processes the passed leaderboardData to aggregate rewards by asset,
 * and updates the cumulative all-time rewards via the setAllTimeRewards callback.
 * It also maps leaderboard types to user-friendly names for display.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag to adjust styling for mobile view.
 * @param {Array} props.leaderboardData - Array of transaction objects for the leaderboard period.
 * @param {Array} props.cards - Array of card objects used to find matching special cards.
 * @param {Function} props.setAllTimeRewards - State setter function to update cumulative rewards.
 * @returns {JSX.Element} Rendered leaderboard earnings row.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LeaderboardEaringsRow = ({ isMobile, leaderboardData, cards, setAllTimeRewards }) => {
    const [rewards, setRewards] = useState({
        giftzReward: 0,
        gemReward: 0,
        wethReward: 0,
        manaReward: 0,
    });

    const [cardsRewards, setCardsRewards] = useState(null);

    const leaderboardsMapping = {
        combativity: 'Combativeness',
        terrestrial: 'Lands',
        aerial: 'Sky',
        aquatic: 'Oceans',
        general: 'Champions',
    };

    const rewardsInfo = leaderboardData.reduce((groups, transaction) => {
        const asset = transaction.attachment?.asset;
        if (!asset) return groups;

        if (!groups[asset]) {
            groups[asset] = [];
        }
        groups[asset].push(transaction);

        return groups;
    }, {});

    useEffect(() => {
        const calculateRewards = asset =>
            rewardsInfo[asset]?.reduce((sum, item) => sum + Number(item.attachment.quantityQNT), 0) || 0;

        const giftzs = calculateRewards(GIFTZASSET);
        const gems = calculateRewards(GEMASSET);
        const weth = calculateRewards(WETHASSET);
        const mana = calculateRewards(MANAASSET);

        setRewards(prevState => {
            const newRewards = {
                giftzReward: giftzs,
                gemReward: gems,
                wethReward: weth,
                manaReward: mana,
            };

            if (JSON.stringify(prevState) !== JSON.stringify(newRewards)) {
                return newRewards;
            }
            return prevState;
        });

        const card = cards.find(card => Object.keys(rewardsInfo).includes(card.asset));
        setCardsRewards(card);

        setAllTimeRewards(prevState => {
            const newGiftz = prevState.giftz + giftzs;
            const newGem = prevState.gem + gems;
            const newWeth = prevState.weth + weth;
            const newMana = prevState.mana + mana;
            const newCards = prevState.cards + (card ? card.length : 0);

            const newRewardsState = {
                giftz: newGiftz,
                gem: newGem,
                weth: newWeth,
                mana: newMana,
                cards: newCards,
            };

            if (JSON.stringify(prevState) !== JSON.stringify(newRewardsState)) {
                return newRewardsState;
            }
            return prevState;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid templateColumns="repeat(7, 1fr)" gap={4} w="100%" mx="auto" mt={2} borderRadius="10px" color={'#FFF'}>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {formatTimeStamp(leaderboardData[0].timestamp)}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {leaderboardsMapping[leaderboardData[0].leaderboardType]}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    textTransform={'uppercase'}
                    justifyContent="center">
                    {rewards.gemReward > 0 ? rewards.gemReward / NQTDIVIDER : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {rewards.wethReward > 0 ? rewards.wethReward / NQTDIVIDER : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {rewards.manaReward > 0 ? rewards.manaReward / NQTDIVIDER : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {rewards.giftzReward}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Text
                    p={3}
                    maxH={'45px'}
                    fontFamily={'Inter, System'}
                    fontWeight={700}
                    h="100%"
                    fontSize={isMobile ? 'xs' : 'md'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {cardsRewards && cardsRewards.length > 0
                        ? cardsRewards.map(card => <Text>{card.name}</Text>)
                        : ' - '}
                </Text>
            </GridItem>
        </Grid>
    );
};

export default LeaderboardEaringsRow;
