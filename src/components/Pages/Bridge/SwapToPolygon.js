import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    PinInput,
    PinInputField,
    Select,
    Stack,
} from '@chakra-ui/react';

import { checkPin } from '../../../utils/walletUtils';

const SwapToPolygon = ({ infoAccount, cards }) => {
    const [polygonAccount, setPolygonAccount] = useState('');
    const [isValidAccount, setIsValidAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [passphrase, setPassphrase] = useState('');

    const handleInput = e => {
        e.preventDefault();
        setPolygonAccount(e.target.value);
        const isValid = true; // check if account is valid !!!!!!!!!!!!!!!!!!!!!!!!!!!
        setIsValidAccount(isValid);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { username } = infoAccount;
        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };
    return (
        <Center>
            <Stack direction="column" spacing={8}>
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    1. Select cards to swap
                </Heading>

                <FormControl variant="floating" id="cards" my={4} mt={8}>
                    <Select placeholder="Select option">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </Select>
                    <FormLabel>Choose</FormLabel>
                </FormControl>

                <Box mb={8}>
                    <Heading fontSize="xl" fontWeight="light">
                        Choosen
                    </Heading>

                    <Box>Card</Box>
                    <Box>Card</Box>
                    <Box>Card</Box>
                </Box>

                <Divider />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    2. Enter your polygon address
                </Heading>

                <FormControl variant="floating" id="address" my={4} mt={8}>
                    <Input placeholder="Polygon address" value={polygonAccount} onChange={handleInput} />
                    <FormLabel>Address</FormLabel>
                </FormControl>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            size="lg"
                            placeholder="🔒"
                            onComplete={handleCompletePin}
                            onChange={handleCompletePin}
                            isInvalid={!isValidPin}
                            variant="filled"
                            mask>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                </Center>

                <Button
                    w="100%"
                    colorScheme="blue"
                    variant="outline"
                    disabled={!isValidAccount || !isValidPin}
                    letterSpacing="widest">
                    SWAP
                </Button>
            </Stack>
        </Center>
    );
};

export default SwapToPolygon;
