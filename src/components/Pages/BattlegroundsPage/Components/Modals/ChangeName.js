import {
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { checkPin } from '../../../../../utils/walletUtils';
import { changeAccountName } from '../../../../../services/Ardor/ardorInterface';
import { errorToast, okToast } from '../../../../../utils/alerts';

const ChangeName = ({ isOpen, onClose, infoAccount }) => {
    const [newName, setNewName] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [isValidPin, setIsValidPin] = useState(false);
    const toast = useToast();
    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleChangeName = async () => {
        if (!isValidPin) return errorToast('Invalid pin', toast);
        if (newName === null || newName === '') return errorToast('New name can not be empty', toast);
        try {
            await changeAccountName(infoAccount.accountRs, passphrase, newName);
            onClose();
            return okToast('Account name changed successfuly', toast);
        } catch (error) {
            console.log('🚀 ~ handleChangeName ~ error:', error);
            return errorToast('There was an error changing your name', toast);
        }
    };

    const handleInputChange = e => {
        setNewName(e.target.value);
    };

    const handleClose = () => {
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay onClose={handleClose} />
            <ModalContent bgColor={'#ebb2b9'} border={'2px solid #F48794'}>
                <ModalHeader mx={'auto'} color={'#000'}>
                    Change account name
                </ModalHeader>
                <ModalCloseButton onClick={handleClose} />
                <ModalBody display={'flex'}>
                    <Stack direction={'column'} mx={'auto'}>
                        <Center>
                            <FormControl variant="floatingModalTransparent" id="Amount" my={4}>
                                <FormLabel>
                                    <Text color={'#FFF'}>New name: </Text>
                                </FormLabel>
                                <Input name="name" value={newName} onChange={handleInputChange} />
                            </FormControl>
                        </Center>
                        <Stack direction={'row'} spacing={7} mx={'auto'}>
                            <PinInput
                                size="lg"
                                onComplete={handleCompletePin}
                                onChange={handleCompletePin}
                                isInvalid={!isValidPin}
                                variant="filled"
                                mask>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </Stack>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button color={'#fff'} bgColor="#F48794" mr={3} mx={'auto'} w={'80%'} onClick={handleChangeName}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangeName;
