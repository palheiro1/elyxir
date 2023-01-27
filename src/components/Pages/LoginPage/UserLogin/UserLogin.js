import { HStack, IconButton, PinInput, PinInputField, Select, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getAllUsers, setNotFirstTime } from '../../../../utils/storage';
import ConfirmDialog from '../../../Modals/ConfirmDialog/ConfirmDialog';
import { ImCross } from 'react-icons/im';

import { useNavigate } from 'react-router-dom';
import { checkPin } from '../../../../utils/walletUtils';
import { backupToast } from '../../../../utils/alerts';

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
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const reference = useRef();

    const [accounts, setAccounts] = useState([]); // list of accounts

    const [user, setUser] = useState(); // username
    const handleSelectUser = e => {
        setUser(e.target.value);
    };

    const handleCompletePin = value => {
        isInvalidPin && setIsInvalidPin(false); // reset invalid pin flag
        handleLogin(value);
    };

    const [isInvalidPin, setIsInvalidPin] = useState(false); // invalid pin flag
    const [needReload, setNeedReload] = useState(true); // reload flag

    let activeToast = false;

    useEffect(() => {
        const recoverUsers = () => {
            setNeedReload(false);
            const users = getAllUsers();
            setAccounts(users);
            if (users.length > 0) setUser(users[0]);
        };

        needReload && recoverUsers();
    }, [needReload]);

    const handleLogin = pin => {
        const account = checkPin(user, pin, false);
        if (!account) {
            setIsInvalidPin(true);
            return;
        }

        setInfoAccount(account);

        if (account.firstTime) {
            navigate('/welcome');
            setNotFirstTime(user);
        } else {
            navigate('/home');
            // Alerta de backup
            if (!account.backupDone && !activeToast) {
                backupToast(toast);
                activeToast = true;
            }
        }
    };

    return (
        <Stack spacing={3} pt={4}>
            <HStack>
                <Select size="lg" w="66%" onChange={handleSelectUser} variant="filled">
                    {accounts.map(account => (
                        <option key={account} value={account}>
                            {account}
                        </option>
                    ))}
                </Select>
                {accounts.length > 0 && <IconButton p={6} icon={<ImCross />} onClick={onOpen} />}
            </HStack>

            <ConfirmDialog
                reference={reference}
                isOpen={isOpen}
                onClose={onClose}
                setNeedReload={setNeedReload}
                user={user}
            />

            <HStack spacing={7}>
                <PinInput
                    size="lg"
                    placeholder="🔒"
                    onChange={handleCompletePin}
                    isInvalid={isInvalidPin}
                    variant="filled"
                    mask>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                </PinInput>
            </HStack>
        </Stack>
    );
};

export default UserLogin;
