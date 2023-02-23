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
    PinInput,
    PinInputField,
    Textarea,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';
import { decryptMessage } from '../../../services/Ardor/ardorInterface';

/**
 * @name DecryptMessage
 * @description Modal to decrypt and show a message
 * @param {ref} reference - reference to the button that opens the modal
 * @param {boolean} isOpen - if the modal is open or not
 * @param {function} onClose - function to close the modal
 */
const DecryptMessage = ({ reference, isOpen, onClose, username, message, account }) => {
    const [text, setText] = useState('');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const toast = useToast();

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
            const response = await decryptMessage({
                passPhrase: passphrase,
                message: message,
                account: message.senderRS,
            });

            if (response) {
                okToast('Message decrypted', toast);
                setText(response);
            } else {
                errorToast('Error decrypting message', toast);
            }
        } catch (error) {
            console.log('🚀 ~ file: NewMessage.js:85 ~ handleOk ~ error:', error);
            errorToast('Error decrypting message', toast);
        }
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

    const handleClose = () => {
        setIsValidPin(false);
        setPassphrase('');
        setText('');
        onClose();
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={handleClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader>Decrypt message</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {text !== '' ? (
                            <FormControl variant="floatingGray" id="Message" my={4} mt={8}>
                                <Textarea placeholder=" " value={text} isDisabled />
                                <FormLabel>Message</FormLabel>
                            </FormControl>
                        ) : (
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
                        )}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button mx={2} ref={reference} onClick={handleClose}>
                            CLOSE
                        </Button>
                        {text === '' && (
                            <Button ref={reference} onClick={handleOk} isDisabled={!isValidPin}>
                                SHOW MESSAGE
                            </Button>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DecryptMessage;
