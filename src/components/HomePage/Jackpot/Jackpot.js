import { Box, HStack } from "@chakra-ui/react";

// Components
import BlockInfo from "./BlockInfo";
import Countdown from "./Countdown";


const Jackpot = () => {
    return (
        <HStack align="flex-end" bg="#1A273D" rounded="lg" p={4}>

            <Countdown/>
            
            <BlockInfo/>

            <Box>
                Box 1
            </Box>
        </HStack>
    )

}

export default Jackpot;