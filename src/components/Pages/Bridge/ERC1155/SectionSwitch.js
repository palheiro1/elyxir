import { Button, SimpleGrid } from '@chakra-ui/react';

/**
 * @name SectionSwitch
 * @description Component to switch between the sections of the Bridge page
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const SectionSwitch = ({ option, setOption }) => {
    return (
        <SimpleGrid columns={2} w="100%" mb={6} shadow="md" rounded="lg">
            <Button
                isActive={option === 0}
                w="100%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(0)}
                borderLeftRadius="lg">
                Swap to Polygon
            </Button>

            <Button
                isActive={option === 1}
                w="100%"
                size="lg"
                rounded="node"
                fontWeight="medium"
                fontSize="md"
                onClick={() => setOption(1)}
                borderRightRadius="lg">
                Swap to ARDOR
            </Button>
        </SimpleGrid>
    );
};

export default SectionSwitch;
