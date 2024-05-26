import { useState } from 'react';
import { Box, Heading, Image, Stack, Center, Button } from '@chakra-ui/react';

import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserLogin from '../../components/Pages/LoginPage/UserLogin/UserLogin';
import SigBroLogin from '../../components/Pages/LoginPage/UserLogin/SigBroLogin';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    return (
        <Box px={8}>
            <Center>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={12} pt={8} align="center">
                    <Box w={{ base: '100%', lg: '60%' }}>
                        <LoginButtons
                            showNewUser={true}
                            showRestore={true}
                            loginType={loginType}
                            setLoginType={setLoginType}
                        />

                        <Heading>
                            Welcome to <br />
                            <strong>Mythical Beings</strong>
                        </Heading>

                        {loginType === 'normal' && <UserLogin setInfoAccount={setInfoAccount} />}
                        {loginType === 'sigbro' && <SigBroLogin setInfoAccount={setInfoAccount} />}

                        <Button
                            w="100%"
                            mt={4}
                            onClick={() => navigate('/redeem')}
                            bgColor={'#EBB2B9'}
                            _hover={{ bgColor: '#E8A5B3' }}
                            color="black">
                            Claim voucher
                        </Button>
                    </Box>

                    <Image src="images/criatures/login.png" w={{ base: '100%', lg: '50%' }} />
                </Stack>
            </Center>
        </Box>
    );
};

export default Login;
