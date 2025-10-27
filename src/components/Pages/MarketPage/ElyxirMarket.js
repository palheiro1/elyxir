import { Box, Heading, Stack, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GridItems from '../../Items/GridItems';
import SectionSwitch from './SectionSwitch';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import { ELYXIR_ASSETS } from '../../../data/CONSTANTS';

/**
 * @name ElyxirMarket
 * @description Market page for Elyxir ingredients
 * @param {Array} items - Array of elyxir ingredient items (with name, image, quantityQNT, etc)
 * @param {Object} infoAccount - Account info
 * @returns {JSX.Element}
 */
const ElyxirMarket = ({ items, infoAccount }) => {
    const [option, setOption] = useState(0);
    const [itemsFiltered, setItemsFiltered] = useState(items);
    const [section, setSection] = useState('all');
    useEffect(() => {
        let newItems = items;
        if (section !== 'all') {
            newItems = items.filter(item => item.type === section);
        }
        setItemsFiltered(newItems);
    }, [items, section]);

    const accountAsk = infoAccount.currentAsks || [];
    const accountBid = infoAccount.currentBids || [];
    const trades = infoAccount.trades || [];
    const askWithoutCurrencies = accountAsk.filter(ask => ELYXIR_ASSETS.includes(ask.asset));
    const bidWithoutCurrencies = accountBid.filter(bid => ELYXIR_ASSETS.includes(bid.asset));
    const tradesWithoutCurrencies = trades.filter(trade => ELYXIR_ASSETS.includes(trade.asset));

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} color={'47,129,144'} />
            {option === 0 && (
                <Box>
                    <Stack direction="row" spacing={2} mb={4}>
                        {['all', 'ingredient', 'tool', 'flask', 'recipe', 'potion'].map(type => (
                            <Button
                                key={type}
                                isActive={section === type}
                                color="white"
                                _active={{ bgColor: 'rgba(47,129,144,1)', color: 'white' }}
                                bgColor={section === type ? 'rgba(47,129,144,1)' : 'rgba(47,129,144,0.5)'}
                                _hover={{ bgColor: 'rgba(47,129,144,0.7)' }}
                                size="sm"
                                fontWeight="medium"
                                fontSize="sm"
                                onClick={() => setSection(type)}>
                                {type.charAt(0).toUpperCase() + type.slice(1) + (type === 'all' ? '' : 's')}
                            </Button>
                        ))}
                    </Stack>
                    {/* <SortAndFilterItems
                        items={itemsFiltered}
                        setItemsFiltered={setItemsFiltered}
                        rgbColor={'47,129,144'}
                    /> */}
                    <GridItems
                        items={itemsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        rgbColor={'47,129,144'}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(47,129,144)">
                        Item Orders
                    </Heading>
                    <AskAndBidGrid
                        username={infoAccount.name}
                        cards={items}
                        askOrders={askWithoutCurrencies}
                        bidOrders={bidWithoutCurrencies}
                        canDelete={true}
                        isItems
                    />
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(47,129,144)">
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

export default ElyxirMarket;
