import { Box, Button, FormControl, FormHelperText, FormLabel, HStack, Input, PinInput, PinInputField, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { errorToast, okToast } from "../../../utils/alerts";
import { addToAllUsers, initUser } from "../../../utils/storage";
import { validatePassPhrase } from "../../../utils/validators";
import { useNavigate } from "react-router-dom";

const UserRestore = () => {

    const toast = useToast();
    const navigate = useNavigate();

    const [ name, setName ] = useState("");
    const [ account, setAccount ] = useState("");
    const [ passphrase, setPassphrase ] = useState("");
    const [ isValidPassphrase, setIsValidPassphrase ] = useState(false);
    const [ pin, setPin ] = useState("");

    const handleChangeName = (e) => setName(e.target.value);
    const handleChangeAccount = (e) => setAccount(e.target.value);
    const handleChangePin = (e) => setPin(e);
    const handleChangePassphrase = (e) => {
        const auxPassphrase = e.target.value;
        const validate = validatePassPhrase(auxPassphrase, account);

        if(validate.invalid) 
            setIsValidPassphrase(false);
        else
            setIsValidPassphrase(true);

        setPassphrase(auxPassphrase);
    }

    const handleRestoreWallet = () => {
        if(!name || !account || !passphrase || !pin) {
            errorToast("Please fill all fields", toast);
            return;
        }

        if(!isValidPassphrase) {
            errorToast("Invalid passphrase", toast);
            return;
        }

        const user = initUser(name, account, true, passphrase, pin);
        if(!user) {
            errorToast("Error creating user", toast);
            return;
        }

        // Save user in local storage
        localStorage.setItem(user.name, JSON.stringify(user));
        addToAllUsers(user);
        okToast("Wallet saved successfully", toast);
        navigate("/login");
    }

    return(
        <Box>
            <Text my={4} mb={8} maxW="70%">
                Account name and PIN are not saved on any server, <strong>only on your own device.</strong>
            </Text>

            <Stack direction={'row'}>
                <FormControl variant="floating" id="name">
                    <Input placeholder=" " value={name} size="lg" onChange={handleChangeName}/>
                    <FormLabel>Name</FormLabel>
                    <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
                </FormControl>

                <FormControl variant="floating" id="pin">
                    <Input placeholder=" " value={account} size="lg" onChange={handleChangeAccount} isInvalid={!isValidPassphrase} />
                    <FormLabel>Account</FormLabel>
                    <FormHelperText textAlign="center">Ardor Account ID</FormHelperText>
                </FormControl>
            </Stack>

            <FormControl variant="floating" id="account" my={6}>
                <Textarea placeholder=" " value={passphrase} onChange={handleChangePassphrase} isInvalid={!isValidPassphrase} />
                <FormLabel>Passphrase</FormLabel>
            </FormControl>

            <Stack direction={'row'}>
                <FormControl variant="floating" id="pin">
                    <HStack spacing={4}>
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

                <Button w="100%" p={6} mb={4} color="white" bgColor="blue" fontWeight="bolder" onClick={handleRestoreWallet}>
                    RESTORE
                </Button>
            </Stack>
        </Box>
    )
}

export default UserRestore;