import { Box, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Overview from "../../components/HomePage/Overview"
import Inventory from "../../components/InventoryPage/Inventory"
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

    const navigate = useNavigate()

    useEffect(() => {
        if(infoAccount.token === null && infoAccount.accountRs === null)
            navigate("/login")

    }, [infoAccount, navigate])

    /*
    * 0 -> Overview
    * 1 -> Inventory
    * 2 -> History
    * 3 -> Market
    * 4 -> Jackpot
    * 5 -> Account
    * 6 -> Buy pack
    */
    const [ option, setOption ] = useState(0);
    const [ renderComponent, setRenderComponent ] = useState(<Overview />)

    useEffect(() => {
        switch(option) {
            case 0:
                setRenderComponent(<Overview />)
                break;
            case 1:
                setRenderComponent(<Inventory infoAccount={infoAccount} />)
                break;
            case 2:
                setRenderComponent(<Overview />)
                break;
            case 3:
                setRenderComponent(<Overview />)
                break;
            case 4:
                setRenderComponent(<Overview />)
                break;
            case 5:
                setRenderComponent(<Overview />)
                break;
            case 6:
                setRenderComponent(<Overview />)
                break;
            default:
                setRenderComponent(<Overview />)
                break;
        }
    }, [option, infoAccount])

    const bgColor = useColorModeValue("blackAlpha.200", "whiteAlpha.100")

    return (
        <Box bg={bgColor} m={4} p={8} rounded="lg">
            <LateralMenu option={option} setOption={setOption} children={renderComponent} />
        </Box>
    )
}

export default Home