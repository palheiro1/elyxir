import {
    useDisclosure,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
    Flex,
    Box,
    useColorModeValue,
    Image,
    Stack,
    Text,
    Center,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
import BuyGiftzDialog from '../Modals/BuyGiftzDialog/BuyGiftzDialog';

const CurrencyMenu = ({ infoAccount = '', goToSection }) => {
    const { IGNISBalance, GIFTZBalance, GEMSBalance, name: username } = infoAccount;

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const { isOpen: isOpenBuyGiftz, onClose: onCloseBuyGiftz, onOpen: onOpenBuyGiftz } = useDisclosure();
    const referenceBuyGiftz = useRef();
    // ----------------------- SEND CURRENCY -----------------------
    const { isOpen: isOpenSendCurrency, onClose: onCloseSendCurrency, onOpen: onOpenSendCurrency } = useDisclosure();
    const reference = useRef();

    const currencies = {
        IGNIS: {
            name: 'IGNIS',
            balance: IGNISBalance,
            handler: () => goToSection(8),
            image: 'images/currency/IGNISicon.png',
        },
        GIFTZ: {
            name: 'GIFTZ',
            balance: GIFTZBalance,
            handler: onOpenBuyGiftz,
            image: 'images/currency/GIFTZicon.png',
        },
        GEMS: {
            name: 'GEMS',
            balance: GEMSBalance,
            handler: () => goToSection(3),
            image: 'images/currency/GEMSicon.png',
        },
    };

    const [currency, setCurrency] = useState(currencies.IGNIS);

    const handleOpenSendCurrency = currencyName => {
        setCurrency(currencies[currencyName]);
        onOpenSendCurrency();
    };

    const handleOpenGetMoreCurrency = currencyName => {
        const { handler } = currencies[currencyName];
        if (handler) {
            handler();
        }
    };

    const hoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const bgColor = useColorModeValue('blackAlpha.300', 'blackAlpha.300');

    return (
        <>
            <Flex align="flex-end" pr={'0.55%'}>
                <ButtonGroup shadow="md" size="sm" fontSize={'sm'} variant="outline" gap={4}>
                    <Box
                        border="4px"
                        borderColor={borderColor}
                        rounded="lg"
                        minW="5rem"
                        maxH={'2.2rem'}
                        _hover={{ bg: hoverColor }}>
                        <Center>
                            <Menu>
                                <MenuButton>
                                    <Stack direction="row" align="center" mt={-2}>
                                        <Image
                                            ml={-8}
                                            bgColor={bgColor}
                                            src="images/currency/ignis.png"
                                            alt="IGNIS Icon"
                                            w="45px"
                                            h="45px"
                                        />
                                        <Text pr={2} align="center">{Number(IGNISBalance).toFixed(0)}</Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('IGNIS')}>Send IGNIS</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('IGNIS')}>
                                            Get IGNIS
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Center>
                    </Box>
                    <Box
                        border="4px"
                        rounded="lg"
                        minW="5rem"
                        maxH={'2.2rem'}
                        borderColor={borderColor}
                        _hover={{ bg: hoverColor }}>
                        <Center>
                            <Menu>
                                <MenuButton>
                                    <Stack direction="row" align="center" mt={-2}>
                                        <Image
                                            ml={-8}
                                            mr={2}
                                            src="images/currency/giftz.png"
                                            alt="GIFTZ Icon"
                                            minW="45px"
                                            h="45px"
                                        />
                                        <Text pr={2} align="center">{Number(GIFTZBalance).toFixed(0)}</Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('GIFTZ')}>
                                            Get GIFTZ
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Center>
                    </Box>
                    <Box
                        border="4px"
                        borderColor={borderColor}
                        rounded="lg"
                        minW="5rem"
                        maxH={'2.2rem'}
                        _hover={{ bg: hoverColor }}>
                        <Center>
                            <Menu>
                                <MenuButton>
                                    <Stack direction="row" align="center" mt={-2}>
                                        <Image
                                            ml={-5}
                                            src="images/currency/gem.png"
                                            alt="GEM Icon"
                                            w="43px"
                                            h="43px"
                                        />
                                        <Text pr={3}>{GEMSBalance.toFixed(0)}</Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GEMS')}>Send GEM</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('GEMS')}>Get GEM</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Center>
                    </Box>
                </ButtonGroup>
            </Flex>
            {isOpenSendCurrency && (
                <SendCurrencyDialog
                    isOpen={isOpenSendCurrency}
                    onClose={onCloseSendCurrency}
                    reference={reference}
                    currency={currency}
                    IGNISBalance={IGNISBalance}
                    username={username}
                />
            )}

            <BuyGiftzDialog
                isOpen={isOpenBuyGiftz}
                onClose={onCloseBuyGiftz}
                reference={referenceBuyGiftz}
                name={username}
                IGNISBalance={IGNISBalance}
            />
        </>
    );
};

export default CurrencyMenu;
