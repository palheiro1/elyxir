import { HStack, PinInput, PinInputField, Select, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { decrypt, getAllUsers, getUser } from "../../../utils/storage";

/**
 * This component is used to render the user login form
 * @name UserLogin
 * @description User login form component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} UserLogin component
 * @todo Add logic to check if the user is already logged in
 */
const UserLogin = () => {

    const [ accounts, setAccounts ] = useState([]); // list of accounts

    const [ user, setUser ] = useState(); // username
    const handleSelectUser = (value) => setUser(value);

    const handleCompletePin = (value) => {
        isInvalidPin && setIsInvalidPin(false); // reset invalid pin flag
        handleLogin(value);
    }
        
    const [ isInvalidPin, setIsInvalidPin ] = useState(false); // invalid pin flag

    useEffect(() => {
        const recoverUsers = () => {
            const users = getAllUsers();
            setAccounts(users);
            if(users.length > 0) setUser(users[0]);
        }
        
        recoverUsers();
    }, [])

    const handleLogin = (pin) => {
        const recoverUser = getUser(user);
        const { token } = recoverUser;

        const data = decrypt(token, pin);
        if(!data) 
            setIsInvalidPin(true);
        
    }

    return(
        <Stack spacing={3} pt={4}>
            <Select size="lg"  w="77%" bgColor="CaptionText" onChange={handleSelectUser}>
                {accounts.map((account) => (
                    <option key={account} value={account}>{account}</option>
                ))}
            </Select>

            <HStack spacing={12}>
                <PinInput size="lg"
                placeholder='🔒'
                onComplete={handleCompletePin}
                isInvalid={isInvalidPin}
                mask
                >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                </PinInput>
            </HStack>
        </Stack>
    )
}

export default UserLogin