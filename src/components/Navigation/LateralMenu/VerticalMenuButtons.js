import { Box, Button, Image, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { IS_BOUNTY_ENABLED } from '../../../data/CONSTANTS';
import { useNavigate } from 'react-router-dom';

const VerticalMenuButtons = ({ setOption, option, handleLogout, widthBotones, cardsLoaded }) => {
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
    const navigate = useNavigate();
    const buttons = [
        {
            icon: !isActive(12)
                ? '/images/icons/menu/blanco/battlegrounds.svg'
                : '/images/icons/menu/color/battlegrounds.svg',
            onClick: () => navigate('/battlegrounds'),
            hoverBg: 'rgba(220, 48, 235, 0.75)',
            bgColor: isActive(12) ? 'white' : '#DC30EB',
            textColor: isActive(12) ? '#DC30EB' : 'white',
            fontWeight: isActive(12) ? 'bolder' : 'normal',
            isActive: isActive(12),
            isLoading: !cardsLoaded,
        },
        {
            icon: '/images/icons/menu/BuyPack.png',
            text: 'Buy pack',
            onClick: () => setOption(7),
            hoverBg: 'rgba(182, 13, 196, 0.75)',
            bgColor: '#B60DC4',
            textColor: textColor(7),
            isDisabled: false,
        },
        {
            icon: '/images/icons/menu/OpenPack.png',
            text: 'Open pack',
            onClick: () => setOption(11),
            hoverBg: 'rgba(142, 5, 154, 0.75)',
            bgColor: '#8E059A',
            textColor: textColor(11),
        },
        {
            icon: !isActive(0) ? '/images/icons/menu/blanco/overview.png' : '/images/icons/menu/color/overview.jpg',
            text: 'Overview',
            onClick: () => setOption(0),
            bgColor: isActive(0) ? 'white' : '#DE8311',
            hoverBg: 'rgba(222, 131, 17, 0.75)',
            textColor: isActive(0) ? '#DE8311' : 'white',
            fontWeight: isActive(0) ? 'bolder' : 'normal',
            isActive: isActive(0),
        },
        {
            icon: !isActive(1) ? '/images/icons/menu/blanco/inventory.png' : '/images/icons/menu/color/inventory.jpg',
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#E1632C',
            hoverBg: 'rgba(225, 99, 44, 0.75)',
            textColor: isActive(1) ? '#E1632C' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
            isActive: isActive(1),
        },
        {
            icon: !isActive(2) ? '/images/icons/menu/blanco/history.png' : '/images/icons/menu/color/history.jpg',
            text: 'History',
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#E25339',
            hoverBg: 'rgba(226, 83, 57, 0.75)',
            textColor: isActive(2) ? '#E25339' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
            isActive: isActive(2),
        },
        {
            icon: !isActive(3) ? '/images/icons/menu/blanco/market.png' : '/images/icons/menu/color/market.jpg',
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#E43E4A',
            hoverBg: 'rgba(228, 62, 74, 0.75)',
            textColor: isActive(3) ? '#E43E4A' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
            isActive: isActive(3),
        },
        {
            icon: !isActive(5) ? '/images/icons/menu/blanco/bounty.png' : '/images/icons/menu/color/bounty.jpg',
            text: 'Bounty',
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#E53055',
            hoverBg: 'rgba(229, 48, 85, 0.75)',
            textColor: isActive(5) ? '#E53055' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
            isActive: isActive(5),
            isDisabled: !IS_BOUNTY_ENABLED,
        },
        {
            icon: !isActive(9) ? '/images/icons/menu/blanco/messages.png' : '/images/icons/menu/color/messages.jpg',
            text: 'Messages',
            onClick: () => setOption(9),
            bgColor: isActive(9) ? 'white' : '#C6335C',
            hoverBg: 'rgba(198, 51, 92, 0.75)',
            textColor: isActive(9) ? '#C6335C' : 'white',
            fontWeight: isActive(9) ? 'bolder' : 'normal',
            isActive: isActive(9),
        },
        {
            icon: !isActive(10) ? '/images/icons/menu/blanco/book.png' : '/images/icons/menu/color/book.jpg',
            text: 'Book',
            onClick: () => setOption(10),
            bgColor: isActive(10) ? 'white' : '#B13262',
            hoverBg: 'rgba(177, 50, 98, 0.75)',
            textColor: isActive(10) ? '#B13262' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
            isActive: isActive(10),
        },
        {
            icon: !isActive(6) ? '/images/icons/menu/blanco/account.png' : '/images/icons/menu/color/account.jpg',
            text: 'Account',
            onClick: () => setOption(6),
            bgColor: isActive(6) ? 'white' : '#993169',
            hoverBg: 'rgba(153, 49, 105, 0.75)',
            textColor: isActive(6) ? '#993169' : 'white',
            fontWeight: isActive(6) ? 'bolder' : 'normal',
            isActive: isActive(6),
        },
        {
            icon: !isActive(4) ? '/images/icons/menu/blanco/bridge.png' : '/images/icons/menu/color/bridge.jpg',
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: isActive(4) ? 'white' : '#823070',
            hoverBg: 'rgba(130, 48, 112, 0.75)',
            textColor: isActive(4) ? '#823070' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
            isActive: isActive(4),
        },
        {
            icon: '/images/icons/menu/blanco/logout.png',
            text: 'Logout',
            onClick: handleLogout,
            bgColor: '#622E78',
            hoverBg: 'rgba(98, 46, 120, 0.75)',
            textColor: sTextColor,
        },
    ];

    // ---------------------------------------------

    return (
        <VStack align="flex-start" spacing={2} width={widthBotones}>
            {buttons.map(
                (
                    { icon, text, onClick, bgColor, hoverBg, textColor, fontWeight, isActive, isDisabled, isLoading },
                    index
                ) =>
                    !isDisabled && (
                        <Button
                            key={index}
                            minW={widthBotones}
                            minH="50px"
                            _hover={{ background: isActive ? bgColor : hoverBg, color: isActive ? undefined : 'white' }}
                            bgColor={bgColor}
                            textColor={textColor}
                            onClick={isLoading ? null : onClick}>
                            <Stack direction="row" align="center" w="100%">
                                {icon && text ? (
                                    <>
                                        <Box minW={'2rem'} ml={isActive ? -1 : 0} mr={isActive ? 1 : 0}>
                                            <Image src={icon} w={isActive ? '30px' : '25px'} />
                                        </Box>
                                        <Text fontSize="sm" fontWeight={fontWeight}>
                                            {text}
                                        </Text>
                                    </>
                                ) : (
                                    !text && (
                                        <Box mx={'auto'}>
                                            {isLoading ? <Spinner /> : <Image src={icon} w={'75px'} />}
                                        </Box>
                                    )
                                )}
                            </Stack>
                        </Button>
                    )
            )}
        </VStack>
    );
};

export default VerticalMenuButtons;
