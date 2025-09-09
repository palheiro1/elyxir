import { Box, Button, Image, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const VerticalMenuButtons = ({ setOption, option, buttonsWidth, cardsLoaded, setSelectedBridgeType }) => {
    // ---------------------------------------------
    // ------------------ COLORS ------------------
    // ---------------------------------------------
    const isActive = index => index === option;
    const sTextActiveColor = 'white';

    // ---------------------------------------------
    // ------------------ BUTTONS ------------------
    // ---------------------------------------------
    const { t } = useTranslation('navigation');
    const buttons = [
        {
            icon: '/images/icons/menu/blanco/news.png',
            text: t('news_airdrops', { defaultValue: 'News & Airdrops' }),
            onClick: () => setOption(5),
            bgColor: isActive(5) ? 'white' : '#2F8190',
            hoverBg: 'rgba(47, 129, 144, 0.75)',
            textColor: isActive(5) ? '#2F8190' : 'white',
            fontWeight: isActive(5) ? 'bolder' : 'normal',
            isActive: isActive(5),
        },
        {
            icon: !isActive(1) ? '/images/icons/menu/blanco/inventory.png' : '/images/icons/menu/color/inventory.jpg',
            text: t('inventory'),
            onClick: () => setOption(1),
            bgColor: isActive(1) ? 'white' : '#2F8190',
            hoverBg: 'rgba(47, 129, 144, 0.75)',
            textColor: isActive(1) ? '#2F8190' : 'white',
            fontWeight: isActive(1) ? 'bolder' : 'normal',
            isActive: isActive(1),
        },
        {
            icon: !isActive(2) ? '/images/icons/menu/blanco/history.png' : '/images/icons/menu/color/history.jpg',
            text: t('history'),
            onClick: () => setOption(2),
            bgColor: isActive(2) ? 'white' : '#3B7197',
            hoverBg: 'rgba(59, 113, 151, 0.75)',
            textColor: isActive(2) ? '#3B7197' : 'white',
            fontWeight: isActive(2) ? 'bolder' : 'normal',
            isActive: isActive(2),
        },
        {
            icon: !isActive(3) ? '/images/icons/menu/blanco/market.png' : '/images/icons/menu/color/market.jpg',
            text: t('market'),
            onClick: () => setOption(3),
            bgColor: isActive(3) ? 'white' : '#3B6497',
            hoverBg: 'rgba(59, 100, 151, 0.75   )',
            textColor: isActive(3) ? '#3B6497' : 'white',
            fontWeight: isActive(3) ? 'bolder' : 'normal',
            isActive: isActive(3),
        },
        {
            icon: !isActive(4) ? '/images/icons/menu/blanco/bridge.png' : '/images/icons/menu/color/bridge.jpg',
            text: t('bridge'),
            onClick: () => {
                setSelectedBridgeType(null);
                setOption(4);
            },
            bgColor: isActive(4) ? 'white' : '#573B97',
            hoverBg: 'rgba(87, 59, 151, 0.75)',
            textColor: isActive(4) ? '#573B97' : 'white',
            fontWeight: isActive(4) ? 'bolder' : 'normal',
            isActive: isActive(4),
        },
        {
            icon: '/images/icons/menu/blanco/alchemy.png',
            text: t('alchemy'),
            onClick: () => {
                setOption(10); // Elyxir section
                window.setTimeout(() => {
                    const elyxirTab = document.querySelector('[data-elyxir-tab="workshop"]');
                    if (elyxirTab) elyxirTab.click();
                }, 100);
            },
            bgColor: isActive(10) ? 'white' : '#7E9246',
            hoverBg: 'rgba(126, 146, 70, 0.75)',
            textColor: isActive(10) ? '#7E9246' : 'white',
            fontWeight: isActive(10) ? 'bolder' : 'normal',
            isActive: isActive(10),
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
