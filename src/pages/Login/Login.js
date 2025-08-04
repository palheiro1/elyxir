import { useState } from 'react';
import { Box, Heading, Image, Stack, Center, Button, Text } from '@chakra-ui/react';

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
        <Box px={8} mb={4}>
            <Center>
                <Stack direction={{ base: 'column' }} spacing={8} pt={8} align="center" w={'100%'}>
                    <Image
                        src="images/logos/s8.png"
                        h={{ base: '100%', lg: '20%' }}
                        w={{ base: '100%', md: '40%', lg: '30%', xl: '17%' }}
                    />

                    <Box w={{ base: '90%', md: '60%', lg: '40%', xl: '30%' }}>
                        <Heading textAlign={'center'}>
                            Welcome to <br />
                            <strong>Mythical Beings</strong>
                        </Heading>
                        <Text textAlign={'center'} fontSize={'sm'}>
                            SEASON 08
                        </Text>

                        <LoginButtons
                            showNewUser={true}
                            showRestore={true}
                            loginType={loginType}
                            setLoginType={setLoginType}
                        />

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
                </Stack>
            </Center>
        </Box>
    );
};

export default Login;
