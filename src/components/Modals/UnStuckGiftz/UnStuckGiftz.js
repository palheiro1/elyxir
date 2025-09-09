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

const UnStuckGiftz = ({ isOpen, onClose, ...props }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>UnStuck GIFTZ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>UnStuck GIFTZ functionality not available in Elyxir mode.</Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UnStuckGiftz;
