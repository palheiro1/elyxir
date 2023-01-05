import { Box } from "@chakra-ui/react"
//import { useState } from "react";
import LateralMenu from "../../LateralMenu/LateralMenu"
import Overview from "./Overview"

const MainPanel = () => {

    /*
    * 0 -> Overview
    * 1 -> Inventory
    * 2 -> History
    * 3 -> Market
    * 4 -> Jackpot
    * 5 -> Account
    * 6 -> Buy pack
    */
    //const [ active, setActive ] = useState(0);

    return (
        <Box bg="whiteAlpha.100" m={8} p={4} rounded="lg">
            <LateralMenu children={<Overview />} />
        </Box>
    )

}

export default MainPanel