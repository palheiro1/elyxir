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
    const { IGNISBalance, GIFTZBalance, GEMBalance, WETHBalance, name: username } = infoAccount;
    const parseWETH = parseFloat(WETHBalance);
    let wEthDecimals = 0;
    if (parseWETH) {
        const aux = parseWETH.toString().split('.');
        if (aux.length > 1) wEthDecimals = aux[1].length || 0;
    }

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
        },
        GIFTZ: {
            name: 'GIFTZ',
            balance: GIFTZBalance,
            handler: onOpenBuyGiftz,
        },
        GEM: {
            name: 'GEM',
            balance: GEMBalance,
            handler: () => goToSection(3),
        },
        WETH: {
            name: 'wETH',
            balance: WETHBalance,
            handler: () => goToSection(3),
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

    return (
        <>
            <Flex align="flex-end" pr={'0.55%'}>
                <ButtonGroup size="sm" fontSize={'sm'} variant="outline" gap={4}>
                    <Box
                        shadow="lg"
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
                                            src="images/currency/ignis.png"
                                            alt="IGNIS Icon"
                                            w="45px"
                                            h="45px"
                                        />
                                        <Text pr={2} align="center">
                                            {Number(IGNISBalance).toFixed(0)}
                                        </Text>
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
                        shadow="lg"
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
                                        <Text pr={2} align="center">
                                            {Number(GIFTZBalance).toFixed(0)}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Center>
                    </Box>
                    <Box
                        shadow="lg"
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
                                        <Image ml={-5} src="images/currency/gem.png" alt="GEM Icon" w="43px" h="43px" />
                                        <Text pr={3}>{GEMBalance.toFixed(0)}</Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('GEM')}>Send GEM</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('GEM')}>Get GEM</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Center>
                    </Box>
                    <Box
                        shadow="lg"
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
                                            src="images/currency/weth.png"
                                            alt="wETH Icon"
                                            w="43px"
                                            h="43px"
                                        />
                                        <Text pr={3}>
                                            {parseWETH.toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('WETH')}>Send wETH</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('WETH')}>Get wETH</MenuItem>
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
