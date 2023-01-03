import { HStack, PinInput, PinInputField, Select, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { decrypt, encrypt, getAllUsers, getUser } from "../../../utils/storage";

/**
 * This component is used to render the user login form
 * @name UserLogin
 * @description User login form component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} UserLogin component
 * @todo Add logic to check if the user exists
 * @todo Add logic to check if the password is correct
 * @todo Add logic to check if the user is already logged in
 */
const UserLogin = () => {

    const [ accounts, setAccounts ] = useState([]); // list of accounts

    const [ user, setUser ] = useState(); // username
    const handleSelectUser = (value) => setUser(value);

    const [ userPin, setUserPin ] = useState(); // user pin
    const handleCompletePin = (value) => {
        setUserPin(value);
        handleLogin(value);
    }

    useEffect(() => {
        const recoverUsers = () => {
            const users = getAllUsers();
            setAccounts(users);
            if(users.length > 0) 
                setUser(users[0]);
        }
        
        recoverUsers();
    }, [])

    const test = encrypt("connection kid sentence almost game greet grant planet perfect glove math came", "1234");
    console.log("🚀 ~ file: UserLogin.js:43 ~ handleLogin ~ test", test)

    const handleLogin = (pin) => {
        const recoverUser = getUser(user);
        
        const { token } = recoverUser;
        console.log("🚀 ~ file: UserLogin.js:43 ~ handleLogin ~ token", token)
        const decryptedPin = decrypt(token, pin);
        console.log("🚀 ~ file: UserLogin.js:42 ~ handleLogin ~ decryptedPin", decryptedPin)
    }

    return(
        <Stack spacing={3} pt={4}>
            <Select size="lg"  w="77%" bgColor="CaptionText" onChange={handleSelectUser}>
                {accounts.map((account) => (
                    <option key={account} value={account}>{account}</option>
                ))}
            </Select>

            <HStack spacing={12}>
                <PinInput size="lg" placeholder='🔒' mask onComplete={handleCompletePin} value={userPin}>
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