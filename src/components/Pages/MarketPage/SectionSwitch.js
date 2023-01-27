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
        <Box w="100%" my={2}>
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
                Orders & Trades
            </Button>
        </Box>
    );
};

export default SectionSwitch;
