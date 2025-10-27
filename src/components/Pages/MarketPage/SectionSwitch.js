import { Button, ButtonGroup } from '@chakra-ui/react';

/**
 * @name SectionSwitch
 * @description Component to switch between the sections of the market page
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const SectionSwitch = ({ option, setOption, color = '59,100,151' }) => {
    const ButtonSwitch = ({ isActive, onClick, text }) => {
        return (
            <Button
                isActive={isActive}
                color="white"
                _active={{ bgColor: `rgba(${color}, 1)`, color: 'white' }}
                bgColor={`rgba(${color},0.5)`}
                _hover={{ bgColor: `rgba(${color},0.7)` }}
                w="33.333%"
                size="lg"
                fontWeight="medium"
                fontSize="md"
                onClick={onClick}>
                {text}
            </Button>
        );
    };

    return (
        <ButtonGroup w="100%" my={6} shadow="md" isAttached>
            <ButtonSwitch isActive={option === 0} onClick={() => setOption(0)} text={'Market'} />
            <ButtonSwitch isActive={option === 1} onClick={() => setOption(1)} text={'Orders'} />
            <ButtonSwitch isActive={option === 2} onClick={() => setOption(2)} text={'Trades'} />
        </ButtonGroup>
    );
};

export default SectionSwitch;
