import { Box } from '@chakra-ui/react';

import { useState } from 'react';

import PairSelector from './PairSelector/PairSelector';
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
const Market = ({ infoAccount, cards, gemCards, giftzCards, wethCards, manaCards }) => {
    // Market type
    const [marketCurrency, setMarketCurrency] = useState('CARDS');

    const textColor = '#3b6497';

    return (
        <Box maxW={{ base: '100%', lg: '70vw', xl: '77.5vw', '2xl': "100%" }}>
            <PairSelector marketCurrency={marketCurrency} setMarketCurrency={setMarketCurrency} textColor={textColor} />

            {marketCurrency === 'CARDS' && (
                <CardMarket cards={cards} infoAccount={infoAccount} marketCurrency={marketCurrency} textColor={textColor} />
            )}

            {marketCurrency === 'CURRENCIES' && (
                <CurrencyMarket
                    username={infoAccount.name}
                    gemCards={gemCards}
                    giftzCards={giftzCards}
                    wethCards={wethCards}
                    manaCards={manaCards}
                    IGNISBalance={infoAccount.IGNISBalance}
                    infoAccount={infoAccount}
                    cards={cards}
                    textColor={textColor}
                />
            )}
        </Box>
    );
};

export default Market;
