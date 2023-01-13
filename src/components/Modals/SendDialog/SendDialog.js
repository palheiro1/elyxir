import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { checkPin } from '../../../services/Ardor/walletUtils';
import { isArdorAccount } from '../../../utils/validators';

const SendDialog = ({ reference, isOpen, onClose, card, username }) => {

    const [ ardorAccount, setArdorAccount ] = useState('');
    const [ isValidArdorAccount, setIsValidArdorAccount ] = useState(false);
    const [ isValidPin, setIsValidPin ] = useState(false); // invalid pin flag


    const handleInput = (e) => {
        e.preventDefault();
        setArdorAccount(e.target.value);
        const isValid = isArdorAccount(e.target.value);
        setIsValidArdorAccount(isValid);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
        }
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center" color="white">
                        <Center>
                            <Text>SEND CARD</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Center rounded="lg" bgColor="whiteAlpha.100" p={4}>
                            <Stack direction="row" align="center" spacing={4}>
                                <Image src={card.cardImgUrl} maxH="5rem" />
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold" color="white">
                                        {card.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {card.channel} / {card.rarity}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Quantity: {card.quantityQNT}
                                    </Text>
                                </Box>
                            </Stack>
                        </Center>

                        <FormControl variant="floatingGray" id="Recipient" my={4} mt={8}>
                            <InputGroup size="lg" border="1px" borderColor="whiteAlpha.300" rounded="lg">
                                <Input placeholder=" " value={ardorAccount} onChange={handleInput} border="0px" isInvalid={!isValidArdorAccount} />
                                <InputRightAddon bgColor="transparent" border="0px" children={
                                    <IconButton bgColor="transparent" aria-label='Scan QR CODE' icon={<FaQrcode />} />
                                } />
                            </InputGroup>

                            <FormLabel>Recipient</FormLabel>
                        </FormControl>

                        <Center>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
                                    placeholder="🔒"
                                    onComplete={handleCompletePin}
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
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button isDisabled={!isValidPin || !isValidArdorAccount} bgColor="blue.700" w="100%" py={6}>
                            Submit
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SendDialog;
