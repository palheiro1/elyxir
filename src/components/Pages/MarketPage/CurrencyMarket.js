import { Box, Center, Stack, Text } from '@chakra-ui/react';
// import GemWidget from './GemWidget';
import CurrencyWidget from './CurrencyWidget';

const CurrencyMarket = ({ username, gemCards, giftzCards, wethCards, IGNISBalance, market, manaCards }) => {
    return (
        <Stack spacing={4} mb={6}>
            <Box>
                <CurrencyWidget
                    username={username}
                    currencyCards={wethCards}
                    IGNISBalance={IGNISBalance}
                    currencyName={'wETH'}
                    decimals={6}
                />
                <Center>
                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        mt={2}
                        border="1px solid #3b6497"
                        rounded="lg"
                        w={{ base: '100%', xl: '75%' }}>
                        wETH is the most widely used cryptocurrency on web3 and is used to buy random packs of Mythical
                        Beings cards from the vending machine.
                    </Text>
                </Center>
            </Box>
            <Box>
                <CurrencyWidget
                    username={username}
                    currencyCards={gemCards}
                    IGNISBalance={IGNISBalance}
                    currencyName={'GEM'}
                />
                <Center>
                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        mt={2}
                        w={{ base: '100%', xl: '75%' }}
                        border="1px solid #3b6497"
                        rounded="lg">
                        GEM is the in-game currency for Mythical Beings. You will need it to perfirm operations such as
                        crafting and morphing, as well as to participate in Battleground, the game in development.
                    </Text>
                </Center>
            </Box>
            <Box>
                <CurrencyWidget
                    username={username}
                    currencyCards={giftzCards}
                    IGNISBalance={IGNISBalance}
                    currencyName={'GIFTZ'}
                    decimals={0}
                />
                <Center>
                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        mt={2}
                        w={{ base: '100%', xl: '75%' }}
                        border="1px solid #3b6497"
                        rounded="lg">
                        GIFTZ are a sealed pack of cards. The are sold from a vending machine that is refilled every
                        day.
                        <br /> They can also be bought and sold on the secondary market, both on Ardor and Polygon. When
                        you open a GIFTZ, you lose it in exchange for three random cards.
                    </Text>
                </Center>
            </Box>
            <Box>
                <CurrencyWidget
                    username={username}
                    currencyCards={manaCards}
                    IGNISBalance={IGNISBalance}
                    currencyName={'MANA'}
                    decimals={0}
                />
                <Center>
                    <Text
                        fontSize={'sm'}
                        textAlign={'center'}
                        mt={2}
                        w={{ base: '100%', xl: '75%' }}
                        border="1px solid #3b6497"
                        rounded="lg">
                        MANA is the governance token of the Mythic DAO, the user organisation for this set.
                        <br /> You can trade MANA in Ardor, but to use it in the DAO, you must bridge it and store it in
                        Polygon.
                    </Text>
                </Center>
            </Box>
        </Stack>
    );
};

export default CurrencyMarket;
