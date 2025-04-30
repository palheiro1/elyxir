import { Button, Image, Stack } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

/**
 * This component is used to render Register and Restore buttons
 * @name LoginButtons
 * @param {boolean} showNewUser - Show the New User button
 * @param {boolean} showLogIn - Show the Log In button
 * @param {boolean} showRestore - Show the Restore button
 * @description Register and Restore buttons component.
 * @description This component is used to render the login page
 * @description Use navigate to change the page to the register or restore page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Register and Restore buttons component
 */
const LoginButtons = ({ showNewUser, showLogIn, showRestore, loginType, setLoginType }) => {
    const navigate = useNavigate();
    const handleNewUser = () => navigate('/register');
    const handleRestoreUser = () => navigate('/restore');
    const handleLogin = () => navigate('/login');

    return (
        <Stack direction={'row'} spacing={2} mt={8}>
            {showNewUser && (
                <Button w="100%" onClick={handleNewUser}>
                    Create
                </Button>
            )}

            {showLogIn && (
                <Button w="100%" onClick={handleLogin}>
                    Log in
                </Button>
            )}

            {showRestore && (
                <Button w="100%" onClick={handleRestoreUser}>
                    Restore
                </Button>
            )}

            {loginType === 'normal' && (
                <Button
                    w="100%"
                    px={6}
                    onClick={() => setLoginType('sigbro')}
                    leftIcon={<Image src="/images/logos/sigbro.png" w="20px" />}>
                    Sigbro
                </Button>
            )}

            {loginType === 'sigbro' && (
                <Button rounded="none" w="100%" onClick={() => setLoginType('normal')}>
                    Legacy login
                </Button>
            )}
        </Stack>
    );
};

export default LoginButtons;
