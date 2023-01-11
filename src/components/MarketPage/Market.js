import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import GridCards from '../Cards/GridCards';
import SortAndFilterMenu from '../SortAndFilters/SortAndFilterMenu';

const Market = ({ infoAccount, cards }) => {

    // Option
    // 0 -> Market
    // 1 -> Trades and orders
    const [option, setOption] = useState(0);

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box>
            <Box>
                <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered} />
            </Box>
            <Box w="100%">
                <Button isActive={option===0} w="50%" size="lg" rounded="node" fontWeight="medium" fontSize="md" onClick={() => setOption(0)} >
                    Market
                </Button>

                <Button isActive={option===1} w="50%" size="lg" rounded="node" fontWeight="medium" fontSize="md" onClick={() => setOption(1)}>
                    Trades and orders
                </Button>
            </Box>
            <Box>
                <GridCards cards={cardsFiltered} isMarket={true} />
            </Box>
        </Box>
    );
};

export default Market;
