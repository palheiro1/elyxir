import { useState } from 'react';
import { Box, Heading, Image, Stack, Center, Button } from '@chakra-ui/react';

import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserLogin from '../../components/Pages/LoginPage/UserLogin/UserLogin';
import SigBroLogin from '../../components/Pages/LoginPage/UserLogin/SigBroLogin';

/**
 * This component is used to render the login page
 * @name Login
 * @description Login page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Login component
 */
const Login = ({ setInfoAccount }) => {
    const [loginType, setLoginType] = useState('normal');

    return (
        <Box px={8}>
            <Center>
                <Stack direction={'row'} spacing={4} pt={8} align="center">
                    <Box w={['100%', '100%', '60%', '60%']} p={4}>
                        <LoginButtons showNewUser={true} showRestore={true} />

                        <Heading>
                            Welcome to the Tarasca
                            <br /> Trading Card Game
                        </Heading>

                        {loginType === 'normal' && <UserLogin setInfoAccount={setInfoAccount} />}
                        {loginType === 'sigbro' && <SigBroLogin setInfoAccount={setInfoAccount} />}

                        <Box my={6}>
                            {loginType === 'normal' && (
                                <Button w="100%" onClick={() => setLoginType('sigbro')}>
                                    Login with SigBro
                                </Button>
                            )}
                            {loginType === 'sigbro' && (
                                <Button w="100%" onClick={() => setLoginType('normal')}>
                                    Login with normal account
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Image src="images/criatures/login.png" w="50%" p={4} />
                </Stack>
            </Center>
        </Box>
    );
};

export default Login;
