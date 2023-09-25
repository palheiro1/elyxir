import { Button, ButtonGroup } from '@chakra-ui/react';

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
    const bgColor = 'rgba(57,59,151,0.5)';
    const fillColor = 'rgba(57,59,151,0.25)';
    const borderColor = 'rgba(57,59,151,1)';

    const ButtonSwitch = ({ isActive, onClick, text }) => {
        return (
            <Button
                isActive={isActive}
                w="100%"
                bgColor={fillColor}
                _active={{ bgColor: bgColor }}
                _disabled={{ bgColor: fillColor }}
                _hover={{ bgColor: fillColor }}
                onClick={onClick}>
                {text}
            </Button>
        );
    };

    return (
        <ButtonGroup size="lg" minW="100%" isAttached mb={4} border="2px" borderColor={borderColor} rounded={'lg'}>
            <ButtonSwitch isActive={option === 0} onClick={() => setOption(0)} text="Swap to ARDOR" />
            <ButtonSwitch isActive={option === 1} onClick={() => setOption(1)} text="Swap to Polygon" />
        </ButtonGroup>
    );
};

export default SectionSwitch;
