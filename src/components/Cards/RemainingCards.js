import { Box, Text } from '@chakra-ui/react';
import GridCards from './GridCards';

const RemainingCards = ({ totalCards, remainingCards, cards }) => {

    const have = totalCards - remainingCards;

    return (
        <Box mt={4}>
            <Box>
                <Text fontSize="xl">You have {have} out of {totalCards} cards.</Text>
                <Text fontSize="xs">
                    Complete the collection to claim the jackpot. {remainingCards.length} cards missing.
                </Text>
            </Box>
            <GridCards cards={cards} onlyBuy={true} />
        </Box>
    );
};

export default RemainingCards;
