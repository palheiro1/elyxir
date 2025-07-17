import { Box, Grid, GridItem, Image, Text, Tooltip } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../../../data/CONSTANTS';

/**
 * @name BattleEarningsRow
 * @description Renders a single row representing the battle earnings for a specific date and arena.
 * Displays rewards in GEM and WETH (adjusted by NQTDIVIDER), and shows the captured card with
 * a tooltip displaying its image on hover.
 * The layout adapts to mobile view by adjusting font sizes.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag indicating if the view is on a mobile device.
 * @param {string} props.date - Date string of the battle.
 * @param {string} props.arenaName - Name of the arena.
 * @param {Object} props.capturedAsset - Object with keys representing captured card assets.
 * @param {Array<Object>} props.rewards - Array of reward objects with `name` and `price`.
 * @param {Array<Object>} props.cards - Array of card objects containing details such as `name` and `cardImgUrl`.
 * @returns {JSX.Element} A grid row showing date, arena, rewards in GEM and WETH, and captured card.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleEarningsRow = ({ isMobile, date, arenaName, capturedAsset, rewards, cards }) => {
    const GemRewards = rewards?.find(item => item.name === 'GEM');
    const WethRewads = rewards?.find(item => item.name === 'WETH');
    const ObtainedCard = cards.find(card => capturedAsset[card.asset]);

    return (
        <Grid templateColumns="repeat(5, 1fr)" gap={4} w="100%" mx="auto" mt={2} borderRadius="10px" color={'#FFF'}>
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
                    {date}
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
                    {arenaName}
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
                    {GemRewards ? (isNaN(GemRewards.price) ? 0 : GemRewards.price / NQTDIVIDER) : 0}
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
                    {WethRewads ? (isNaN(WethRewads.price) ? 0 : WethRewads.price / NQTDIVIDER) : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center">
                <Box>
                    <Tooltip
                        label={
                            <Box>
                                <Image src={ObtainedCard?.cardImgUrl} alt={ObtainedCard?.name} w="200px" />
                            </Box>
                        }
                        aria-label={ObtainedCard?.name}
                        placement="top"
                        hasArrow>
                        <Box
                            p={3}
                            fontFamily="Inter, System"
                            fontWeight="700"
                            h="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            maxH="45px"
                            fontSize={isMobile ? 'xs' : 'md'}>
                            <Text
                                border="2px solid #C1A34C"
                                borderRadius="20px"
                                w="150px"
                                p={3}
                                maxH={'45px'}
                                fontFamily={'Inter, System'}
                                color={'#C1A34C'}
                                fontWeight={700}
                                h="100%"
                                fontSize={isMobile ? 'xs' : 'md'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {ObtainedCard?.name}
                            </Text>
                        </Box>
                    </Tooltip>
                </Box>
            </GridItem>
        </Grid>
    );
};

export default BattleEarningsRow;
