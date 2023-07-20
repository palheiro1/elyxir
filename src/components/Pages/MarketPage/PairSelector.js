import { Box, Button, Center, SimpleGrid } from '@chakra-ui/react';

const PairSelector = ({ setMarketCurrency }) => {
    return (
        <Center>
            <Box minW="44%" my={2}>
                <SimpleGrid columns={2} spacing={2} mt={2}>
                    <Button size="sm" variant="outline"onClick={() => setMarketCurrency('CARDS')}>
                        CARDS
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMarketCurrency('CURRENCIES')}>
                        CURRENCIES
                    </Button>
                </SimpleGrid>
            </Box>
        </Center>
    );
};

export default PairSelector;
