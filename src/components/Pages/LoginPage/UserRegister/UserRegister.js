import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Stack,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { generatePassphrase } from '../../../../services/Ardor/generatePassphrase';
import { getAccountFromPhrase } from '../../../../services/Ardor/ardorInterface';
import { addToAllUsers, getUser, initUser } from '../../../../utils/storage';
import { copyToast, errorToast, okToast } from '../../../../utils/alerts';
import { useNavigate } from 'react-router-dom';
/**
 * @description This component is used to render the user register form
 * @description Auto-generates a wallet and saves it in the local storage
 * @returns {JSX.Element} User register form
 * @name UserRegister
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @todo Add logic to check if the user is already logged in
 */
const UserRegister = () => {
    const toast = useToast();
    const navigate = useNavigate();

    // Generated wallet
    const [account, setAccount] = useState('');
    const [passphrase, setPassphrase] = useState('');

    // Controlled inputs
    const [name, setName] = useState('');
    const handleChangeName = e => setName(e.target.value);

    const [pin, setPin] = useState('');
    const handleChangePin = e => setPin(e);

    const clearFormData = () => {
        setName('');
        setPin('');
        setAccount('');
        setPassphrase('');
    };

    const handleCopyToast = text => copyToast(text, toast);

    const handleGenerateWallet = async () => {
        const auxPassphrase = generatePassphrase();
        const auxAccount = await getAccountFromPhrase(auxPassphrase);
        setAccount(auxAccount);
        setPassphrase(auxPassphrase);
    };

    const handleSaveWallet = () => {
        // Check if all fields are filled
        if (!name || !account || !passphrase || !pin || pin.length !== 4) {
            errorToast('Please generate a wallet and set an account name and PIN number', toast);
            return;
        }

        // Check if user already exists
        if (getUser(name)) {
            errorToast('User already exists', toast);
            return;
        }

        // Prepare user object
        const user = initUser(name, account, true, passphrase, pin, true);
        // Save user in local storage
        saveUserAndRedirect(user);
    };

    const saveUserAndRedirect = user => {
        // Save user in local storage
        localStorage.setItem(user.name, JSON.stringify(user));
        addToAllUsers(user);
        okToast('Wallet saved successfully', toast);
        clearFormData();
        navigate('/login');
    };

    return (
        <Box>
            <Text my={4} mb={8} maxW="70%">
                Account name and PIN are not saved on any server, <strong>only on your own device.</strong>
            </Text>

            <Button variant="outline" w="100%" p={6} mb={4} borderColor="blue" onClick={handleGenerateWallet}>
                Generate wallet
            </Button>

            <Box>
                <FormControl variant="floating" id="account" my={6}>
                    <InputGroup size="lg">
                        <Input disabled placeholder=" " value={account} />
                        <InputRightAddon bgColor="transparent">
                            <Button
                                variant="outline"
                                borderColor="blue"
                                onClick={() => {
                                    navigator.clipboard.writeText(account) && handleCopyToast('Account');
                                }}>
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Account</FormLabel>
                </FormControl>

                <FormControl variant="floating" id="passphrase" my={6}>
                    <InputGroup size="lg">
                        <Textarea disabled placeholder=" " value={passphrase} resize="none" minH="80px" />
                        <InputRightAddon bgColor="transparent" minH="80px">
                            <Button
                                variant="outline"
                                borderColor="blue"
                                onClick={() => {
                                    navigator.clipboard.writeText(passphrase) && handleCopyToast('Passphrase');
                                }}>
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Passphrase</FormLabel>
                </FormControl>

                <Stack direction={{ base: 'column', lg: 'column' }}>
                    <FormControl variant="floating" id="name">
                        <Input placeholder=" " value={name} size="lg" onChange={handleChangeName} />
                        <FormLabel>Name</FormLabel>
                        <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
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
                            size={'lg'}
                            p={4}
                            bgColor="blue"
                            textColor="white"
                            fontWeight="bold"
                            onClick={handleSaveWallet}>
                            SAVE
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default UserRegister;

/*
<FormControl variant="floating" id="pin">
    <Input placeholder=" " value={pin} size="lg" onChange={handleChangePin}/>
    <FormLabel>PIN</FormLabel>
    <FormHelperText textAlign="center">Used to access easily.</FormHelperText>
</FormControl>
*/
