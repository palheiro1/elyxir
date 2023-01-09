import {
    Box,
    Button,
    Stack,
    Switch,
    Text,
    VStack,
} from '@chakra-ui/react';

import {
    BsReverseLayoutTextWindowReverse,
    BsClockHistory,
} from 'react-icons/bs';

import { GiCardRandom, GiCutDiamond } from 'react-icons/gi';
import { AiOutlineSetting, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPackage } from 'react-icons/bi';

const LateralMenu = ({ children }) => {
    const isActive = true;
    const bgColor = isActive && 'white';
    const textColor = isActive ? 'black' : 'white';
    const iconColor = isActive ? 'blue' : 'white';

    return (
        <Stack direction="row">
            <Box mr={8}>
                <Stack direction="column">
                    <Text
                        fontSize="xl"
                        ml={2}
                        mr={4}
                        mb={4}
                        textAlign="center"
                        fontWeight="bold"
                    >
                        My Wallet
                    </Text>

                    <Box></Box>
                </Stack>
                <VStack align="flex-start">
                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={
                            <BsReverseLayoutTextWindowReverse
                                size={17.5}
                                color={iconColor}
                            />
                        }
                        bgColor={bgColor}
                        textColor={textColor}
                    >
                        Overview
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<GiCardRandom />}
                    >
                        Inventory
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<BsClockHistory />}
                    >
                        History
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<AiOutlineShoppingCart />}
                    >
                        Market
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<GiCutDiamond />}
                    >
                        Jackpot
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<AiOutlineSetting />}
                    >
                        Account
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        bgColor="orange.600"
                        leftIcon={<BiPackage />}
                    >
                        Buy pack
                    </Button>
                </VStack>
                <Stack p={2} align="center" pt={8} >
                    <Text fontWeight="bold">Show all cards</Text>
                    <Switch size="md" colorScheme="blue" />
                </Stack>
            </Box>
            <Box width="100%">{children}</Box>
        </Stack>
    );
};

export default LateralMenu;
