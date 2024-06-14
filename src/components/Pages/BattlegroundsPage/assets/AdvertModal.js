import { useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

export const AdvertModal = ({ isOpen, onClose }) => {
    const handleClose = () => {
        onClose();
    };

    const { onOpen } = useDisclosure();

    useEffect(() => {
        if (isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={'#1F2323'}
                    fontFamily={'Chelsea Market, system-ui'}
                    borderRadius={'25px'}>
                    <ModalCloseButton color={'#FFF'} />
                    <ModalBody color={'#FFF'} textTransform={'uppercase'} textAlign={'center'} mt={'50px'}>
                        Please select the land to attack on the map to start a Battle
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            backgroundColor={'transparent'}
                            color={'#EBB2B9'}
                            _hover={{ backgroundColor: '#1F2323' }}
                            mr={3}
                            onClick={handleClose}
                            mx={'auto'}>
                            OK!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
