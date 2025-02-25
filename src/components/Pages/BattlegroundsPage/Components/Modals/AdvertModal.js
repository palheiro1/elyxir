import { useEffect } from 'react';
import { Image, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import logo from '../../assets/logoS06Trans.svg';
import '@fontsource/chelsea-market';
import '@fontsource/inter';

export const AdvertModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            onOpen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const { onOpen } = useDisclosure();

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} isCentered size={'3xl'}>
                <ModalOverlay />
                <ModalContent
                    backgroundColor={'#1F2323'}
                    fontFamily={'Chelsea Market, system-ui'}
                    borderRadius={'25px'}>
                    <ModalCloseButton color={'#FFF'} />
                    <ModalBody color={'#FFF'} textTransform={'uppercase'} textAlign={'center'} mt={'50px'}>
                        <Stack direction={'row'} m={'auto'}>
                            <Stack direction={'column'} w={'50%'} mx={'auto'} mt={5} ml={5}>
                                <Text textTransform={'uppercase'} fontSize={'larger'} textAlign={'left'}>
                                    Please select the land to attack on the map to start a Battle
                                </Text>
                                <Button
                                    backgroundColor={'transparent'}
                                    color={'#EBB2B9'}
                                    _hover={{ backgroundColor: '#1F2323' }}
                                    mr={3}
                                    onClick={handleClose}
                                    mx={'auto'}>
                                    OK!
                                </Button>
                            </Stack>
                            <Image src={logo} boxSize={'60%'} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
