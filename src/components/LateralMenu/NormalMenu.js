import { Box, Stack, Switch, Text } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';

const NormalMenu = ({ option, setOption, handleLogout, showAllCards, handleShowAllCards, children }) => {
    return (
        <Stack direction="row">
            <Box>
                <VerticalMenuButtons setOption={setOption} option={option} handleLogout={handleLogout} widthBotones="140px" />

                <Stack p={2} align="center" pt={8}>
                    <Text fontWeight="bold" textAlign="center" fontSize="sm">
                        Show all cards
                    </Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} colorScheme="blue" />
                </Stack>
            </Box>

            {/* This is the main section */}
            <Box width="100%" p={2}>
                {children}
            </Box>
        </Stack>
    );
};

export default NormalMenu;
