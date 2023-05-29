import { Box, Heading } from '@chakra-ui/react';

import { useState } from 'react';
import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import GemWidget from './GemWidget';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';
import PairSelector from './PairSelector';

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
    // 1 -> Trades
    // 2 -> Orders
    const [option, setOption] = useState(0);

    // Market type
    const [marketCurrency, setMarketCurrency] = useState('IGNIS');

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    const syleOption2 = {
        base: '100%',
        md: '80%',
        lg: '70vw',
        xl: '75vw',
        '2xl': '100%',
    };

    return (
        <Box maxW={option === 2 ? syleOption2 : '100%'}>
            <GemWidget
                username={infoAccount.name}
                gemCards={gemCards}
                IGNISBalance={infoAccount.IGNISBalance}
                market={marketCurrency}
            />

            <PairSelector marketCurrency={marketCurrency} setMarketCurrency={setMarketCurrency} />
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <Box>
                    <SortAndFilterCards cards={cards} setCardsFiltered={setCardsFiltered} />

                    <GridCards
                        cards={cardsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        market={marketCurrency}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4}>
                        Orders
                    </Heading>

                    <AskAndBidGrid
                        username={infoAccount.name}
                        cards={cards}
                        askOrders={infoAccount.currentAsks}
                        bidOrders={infoAccount.currentBids}
                        canDelete={false}
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
        </Box>
    );
};

export default Market;
