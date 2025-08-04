import { Grid, GridItem, Text } from '@chakra-ui/react';

/**
 * @name LeaderboardRewards
 * @description Displays the all-time total rewards summary in a grid format for the leaderboard.
 * Shows aggregated amounts for GEM, WETH, MANA, GIFTZ, and SPECIAL CARDS.
 * The layout adapts font sizes for mobile devices based on the isMobile prop.
 * The component is styled with a sticky position to remain visible on scroll.
 * @param {Object} props - Component props.
 * @param {Object} props.allTimeRewards - Object containing total rewards by type.
 * @param {number|string} props.allTimeRewards.gem - Total GEM rewards.
 * @param {number|string} props.allTimeRewards.weth - Total WETH rewards.
 * @param {number|string} props.allTimeRewards.mana - Total MANA rewards.
 * @param {number|string} props.allTimeRewards.giftz - Total GIFTZ rewards.
 * @param {number|string} props.allTimeRewards.cards - Total SPECIAL CARDS rewards.
 * @param {boolean} props.isMobile - Flag to toggle mobile styling.
 * @returns {JSX.Element} The leaderboard all-time rewards summary component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LeaderboardRewards = ({ allTimeRewards, isMobile }) => {
    return (
        <Grid
            templateColumns="repeat(7, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={3}
            p={2}
            borderRadius={'10px'}
            border={'2px solid #BBC4D3'}
            color={'#000'}
            bgColor={'#BBC4D3'}
            position="sticky"
            top="0"
            zIndex={1}>
            <GridItem colSpan={2} my={'auto'} ml={5}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    ALL TIME TOTAL
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {allTimeRewards.gem}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {allTimeRewards.weth}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {allTimeRewards.mana}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {allTimeRewards.giftz}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {allTimeRewards.cards}
                </Text>
            </GridItem>
        </Grid>
    );
};

export default LeaderboardRewards;
