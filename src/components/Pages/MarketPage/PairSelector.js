import { Box, Button, Center, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

const PairSelector = ({ setMarketCurrency }) => {
    const textColor = useColorModeValue('gray.700', 'gray.300');

    return (
        <Center>
            <Box minW="44%" my={2}>
                <SimpleGrid columns={2} spacing={2} mt={2}>
                    <Button
                        borderColor="#3b6497"
                        size="sm"
                        variant="outline"
                        onClick={() => setMarketCurrency('CARDS')}
                        _hover={{ bgColor: 'rgba(59,100,151,0.59)' }}>
                        CARDS
                    </Button>
                    <Button
                        borderColor="#3b6497"
                        size="sm"
                        variant="outline"
                        onClick={() => setMarketCurrency('CURRENCIES')}
                        _hover={{ bgColor: 'rgba(59,100,151,0.59)' }}>
                        CURRENCIES
                    </Button>
                </SimpleGrid>
                <Text fontSize="xs" color={textColor} textAlign="center" mt={2}>
                    Want to trade your cards or currencies for wETH, Matic or DAI?
                    <br /> Use the bridge to send them to Polygon and use the OpenSea marketplace.
                </Text>
            </Box>
        </Center>
    );
};

export default PairSelector;
