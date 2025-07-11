import { Grid, GridItem } from '@chakra-ui/react';

/**
 * @name BattleListHeader
 * @description Renders the header row for the Battle List Table. Displays column titles such as date, opponent, land, position, result, and rewards/losses if cards are available.
 * @param {Array} cards - List of card objects. Determines whether to render the "REWARDS/ LOSSES" column.
 * @param {Boolean} isMobile - Flag to adapt font size for mobile screens.
 * @returns {JSX.Element} A grid layout with labeled headers for the battle list.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleListHeader = ({ cards, isMobile }) => {
    const headerItemProps = {
        fontWeight: '700',
        fontSize: isMobile ? 'xs' : 'md',
        textAlign: 'center',
        color: '#FFF',
        my: 'auto',
    };

    return (
        <Grid
            templateColumns="repeat(6, 1fr)"
            border="2px solid #DB78AA"
            borderRadius="20px"
            position="relative"
            bg="inherit"
            zIndex={1}>
            <GridItem {...headerItemProps}>DATE</GridItem>
            <GridItem {...headerItemProps}>OPPONENT</GridItem>
            <GridItem {...headerItemProps}>LAND</GridItem>
            <GridItem {...headerItemProps}>POSITION</GridItem>
            <GridItem {...headerItemProps}>RESULT</GridItem>
            {cards?.length > 0 && <GridItem {...headerItemProps}>REWARDS/ LOSSES</GridItem>}
        </Grid>
    );
};

export default BattleListHeader;
