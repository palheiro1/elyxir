import { Box, Heading } from '@chakra-ui/react';

import { useState } from 'react';

import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';
import { CURRENCY_ASSETS } from '../../../data/CONSTANTS';

const CardMarket = ({ cards, infoAccount, textColor }) => {
    // Filter only cards, no currencies
    const accountAsk = infoAccount.currentAsks || [];
    const accountBid = infoAccount.currentBids || [];
    const trades = infoAccount.trades || [];
    const askWithoutCurrencies = accountAsk.filter((ask) => !Object.keys(CURRENCY_ASSETS).includes(ask.asset));
    const bidWithoutCurrencies = accountBid.filter((bid) => !Object.keys(CURRENCY_ASSETS).includes(bid.asset));
    const tradesWithoutCurrencies = trades.filter((trade) => !Object.keys(CURRENCY_ASSETS).includes(trade.asset));
    
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
                        askOrders={askWithoutCurrencies}
                        bidOrders={bidWithoutCurrencies}
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

                    <TradesAndOrderTable account={infoAccount.accountRs} cards={cards} trades={tradesWithoutCurrencies} />
                </Box>
            )}
        </>
    );
};

export default CardMarket;
