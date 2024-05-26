import { Box, Center, Heading, Image, Stack } from '@chakra-ui/react';
import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserRestore from '../../components/Pages/LoginPage/UserRestore/UserRestore';

const Restore = () => {
    return (
        <Box px={8}>
            <Center>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={12} pt={8} align="center">
                    <Box w={{ base: '100%', lg: '60%' }}>
                        <LoginButtons showLogIn={true} showNewUser={true} />

                        <Heading>
                            Welcome to <br /> <strong>Mythical Beings</strong>
                        </Heading>

                        <UserRestore />
                    </Box>
                    
                    <Image src="images/criatures/login.png" w={{ base: '100%', lg: '50%' }} align={"center"} />
                </Stack>
            </Center>
        </Box>
    );
};

export default Restore;
