import { Stack } from '@chakra-ui/react';
// import GemWidget from './GemWidget';
import CurrencyWidget from './CurrencyWidget';

const CurrencyMarket = ({ username, gemCards, giftzCards, wethCards, IGNISBalance, market }) => {
    return (
        <Stack spacing={8}>
            <CurrencyWidget
                username={username}
                currencyCards={wethCards}
                IGNISBalance={IGNISBalance}
                currencyName={'wETH'}
                decimals={6}
            />
            <CurrencyWidget
                username={username}
                currencyCards={gemCards}
                IGNISBalance={IGNISBalance}
                currencyName={'GEM'}
            />
            <CurrencyWidget
                username={username}
                currencyCards={giftzCards}
                IGNISBalance={IGNISBalance}
                currencyName={'GIFTZ'}
                decimals={0}
            />
        </Stack>
    );
};

export default CurrencyMarket;
