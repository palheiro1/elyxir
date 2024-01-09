import { Box, Text } from '@chakra-ui/react';
import GridCards from './GridCards';


/**
 * @name RemainingCards
 * @description Component to show the remaining cards to complete the collection
 * @param {number} totalCards - Total cards
 * @param {number} remainingCards - Remaining cards
 * @param {array} cards - Cards to show
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const RemainingCards = ({ totalCards, remainingCards, cards, infoAccount }) => {
    const have = totalCards - remainingCards.length;

    return (
        <Box mt={4}>
            <Box>
                <Text fontSize="xl">
                    You have {have} out of {totalCards} cards.
                </Text>
                <Text fontSize="xs">Complete the collection to claim the jackpot. {remainingCards.length } cards missing.</Text>
            </Box>
            <GridCards cards={cards} onlyBuy={true} rgbColor={"59, 83, 151"} infoAccount={infoAccount} />
        </Box>
    )
};

export default RemainingCards;
