import { Box, Center, Select, Text, useColorModeValue } from '@chakra-ui/react';

const PairSelector = ({ marketCurrency, setMarketCurrency }) => {

    const selectColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

    return (
        <Center>
            <Box minW="44%" my={2}>
                <Text textAlign="center" fontSize="md" mb={2}>
                    Select pair to trade
                </Text>
                <Select
                    value={marketCurrency}
                    textAlign="center"
                    onChange={e => setMarketCurrency(e.target.value)}
                    fontWeight="bold"
                    textTransform="full-width"
                    bgColor={selectColor}>
                    <option value={'IGNIS'}>IGNIS</option>
                    <option value={'WETH'}>wETH</option>
                </Select>
            </Box>
        </Center>
    );
};

export default PairSelector;
