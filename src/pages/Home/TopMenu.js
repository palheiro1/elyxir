import { Flex, Stack, Text } from '@chakra-ui/react';
import CurrencyMenu from '../../components/CurrencyMenu/CurrencyMenu';

const TopMenu = ({ infoAccount }) => {
    return (
        <>
            <Flex>
                <Stack direction="column" mb={1}>
                    <Text fontSize="sm" fontWeight="bold" mb={-3}>
                        {infoAccount.name}
                    </Text>
                    <Text fontSize="md" fontWeight="bold">
                        {infoAccount.accountRs}
                    </Text>
                </Stack>
                <CurrencyMenu infoAccount={infoAccount} />
            </Flex>
        </>
    );
};

export default TopMenu;
