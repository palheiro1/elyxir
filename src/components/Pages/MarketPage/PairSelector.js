import { Box, Button, Center, SimpleGrid, Text } from '@chakra-ui/react';

const PairSelector = ({ setMarketCurrency }) => {
    return (
        <Center>
            <Box minW="44%" my={2}>
                <SimpleGrid columns={2} spacing={2} mt={2}>
                    <Button size="sm" variant="outline" onClick={() => setMarketCurrency('CARDS')}>
                        CARDS
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setMarketCurrency('CURRENCIES')}>
                        CURRENCIES
                    </Button>
                </SimpleGrid>
                <Text fontSize="xs" color="white" textAlign="center" mt={2}>
                    Want to trade your cards or currencies for wETH, Matic or DAI?
                    <br /> Use the bridge to send them to Polygon and use the OpenSea marketplace.
                </Text>
            </Box>
        </Center>
    );
};

export default PairSelector;
