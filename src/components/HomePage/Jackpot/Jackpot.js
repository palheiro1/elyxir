import { Box, Center, Stack, Text } from "@chakra-ui/react";

// Components
import BlockInfo from "./BlockInfo";
import Countdown from "./Countdown";


const Jackpot = () => {
    return (
        <Box>
            <Text mb={4} fontSize="2xl">Jackpot</Text>
            <Center>
                <Stack bg="#1A273D" rounded="lg" p={4} direction="row">

                    <Countdown />

                    <BlockInfo />

                </Stack>
            </Center>
        </Box>
    )

}

export default Jackpot;