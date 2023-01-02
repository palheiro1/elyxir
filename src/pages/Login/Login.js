import { Button, Box, Heading, Image, Stack, Center, Input } from "@chakra-ui/react"

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
                        <Stack direction={"row"} spacing={4} py={4}>
                            <Button>
                                New user
                            </Button>
                            <Button>
                                Restore user
                            </Button>
                        </Stack>
                        <Heading>
                            Welcome to the Tarasca<br/> Trading Card Game
                        </Heading>

                        <Stack spacing={3} pt={4}>
                            <Input placeholder='Login' size='lg' />
                            <Input placeholder='PIN' size='lg' />
                            <Button size="lg" fontWeight="bold" bgColor="blue" color="white">LOGIN NOW</Button>
                        </Stack>
                    </Box>

                    <Image src="images/criatures/login.png" w="40%"/>
                </Stack>
            </Center>
        </Box>
    )
}

export default Login