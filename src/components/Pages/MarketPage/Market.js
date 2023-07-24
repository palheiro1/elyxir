import { Box } from '@chakra-ui/react';

import { useState } from 'react';

import PairSelector from './PairSelector';
import CardMarket from './CardMarket';
import CurrencyMarket from './CurrencyMarket';

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
const Market = ({ infoAccount, cards, gemCards, giftzCards, wethCards }) => {
    // Market type
    const [marketCurrency, setMarketCurrency] = useState('CARDS');

    // const syleOption2 = {
    //     base: '100%',
    //     md: '80%',
    //     lg: '70vw',
    //     xl: '75vw',
    //     '2xl': '100%',
    // };

    // <Box maxW={option === 2 ? syleOption2 : '100%'}>
    return (
        <Box>
            <PairSelector marketCurrency={marketCurrency} setMarketCurrency={setMarketCurrency} />

            {marketCurrency === 'CARDS' && (
                <CardMarket cards={cards} infoAccount={infoAccount} marketCurrency={marketCurrency} />
            )}

            {marketCurrency === 'CURRENCIES' && (
                <CurrencyMarket
                    username={infoAccount.name}
                    gemCards={gemCards}
                    giftzCards={giftzCards}
                    wethCards={wethCards}
                    IGNISBalance={infoAccount.IGNISBalance}
                />
            )}
        </Box>
    );
};

export default Market;
