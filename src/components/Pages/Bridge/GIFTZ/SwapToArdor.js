import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';

// Utils
import { processUnwrapsFor1155 } from '../../../../services/Ardor/ardorInterface';
import { copyToast, errorToast, okToast } from '../../../../utils/alerts';

/**
 * @name SwapToArdor
 * @description This component is used to swap GIFTZ to Ardor
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {String} ethAddress - Ethereum address
 * @returns {JSX.Element} - JSX element
 */
const SwapToArdor = ({ infoAccount, ethAddress }) => {
    const toast = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ethAddress);
        copyToast('Deposit address', toast);
    };

    const swap = async () => {
        const response = await processUnwrapsFor1155(infoAccount.accountRs);
        if (response && response.starts) {
            okToast(response.starts + ' transfers started.', toast);
        } else if (response && response.requestProcessingTime) {
            errorToast('No transfer started.', toast);
        } else {
            errorToast('Something went wrong.', toast);
        }
    };

    return (
        <Stack direction="column" spacing={8} align="center">
            <Heading fontSize="3xl" fontWeight="light" mb={-8}>
                1. Send the cards
            </Heading>
            <Text fontWeight="light">to your deposit address</Text>

            <FormControl variant="floatingTransparent" id="cards">
                <Tooltip label="Click to copy">
                    <Input
                        value={ethAddress}
                        isReadOnly
                        onClick={() => {
                            copyToClipboard();
                        }}
                    />
                </Tooltip>
                <FormLabel>Deposit address</FormLabel>
            </FormControl>

            <Divider bgColor="#393b97" />

            <Box>
                <Heading fontSize="3xl" fontWeight="light">
                    2. Wait until the transaction is
                </Heading>
                <Text fontWeight="light" textAlign="center">
                    well confirmed.
                </Text>
            </Box>

            <Divider bgColor="#393b97" />

            <Heading fontSize="3xl" fontWeight="light">
                3. Initiate the swap to this wallet
            </Heading>

            <FormControl variant="floatingTransparent" id="cards">
                <Input value={infoAccount.accountRs} isReadOnly />
                <FormLabel>ARDOR address</FormLabel>
            </FormControl>

            <Button w="100%" variant="bridge" letterSpacing="widest" onClick={swap}>
                SWAP
            </Button>
        </Stack>
    );
};

export default SwapToArdor;
