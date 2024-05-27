import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

const ShowQR = ({ isOpen, onClose, account }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>QR for: {account}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box p={8} bg="white" rounded={"lg"}>
                        <QRCode
                            size={256}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            viewBox={`0 0 256 256`}
                            value={account}
                        />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ShowQR;
