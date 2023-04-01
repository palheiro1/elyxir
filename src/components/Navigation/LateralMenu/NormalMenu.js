import { Box, Stack, Switch, Text } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';

const NormalMenu = ({ option, setOption, handleLogout, showAllCards, handleShowAllCards, nextBlock, children }) => {
    const blockTime = nextBlock === 0 ? 'SOON' : nextBlock;
    return (
        <Stack direction="row">
            <Box>
                <VerticalMenuButtons
                    setOption={setOption}
                    option={option}
                    handleLogout={handleLogout}
                    widthBotones="140px"
                />

                <Text fontWeight="bold" textAlign="center" fontSize="2xs" mt={2}>
                    Block in... {blockTime}
                </Text>

                <Stack p={2} align="center">
                    <Text fontWeight="bold" textAlign="center" fontSize="sm">
                        Show all cards
                    </Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} colorScheme="blue" />
                </Stack>
            </Box>

            {/* This is the main section */}
            <Box w="100%" p={2}>
                {children}
            </Box>
        </Stack>
    );
};

export default NormalMenu;
