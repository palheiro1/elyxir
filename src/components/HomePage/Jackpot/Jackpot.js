import { Center, HStack } from "@chakra-ui/react";

// Components
import BlockInfo from "./BlockInfo";
import Countdown from "./Countdown";


const Jackpot = () => {
    return (
        <Center>
            <HStack bg="#1A273D" rounded="lg" p={4}>

                <Countdown />

                <BlockInfo />

            </HStack>
        </Center>
    )

}

export default Jackpot;