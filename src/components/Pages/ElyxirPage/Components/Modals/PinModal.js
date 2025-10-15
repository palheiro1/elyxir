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
