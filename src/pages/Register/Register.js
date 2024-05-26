import { Box, Center, Heading, Image, Stack } from '@chakra-ui/react';
import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserRegister from '../../components/Pages/LoginPage/UserRegister/UserRegister';

const Register = () => {
    return (
        <Box px={8}>
            <Center>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={12} pt={8} align="center">
                    <Box w={{ base: '100%', lg: '60%' }}>
                        <LoginButtons showLogIn={true} showRestore={true} />

                        <Heading>
                            Welcome to <br /> <strong>Mythical Beings</strong>
                        </Heading>

                        <UserRegister />
                    </Box>

                    <Image src="images/criatures/login.png" w={{ base: '100%', lg: '50%' }} />
                </Stack>
            </Center>
        </Box>
    );
};

export default Register;
