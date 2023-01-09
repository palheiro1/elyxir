import { Box, Center, Stack, StackDivider, Text } from "@chakra-ui/react";

// Components
import BlockInfo from "./BlockInfo";
import Countdown from "./Countdown";


const Jackpot = () => {
    return (
        <Box alignContent="center">
            
            <Text mb={4} fontSize="2xl" textAlign="center" fontWeight="bolder">Jackpot</Text>
            <Center>
                <Stack bg="#1A273D" rounded="lg" p={4} direction="row" divider={<StackDivider borderColor='blue.800' />}>
                    <Countdown />
                    
                    <BlockInfo />
                </Stack>
            </Center>
        </Box>
    )

}

export default Jackpot;