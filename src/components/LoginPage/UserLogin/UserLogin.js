import { HStack, Input, PinInput, PinInputField, Stack } from "@chakra-ui/react"

/**
 * This component is used to render the user login form
 * @name UserLogin
 * @description User login form component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} UserLogin component
 * @todo Add logic to check if the user exists
 * @todo Add logic to check if the password is correct
 * @todo Add logic to check if the user is already logged in
 */
const UserLogin = () => {
    return(
        <Stack spacing={3} pt={4}>
            <Input placeholder='Login' size='lg' w="77%"/>
            <HStack spacing={12}>
                <PinInput size="lg" placeholder='🔒'>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                </PinInput>
            </HStack>
        </Stack>
    )
}

export default UserLogin