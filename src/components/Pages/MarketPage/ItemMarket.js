import { Box, Heading } from '@chakra-ui/react';

import { useState } from 'react';

import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import SectionSwitch from './SectionSwitch';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import { ITEMS_ASSETS } from '../../../data/CONSTANTS';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';

const ItemMarket = ({ items, infoAccount, textColor }) => {
    // Option
    // 0 -> Market
    // 1 -> Orders
    // 2 -> Trades
    const [option, setOption] = useState(0);
    // Filtered items
    const [itemsFiltered, setItemsFiltered] = useState(items);

    const accountAsk = infoAccount.currentAsks || [];
    const accountBid = infoAccount.currentBids || [];
    const trades = infoAccount.trades || [];
    const askWithoutCurrencies = accountAsk.filter(ask => ITEMS_ASSETS.includes(ask.asset));
    const bidWithoutCurrencies = accountBid.filter(bid => ITEMS_ASSETS.includes(bid.asset));
    const tradesWithoutCurrencies = trades.filter(trade => ITEMS_ASSETS.includes(trade.asset));

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <Box>
                    <SortAndFilterItems items={items} setItemsFiltered={setItemsFiltered} rgbColor={'59,100,151'} />

                    <GridItems
                        items={itemsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        rgbColor={'59,100,151'}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Orders
                    </Heading>
                    <AskAndBidGrid
                        username={infoAccount.name}
                        cards={items}
                        askOrders={askWithoutCurrencies}
                        bidOrders={bidWithoutCurrencies}
                        canDelete={true}
                        textColor={textColor}
                        isItems
                    />
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Trades
                    </Heading>
                    <TradesAndOrderTable
                        account={infoAccount.accountRs}
                        cards={items}
                        trades={tradesWithoutCurrencies}
                        isItems
                    />
                </Box>
            )}
        </>
    );
};

export default ItemMarket;
