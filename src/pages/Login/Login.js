import { Box, Heading, Image, Stack, Center, useColorModeValue } from '@chakra-ui/react';

import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserLogin from '../../components/Pages/LoginPage/UserLogin/UserLogin';

/**
 * This component is used to render the login page
 * @name Login
 * @description Login page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Login component
 */
const Login = ({ setInfoAccount }) => {
    const image = useColorModeValue('ElyxirColor.png', 'ElyxirColorBlack.png');
    return (
        <Box px={8} mb={4}>
            <Center>
                <Stack direction={{ base: 'column' }} spacing={8} pt={8} align="center" w={'100%'}>
                    <Heading textAlign="center">Welcome to</Heading>

                    <Image
                        src={`images/logos/${image}`}
                        h={{ base: '100%', lg: '20%' }}
                        w={{ base: '100%', md: '40%', lg: '40%', xl: '30%' }}
                    />

                    <Box w={{ base: '90%', md: '60%', lg: '40%', xl: '30%' }}>
                        <LoginButtons showNewUser={true} showRestore={true} />

                        <UserLogin setInfoAccount={setInfoAccount} />
                    </Box>
                </Stack>
            </Center>
        </Box>
    );
};

export default Login;
