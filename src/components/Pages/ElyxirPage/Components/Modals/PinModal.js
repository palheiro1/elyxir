import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Stack,
    Text,
} from '@chakra-ui/react';

/**
 * @name PinModal
 * @description Modal component that prompts the user to enter a 4-digit PIN to authorize a transaction.
 * Includes a masked PIN input and calls a callback function when the input is complete.
 * @param {boolean} showPinInput - Controls whether the PIN input modal is visible.
 * @param {Function} setShowPinInput - Function to toggle the visibility of the modal.
 * @param {Function} handlePinInput - Callback function executed when the user completes entering the 4-digit PIN.
 * @returns {JSX.Element} A small modal with instructions and a masked 4-digit PIN input for transaction authorization.
 * author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PinModal = ({ showPinInput, setShowPinInput, handlePinInput }) => {
    return (
        <Modal isOpen={showPinInput} onClose={() => setShowPinInput(false)} size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enter Your PIN</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Stack direction={'column'} spacing={4}>
                        <Text textAlign="center" color="gray.600">
                            Please enter your 4-digit PIN to authorize the transaction
                        </Text>
                        <Stack direction={'row'} w={'100%'} justifyContent={'center'}>
                            <PinInput size="lg" onComplete={handlePinInput} mask>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </Stack>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PinModal;
