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
const SectionSwitch = ({ option, setOption }) => {
    const ButtonSwitch = ({ isActive, onClick, text }) => {
        return (
            <Button
                isActive={isActive}
                _active={{ bgColor: '#3b6497', color: 'white' }}
                bgColor={'rgba(59,100,151,0.5)'}
                _hover={{ bgColor: 'rgba(59,100,151,0.7)' }}
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
