import { Box, Button, HStack, Switch, Text, VStack } from "@chakra-ui/react"

import { BsReverseLayoutTextWindowReverse, BsClockHistory } from "react-icons/bs";
import { GiCardRandom, GiCutDiamond } from "react-icons/gi";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";

const LateralMenu = ({ children }) => {

    const isActive = true;
    const bgColor = isActive && "white";
    const textColor = isActive ? "black" : "white";
    const iconColor = isActive ? "blue" : "white";

    return (
        <HStack>
            <Box>
                <HStack>
                    <Text fontSize="xl" ml={2} mr={4}>
                        My Wallet
                    </Text>

                    <Box>
                        <HStack p={2}>
                            <Text>Show all cards</Text>
                            <Switch size="md" p={4} colorScheme="blue" />
                        </HStack>
                    </Box>
                </HStack>
                <VStack align="flex-start" ml={2}>

                    <Button minW="150px" minH="50px" leftIcon={<BsReverseLayoutTextWindowReverse size={17.5} color={iconColor} />} bgColor={bgColor} textColor={textColor}>
                        Overview
                    </Button>

                    <Button minW="150px" minH="50px" leftIcon={<GiCardRandom />}>
                        Inventory
                    </Button>

                    <Button minW="150px" minH="50px" leftIcon={<BsClockHistory />} >
                        History
                    </Button>

                    <Button minW="150px" minH="50px" leftIcon={<AiOutlineShoppingCart />} >
                        Market
                    </Button>

                    <Button minW="150px" minH="50px" leftIcon={<GiCutDiamond />}>
                        Jackpot
                    </Button>

                    <Button minW="150px" minH="50px" leftIcon={<AiOutlineSetting />}>
                        Account
                    </Button>

                    <Button minW="150px" minH="50px" bgColor="orange.600" leftIcon={<BiPackage />}>
                        Buy pack
                    </Button>
                </VStack>
            </Box>
            <Box>
                {children}
            </Box>
        </HStack>
    )
}

export default LateralMenu