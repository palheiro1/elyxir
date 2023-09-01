import { Button, Image, Stack, Text, VStack } from '@chakra-ui/react';

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
            icon: <Image src="/images/icons/menu/BuyPack.png" w="25px" />,
            text: 'Buy pack',
            onClick: () => setOption(7),
            hoverBg: 'rgba(159, 55, 114, 0.75)',
            bgColor: '#9f3772',
            textColor: textColor(7),
        },
        {
            icon: <Image src="/images/icons/menu/OpenPack.png" w="25px" />,
            text: 'Open pack',
            onClick: () => setOption(11),
            hoverBg: 'rgba(224, 148, 179, 0.75)',
            bgColor: '#e094b3',
            textColor: textColor(11),
        },
        {
            icon: !isActive(0) ? (
                <Image src="/images/icons/menu/blanco/overview.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/overview.jpg" w="30px" />
            ),
            text: 'Overview',
            onClick: () => setOption(0),
            bgColor: isActive(0) ? 'white' : '#2f9088',
            hoverBg: 'rgba(47, 144, 136, 0.75)',
            textColor: isActive(0) ? '#2f9088' : 'white',
            fontWeight: isActive(0) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(1) ? (
                <Image src="/images/icons/menu/blanco/inventory.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/inventory.jpg" w="30px" />
            ),
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#2f8190',
            hoverBg: 'rgba(47, 129, 144, 0.75)',
            textColor: isActive(1) ? '#2f8190' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(2) ? (
                <Image src="/images/icons/menu/blanco/history.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/history.jpg" w="30px" />
            ),
            text: 'History',
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#3b7197',
            hoverBg: 'rgba(59, 113, 151, 0.75)',
            textColor: isActive(2) ? '#3b7197' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(3) ? (
                <Image src="/images/icons/menu/blanco/market.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/market.jpg" w="30px" />
            ),
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#3b6497',
            hoverBg: 'rgba(59, 100, 151, 0.75)',
            textColor: isActive(3) ? '#3b6497' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(5) ? (
                <Image src="/images/icons/menu/blanco/jackpot.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/jackpot.jpg" w="30px" />
            ),
            text: 'Jackpot',
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#3b5397',
            hoverBg: 'rgba(59, 83, 151, 0.75)',
            textColor: isActive(5) ? '#3b5397' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(9) ? (
                <Image src="/images/icons/menu/blanco/messages.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/messages.jpg" w="30px" />
            ),
            text: 'Messages',
            onClick: () => setOption(9),
            bgColor: isActive(9) ? 'white' : '#3b4397',
            hoverBg: 'rgba(59, 67, 151, 0.75)',
            textColor: isActive(9) ? '#3b4397' : 'white',
            fontWeight: isActive(9) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(10) ? (
                <Image src="/images/icons/menu/blanco/book.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/book.jpg" w="30px" />
            ),
            text: 'Book',
            onClick: () => setOption(10),
            bgColor: isActive(10) ? 'white' : '#413b97',
            hoverBg: 'rgba(65, 59, 151, 0.75)',
            textColor: isActive(10) ? '#413b97' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(6) ? (
                <Image src="/images/icons/menu/blanco/account.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/account.jpg" w="30px" />
            ),
            text: 'Account',
            onClick: () => setOption(6),
            bgColor: isActive(6) ? 'white' : '#4e3b97',
            hoverBg: 'rgba(78, 59, 151 , 0.75)',
            textColor: isActive(6) ? '#4e3b97' : 'white',
            fontWeight: isActive(6) ? 'bolder' : 'normal',
        },
        {
            icon: !isActive(4) ? (
                <Image src="/images/icons/menu/blanco/bridge.png" w="25px" />
            ) : (
                <Image src="/images/icons/menu/color/bridge.jpg" w="30px" />
            ),
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: isActive(4) ? 'white' : '#573b97',
            hoverBg: 'rgba(87, 59, 151, 0.75)',
            textColor: isActive(4) ? '#573b97' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
        },
        {
            icon: <Image src="/images/icons/menu/blanco/logout.png" w="25px" />,
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
            {buttons.map(({ icon, text, onClick, bgColor, hoverBg, textColor, fontWeight }) => (
                <Button
                    key={text}
                    minW={widthBotones}
                    minH="50px"
                    _hover={{ background: hoverBg, color: 'white' }}
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
