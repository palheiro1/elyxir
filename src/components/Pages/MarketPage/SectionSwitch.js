import { Box, Button } from '@chakra-ui/react';

/**
 * @name SectionSwitch
 * @description Component to switch between the sections of the market page
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const SectionSwitch = ({ option, setOption }) => {
    return (
        <Box w="100%" my={6} shadow="md" rounded="lg">
            <Button
                isActive={option === 0}
                _active={{ bgColor: '#3b6497' }}
                bgColor={'rgba(59,100,151,0.5)'}
                _hover={{ bgColor: 'rgba(59,100,151,0.7)' }}
                w="33.333%"
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
                _active={{ bgColor: '#3b6497' }}
                bgColor={'rgba(59,100,151,0.5)'}
                _hover={{ bgColor: 'rgba(59,100,151,0.7)' }}
                w="33.333%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(1)}>
                Orders
            </Button>

            <Button
                isActive={option === 2}
                _active={{ bgColor: '#3b6497' }}
                bgColor={'rgba(59,100,151,0.5)'}
                _hover={{ bgColor: 'rgba(59,100,151,0.7)' }}
                w="33.333%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(2)}
                borderRightRadius="lg">
                Trades
            </Button>
        </Box>
    );
};

export default SectionSwitch;
