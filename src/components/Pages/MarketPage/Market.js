import { Box } from '@chakra-ui/react';

import { useState } from 'react';
import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import GemWidget from './GemWidget';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';

/**
 * @name Market
 * @description Market page
 * @param {Object} infoAccount - Info of the account
 * @param {Array} cards - Array with the cards data
 * @param {Object} gemCards - Object with the gem cards data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Market = ({ infoAccount, cards, gemCards }) => {
    // Option
    // 0 -> Market
    // 1 -> Trades and orders
    const [option, setOption] = useState(0);

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box>
            <GemWidget username={infoAccount.name} gemCards={gemCards} />

            <SectionSwitch option={option} setOption={setOption} />
            {option === 0 && (
                <>
                    <SortAndFilterCards cards={cards} setCardsFiltered={setCardsFiltered} />
                    <GridCards
                        cards={cardsFiltered}
                        isMarket={true}
                        username={infoAccount.name}
                        ignis={infoAccount.IGNISBalance}
                    />
                </>
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
