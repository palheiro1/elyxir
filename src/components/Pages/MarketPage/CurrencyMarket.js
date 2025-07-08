import { Box, Heading, Stack } from '@chakra-ui/react';
import CurrencyWidget from './CurrencyWidget';
import { useState } from 'react';
import SectionSwitch from './SectionSwitch';
import AskAndBidGrid from './TradesAndOrders/AskAndBids/AskAndBidGrid';
import TradesAndOrderTable from './TradesAndOrders/TradesAndOrderTable';
import { CURRENCY_ASSETS } from '../../../data/CONSTANTS';

const CurrencyMarket = ({ username, gemCards, giftzCards, wethCards, IGNISBalance, market, manaCards, infoAccount, cards, textColor }) => {
    // Option
    // 0 -> Market
    // 1 -> Trades
    // 2 -> Orders
    const [option, setOption] = useState(0);

    const accountAsk = infoAccount.currentAsks || [];
    const accountBid = infoAccount.currentBids || [];
    const trades = infoAccount.trades || [];
    const askWithoutCurrencies = accountAsk.filter((ask) => Object.keys(CURRENCY_ASSETS).includes(ask.asset));
    const bidWithoutCurrencies = accountBid.filter((bid) => Object.keys(CURRENCY_ASSETS).includes(bid.asset));
    const tradesWithoutCurrencies = trades.filter((trade) => Object.keys(CURRENCY_ASSETS).includes(trade.asset));
    // const myAskWethCards = wethCards.askOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // const myBidWethCards = wethCards.bidOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // wethCards.askOrders = myAskWethCards;
    // wethCards.bidOrders = myBidWethCards;

    // const myAskGiftzCards = giftzCards.askOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // const myBidGiftzCards = giftzCards.bidOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // giftzCards.askOrders = myAskGiftzCards;
    // giftzCards.bidOrders = myBidGiftzCards;

    // const myAskGemCards = gemCards.askOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // const myBidGemCards = gemCards.bidOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // gemCards.askOrders = myAskGemCards;
    // gemCards.bidOrders = myBidGemCards;

    // const myAskManaCards = manaCards.askOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // const myBidManaCards = manaCards.bidOrders.filter((order) => order.accountRS === infoAccount.accountRs);
    // manaCards.askOrders = myAskManaCards;
    // manaCards.bidOrders = myBidManaCards;

    const textGiftz = (
        <Box>
            GIFTZ are a sealed pack of cards. The are sold from a vending machine that is refilled every day.
            <br /> They can also be bought and sold on the secondary market, both on Ardor and Polygon.
            <br /> When you open a GIFTZ, you lose it in exchange for three random cards.
        </Box>
    );

    const textGem = (
        <Box>
            GEM is the in-game currency for Mythical Beings. <br />
            You will need it to perform operations such as crafting and morphing, as well as to participate in
            Battleground, the game in development.
        </Box>
    );

    const textMana = (
        <Box>
            MANA is the governance token of the Mythic DAO, the user organisation for this set.
            <br />
            You can trade MANA in Ardor, but to use it in the DAO, you must bridge it and store it in Polygon.
        </Box>
    );

    return (
        <Stack spacing={4} mb={6}>
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <>
                    <CurrencyWidget
                        username={username}
                        currencyCards={wethCards}
                        IGNISBalance={IGNISBalance}
                        currencyName={'wETH'}
                        decimals={6}
                        message={`wETH is the most widely used cryptocurrency on web3 and is used to buy random packs of Mythical
                    Beings cards from the vending machine.`}
                    />
                    <CurrencyWidget
                        username={username}
                        currencyCards={gemCards}
                        IGNISBalance={IGNISBalance}
                        currencyName={'GEM'}
                        message={textGem}
                    />
                    <CurrencyWidget
                        username={username}
                        currencyCards={giftzCards}
                        IGNISBalance={IGNISBalance}
                        currencyName={'GIFTZ'}
                        decimals={0}
                        message={textGiftz}
                    />
                    <CurrencyWidget
                        username={username}
                        currencyCards={manaCards}
                        IGNISBalance={IGNISBalance}
                        currencyName={'MANA'}
                        decimals={0}
                        message={textMana}
                    />
                </>
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
                    <Heading textAlign="center" mt={4} color={textColor}>
                        Trades
                    </Heading>

                    <TradesAndOrderTable
                        account={infoAccount.accountRs}
                        cards={cards}
                        trades={tradesWithoutCurrencies}
                    />
                </Box>
            )}
        </Stack>
    );
};

export default CurrencyMarket;
