import { Box, Button } from '@chakra-ui/react';

const StartBattleButton = ({ handleStartButtonClick, isMobile }) => {
    return (
        <Box
            m="auto"
            borderRadius="30px"
            p="3px"
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
