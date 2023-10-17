import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text,
    Textarea,
} from '@chakra-ui/react';

import { setBackupDone } from '../../../utils/storage';

/**
 * @name BackupDialog
 * @description Modal to confirm passphrase backup
 * @param {ref} reference - reference to the button that opens the modal
 * @param {boolean} isOpen - if the modal is open or not
 * @param {function} onClose - function to close the modal
 * @param {string} account - account address
 * @param {string} passphrase - account passphrase
 * @param {string} username - account username
 */
const BackupDialog = ({ reference, isOpen, onClose, account, passphrase, username }) => {
    const handleOk = e => {
        e.preventDefault();
        setBackupDone(username);
        onClose();
    };

    const bgColor = '#d86471';
    const borderColor = '#f39d54';
    const filledColor = '#f79c27';

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent
                    bgColor={bgColor}
                    border="1px"
                    borderColor={borderColor}
                    shadow="dark-lg"
                    color="white">
                    <AlertDialogHeader>Confirm passphrase backup</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Text>Write down your passphrase (in the box) and store it somewhere safe.</Text>

                        <Text textAlign="center" pt={2}>
                            Account
                        </Text>
                        <Text textAlign="center" py={1} pb={2} fontWeight="bold">
                            {account}
                        </Text>
                        <Textarea textAlign="center" isReadOnly>{passphrase}</Textarea>
                        <Text pt={4}>
                            Selecting <strong>OK</strong> you disable the backup reminder. <br />
                            Select <strong>CANCEL</strong> to keep the reminder.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button mx={2} ref={reference} onClick={onClose} bgColor={filledColor} fontWeight={'black'}>
                            CANCEL
                        </Button>
                        <Button ref={reference} onClick={handleOk} bgColor={filledColor} fontWeight={'black'}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BackupDialog;
