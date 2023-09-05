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
    const { IGNISBalance, GIFTZBalance, GEMBalance, WETHBalance, MANABalance, name: username } = infoAccount;
    const parseWETH = parseFloat(WETHBalance);
    const parseMANA = parseFloat(MANABalance);

    let wEthDecimals = 0;
    if (parseWETH) {
        const aux = parseWETH.toString().split('.');
        if (aux.length > 1) wEthDecimals = aux[1].length || 0;
    }

    let manaDecimals = 0;
    if (parseMANA) {
        const aux = parseMANA.toString().split('.');
        if (aux.length > 1) manaDecimals = aux[1].length || 0;
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
        MANA: {
            name: 'MANA',
            balance: MANABalance,
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

    const hoverColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.800');

    return (
        <>
            <Flex align="flex-end" pr={'0.55%'}>
                <ButtonGroup size="sm" fontSize={'sm'} variant="outline" gap={4}>
                    <Box>
                        <Center>
                            <Menu>
                                <MenuButton
                                    shadow="lg"
                                    border="4px"
                                    bgColor={'white'}
                                    color={'black'}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    minW="5rem"
                                    maxH={'2.2rem'}
                                    _hover={{ bg: hoverColor }}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-7}
                                            src="images/currency/ignis.png"
                                            alt="IGNIS Icon"
                                            w="50px"
                                            h="50px"
                                        />
                                        <Text pr={6} align="center">
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
                    <Box>
                        <Center>
                            <Menu>
                                <MenuButton
                                    shadow="lg"
                                    border="4px"
                                    bgColor={'white'}
                                    color={'black'}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    minW="5rem"
                                    maxH={'2.2rem'}
                                    _hover={{ bg: hoverColor }}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-7}
                                            mr={2}
                                            src="images/currency/giftz.png"
                                            alt="GIFTZ Icon"
                                            minW="50px"
                                            h="50px"
                                        />
                                        <Text pr={6} align="center">
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
                    <Box>
                        <Center>
                            <Menu>
                                <MenuButton
                                    shadow="lg"
                                    border="4px"
                                    bgColor={'white'}
                                    color={'black'}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    minW="5rem"
                                    maxH={'2.2rem'}
                                    _hover={{ bg: hoverColor }}>
                                    <Stack direction="row" align="center">
                                        <Image ml={-7} src="images/currency/gem.png" alt="GEM Icon" w="55px" h="50px" />
                                        <Text pr={6}>{GEMBalance.toFixed(0)}</Text>
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
                    <Box>
                        <Center>
                            <Menu>
                                <MenuButton
                                    shadow="lg"
                                    border="4px"
                                    bgColor={'white'}
                                    color={'black'}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    minW="5rem"
                                    maxH={'2.2rem'}
                                    _hover={{ bg: hoverColor }}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-7}
                                            src="images/currency/weth.png"
                                            alt="wETH Icon"
                                            w="50px"
                                            h="50px"
                                        />
                                        <Text pr={6}>
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

                    <Box>
                        <Center>
                            <Menu>
                                <MenuButton
                                    shadow="lg"
                                    border="4px"
                                    bgColor={'white'}
                                    color={'black'}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    minW="5rem"
                                    maxH={'2.2rem'}
                                    _hover={{ bg: hoverColor }}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-6}
                                            src="images/currency/mana.png"
                                            alt="MANA Icon"
                                            w="55px"
                                            h="55px"
                                            mb={2}
                                        />
                                        <Text pr={6}>
                                            {parseMANA.toFixed(Math.max(0, manaDecimals <= 6 ? manaDecimals : 6))}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenSendCurrency('MANA')}>Send MANA</MenuItem>
                                        <MenuItem onClick={() => handleOpenGetMoreCurrency('MANA')}>Get MANA</MenuItem>
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
