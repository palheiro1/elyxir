import { HStack, IconButton, PinInput, PinInputField, Select, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { decrypt, getAllUsers, getUser, removeFromAllUsers } from "../../../utils/storage";

import { ImCross } from "react-icons/im";

/**
 * This component is used to render the user login form
 * @name UserLogin
 * @description User login form component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} UserLogin component
 * @todo Add logic to check if the user is already logged in
 */
const UserLogin = ({ setInfoAccount }) => {

    const [ accounts, setAccounts ] = useState([]); // list of accounts

    const [ user, setUser ] = useState(); // username
    const handleSelectUser = (e) => {
        setUser(e.target.value);
    }
        

    const handleCompletePin = (value) => {
        isInvalidPin && setIsInvalidPin(false); // reset invalid pin flag
        handleLogin(value);
    }
        
    const [ isInvalidPin, setIsInvalidPin ] = useState(false); // invalid pin flag
    const [ needReload, setNeedReload ] = useState(true); // reload flag

    useEffect(() => {
        const recoverUsers = () => {
            setNeedReload(false);
            const users = getAllUsers();
            setAccounts(users);
            if(users.length > 0) setUser(users[0]);
        }
        
        needReload && recoverUsers();
    }, [needReload])

    const handleLogin = (pin) => {
        const recoverUser = getUser(user);
        const { token } = recoverUser;

        const data = decrypt(token, pin);
        if(!data) {
            setIsInvalidPin(true);
            return;
        }

        setInfoAccount(data);
    }

    const handleDeleteUser = () => {
        localStorage.removeItem(user.name);
        removeFromAllUsers(user);
        setNeedReload(true);
    }

    return(
        <Stack spacing={3} pt={4}>
            <HStack>
                <Select size="lg" w="59%" onChange={handleSelectUser} variant="filled">
                    {accounts.map((account) => (
                        <option key={account} value={account}>{account}</option>
                    ))}
                </Select>
                <IconButton p={6} icon={<ImCross />} onClick={handleDeleteUser} />
            </HStack>

            <HStack spacing={6}>
                <PinInput size="lg"
                placeholder='🔒'
                onComplete={handleCompletePin}
                isInvalid={isInvalidPin}
                variant="filled"
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