import { Box, Text } from '@chakra-ui/react';
import GridCards from './GridCards';

const RemainingCards = ({ remainingCards }) => {
    return (
        <Box mt={4}>
            <Box>
                <Text fontSize="xl">You have 0 out of 29 cards.</Text>
                <Text fontSize="xs">
                    Complete the collection to claim the jackpot. 20 cards missing.
                </Text>
            </Box>
            <GridCards cards={remainingCards} onlyBuy={true} />
        </Box>
    );
};

export default RemainingCards;
