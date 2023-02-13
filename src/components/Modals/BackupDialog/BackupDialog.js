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

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent>
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
                        <Textarea textAlign="center">{passphrase}</Textarea>
                        <Text pt={4}>
                            By selecting OK you disable the backup reminder after login. <br />
                            Select CANCEL to keep the reminder.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button mx={2} ref={reference} onClick={onClose}>
                            CANCEL
                        </Button>
                        <Button ref={reference} onClick={handleOk}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BackupDialog;
