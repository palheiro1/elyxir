import { Box, Button } from '@chakra-ui/react';

/**
 * @name StartBattleButton
 * @description Renders a styled button to initiate the battle start process.
 * The button has a gradient border and text styling consistent with the app's design.
 * It adapts font size and padding based on whether the view is mobile or desktop.
 * @param {Function} handleStartButtonClick - Callback function triggered when the button is clicked.
 * @param {boolean} isMobile - Flag indicating if the device is mobile, used to adjust styling.
 * @returns {JSX.Element} A Chakra UI Button wrapped in a styled Box container.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const StartBattleButton = ({ handleStartButtonClick, isMobile }) => {
    return (
        <Box
            m="auto"
            borderRadius="30px"
            p="3px"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.2s"
            background="linear-gradient(49deg, rgba(235,178,185,1) 0%, rgba(32,36,36,1) 100%)"
            display="inline-block">
            <Button
                sx={{
                    background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                    borderRadius: '30px',
                    color: '#FFF',
                    textTransform: 'uppercase',
                    fontWeight: '400',
                    letterSpacing: '1px',
                    fontSize: isMobile ? 'md' : 'lg',
                    fontFamily: "'Chelsea Market', system-ui",
                    padding: isMobile ? '5' : '6',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
                onClick={handleStartButtonClick}>
                Start a Battle
            </Button>
        </Box>
    );
};

export default StartBattleButton;
