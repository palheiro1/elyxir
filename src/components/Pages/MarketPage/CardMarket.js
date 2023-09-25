import { Box, Heading } from '@chakra-ui/react';

import { useState } from 'react';

import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';

const CardMarket = ({ cards, infoAccount, textColor }) => {
    // Option
    // 0 -> Market
    // 1 -> Trades
    // 2 -> Orders
    const [option, setOption] = useState(0);
    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <Box>
                    <SortAndFilterCards cards={cards} setCardsFiltered={setCardsFiltered} rgbColor={"59,100,151"} />

                    <GridCards
                        cards={cardsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color={textColor}>
                        Orders
                    </Heading>

                    <AskAndBidGrid
                        username={infoAccount.name}
                        cards={cards}
                        askOrders={infoAccount.currentAsks}
                        bidOrders={infoAccount.currentBids}
                        canDelete={true}
                        textColor={textColor}
                    />
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4}>
                        Trades
                    </Heading>

                    <TradesAndOrderTable account={infoAccount.accountRs} cards={cards} trades={infoAccount.trades} />
                </Box>
            )}
        </>
    );
};

export default CardMarket;
