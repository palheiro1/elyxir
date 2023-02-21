import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Center,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Textarea,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { FaQrcode } from 'react-icons/fa';
import { isArdorAccount } from '../../../utils/validators';
import { sendDirectMessage } from '../../../services/Ardor/ardorInterface';
import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';

/**
 * @name NewMessage
 * @description Modal to send a new message
 * @param {ref} reference - reference to the button that opens the modal
 * @param {boolean} isOpen - if the modal is open or not
 * @param {function} onClose - function to close the modal
 */
const NewMessage = ({ reference, isOpen, onClose, username }) => {
    const [ardorAccount, setArdorAccount] = useState('');
    const [message, setMessage] = useState('');
    const [isValidArdorAccount, setIsValidArdorAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const toast = useToast();

    const handleInputArdorAccount = e => {
        e.preventDefault();
        setArdorAccount(e.target.value);
        const isValid = isArdorAccount(e.target.value);
        setIsValidArdorAccount(isValid);
    };

    const handleInputMessage = e => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleOk = async () => {
        try {
            const response = await sendDirectMessage({
                recipient: ardorAccount,
                passPhrase: passphrase,
                message,
            });

            if (response) {
                okToast('Message sent', toast);
                onClose();
            } else {
                errorToast('Error sending message', toast);
            }
        } catch (error) {
            console.log("🚀 ~ file: NewMessage.js:85 ~ handleOk ~ error:", error)
            errorToast('Error sending message', toast);
        }
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader>Send message</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <FormControl variant="floatingGray" id="Recipient" my={4} mt={8}>
                            <InputGroup size="lg" border="1px" borderColor={borderColor} rounded="lg">
                                <Input
                                    placeholder=" "
                                    value={ardorAccount}
                                    onChange={handleInputArdorAccount}
                                    border="0px"
                                    isInvalid={!isValidArdorAccount}
                                />
                                <InputRightAddon
                                    bgColor="transparent"
                                    border="0px"
                                    children={
                                        <IconButton
                                            bgColor="transparent"
                                            aria-label="Scan QR CODE"
                                            icon={<FaQrcode />}
                                        />
                                    }
                                />
                            </InputGroup>

                            <FormLabel>Recipient</FormLabel>
                        </FormControl>

                        <FormControl variant="floatingGray" id="Message" my={4} mt={8}>
                            <Textarea placeholder=" " value={message} onChange={handleInputMessage} />
                            <FormLabel>Recipient</FormLabel>
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
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button mx={2} ref={reference} onClick={onClose}>
                            CANCEL
                        </Button>
                        <Button ref={reference} onClick={handleOk} isDisabled={!isValidArdorAccount || !isValidPin}>
                            SEND NOW
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default NewMessage;
