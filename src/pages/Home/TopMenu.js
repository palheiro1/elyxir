import { Flex, Spacer, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import CurrencyMenu from '../../components/CurrencyMenu/CurrencyMenu';
import { copyToast } from '../../utils/alerts';

const TopMenu = ({ infoAccount, goToSection, setSelectedBridgeType }) => {
    const toast = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(infoAccount.accountRs);
        copyToast('ARDOR Account', toast);
    };

    return (
        <>
            <Flex w="100%">
                <Stack direction="column" mb={1}>
                    <Text fontSize="sm" fontWeight="bold" mb={-3}>
                        {infoAccount.name}
                    </Text>
                    <Tooltip label="Click to copy" hasArrow placement="top-end">
                        <Text fontSize="md" fontWeight="bold" onClick={copyToClipboard} _hover={{ cursor: 'pointer' }}>
                            {infoAccount.accountRs}
                        </Text>
                    </Tooltip>
                </Stack>

                <Spacer />

                {infoAccount.GEMBalance !== undefined && infoAccount.GEMBalance !== null && (
                    <CurrencyMenu
                        infoAccount={infoAccount}
                        goToSection={goToSection}
                        setSelectedBridgeType={setSelectedBridgeType}
                    />
                )}
            </Flex>
        </>
    );
};

export default TopMenu;
