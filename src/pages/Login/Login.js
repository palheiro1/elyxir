import { Box, Heading, Image, Stack, Center } from "@chakra-ui/react"
import LoginButtons from "../../components/LoginPage/LoginButtons/LoginButtons"
import UserLogin from "../../components/LoginPage/UserLogin/UserLogin"

/**
 * This component is used to render the login page
 * @name Login
 * @description Login page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Login component
 */
const Login = () => {
    return(
        <Box px={8}>
            <Center>
                <Stack direction={"row"} spacing={4} pt={8} align="center">
                    <Box w="60%">
                        <LoginButtons showNewUser={true} showRestore={true} />

                        <Heading>
                            Welcome to the Tarasca<br/> Trading Card Game
                        </Heading>
                        
                        <UserLogin/>
                    </Box>

                    <Image src="images/criatures/login.png" w="40%"/>
                </Stack>
            </Center>
        </Box>
    )
}

export default Login