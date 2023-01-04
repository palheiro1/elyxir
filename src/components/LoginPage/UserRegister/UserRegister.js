import { Box, Button, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightAddon, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { generatePassphrase } from "../../../services/Ardor/generatePassphrase";
import { getAccountFromPhrase } from "../../../services/Ardor/ardorInterface";
import { initUser, registerOrUpdateUser } from "../../../utils/storage";
import { copyToast, errorToast, okToast } from "../../../utils/alerts";

/**
 * @description This component is used to render the user register form
 * @description Auto-generates a wallet and saves it in the local storage
 * @returns {JSX.Element} User register form
 * @name UserRegister
 * @author Jesús Sánchez Fernández
 * @version 0.1

 */
const UserRegister = () => {

    const toast = useToast();

    // Generated wallet
    const [ account, setAccount ] = useState("");
    const [ passphrase, setPassphrase ] = useState("");

    // Controlled inputs
    const [ name, setName ] = useState("");
    const handleChangeName = (e) => setName(e.target.value);

    const [ pin, setPin ] = useState("");
    const handleChangePin = (e) => setPin(e.target.value);

    const clearFormData = () => {
        setName("");
        setPin("");
        setAccount("");
        setPassphrase("");
    }

    const handleGenerateWallet = () => {
        const auxPassphrase = generatePassphrase();
        const auxAccount = getAccountFromPhrase(auxPassphrase);
        setAccount(auxAccount);
        setPassphrase(auxPassphrase);
    }

    const handleSaveWallet = () => {

        if(!name || !account || !passphrase || !pin) {
            errorToast("Please generate wallet and fill name and PIN", toast);
            return;
        }

        const user = initUser(name, account, true, passphrase, pin);

        registerOrUpdateUser(user).then(() => {
            okToast("User saved successfully", toast);
            clearFormData();
        }).catch(() => {
            errorToast("Error saving user", toast)
        });
    }

    const handleCopyToast = (text) => copyToast(text, toast);

    return(
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
                        <Input disabled placeholder=" " value={account}/>
                        <InputRightAddon bgColor="transparent">
                            <Button variant="outline" borderColor="blue" onClick={() => {handleCopyToast("Account") && navigator.clipboard.writeText(account)}}>
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Account</FormLabel>
                </FormControl>

                <FormControl variant="floating" id="passphrase" my={6}>
                    <InputGroup size="lg">
                        <Textarea disabled placeholder=" " value={passphrase} resize="none" />
                        <InputRightAddon bgColor="transparent">
                            <Button variant="outline" borderColor="blue" onClick={() => {handleCopyToast("Passphrase") && navigator.clipboard.writeText(passphrase)}}>
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Passphrase</FormLabel>
                </FormControl>

                <Stack direction={'row'}>
                    <FormControl variant="floating" id="name">
                        <Input placeholder=" " value={name} size="lg" onChange={handleChangeName}/>
                        <FormLabel>Name</FormLabel>
                        <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
                    </FormControl>

                    <FormControl variant="floating" id="pin">
                        <Input placeholder=" " value={pin} size="lg" onChange={handleChangePin}/>
                        <FormLabel>PIN</FormLabel>
                        <FormHelperText textAlign="center">Used to access easily.</FormHelperText>
                    </FormControl>
                </Stack>
                <Button w="100%" p={4} mt={6} bgColor="blue" textColor="white" fontWeight="bold" onClick={handleSaveWallet}>
                    Save account
                </Button>
            </Box>
        </Box>
    )
}

export default UserRegister;