import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Stack,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { errorToast, okToast } from '../../../../utils/alerts';
import { addToAllUsers, initUser } from '../../../../utils/storage';
import { checkIsValidPassphrase } from '../../../../utils/validators';
import { useNavigate } from 'react-router-dom';
import QRReader from '../../../QRReader/QRReader';
import { getAccountFromPhrase } from '../../../../services/Ardor/ardorInterface';

const UserRestore = ({ isRedeem = false }) => {
    const toast = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState(isRedeem ? 'GIFTZ Pack' : '');
    const [account, setAccount] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [isValidPassphrase, setIsValidPassphrase] = useState(false);
    const [pin, setPin] = useState('');
    const [readerEnabled, setReaderEnabled] = useState(false);

    const handleChangeName = e => setName(e.target.value);
    const handleChangeAccount = e => setAccount(e.target.value);
    const handleChangePin = e => setPin(e);

    let needScanQR = isRedeem && !isValidPassphrase;

    const handleChangePassphrase = e => {
        const auxPassphrase = e.target.value;
        const isValid = checkIsValidPassphrase(auxPassphrase, account);

        if (!isValid) setIsValidPassphrase(false);
        else setIsValidPassphrase(true);

        setPassphrase(auxPassphrase);
    };

    useEffect(() => {
        const checkPassphrase = () => {
            const isValid = checkIsValidPassphrase(passphrase, account);
            if (!isValid) setIsValidPassphrase(false);
            else setIsValidPassphrase(true);
        };

        if (account !== '' && passphrase !== '') checkPassphrase();
    }, [account, passphrase]);

    const handleRestoreWallet = () => {
        if (!name || !account || !passphrase || !pin) {
            errorToast('Please fill all fields', toast);
            return;
        }

        if (!isValidPassphrase) {
            errorToast('Invalid passphrase', toast);
            return;
        }

        const user = initUser(name, account, true, passphrase, pin);
        if (!user) {
            errorToast('Error creating user', toast);
            return;
        }

        // Save user in local storage
        localStorage.setItem(user.name, JSON.stringify(user));
        addToAllUsers(user);
        okToast('Wallet saved successfully', toast);
        navigate('/login');
    };

    // ---------------- QR Reader ----------------

    const handleScan = scanPhrase => {
        if (readerEnabled) setReaderEnabled(false);

        const account = getAccountFromPhrase(scanPhrase);
        setPassphrase(scanPhrase);
        setAccount(account);
    };

    const handleSubmit = () => {
        if (needScanQR) setReaderEnabled(true);
        else handleRestoreWallet();
    };

    // -------------------------------------------

    return (
        <>
            <Box>
                <Text my={4} mb={8} maxW="70%">
                    Account name and PIN are not saved on any server, <strong>only on your own device.</strong>
                </Text>

                <Stack direction={'row'}>
                    <FormControl variant="floating" id="name">
                        <Input placeholder=" " value={name} size="lg" onChange={handleChangeName} />
                        <FormLabel>Name</FormLabel>
                        <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
                    </FormControl>

                    <FormControl variant="floating" id="pin">
                        <Input
                            placeholder=" "
                            value={account}
                            size="lg"
                            onChange={handleChangeAccount}
                            isInvalid={!isRedeem && !isValidPassphrase}
                            isDisabled={isRedeem}
                        />
                        <FormLabel>Account</FormLabel>
                        <FormHelperText textAlign="center">Ardor Account ID</FormHelperText>
                    </FormControl>
                </Stack>

                <FormControl variant="floating" id="account" my={6}>
                    <Textarea
                        placeholder=" "
                        value={passphrase}
                        onChange={handleChangePassphrase}
                        isInvalid={!isRedeem && !isValidPassphrase}
                        isDisabled={isRedeem}
                    />
                    <FormLabel>Passphrase</FormLabel>
                </FormControl>

                <Stack direction={'row'}>
                    <FormControl variant="floating" id="pin">
                        <HStack spacing={2}>
                            <PinInput size="lg" onComplete={handleChangePin} manageFocus={true}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                        <FormLabel mx={16}>PIN</FormLabel>
                        <FormHelperText textAlign="center">Used to access easily.</FormHelperText>
                    </FormControl>

                    <Button
                        w="100%"
                        p={6}
                        mb={4}
                        color="white"
                        bgColor="blue"
                        fontWeight="bolder"
                        onClick={handleSubmit}>
                        {needScanQR ? 'Scan QR CODE' : 'Restore'}
                    </Button>
                </Stack>
            </Box>
            {readerEnabled && (
                <Modal isOpen={readerEnabled} onClose={() => setReaderEnabled(false)} isCentered size={'3xl'}>
                    <ModalOverlay bgColor={'blackAlpha.800'} />
                    <ModalContent>
                        <ModalHeader>Scan QR</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <QRReader handleInput={handleScan} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default UserRestore;
