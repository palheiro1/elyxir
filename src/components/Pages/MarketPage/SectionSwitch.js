import { Box, Button } from '@chakra-ui/react';

const SectionSwitch = ({ option, setOption }) => {
    return (
        <Box w="100%">
            <Button
                isActive={option === 0}
                w="50%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(0)}
                borderLeftRadius="lg">
                Market
            </Button>

            <Button
                isActive={option === 1}
                w="50%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(1)}
                borderRightRadius="lg">
                Trades and orders
            </Button>
        </Box>
    );
};

export default SectionSwitch;
