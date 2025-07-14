import {
    Button,
    Center,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
} from '@chakra-ui/react';

/**
 * @name PinModal
 * @description Modal dialog that prompts the user to enter a 4-digit PIN code.
 * The PIN input masks the characters and validates the input on completion and change.
 * Shows an invalid state when the PIN is incorrect.
 * Includes a "Play" button that triggers the battle start handler.
 * The button can be disabled to prevent multiple submissions.
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {Function} onClose - Callback to close the modal.
 * @param {Function} handleCompletePin - Callback triggered when PIN input is completed or changed.
 * @param {boolean} isValidPin - Flag indicating if the entered PIN is valid.
 * @param {Function} handleStartBattle - Callback triggered when clicking the "Play" button.
 * @param {boolean} disableButton - Flag to disable the "Play" button (e.g., while processing).
 * @returns {JSX.Element} A modal component with masked PIN input and a submit button.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PinModal = ({ isOpen, onClose, handleCompletePin, isValidPin, handleStartBattle, disableButton }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bgColor={'#ebb2b9'} border={'2px solid #F48794'}>
                <ModalHeader mx={'auto'}>Insert your pin</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <HStack spacing={7}>
                            <PinInput
                                size="lg"
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
                </ModalBody>

                <ModalFooter>
                    <Button
                        color={'#fff'}
                        bgColor="#F48794"
                        mx={'auto'}
                        w={'80%'}
                        onClick={handleStartBattle}
                        isDisabled={disableButton}>
                        Play
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PinModal;
