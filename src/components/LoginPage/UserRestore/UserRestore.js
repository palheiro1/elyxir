import { Box, Button, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightAddon, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const UserRestore = () => {

    const [ name, setName ] = useState("");
    const [ account, setAccount ] = useState("");

    return(
        <Box>
            <Text my={4} mb={8} maxW="70%">
                Account name and PIN are not saved on any server, <strong>only on your own device.</strong>
            </Text>

            <Stack direction={'row'}>
                <FormControl variant="floating" id="name">
                    <Input placeholder=" " value={name} size="lg"/>
                    <FormLabel>Name</FormLabel>
                    <FormHelperText textAlign="center">Used to identify you on this device</FormHelperText>
                </FormControl>

                <FormControl variant="floating" id="pin">
                    <Input placeholder=" " value={account} size="lg"/>
                    <FormLabel>Account</FormLabel>
                    <FormHelperText textAlign="center">Ardor Account ID</FormHelperText>
                </FormControl>
            </Stack>

            <FormControl variant="floating" id="account" my={6}>
                <Input placeholder=" " minH="100px" />
                <FormLabel>Passphrase</FormLabel>
            </FormControl>

            <Stack direction={'row'}>
                <FormControl variant="floating" id="name">
                    <Input placeholder=" " value={name} size="lg"/>
                    <FormLabel>PIN</FormLabel>
                    <FormHelperText textAlign="center">Used to access easily</FormHelperText>
                </FormControl>

                <Button w="100%" p={6} mb={4} bgColor="blue" fontWeight="bolder">
                    RESTORE
                </Button>
            </Stack>
        </Box>
    )
}

export default UserRestore;