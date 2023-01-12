import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react"
import { dropUser, removeFromAllUsers } from "../../../utils/storage"

const ConfirmDialog = ({ reference, isOpen, onClose, setNeedReload, user }) => {

    const handleDelete = () => {
        dropUser(user);
        removeFromAllUsers(user);
        setNeedReload(true);
        onClose();
    }
        

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Delete wallet from this device?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Don't worry, you can restore it with your Ardor account and your seed phrase.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={reference} onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={handleDelete}>
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ConfirmDialog