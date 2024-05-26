import { Box, Center, Heading, Image, Stack } from '@chakra-ui/react';
import LoginButtons from '../../components/Pages/LoginPage/LoginButtons/LoginButtons';
import UserRestore from '../../components/Pages/LoginPage/UserRestore/UserRestore';

const Redeem = () => {
    return (
        <Box px={8}>
            <Center>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} pt={8} align="center">
                    <Box w="60%">
                        <LoginButtons showLogIn={true} showNewUser={true} />

                        <Heading>
                            Welcome to <br /> <strong>Mythical Beings</strong>
                        </Heading>

                        <UserRestore isRedeem />
                    </Box>

                    <Image src="images/criatures/login.png" w="40%" />
                </Stack>
            </Center>
        </Box>
    );
};

export default Redeem;
