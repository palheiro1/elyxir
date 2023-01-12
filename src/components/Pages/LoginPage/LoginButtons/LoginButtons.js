import { Button, Stack } from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

/**
 * This component is used to render Register and Restore buttons
 * @name LoginButtons
 * @param {boolean} showNewUser - Show the New User button
 * @param {boolean} showLogIn - Show the Log In button
 * @param {boolean} showRestore - Show the Restore button
 * @description Register and Restore buttons component.
 * @description This component is used to render the login page
 * @description Use navigate to change the page to the register or restore page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Register and Restore buttons component
 */
const LoginButtons = ({ showNewUser, showLogIn, showRestore }) => {

    const navigate = useNavigate()
    const handleNewUser = () => navigate("/register");
    const handleRestoreUser = () => navigate("/restore");
    const handleLogin = () => navigate("/login");


    return(
        <Stack direction={"row"} spacing={4} mb={4}>

            {showNewUser && (
                <Button onClick={handleNewUser}>
                    New user
                </Button>
            )}

            {showLogIn && (
                <Button onClick={handleLogin}>
                    Log in
                </Button>
            )}

            {showRestore && (
                <Button onClick={handleRestoreUser}>
                    Restore user
                </Button>
            )}

        </Stack>
    )
}

export default LoginButtons