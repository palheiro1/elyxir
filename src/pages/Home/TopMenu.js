import { Flex, Spacer, Stack, Text } from '@chakra-ui/react';
import CurrencyMenu from '../../components/CurrencyMenu/CurrencyMenu';

const TopMenu = ({ infoAccount }) => {
    return (
        <>
            <Flex w="100%">
                <Stack direction="column" mb={1}>
                    <Text fontSize="sm" fontWeight="bold" mb={-3}>
                        {infoAccount.name}
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                        {infoAccount.accountRs}
                    </Text>
                </Stack>
                <Spacer />
                <CurrencyMenu infoAccount={infoAccount} />
            </Flex>
        </>
    );
};

export default TopMenu;
