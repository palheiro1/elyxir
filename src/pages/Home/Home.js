import { Box } from "@chakra-ui/react"
import { useEffect } from "react"
import LateralMenu from "../../components/LateralMenu/LateralMenu"
import { useNavigate } from "react-router-dom"

/**
 * @name Home
 * @description Home page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the home page
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount }) => {

    const navigate = useNavigate()

    useEffect(() => {
        if(infoAccount.token === null && infoAccount.accountRs === null)
            navigate("/login")

    }, [infoAccount, navigate])
    return (
        <Box bg="whiteAlpha.100" m={8} p={4} rounded="lg">
            <LateralMenu/>
        </Box>
    )
}

export default Home