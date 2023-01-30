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
import { okToast } from '../../../utils/alerts';

const SwapToArdor = ({ infoAccount, ethAddress, cards }) => {
    const toast = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ethAddress);
        okToast('Copied to clipboard', toast);
    };

    return (
        <Stack direction="column" spacing={8} align="center">
            <Heading fontSize="3xl" fontWeight="light" mb={-8}>
                1. Send the cards
            </Heading>
            <Text fontWeight="light">to your deposit address</Text>

            <FormControl variant="floating" id="cards">
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

            <Divider />

            <Box>
                <Heading fontSize="3xl" fontWeight="light">
                    2. Wait until the transaction is
                </Heading>
                <Text fontWeight="light" textAlign="center">
                    well confirmed.
                </Text>
            </Box>

            <Divider />

            <Heading fontSize="3xl" fontWeight="light">
                3. Initiate the swap to this wallet
            </Heading>

            <FormControl variant="floating" id="cards">
                <Input value={infoAccount.accountRs} isReadOnly />
                <FormLabel>ARDOR address</FormLabel>
            </FormControl>

            <Button w="100%" colorScheme="blue" variant="outline" letterSpacing="widest">
                SWAP
            </Button>
        </Stack>
    );
};

export default SwapToArdor;
