import { Button, Stack } from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

/**
 * This component is used to render Register and Restore buttons
 * @name LoginButtons
 * @description Register and Restore buttons component.
 * @description This component is used to render the login page
 * @description Use navigate to change the page to the register or restore page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @returns {JSX.Element} Register and Restore buttons component
 */
const LoginButtons = () => {

    const navigate = useNavigate()
    const handleNewUser = () => navigate("/register");
    const handleRestoreUser = () => navigate("/restore");

    return(
        <Stack direction={"row"} spacing={4} py={4}>
            <Button onClick={handleNewUser}>
                New user
            </Button>
            <Button onClick={handleRestoreUser}>
                Restore user
            </Button>
        </Stack>
    )
}

export default LoginButtons