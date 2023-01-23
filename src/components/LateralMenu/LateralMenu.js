import { Box, Button, Stack, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { BsReverseLayoutTextWindowReverse, BsClockHistory } from 'react-icons/bs';

import { GiCardRandom, GiCutDiamond } from 'react-icons/gi';
import { AiOutlineLogout, AiOutlineSetting, AiOutlineShoppingCart } from 'react-icons/ai';
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
const LateralMenu = ({ option = 0, setOption, children, showAllCards, handleShowAllCards, username, account, handleLogout }) => {

    const isActive = index => {
        return index === option;
    };

    const sBgActiveColor = useColorModeValue('blackAlpha.900', '#FFFFFF');
    const sBgColor = useColorModeValue('blackAlpha.600', '#282828');

    const sTextActiveColor = useColorModeValue('white', 'black');
    const sTextColor = useColorModeValue('white', 'white');

    const sIconColor = useColorModeValue('white', 'blue');

    const bgColor = index => (isActive(index) ? sBgActiveColor : sBgColor);
    const textColor = index => (isActive(index) ? sTextActiveColor : sTextColor);
    const iconColor = index => (isActive(index) ? sIconColor : 'white');

    if(!username || !account) return null;
    const splitAccount = account.slice(0, 5) + ' ... ' + account.slice(-5);

    const widthBotones = "130px";

    return (
        <Stack direction="row">
            <Box>
                <Stack direction="column" mb={4} maxW={widthBotones}>
                    <Text fontSize="xl" textAlign="center" fontWeight="bold">
                        {username}
                    </Text>
                    <Text fontSize="xs" textAlign="center" fontWeight="bold" mb={2}>
                        {splitAccount}
                    </Text>
                </Stack>
                <VStack align="flex-start" spacing={2}>
                    <Button
                        minW={widthBotones}
                        minH="50px"
                        bgColor="#F18800"
                        _hover={{ background: '#F18000' }}
                        _active={{ background: '#F18000' }}
                        textColor={'white'}
                        onClick={() => setOption(6)}>
                        <Stack direction="row" align="center" w="100%">
                            <BiPackage color={iconColor(6)} />
                            <Text fontSize="sm" fontWeight="bolder">BUY PACK</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(0)}
                        textColor={textColor(0)}
                        onClick={() => setOption(0)}>
                        <Stack direction="row" align="center" w="100%">
                            <BsReverseLayoutTextWindowReverse color={iconColor(0)} />
                            <Text fontSize="sm">Overview</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(1)}
                        textColor={textColor(1)}
                        onClick={() => setOption(1)}>
                        <Stack direction="row" align="center" w="100%">
                            <GiCardRandom color={iconColor(1)} />
                            <Text fontSize="sm">Inventory</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(2)}
                        textColor={textColor(2)}
                        onClick={() => setOption(2)}>
                        <Stack direction="row" align="center" w="100%">
                            <BsClockHistory color={iconColor(2)} />
                            <Text fontSize="sm">History</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(3)}
                        textColor={textColor(3)}
                        onClick={() => setOption(3)}>
                        <Stack direction="row" align="center" w="100%">
                            <AiOutlineShoppingCart color={iconColor(3)} />
                            <Text fontSize="sm">Market</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(4)}
                        textColor={textColor(4)}
                        onClick={() => setOption(4)}>
                        <Stack direction="row" align="center" w="100%">
                            <GiCutDiamond color={iconColor(4)} />
                            <Text fontSize="sm">Jackpot</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(5)}
                        textColor={textColor(5)}
                        onClick={() => setOption(5)}>
                        <Stack direction="row" align="center" w="100%">
                            <AiOutlineSetting color={iconColor(5)} />
                            <Text fontSize="sm">Account</Text>
                        </Stack>
                    </Button>

                    <Button
                        minW={widthBotones}
                        minH="50px"
                        _hover={{ background: 'white.600' }}
                        _active={{ background: 'white.600' }}
                        bgColor={bgColor(7)}
                        textColor={textColor(7)}
                        onClick={handleLogout}>
                        <Stack direction="row" align="center" w="100%">
                            <AiOutlineLogout color={iconColor(7)} />
                            <Text fontSize="sm">Logout</Text>
                        </Stack>
                    </Button>
                </VStack>
                <Stack p={2} align="center" pt={8}>
                    <Text fontWeight="bold" textAlign="center" fontSize="sm">Show all cards</Text>
                    <Switch isChecked={showAllCards} onChange={handleShowAllCards} colorScheme="blue" />
                </Stack>
            </Box>
            <Box width="100%" p={2}>
                {children}
            </Box>
        </Stack>
    );
};

export default LateralMenu;
