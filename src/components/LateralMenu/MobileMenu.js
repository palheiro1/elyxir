import { Box, Center, Stack, Switch, Text } from '@chakra-ui/react';
import CurrencyMenu from '../CurrencyMenu/CurrencyMenu';
import VerticalMenuButtons from './VerticalMenuButtons';

const MobileMenu = ({ option, setOption, handleLogout, infoAccount, showAllCards, handleShowAllCards, goToSection }) => {
    const { name: username, accountRs: account } = infoAccount;
    return (
        <Stack direction="column" w="100%">
            <Box w="100%" p={2}>
                <Stack direction="column" mb={2} w="100%">
                    <Text fontSize="xl" textAlign="center" fontWeight="bold">
                        {username}
                    </Text>
                    <Text fontSize="xs" textAlign="center" fontWeight="bold" mb={2}>
                        {account}
                    </Text>
                </Stack>

                <Center my={2}>
                    <CurrencyMenu infoAccount={infoAccount} goToSection={goToSection} />
                </Center>

                <Center w="100%">
                    <VerticalMenuButtons
                        setOption={setOption}
                        option={option}
                        handleLogout={handleLogout}
                        widthBotones="100%"
                    />
                </Center>

                <Stack p={2} align="center" pt={{ base: 4, md: 8}}>
                    <Text fontWeight="bold" textAlign="center" fontSize="sm">
                        Show all cards
                    </Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} colorScheme="blue" />
                </Stack>
            </Box>
        </Stack>
    );
};

export default MobileMenu;
