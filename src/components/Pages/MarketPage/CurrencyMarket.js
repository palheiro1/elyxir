import { Box, Stack } from '@chakra-ui/react';
import CurrencyWidget from './CurrencyWidget';

const CurrencyMarket = ({ username, gemCards, giftzCards, wethCards, IGNISBalance, market, manaCards }) => {
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
            You will need it to perfirm operations such as crafting and morphing, as well as to participate in
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
        </Stack>
    );
};

export default CurrencyMarket;
