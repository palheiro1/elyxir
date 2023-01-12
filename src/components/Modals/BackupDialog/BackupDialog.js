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

const BackupDialog = ({ reference, isOpen, onClose, account, passphrase }) => {

    const handleOk = (e) => {
        e.preventDefault();
        setBackupDone(account);
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
                        <Text>
                            Write down your passphrase (in the box) and store it somewhere safe.
                        </Text>

                        <Text textAlign="center" pt={2}>
                            Account
                        </Text>
                        <Text textAlign="center" py={1} pb={2} fontWeight="bold">
                            {account}
                        </Text>
                        <Textarea textAlign="center">{passphrase}</Textarea>
                        <Text pt={4}>
                            By selecting Ok you disable the backup reminder after login. Select
                            Cancel to keep the reminder.
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
