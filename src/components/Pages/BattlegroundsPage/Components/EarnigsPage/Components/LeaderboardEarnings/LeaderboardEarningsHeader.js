import { Grid } from '@chakra-ui/react';
import RewardColumn from '../RewardColumn';
import ColumnLabel from '../../../ColumnLabel';

/**
 * @name LeaderboardEarningsHeader
 * @description Displays the header row for the leaderboard earnings table with columns:
 * Date, Phanteon, GEM, WETH, MANA, GIFTZ, and Special Cards.
 * Includes icons next to the currency labels and adapts font sizes for mobile view.
 * The header is sticky to remain visible on scroll.
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobile - Flag indicating if the display is on a mobile device, affects font sizes.
 * @returns {JSX.Element} The rendered header grid component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const LeaderboardEarningsHeader = ({ isMobile }) => {
    return (
        <Grid
            templateColumns="repeat(7, 1fr)"
            gap={4}
            w={'90%'}
            mx={'auto'}
            mt={3}
            p={1}
            borderRadius={'10px'}
            border={'2px solid #BBC4D3'}
            color={'#FFF'}
            bgColor={'inherit'}
            position="sticky"
            top="0"
            zIndex={1}>
            <ColumnLabel label="DATE" isMobile={isMobile} />
            <ColumnLabel label="PHANTEON" isMobile={isMobile} />
            <RewardColumn label="GEM" imageSrc="/images/currency/gem.png" isMobile={isMobile} />
            <RewardColumn label="WETH" imageSrc="/images/currency/weth.png" isMobile={isMobile} />
            <RewardColumn label="MANA" imageSrc="/images/currency/mana.png" isMobile={isMobile} />
            <RewardColumn label="GIFTZ" imageSrc="/images/currency/giftz.png" isMobile={isMobile} />
            <ColumnLabel label="SPECIAL CARDS" isMobile={isMobile} />
        </Grid>
    );
};

export default LeaderboardEarningsHeader;
