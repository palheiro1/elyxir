import { Box, Heading, Image, Stack, Center } from "@chakra-ui/react"
import LoginButtons from "../../components/Pages/LoginPage/LoginButtons/LoginButtons"
import UserLogin from "../../components/Pages/LoginPage/UserLogin/UserLogin"

/**
 * This component is used to render the login page
 * @name Login
 * @description Login page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Login component
 */
const Login = ({ setInfoAccount }) => {
    return(
        <Box px={8}>
            <Center>
                <Stack direction={"row"} spacing={4} pt={8} align="center">
                    <Box w={[ "100%", "100%", "60%", "60%" ]} p={4}>
                        <LoginButtons showNewUser={true} showRestore={true} />

                        <Heading>
                            Welcome to the Tarasca<br/> Trading Card Game
                        </Heading>
                        
                        <UserLogin setInfoAccount = {setInfoAccount} />
                    </Box>

                    <Image src="images/criatures/login.png" w="50%" p={4} />
                </Stack>
            </Center>
        </Box>
    )
}

export default Login