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
    HStack,
    PinInput,
    PinInputField,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { checkPin } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import { withdrawAllGiftzFromOmno } from '../../../services/Ardor/omnoInterface';

/**
 * @name UnStuckGiftz
 * @description Component to un-stuck giftz from Omno
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const UnStuckGiftz = ({ reference, isOpen, onClose, username }) => {
    const toast = useToast();

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [sendingTx, setSendingTx] = useState(false);
    const [passphrase, setPassphrase] = useState('');

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleSend = async () => {
        try {
            setSendingTx(true);
            const unstucked = await withdrawAllGiftzFromOmno(passphrase);
            if(unstucked) {
                okToast('Giftz unstucked', toast);
                onClose();
            } else {
                errorToast('Error unstucking giftz', toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: unStuckGiftz.js:104 ~ handleSend ~ error:', error);
            errorToast('Error unstucking giftz', toast);
        } finally {
            setSendingTx(false);
        }
    };

    const bgColor = '#246773';
    const borderColor = '#2f8190';
    const isDisabled = !isValidPin || sendingTx;

    // const bgColor = '#246773';
    // const borderColor = '#2f8190';

    const cleanOnClose = () => {
        setIsValidPin(false);
        setPassphrase('');
        setSendingTx(false);
        onClose();
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={cleanOnClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">
                        <Text color="white">UNSTUCK GIFTZ</Text>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton color="white" />
                    <AlertDialogBody color="white">
                        <Center>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
                                    onComplete={handleCompletePin}
                                    onChange={handleCompletePin}
                                    isInvalid={!isValidPin}
                                    variant="filled"
                                    mask>
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                </PinInput>
                            </HStack>
                        </Center>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            isDisabled={isDisabled || sendingTx}
                            bgColor={borderColor}
                            w="100%"
                            _hover={{ filter: 'brightness(1.2)' }}
                            py={6}
                            color="white"
                            fontWeight={'black'}
                            onClick={handleSend}>
                            {sendingTx ? 'SENDING...' : 'SUBMIT'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default UnStuckGiftz;
