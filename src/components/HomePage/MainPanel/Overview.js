import { Box, Stack } from "@chakra-ui/react";
import Jackpot from "../Jackpot/Jackpot";
import LatestTransaction from "../LatestTransactions/LatestTransaction";
import News from "../News/News";

const Overview = () => {
    return (
        <Box>
            <Jackpot/>
            <Stack direction="row">
                <Box m={4}>
                    <LatestTransaction/>
                </Box>
                <Box m={8}>
                    <News/>
                </Box>
            </Stack>
        </Box>
    )
}

export default Overview;