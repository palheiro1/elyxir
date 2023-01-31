import { Button, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

// Icons
import { BsReverseLayoutTextWindowReverse, BsClockHistory, BsArrowLeftRight } from 'react-icons/bs';
import { GiCardRandom, GiCutDiamond } from 'react-icons/gi';
import { AiOutlineLogout, AiOutlineSetting, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPackage } from 'react-icons/bi';

const VerticalMenuButtons = ({ setOption, option, handleLogout, widthBotones }) => {
    const isActive = index => index === option;

    const sBgActiveColor = useColorModeValue('blackAlpha.900', '#FFFFFF');
    const sBgColor = useColorModeValue('blackAlpha.600', '#282828');

    const sTextActiveColor = useColorModeValue('white', 'black');
    const sTextColor = useColorModeValue('white', 'white');

    const sIconColor = useColorModeValue('white', '#F18000');

    const bgColor = index => (isActive(index) ? sBgActiveColor : sBgColor);
    const textColor = index => (isActive(index) ? sTextActiveColor : sTextColor);
    const iconColor = index => (isActive(index) ? sIconColor : 'white');

    return (
        <VStack align="flex-start" spacing={2} width={widthBotones}>
            <Button
                minW={widthBotones}
                minH="50px"
                bgColor="#F18800"
                _hover={{ background: '#F18000' }}
                _active={{ background: '#F18000' }}
                textColor={'white'}
                onClick={() => setOption(7)}>
                <Stack direction="row" align="center" w="100%">
                    <BiPackage color={iconColor(7)} />
                    <Text fontSize="sm" fontWeight="bolder">
                        BUY PACK
                    </Text>
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
                    <BsReverseLayoutTextWindowReverse
                        style={{ stroke: iconColor(0), strokeWidth: '1' }}
                        color={iconColor(0)}
                    />
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
                    <GiCardRandom style={{ stroke: iconColor(1), strokeWidth: '1' }} color={iconColor(1)} />
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
                    <BsClockHistory style={{ stroke: iconColor(2), strokeWidth: '1' }} color={iconColor(2)} />
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
                    <AiOutlineShoppingCart style={{ stroke: iconColor(3), strokeWidth: '1' }} color={iconColor(3)} />
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
                    <BsArrowLeftRight style={{ stroke: iconColor(4), strokeWidth: '1' }} color={iconColor(4)} />
                    <Text fontSize="sm">Bridge</Text>
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
                    <GiCutDiamond style={{ stroke: iconColor(5), strokeWidth: '1' }} color={iconColor(5)} />
                    <Text fontSize="sm">Jackpot</Text>
                </Stack>
            </Button>

            <Button
                minW={widthBotones}
                minH="50px"
                _hover={{ background: 'white.600' }}
                _active={{ background: 'white.600' }}
                bgColor={bgColor(6)}
                textColor={textColor(6)}
                onClick={() => setOption(6)}>
                <Stack direction="row" align="center" w="100%">
                    <AiOutlineSetting style={{ stroke: iconColor(6), strokeWidth: '1' }} color={iconColor(6)} />
                    <Text fontSize="sm">Account</Text>
                </Stack>
            </Button>

            <Button
                minW={widthBotones}
                minH="50px"
                _hover={{ background: 'white.600' }}
                _active={{ background: 'white.600' }}
                bgColor={bgColor(8)}
                textColor={textColor(8)}
                onClick={handleLogout}>
                <Stack direction="row" align="center" w="100%">
                    <AiOutlineLogout style={{ stroke: iconColor(8), strokeWidth: '1' }} color={iconColor(8)} />
                    <Text fontSize="sm">Logout</Text>
                </Stack>
            </Button>
        </VStack>
    );
};

export default VerticalMenuButtons;
