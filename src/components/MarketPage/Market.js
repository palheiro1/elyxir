import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import GridCards from '../Cards/GridCards';
import SortAndFilterMenu from '../SortAndFilters/SortAndFilterMenu';

const Market = ({ infoAccount, cards }) => {

    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box>
            <Box>
                <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered} />
            </Box>
            <Box w="100%">
                <Button isActive w="50%" size="lg" rounded="node" fontWeight="medium" fontSize="md" >
                    Market
                </Button>

                <Button w="50%" size="lg" rounded="node" fontWeight="medium" fontSize="md" >
                    Trades and orders
                </Button>
            </Box>
            <Box>
                <GridCards cards={cards} />
            </Box>
        </Box>
    );
};

export default Market;
