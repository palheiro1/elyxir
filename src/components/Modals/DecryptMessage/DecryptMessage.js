import { forwardRef, createRef, useEffect, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';

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
    Flex,
    FormControl,
    FormLabel,
    HStack,
    PinInput,
    PinInputField,
    Spacer,
    Textarea,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';
import { decryptMessage, getAccountPublicKey, getAllMessages } from '../../../services/Ardor/ardorInterface';
import { getMessageTimestamp } from '../../../utils/dateAndTime';

/**
 * @name DecryptMessage
 * @description Modal to decrypt and show a message
 * @param {ref} reference - reference to the button that opens the modal
 * @param {boolean} isOpen - if the modal is open or not
 * @param {function} onClose - function to close the modal
 */
const DecryptMessage = ({ reference, isOpen, onClose, username, messages = [], sender, account }) => {
    const [decryptedMessages, setDecryptedMessages] = useState([]); // array of decrypted messages
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [sizeModal, setSizeModal] = useState('md'); // modal size
    const [loadedMessages, setLoadedMessages] = useState(false); // flag to know if messages are loaded
    const [totalMessages, setTotalMessages] = useState([]);
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
            const promises = totalMessages.map(async message => {
                const msg = await decryptMessage({
                    passPhrase: passphrase,
                    message: message,
                    publicKey: publicKey,
                });
                const { timeElapsedText, isDate } = getMessageTimestamp(message);
                const isMyMessage = message.senderRS === account;
                return {
                    message: msg,
                    timeElapsedText,
                    isDate,
                    isMyMessage,
                };
            });

            const response = await Promise.all(promises);

            if (response) {
                okToast('Message decrypted', toast);
                setDecryptedMessages(response);
                setSizeModal('6xl');
                setLoadedMessages(true);
            } else {
                errorToast('Error decrypting message', toast);
            }
        } catch (error) {
            console.log('🚀 ~ file: NewMessage.js:85 ~ handleOk ~ error:', error);
            errorToast('Error decrypting message', toast);
        }
    };

    // ------------------ Get all messages from sender ------------------

    useEffect(() => {
        const getMyMessages = async () => {
            const response = await getAllMessages(sender);
            let auxMessages = response.prunableMessages;
            // Delete messages have JSON format
            auxMessages = auxMessages.filter(message => {
                if (message.encryptedMessage) return true;
                return false;
            });
            // Filter messages by account
            auxMessages = auxMessages.filter(message => {
                if (message.senderRS === account) return true;
                return false;
            });
            // Mix messages with auxMessages
            const auxTotalMsg = [...messages, ...auxMessages];
            // Sort messages by timestamp
            // auxTotalMsg.sort((a, b) => {
            //     return a.timestamp - b.timestamp;
            // });
            setTotalMessages(auxTotalMsg);
        };

        getMyMessages();
    }, [sender, account, messages]);

    const AutoResizeTextarea = forwardRef((props, ref) => {
        return (
            <Textarea
                minH="unset"
                overflow="hidden"
                w="100%"
                resize="none"
                ref={ref}
                minRows={1}
                as={ResizeTextarea}
                {...props}
            />
        );
    });

    // ------------------------------------------------------------------

    const bgColor = useColorModeValue('', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

    const handleClose = () => {
        setIsValidPin(false);
        setPassphrase('');
        setDecryptedMessages([]);
        setSizeModal('md');
        setLoadedMessages(false);
        onClose();
    };

    const messagesEndRef = createRef();

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        loadedMessages && scrollToBottom();
    }, [decryptedMessages, loadedMessages, messagesEndRef]);

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
                                {decryptedMessages.map((message, index) => {
                                    return (
                                        <FormControl
                                            variant={message.isMyMessage ? 'whatsAppStyleRight' : 'whatsAppStyleLeft'}
                                            key={index}
                                            id="Message">
                                            <Flex>
                                                {message.isMyMessage && <Spacer />}
                                                <AutoResizeTextarea
                                                    bg={message.isMyMessage ? 'blackAlpha.100' : 'whiteAlpha.100'}
                                                    my={2}
                                                    key={index}
                                                    placeholder=" "
                                                    value={message.message}
                                                    maxW="70%"
                                                    isReadOnly
                                                />

                                                <FormLabel fontSize="2xs">
                                                    <strong>{message.timeElapsedText}</strong>{' '}
                                                    {!message.isDate && 'ago'}
                                                </FormLabel>
                                            </Flex>
                                            <div ref={messagesEndRef} />
                                        </FormControl>
                                    );
                                })}
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
