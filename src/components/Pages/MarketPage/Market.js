import {
    Box,
    Button
} from '@chakra-ui/react';

import { useState } from 'react';
import GridCards from '../Cards/GridCards';
import SortAndFilterMenu from '../SortAndFilters/SortAndFilterMenu';
import AskAndBidGrid from './AskAndBidGrid';
import TradesAndOrderTable from './TradesAndOrderTable';

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
                <Button
                    isActive={option === 0}
                    w="50%"
                    size="lg"
                    rounded="node"
                    fontWeight="medium"
                    fontSize="md"
                    onClick={() => setOption(0)}
                    borderLeftRadius="lg">
                    Market
                </Button>

                <Button
                    isActive={option === 1}
                    w="50%"
                    size="lg"
                    rounded="node"
                    fontWeight="medium"
                    fontSize="md"
                    onClick={() => setOption(1)}
                    borderRightRadius="lg">
                    Trades and orders
                </Button>
            </Box>

            {option === 0 && (
                <GridCards cards={cardsFiltered} isMarket={true} />
            )}

            {option === 1 && (
                <Box>
                    <TradesAndOrderTable />
                    <AskAndBidGrid />
                </Box>
            )}
        </Box>
    );
};

export default Market;
