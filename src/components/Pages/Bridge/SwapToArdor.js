import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';

const SwapToArdor = ({ infoAccount, cards }) => {
    const depositAddress = '0x0000000000000000000000000000000000000000';

    return (
        <Stack direction="column" spacing={8} align="center">
            <Heading fontSize="3xl" fontWeight="light" mb={-8}>
                1. Send the cards
            </Heading>
            <Text fontWeight="light">to your deposit address</Text>

            <FormControl variant="floating" id="cards">
                <Input value={depositAddress} isReadOnly />
                <FormLabel>Deposit address</FormLabel>
            </FormControl>

            <Box>
                <Heading fontSize="3xl" fontWeight="light">
                    2. Wait until the transaction is
                </Heading>
                <Text fontWeight="light" textAlign="center">
                    well confirmed.
                </Text>
            </Box>

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
