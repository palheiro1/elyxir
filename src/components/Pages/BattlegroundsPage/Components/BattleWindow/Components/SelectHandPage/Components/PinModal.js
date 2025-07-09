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
