import { Box, Button, Center, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

const PairSelector = ({ marketCurrency, setMarketCurrency }) => {
    const textColor = useColorModeValue('gray.700', 'gray.300');

    const SelectButton = ({ text, value }) => {
        return (
            <Button
                borderColor="#3b6497"
                size="sm"
                variant="outline"
                _active={{ bgColor: '#3b6497', color: 'white' }}
                isActive={marketCurrency === value}
                onClick={() => setMarketCurrency(value)}
                _hover={{ bgColor: 'rgba(59,100,151,0.59)' }}>
                {text}
            </Button>
        );
    };
    

    return (
        <Center>
            <Box minW="44%" mb={2}>
                <SimpleGrid columns={2} spacing={2}>
                    <SelectButton text="CARD" value="CARDS" />
                    <SelectButton text="CURRENCIES" value="CURRENCIES" />
                </SimpleGrid>
                <Text fontSize="xs" color={textColor} textAlign="center" mt={2}>
                    Want to trade your cards or currencies for wETH, MATIC or DAI?
                    <br /> Send them to Polygon via Bridge, and use the marketplaces{' '}
                    <a href="https://polygon.mythicalbeings.io" target="_blank" rel="noreferrer">
                        polygon.mythicalbeings.io
                    </a>
                    ,{' '}
                    <a href="https://opensea.io/collection/beings-mythical" target="_blank" rel="noreferrer">
                        Opensea
                    </a>{' '}
                    or{' '}
                    <a href="https://rarible.com/mythicalbeings/" target="_blank" rel="noreferrer">
                        Rarible
                    </a>
                    .
                </Text>
            </Box>
        </Center>
    );
};

export default PairSelector;
