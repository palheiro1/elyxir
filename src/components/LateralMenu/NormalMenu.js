import { Box, Stack, Switch, Text } from '@chakra-ui/react';
import VerticalMenuButtons from './VerticalMenuButtons';

const NormalMenu = ({ option, setOption, handleLogout, account, username, showAllCards, handleShowAllCards, children }) => {
    const splitAccount = account.slice(0, 5) + ' ... ' + account.slice(-5);

    return (
        <Stack direction="row">
            <Box>
                <Stack direction="column" mb={4} maxW={'130px'}>
                    <Text fontSize="xl" textAlign="center" fontWeight="bold">
                        {username}
                    </Text>
                    <Text fontSize="xs" textAlign="center" fontWeight="bold" mb={2}>
                        {splitAccount}
                    </Text>
                </Stack>

                <VerticalMenuButtons setOption={setOption} option={option} handleLogout={handleLogout} widthBotones="130px" />

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
