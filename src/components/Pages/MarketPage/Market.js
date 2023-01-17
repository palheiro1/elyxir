import { Box } from '@chakra-ui/react';

import { useState } from 'react';
import GridCards from '../../Cards/GridCards';
import SortAndFilterMenu from '../../SortAndFilters/SortAndFilterMenu';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import GemWidget from './GemWidget';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';

const Market = ({ infoAccount, cards, gemCards }) => {
    console.log('🚀 ~ file: Market.js:12 ~ Market ~ infoAccount', infoAccount);
    // Option
    // 0 -> Market
    // 1 -> Trades and orders
    const [option, setOption] = useState(0);

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box>
            <GemWidget username={infoAccount.name} gemCards={gemCards} />

            <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered} />
            <SectionSwitch option={option} setOption={setOption} />
            {option === 0 && (
                <GridCards
                    cards={cardsFiltered}
                    isMarket={true}
                    username={infoAccount.name}
                    ignis={infoAccount.IGNISBalance}
                />
            )}

            {option === 1 && (
                <Box>
                    <TradesAndOrderTable
                        account={infoAccount.accountRs}
                        cards={cards}
                        trades={infoAccount.trades}
                    />
                    <AskAndBidGrid
                        username={infoAccount.name}
                        cards={cards}
                        askOrders={infoAccount.currentAsks}
                        bidOrders={infoAccount.currentBids}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Market;
