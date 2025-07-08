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
            icon: !isActive(0) ? '/images/icons/menu/blanco/overview.png' : '/images/icons/menu/color/overview.jpg',
            text: 'Overview',
            onClick: () => setOption(0),
            bgColor: isActive(0) ? 'white' : '#E5CF51',
            hoverBg: 'rgba(229, 207, 81, 0.75)',
            textColor: isActive(0) ? '#E5CF51' : 'white',
            fontWeight: isActive(0) ? 'bolder' : 'normal',
            isActive: isActive(0),
        },
        {
            icon: !isActive(12)
                ? '/images/icons/menu/blanco/battlegrounds.svg'
                : '/images/icons/menu/color/battlegrounds.svg',
            onClick: () => navigate('/battlegrounds'),
            hoverBg: 'rgba(190, 198, 113, 0.75)',
            bgColor: isActive(12) ? 'white' : '#BEC671',
            textColor: isActive(12) ? '#BEC671' : 'white',
            fontWeight: isActive(12) ? 'bolder' : 'normal',
            isActive: isActive(12),
            isLoading: !cardsLoaded,
        },
        {
            icon: '/images/icons/menu/BuyPack.png',
            text: 'Buy pack',
            onClick: () => setOption(7),
            hoverBg: 'rgba(132, 187, 164, 0.75)',
            bgColor: '#84BBA4',
            textColor: textColor(7),
            isDisabled: false,
        },
        {
            icon: '/images/icons/menu/OpenPack.png',
            text: 'Open pack',
            onClick: () => setOption(11),
            hoverBg: 'rgba(110, 178, 187, 0.75)',
            bgColor: '#6EB2BB',
            textColor: textColor(11),
        },
        {
            icon: !isActive(1) ? '/images/icons/menu/blanco/inventory.png' : '/images/icons/menu/color/inventory.jpg',
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#96A8B9',
            hoverBg: 'rgba(150, 168, 185, 0.75)',
            textColor: isActive(1) ? '#96A8B9' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
            isActive: isActive(1),
        },
        {
            icon: !isActive(2) ? '/images/icons/menu/blanco/history.png' : '/images/icons/menu/color/history.jpg',
            text: 'History',
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#CE99B4',
            hoverBg: 'rgba(206, 153, 180, 0.75)',
            textColor: isActive(2) ? '#CE99B4' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
            isActive: isActive(2),
        },
        {
            icon: !isActive(3) ? '/images/icons/menu/blanco/market.png' : '/images/icons/menu/color/market.jpg',
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#D688A6',
            hoverBg: 'rgba(214, 136, 166, 0.75)',
            textColor: isActive(3) ? '#D688A6' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
            isActive: isActive(3),
        },
        {
            icon: !isActive(5) ? '/images/icons/menu/blanco/bounty.png' : '/images/icons/menu/color/bounty.jpg',
            text: 'Bounty',
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#C76D8E',
            hoverBg: 'rgba(199, 109, 142, 0.75)',
            textColor: isActive(5) ? '#C76D8E' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
            isActive: isActive(5),
            isDisabled: !IS_BOUNTY_ENABLED,
        },
        {
            icon: !isActive(10) ? '/images/icons/menu/blanco/book.png' : '/images/icons/menu/color/book.jpg',
            text: 'Book',
            onClick: () => setOption(10),
            bgColor: isActive(10) ? 'white' : '#BA5779',
            hoverBg: 'rgba(186, 87, 121, 0.75)',
            textColor: isActive(10) ? '#BA5779' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
            isActive: isActive(10),
        },
        {
            icon: !isActive(4) ? '/images/icons/menu/blanco/bridge.png' : '/images/icons/menu/color/bridge.jpg',
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: isActive(4) ? 'white' : '#B2496C',
            hoverBg: 'rgba(178, 73, 108, 0.75)',
            textColor: isActive(4) ? '#B2496C' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
            isActive: isActive(4),
        },
    ];

    // ---------------------------------------------

    return (
        <VStack align="flex-start" spacing={2} width={widthBotones}>
            {buttons.map(
                (
                    {
                        icon,
                        text,
                        onClick,
                        bgColor,
                        hoverBg,
                        textColor,
                        fontWeight,
                        isActive,
                        isDisabled,
                        isLoading,
                        onlyMobile,
                    },
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
                            display={onlyMobile ? { base: 'flex', md: 'none' } : 'flex'}
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
