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

const MorphDialog = ({ isOpen, onClose, ...props }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Morph Dialog</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Morph functionality not available in Elyxir mode.</Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default MorphDialog;
