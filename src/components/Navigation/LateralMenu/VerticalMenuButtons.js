import { Box, Button, Image, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { IS_BOUNTY_ENABLED } from '../../../data/CONSTANTS';
import { useNavigate } from 'react-router-dom';

const VerticalMenuButtons = ({ setOption, option, buttonsWidth, cardsLoaded }) => {
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
            bgColor: isActive(0) ? 'white' : '#7E9246',
            hoverBg: 'rgba(126, 146, 70, 0.75)',
            textColor: isActive(0) ? '#7E9246' : 'white',
            fontWeight: isActive(0) ? 'bolder' : 'normal',
            isActive: isActive(0),
        },
        {
            icon: !isActive(12)
                ? '/images/icons/menu/blanco/battlegrounds.svg'
                : '/images/icons/menu/color/battlegrounds.svg',
            onClick: () => navigate('/battlegrounds'),
            hoverBg: 'rgba(188, 199, 84, 0.75)',
            bgColor: isActive(12) ? 'white' : '#BCC754',
            textColor: isActive(12) ? '#BCC754' : 'white',
            fontWeight: isActive(12) ? 'bolder' : 'normal',
            isActive: isActive(12),
            isLoading: !cardsLoaded,
        },
        {
            icon: '/images/icons/menu/BuyPack.png',
            text: 'Buy pack',
            onClick: () => setOption(7),
            hoverBg: 'rgba(159, 55, 114, 0.75)',
            bgColor: '#9F3772',
            textColor: textColor(7),
            isDisabled: false,
        },
        {
            icon: '/images/icons/menu/OpenPack.png',
            text: 'Open pack',
            onClick: () => setOption(11),
            hoverBg: 'rgba(224, 148, 179, 0.75)',
            bgColor: '#E094B3',
            textColor: textColor(11),
        },
        {
            icon: !isActive(1) ? '/images/icons/menu/blanco/inventory.png' : '/images/icons/menu/color/inventory.jpg',
            text: 'Inventory',
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#2F8190',
            hoverBg: 'rgba(47, 129, 144, 0.75)',
            textColor: isActive(1) ? '#2F8190' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
            isActive: isActive(1),
        },
        {
            icon: !isActive(2) ? '/images/icons/menu/blanco/history.png' : '/images/icons/menu/color/history.jpg',
            text: 'History',
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#3B7197',
            hoverBg: 'rgba(59, 113, 151, 0.75)',
            textColor: isActive(2) ? '#3B7197' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
            isActive: isActive(2),
        },
        {
            icon: !isActive(3) ? '/images/icons/menu/blanco/market.png' : '/images/icons/menu/color/market.jpg',
            text: 'Market',
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#3B6497',
            hoverBg: 'rgba(59, 100, 151, 0.75   )',
            textColor: isActive(3) ? '#3B6497' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
            isActive: isActive(3),
        },
        {
            icon: !isActive(5) ? '/images/icons/menu/blanco/bounty.png' : '/images/icons/menu/color/bounty.jpg',
            text: 'Bounty',
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#3B6497',
            hoverBg: 'rgba(59, 100, 151, 0.75)',
            textColor: isActive(5) ? '#3B6497' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
            isActive: isActive(5),
            isDisabled: !IS_BOUNTY_ENABLED,
        },
        {
            icon: !isActive(10) ? '/images/icons/menu/blanco/book.png' : '/images/icons/menu/color/book.jpg',
            text: 'Book',
            onClick: () => setOption(10),
            bgColor: isActive(10) ? 'white' : '#413B97',
            hoverBg: 'rgba(65, 59, 151, 0.75)',
            textColor: isActive(10) ? '#413B97' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
            isActive: isActive(10),
        },
        {
            icon: !isActive(4) ? '/images/icons/menu/blanco/bridge.png' : '/images/icons/menu/color/bridge.jpg',
            text: 'Bridge',
            onClick: () => setOption(4),
            bgColor: isActive(4) ? 'white' : '#573B97',
            hoverBg: 'rgba(87, 59, 151, 0.75)',
            textColor: isActive(4) ? '#573B97' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
            isActive: isActive(4),
        },
    ];

    // ---------------------------------------------

    return (
        <VStack align="flex-start" spacing={2} width={buttonsWidth}>
            {buttons.map(
                (
                    { icon, text, onClick, bgColor, hoverBg, textColor, fontWeight, isActive, isDisabled, isLoading },
                    index
                ) =>
                    !isDisabled && (
                        <Button
                            key={index}
                            minW={buttonsWidth}
                            minH="50px"
                            _hover={{ background: isActive ? bgColor : hoverBg, color: isActive ? undefined : 'white' }}
                            bgColor={bgColor}
                            textColor={textColor}
                            onClick={isLoading ? null : onClick}>
                            <Stack direction="row" align="center" w="100px" spacing={3}>
                                {icon && text ? (
                                    <>
                                        <Image src={icon} w="28px" />
                                        <Text fontSize="sm" fontWeight={fontWeight} whiteSpace="nowrap">
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
