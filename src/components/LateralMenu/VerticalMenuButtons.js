import { Button, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

// Icons
import { BsReverseLayoutTextWindowReverse, BsClockHistory, BsArrowLeftRight } from 'react-icons/bs';
import { GiCardRandom, GiCutDiamond } from 'react-icons/gi';
import { AiOutlineLogout, AiOutlineSetting, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPackage } from 'react-icons/bi';

const VerticalMenuButtons = ({ setOption, option, handleLogout, widthBotones }) => {
    // ---------------------------------------------
    // ------------------ COLORS ------------------
    // ---------------------------------------------
    const isActive = index => index === option;
    const GetColor = (light, dark) => useColorModeValue(light, dark);

    const sBgActiveColor = GetColor('blackAlpha.900', '#FFFFFF');
    const sBgColor = GetColor('blackAlpha.600', '#282828');
    const sTextActiveColor = GetColor('white', 'black');
    const sTextColor = GetColor('white', 'white');
    const sIconColor = GetColor('white', '#F18000');
    const hoverChangeColor = GetColor('blackAlpha.700', 'whiteAlpha.300');

    const bgColor = index => (isActive(index) ? sBgActiveColor : sBgColor);
    const textColor = index => (isActive(index) ? sTextActiveColor : sTextColor);
    const iconColor = index => (isActive(index) ? sIconColor : 'white');
    const hoverColor = index => (isActive(index) ? null : hoverChangeColor);
    // ---------------------------------------------

    // ---------------------------------------------
    // ------------------ BUTTONS ------------------
    // ---------------------------------------------
    const buttons = [
        {
            icon: <BiPackage color={iconColor(7)} />,
            text: 'BUY PACK',
            onClick: () => setOption(7),
            bgColor: '#F18800',
            hoverBg: '#F18800',
            textColor: textColor(7),
            fontWeight: 'bolder',
        },
        {
            icon: (
                <BsReverseLayoutTextWindowReverse
                    style={{ stroke: iconColor(0), strokeWidth: '1' }}
                    color={iconColor(0)}
                />
            ),
            text: 'Overview',
            onClick: () => setOption(0),
            bgColor: bgColor(0),
            hoverBg: hoverColor(0),
            textColor: textColor(0),
        },
        {
            icon: <GiCardRandom style={{ stroke: iconColor(1), strokeWidth: '1' }} color={iconColor(1)} />,
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: bgColor(1),
            hoverBg: hoverColor(1),
            textColor: textColor(1),
        },
        {
            icon: <BsClockHistory style={{ stroke: iconColor(2), strokeWidth: '1' }} color={iconColor(2)} />,
            text: 'History',
            onClick: () => setOption(2),
            bgColor: bgColor(2),
            hoverBg: hoverColor(2),
            textColor: textColor(2),
        },
        {
            icon: <AiOutlineShoppingCart style={{ stroke: iconColor(3), strokeWidth: '1' }} color={iconColor(3)} />,
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: bgColor(3),
            hoverBg: hoverColor(3),
            textColor: textColor(3),
        },
        {
            icon: <BsArrowLeftRight style={{ stroke: iconColor(4), strokeWidth: '1' }} color={iconColor(4)} />,
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: bgColor(4),
            hoverBg: hoverColor(4),
            textColor: textColor(4),
        },
        {
            icon: <GiCutDiamond style={{ stroke: iconColor(5), strokeWidth: '1' }} color={iconColor(5)} />,
            text: 'Jackpot',
            onClick: () => setOption(5),
            bgColor: bgColor(5),
            hoverBg: hoverColor(5),
            textColor: textColor(5),
        },
        {
            icon: <AiOutlineSetting style={{ stroke: iconColor(6), strokeWidth: '1' }} color={iconColor(6)} />,
            text: 'Account',
            onClick: () => setOption(6),
            bgColor: bgColor(6),
            hoverBg: hoverColor(6),
            textColor: textColor(6),
        },
        {
            icon: <AiOutlineLogout />,
            text: 'Logout',
            onClick: handleLogout,
            bgColor: sBgColor,
            hoverBg: hoverColor(8),
            textColor: sTextColor,
        },
    ];

    // ---------------------------------------------

    return (
        <VStack align="flex-start" spacing={2} width={widthBotones}>
            {buttons.map(({ icon, text, onClick, bgColor, hoverBg, textColor, fontWeight }) => (
                <Button
                    key={text}
                    minW={widthBotones}
                    minH="50px"
                    _hover={{ background: hoverBg }}
                    bgColor={bgColor}
                    textColor={textColor}
                    onClick={onClick}>
                    <Stack direction="row" align="center" w="100%">
                        {icon}
                        <Text fontSize="sm" fontWeight={fontWeight}>
                            {text}
                        </Text>
                    </Stack>
                </Button>
            ))}
        </VStack>
    );
};

export default VerticalMenuButtons;
