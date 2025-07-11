import { Box, Center, SimpleGrid } from '@chakra-ui/react';
import Warning from './Warning';
import PairButton from './PairButton';

const PairSelector = ({ marketCurrency, setMarketCurrency, textColor }) => {
    return (
        <Center>
            <Box minW="44%" mb={2}>
                <SimpleGrid columns={3} spacing={2}>
                    <PairButton
                        text="CARD"
                        value="CARDS"
                        marketCurrency={marketCurrency}
                        setMarketCurrency={setMarketCurrency}
                        textColor={textColor}
                    />
                    <PairButton
                        text="ITEMS"
                        value="ITEMS"
                        marketCurrency={marketCurrency}
                        setMarketCurrency={setMarketCurrency}
                        textColor={textColor}
                    />
                    <PairButton
                        text="CURRENCIES"
                        value="CURRENCIES"
                        marketCurrency={marketCurrency}
                        setMarketCurrency={setMarketCurrency}
                        textColor={textColor}
                    />
                </SimpleGrid>
                <Warning textColor={textColor} />
            </Box>
        </Center>
    );
};

export default PairSelector;
