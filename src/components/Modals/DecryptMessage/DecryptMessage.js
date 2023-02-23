import { useState } from 'react';

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
    PinInput,
    PinInputField,
    Textarea,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';
import { decryptMessage, getAccountPublicKey } from '../../../services/Ardor/ardorInterface';

/**
 * @name DecryptMessage
 * @description Modal to decrypt and show a message
 * @param {ref} reference - reference to the button that opens the modal
 * @param {boolean} isOpen - if the modal is open or not
 * @param {function} onClose - function to close the modal
 */
const DecryptMessage = ({ reference, isOpen, onClose, username, messages = [], sender }) => {
    const [decryptedMessages, setDecryptedMessages] = useState([]); // array of decrypted messages
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [sizeModal, setSizeModal] = useState('md'); // modal size
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
            const publicKey = (await getAccountPublicKey(sender)).publicKey;
            const promises = messages.map(async message => {
                return decryptMessage({
                    passPhrase: passphrase,
                    message: message,
                    publicKey: publicKey,
                });
            });
            const response = await Promise.all(promises);
            console.log('🚀 ~ file: DecryptMessage.js:62 ~ handleOk ~ response:', response);

            if (response) {
                okToast('Message decrypted', toast);
                setDecryptedMessages(response);
                setSizeModal('6xl');
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
        setDecryptedMessages([]);
        setSizeModal('md');
        onClose();
    };

    return (
        <>
            <AlertDialog
                size={sizeModal}
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={handleClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader>Messages</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {decryptedMessages.length > 0 ? (
                            <Box maxH="70vh" overflowY="auto">
                                <FormControl variant="floatingGray" id="Message" my={4} mt={8}>
                                    {decryptedMessages.map((message, index) => {
                                        return (
                                            <Textarea my={2} key={index} placeholder=" " value={message} isDisabled />
                                        );
                                    })}
                                    <FormLabel>Message</FormLabel>
                                </FormControl>
                            </Box>
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
                        {decryptedMessages.length === 0 && (
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

/*
<FormControl variant="floatingGray" id="Message" my={4} mt={8}>
                                <Textarea placeholder=" " value={text} isDisabled />
                                <FormLabel>Message</FormLabel>
                            </FormControl>
                            */
