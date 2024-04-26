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
                <Stack direction={'row'} spacing={4} pt={12} align="center">
                    <Box w={['100%', '100%', '60%', '60%']} p={4}>
                        <LoginButtons
                            showNewUser={true}
                            showRestore={true}
                            loginType={loginType}
                            setLoginType={setLoginType}
                        />

                        <Heading my={6}>
                            Welcome to <br />
                            Mythical Beings
                        </Heading>

                        {loginType === 'normal' && <UserLogin setInfoAccount={setInfoAccount} />}
                        {loginType === 'sigbro' && <SigBroLogin setInfoAccount={setInfoAccount} />}

                        <Button w="100%" mt={4} onClick={() => navigate('/redeem')} bgColor={"#EBB2B9"} _hover={{ bgColor: "#E8A5B3" }}>
                            Claim voucher
                        </Button>
                    </Box>

                    <Image src="images/criatures/login.png" w="50%" p={4} />
                </Stack>
            </Center>
        </Box>
    );
};

export default Login;
