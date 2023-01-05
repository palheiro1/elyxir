import { Box, HStack } from "@chakra-ui/react";
import Jackpot from "../Jackpot/Jackpot";
import LatestTransaction from "../LatestTransactions/LatestTransaction";

const Overview = () => {
    return (
        <Box>
            <Jackpot/>
            <HStack>
                <LatestTransaction/>
            </HStack>
        </Box>
    )
}

export default Overview;