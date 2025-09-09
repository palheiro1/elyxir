import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react';

const CardReceived = ({ isOpen, onClose, ...props }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Card Received</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Card received functionality not available in Elyxir mode.</Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CardReceived;
