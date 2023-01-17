import { Box, Button, Stack, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { BsReverseLayoutTextWindowReverse, BsClockHistory } from 'react-icons/bs';

import { GiCardRandom, GiCutDiamond } from 'react-icons/gi';
import { AiOutlineSetting, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPackage } from 'react-icons/bi';


/**
 * @name LateralMenu
 * @description Component that shows the lateral menu of the app
 * @param {Number} option - Option selected
 * @param {Function} setOption - Function to set the option
 * @param {JSX.Element} children - Components to show in the main section
 * @param {Boolean} showAllCards - Boolean to show all cards
 * @param {Function} handleShowAllCards - Function to handle the show all cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const LateralMenu = ({ option = 0, setOption, children, showAllCards, handleShowAllCards }) => {
    const isActive = index => {
        return index === option;
    };

    const sBgActiveColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.800');
    const sBgColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.100');

    const sTextActiveColor = useColorModeValue('white', 'black');
    const sTextColor = useColorModeValue('white', 'white');

    const sIconColor = useColorModeValue('white', 'blue');

    const bgColor = index => (isActive(index) ? sBgActiveColor : sBgColor);
    const textColor = index => (isActive(index) ? sTextActiveColor : sTextColor);
    const iconColor = index => (isActive(index) ? sIconColor : 'white');

    return (
        <Stack direction="row">
            <Box>
                <Stack direction="column">
                    <Text fontSize="2xl" textAlign="center" fontWeight="bold" mb={2}>
                        My Wallet
                    </Text>
                </Stack>
                <VStack align="flex-start" spacing={2}>
                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<BsReverseLayoutTextWindowReverse size={17.5} color={iconColor(0)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(0)}
                        textColor={textColor(0)}
                        onClick={() => setOption(0)}>
                        Overview
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<GiCardRandom size={17.5} color={iconColor(1)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(1)}
                        textColor={textColor(1)}
                        onClick={() => setOption(1)}>
                        Inventory
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<BsClockHistory size={17.5} color={iconColor(2)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(2)}
                        textColor={textColor(2)}
                        onClick={() => setOption(2)}>
                        History
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<AiOutlineShoppingCart size={17.5} color={iconColor(3)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(3)}
                        textColor={textColor(3)}
                        onClick={() => setOption(3)}>
                        Market
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<GiCutDiamond size={17.5} color={iconColor(4)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(4)}
                        textColor={textColor(4)}
                        onClick={() => setOption(4)}>
                        Jackpot
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        leftIcon={<AiOutlineSetting size={17.5} color={iconColor(5)} />}
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(5)}
                        textColor={textColor(5)}
                        onClick={() => setOption(5)}>
                        Account
                    </Button>

                    <Button
                        minW="150px"
                        minH="50px"
                        bgColor="orange.600"
                        leftIcon={<BiPackage size={17.5} color={iconColor(6)} />}
                        _hover={{ background: 'orange.700' }}
                        _active={{ background: 'orange.700' }}
                        textColor={'white'}
                        onClick={() => setOption(6)}>
                        Buy pack
                    </Button>
                </VStack>
                <Stack p={2} align="center" pt={8}>
                    <Text fontWeight="bold">Show all cards</Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} size="lg" colorScheme="blue" />
                </Stack>
            </Box>
            <Box width="100%" p={2}>
                {children}
            </Box>
        </Stack>
    );
};

export default LateralMenu;
