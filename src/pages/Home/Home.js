import { Box } from "@chakra-ui/react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Jackpot from "../../components/HomePage/Jackpot/Jackpot"
import SimpleSidebar from "../../components/SideBar/SideBar"

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
            <SimpleSidebar children={<Jackpot/>} />

            
        </Box>
    )
}

export default Home