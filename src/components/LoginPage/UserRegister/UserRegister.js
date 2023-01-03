import { Box, Button, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightAddon, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const UserRegister = () => {

    const [ account, setAccount ] = useState("");
    const [ passphrase, setPassphrase ] = useState("");
    const [ name, setName ] = useState("");
    const [ pin, setPin ] = useState("");

    const handleGenerateWallet = () => {
        const { account, passphrase, name, pin } = null;
        setAccount(account);
        setPassphrase(passphrase);
        setName(name);
        setPin(pin);
    }

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
                            <Button variant="outline" borderColor="blue">
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Account</FormLabel>
                </FormControl>

                <FormControl variant="floating" id="passphrase" my={6}>
                    <InputGroup size="lg">
                        <Input disabled placeholder=" " value={passphrase} size="lg"/>
                        <InputRightAddon bgColor="transparent">
                            <Button variant="outline" borderColor="blue">
                                COPY
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                    <FormLabel>Passphrase</FormLabel>
                </FormControl>

                <Stack direction={'row'}>
                    <FormControl variant="floating" id="name">
                        <Input placeholder=" " value={name} size="lg"/>
                        <FormLabel>Name</FormLabel>
                        <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
                    </FormControl>

                    <FormControl variant="floating" id="pin">
                        <Input placeholder=" " value={pin} size="lg"/>
                        <FormLabel>PIN</FormLabel>
                        <FormHelperText textAlign="center">Used to access easily.</FormHelperText>
                    </FormControl>
                </Stack>
                <Button w="100%" p={4} mt={4} bgColor="blue">
                    Save account
                </Button>
            </Box>
        </Box>
    )
}

export default UserRegister;