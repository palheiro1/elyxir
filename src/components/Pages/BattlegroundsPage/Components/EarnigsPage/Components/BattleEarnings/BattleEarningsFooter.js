import { Grid, GridItem, Text } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../../../data/CONSTANTS';

/**
 * @name BattleEarningsFooter
 * @description Displays the summary footer for the battle earnings section, showing the
 * total rewards accumulated in GEM and WETH tokens for the current season,
 * as well as the total count of battles won.
 * It formats the token rewards by dividing them by a constant divider and
 * adapts font sizes based on the `isMobile` prop for responsive design.
 * @param {Object} props - Component props.
 * @param {Object} props.totalRewards - Object containing total rewards { gem, weth }.
 * @param {boolean} props.isMobile - Flag to adjust styling for mobile view.
 * @param {Array} props.wonBattles - Array of won battle entries.
 * @returns {JSX.Element} Rendered footer grid displaying total season rewards.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleEarningsFooter = ({ totalRewards, isMobile, wonBattles }) => {
    return (
        <Grid
            templateColumns="repeat(5, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={3}
            p={2}
            borderRadius={'10px'}
            border={'2px solid #C1A34C'}
            color={'#FFF'}
            bgColor={' #C1A34C'}
            position="sticky"
            top="0"
            zIndex={1}>
            <GridItem colSpan={2} my={'auto'} ml={5}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    SEASON TOTAL
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {totalRewards.gem > 0 ? totalRewards.gem / NQTDIVIDER : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {totalRewards.weth > 0 ? totalRewards.weth / NQTDIVIDER : 0}
                </Text>
            </GridItem>
            <GridItem colSpan={1} textAlign="center" my={'auto'}>
                <Text fontFamily={'Inter, System'} fontWeight={700} fontSize={isMobile ? 'sm' : 'md'}>
                    {wonBattles && wonBattles.length}
                </Text>
            </GridItem>
        </Grid>
    );
};

export default BattleEarningsFooter;
