import { Box } from "@chakra-ui/react"
import LateralMenu from "../../components/LateralMenu/LateralMenu"

/**
 * @name Home
 * @description Home page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the home page
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount }) => {
    return (
        <Box bg="whiteAlpha.100" m={8} p={4} rounded="lg">
            <LateralMenu/>
        </Box>
    )
}

export default Home