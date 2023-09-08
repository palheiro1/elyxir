import { Box, Button, Image, Stack, Text, VStack } from '@chakra-ui/react';

const VerticalMenuButtons = ({ setOption, option, handleLogout, widthBotones }) => {
    // ---------------------------------------------
    // ------------------ COLORS ------------------
    // ---------------------------------------------
    const isActive = index => index === option;
    const sTextActiveColor = 'white';
    const sTextColor = 'white';

    const textColor = index => (isActive(index) ? sTextActiveColor : sTextColor);
    // ---------------------------------------------

    // ---------------------------------------------
    // ------------------ BUTTONS ------------------
    // ---------------------------------------------
    const buttons = [
        {
            icon: '/images/icons/menu/BuyPack.png',
            text: 'Buy pack',
            onClick: () => setOption(7),
            hoverBg: 'rgba(159, 55, 114, 0.75)',
            bgColor: '#9f3772',
            textColor: textColor(7),
        },
        {
            icon: '/images/icons/menu/OpenPack.png',
            text: 'Open pack',
            onClick: () => setOption(11),
            hoverBg: 'rgba(224, 148, 179, 0.75)',
            bgColor: '#e094b3',
            textColor: textColor(11),
        },
        {
            icon: !isActive(0) ? '/images/icons/menu/blanco/overview.png' : '/images/icons/menu/color/overview.jpg',
            text: 'Overview',
            onClick: () => setOption(0),
            bgColor: isActive(0) ? 'white' : '#2f9088',
            hoverBg: 'rgba(47, 144, 136, 0.75)',
            textColor: isActive(0) ? '#2f9088' : 'white',
            fontWeight: isActive(0) ? 'bolder' : 'normal',
            isActive: isActive(0),
        },
        {
            icon: !isActive(1) ? '/images/icons/menu/blanco/inventory.png' : '/images/icons/menu/color/inventory.jpg',
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#2f8190',
            hoverBg: 'rgba(47, 129, 144, 0.75)',
            textColor: isActive(1) ? '#2f8190' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
            isActive: isActive(1),
        },
        {
            icon: !isActive(2) ? '/images/icons/menu/blanco/history.png' : '/images/icons/menu/color/history.jpg',
            text: 'History',
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#3b7197',
            hoverBg: 'rgba(59, 113, 151, 0.75)',
            textColor: isActive(2) ? '#3b7197' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
            isActive: isActive(2),
        },
        {
            icon: !isActive(3) ? '/images/icons/menu/blanco/market.png' : '/images/icons/menu/color/market.jpg',
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#3b6497',
            hoverBg: 'rgba(59, 100, 151, 0.75)',
            textColor: isActive(3) ? '#3b6497' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
            isActive: isActive(3),
        },
        {
            icon: !isActive(5) ? '/images/icons/menu/blanco/jackpot.png' : '/images/icons/menu/color/jackpot.jpg',
            text: 'Jackpot',
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#3b5397',
            hoverBg: 'rgba(59, 83, 151, 0.75)',
            textColor: isActive(5) ? '#3b5397' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
            isActive: isActive(5),
        },
        {
            icon: !isActive(9) ? '/images/icons/menu/blanco/messages.png' : '/images/icons/menu/color/messages.jpg',
            text: 'Messages',
            onClick: () => setOption(9),
            bgColor: isActive(9) ? 'white' : '#3b4397',
            hoverBg: 'rgba(59, 67, 151, 0.75)',
            textColor: isActive(9) ? '#3b4397' : 'white',
            fontWeight: isActive(9) ? 'bolder' : 'normal',
            isActive: isActive(9),
        },
        {
            icon: !isActive(10) ? '/images/icons/menu/blanco/book.png' : '/images/icons/menu/color/book.jpg',
            text: 'Book',
            onClick: () => setOption(10),
            bgColor: isActive(10) ? 'white' : '#413b97',
            hoverBg: 'rgba(65, 59, 151, 0.75)',
            textColor: isActive(10) ? '#413b97' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
            isActive: isActive(10),
        },
        {
            icon: !isActive(6) ? '/images/icons/menu/blanco/account.png' : '/images/icons/menu/color/account.jpg',
            text: 'Account',
            onClick: () => setOption(6),
            bgColor: isActive(6) ? 'white' : '#4e3b97',
            hoverBg: 'rgba(78, 59, 151 , 0.75)',
            textColor: isActive(6) ? '#4e3b97' : 'white',
            fontWeight: isActive(6) ? 'bolder' : 'normal',
            isActive: isActive(6),
        },
        {
            icon: !isActive(4) ? '/images/icons/menu/blanco/bridge.png' : '/images/icons/menu/color/bridge.jpg',
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: isActive(4) ? 'white' : '#573b97',
            hoverBg: 'rgba(87, 59, 151, 0.75)',
            textColor: isActive(4) ? '#573b97' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
            isActive: isActive(4),
        },
        {
            icon: '/images/icons/menu/blanco/logout.png',
            text: 'Logout',
            onClick: handleLogout,
            bgColor: '#5d3b97',
            hoverBg: 'rgba(93, 59, 151, 0.75)',
            textColor: sTextColor,
        },
    ];

    // ---------------------------------------------

    return (
        <VStack align="flex-start" spacing={2} width={widthBotones}>
            {buttons.map(({ icon, text, onClick, bgColor, hoverBg, textColor, fontWeight, isActive }) => (
                <Button
                    key={text}
                    minW={widthBotones}
                    minH="50px"
                    _hover={{ background: hoverBg, color: 'white' }}
                    bgColor={bgColor}
                    textColor={textColor}
                    onClick={onClick}>
                    <Stack direction="row" align="center" w="100%">
                        <Box minW={"2rem"}>
                            <Image src={icon} w={isActive ? '30px' : '25px'} />
                        </Box>
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
