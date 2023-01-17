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
    HStack,
    PinInput,
    PinInputField,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { cancelAskOrder, cancelBidOrder } from '../../../../services/Ardor/ardorInterface';
import { errorToast, okToast } from '../../../../utils/alerts';
import { checkPin } from '../../../../utils/walletUtils';


/**
 * @name CancelDialog
 * @description Component to cancel orders
 * @param {Object} reference - Object with the reference to the modal
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {String} username - String with the username
 * @param {Object} selectedOrder - Object with the order data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const CancelDialog = ({ reference, isOpen, onClose, username, selectedOrder }) => {
    const toast = useToast();
    const [passphrase, setPassphrase] = useState('');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    if (!selectedOrder) return;
    const { order, isAsk } = selectedOrder;
    const typeTrade = isAsk ? 'ask' : 'bid';

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleDelete = async () => {
        if (isValidPin) {
            let result;

            if (isAsk) result = await cancelAskOrder(order, passphrase);
            else result = await cancelBidOrder(order, passphrase);

            if (result) okToast('Order deleted', toast);
            else errorToast('Error deleting order', toast);

            onClose();
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

                <AlertDialogContent>
                    <AlertDialogHeader>Delete {typeTrade} order?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Center fontWeight="bold">Confirm by entering your PIN.</Center>
                        <Center>
                            <Box py={2}>
                                <HStack spacing={4}>
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
                            </Box>
                        </Center>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={reference} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            ml={3}
                            disabled={!isValidPin}
                            onClick={handleDelete}>
                            Delete now
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CancelDialog;
