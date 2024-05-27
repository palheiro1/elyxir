import {
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
    useColorModeValue,
    Image,
    Stack,
    Text,
    Spacer,
    SimpleGrid,
    useToast,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
import { getIgnisFromFaucet } from '../../services/Faucet/faucet';
import { errorToast, okToast } from '../../utils/alerts';
import UnStuckGiftz from '../Modals/UnStuckGiftz/UnStuckGiftz';

const CurrencyMenu = ({ infoAccount = '', goToSection }) => {
    const {
        IGNISBalance,
        GIFTZBalance,
        GEMBalance,
        WETHBalance,
        MANABalance,
        name: username,
        accountRs,
        publicKey,
    } = infoAccount;
    const parseWETH = parseFloat(WETHBalance);
    const parseMANA = parseFloat(MANABalance);

    const cleanDecimals = number => {
        const aux = number.toString().split('.');
        if (aux.length > 1) return aux[1].length || 0;
        return 0;
    };

    let wEthDecimals = 0;
    if (parseWETH) {
        // const aux = parseWETH.toString().split('.');
        // if (aux.length > 1) wEthDecimals = aux[1].length || 0;
        wEthDecimals = cleanDecimals(parseWETH);
    }

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    // --------------------- UNSTUCK GIFTZ ---------------------
    const { isOpen: isOpenUnstuckGiftz, onClose: onCloseUnstuckGiftz, onOpen: onOpenUnstuckGiftz } = useDisclosure();
    const unstuckReference = useRef();

    // ----------------------- SEND CURRENCY -----------------------
    const { isOpen: isOpenSendCurrency, onClose: onCloseSendCurrency, onOpen: onOpenSendCurrency } = useDisclosure();
    const reference = useRef();

    const toast = useToast();

    const currencies = {
        IGNIS: {
            name: 'IGNIS',
            balance: IGNISBalance,
            handler: () => goToSection(8),
        },
        GIFTZ: {
            name: 'GIFTZ',
            balance: GIFTZBalance,
            handler: () => goToSection(7),
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

    const hoverColor = useColorModeValue('blackAlpha.100', 'white');

    const handleClaim = async () => {
        try {
            const response = await getIgnisFromFaucet(accountRs, publicKey);
            if (!response.error) {
                okToast(response.message, toast);
            } else {
                errorToast(response.message, toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: UserDataItem.js:32 ~ handleClaim ~ error:', error);
            errorToast(error.response.data.message || 'ERROR', toast);
        }
    };

    const TOKEN_OPTIONS = [
        {
            name: 'GEM',
            symbol: 'GEM',
            type: 'ERC20',
            address: '0x5F790ffA0695967A2d711872EcB4c7553e24794D',
            decimals: 18,
            image: 'https://weth.mythicalbeings.io/images/thumb/gem.png',
        },
        {
            name: 'MANA',
            symbol: 'MANA',
            type: 'ERC20',
            address: '0x2caCCa1266653bB090D3Fb511456EBCA33150562',
            decimals: 18,
            image: 'https://weth.mythicalbeings.io/images/thumb/mana.png',
        },
        {
            name: 'WETH',
            symbol: 'WETH',
            type: 'ERC20',
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            image: 'https://weth.mythicalbeings.io/images/thumb/weth.png',
        },
    ];

    const addToMetamask = async currencyName => {
        if (!currencyName) return;

        if (window && window.ethereum) {
            const currencyOptions = TOKEN_OPTIONS.find(token => token.name === currencyName);

            try {
                // Prompt the user to connect to MetaMask
                await window.ethereum.enable();

                const options = {
                    type: currencyOptions.type, // Token type
                    options: {
                        address: currencyOptions.address,
                        symbol: currencyOptions.symbol,
                        decimals: currencyOptions.decimals,
                        image: currencyOptions.image,
                    },
                };

                // Add the custom token
                const result = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: options,
                });

                if (result) {
                    okToast(`${currencyName} added to MetaMask`, toast);
                } else {
                    errorToast("Couldn't add token to MetaMask", toast);
                }
            } catch (error) {
                console.error('🚀 ~ addToMetamask ~ error:', error);
                errorToast("Couldn't add token to MetaMask", toast);
            }
        } else {
            errorToast('MetaMask is not installed', toast);
        }
    };

    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');

    return (
        <>
            <Stack direction={{ base: 'column', md: 'row' }} gap={4} align="flex-end" w="80%">
                <Spacer />
                <SimpleGrid
                    columns={{ base: 2, md: 3, lg: 5 }}
                    spacing={{ base: 4, lg: 6 }}
                    pb={{ base: 4, lg: 0 }}
                    w="100%">
                    <Menu>
                        <MenuButton
                            color={'black'}
                            bgColor={bgColor}
                            borderColor={borderColor}
                            rounded="lg"
                            minW={{ base: '100%', md: '5rem' }}
                            maxH={'2.2rem'}
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center">
                                <Image ml={-5} src="images/currency/ignis.png" alt="IGNIS Icon" w="50px" h="50px" />
                                <Text pr={6} align="center" w="100%" textAlign="center">
                                    {Number(IGNISBalance).toFixed(0)}
                                </Text>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('IGNIS')}>Send IGNIS</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('IGNIS')}>Get IGNIS</MenuItem>
                                <MenuItem onClick={() => handleClaim()}>Claim Faucet</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                    <Menu>
                        <MenuButton
                            bgColor={bgColor}
                            color={'black'}
                            borderColor={borderColor}
                            rounded="lg"
                            minW="5rem"
                            maxH={'2.2rem'}
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center">
                                <Image ml={-5} src="images/currency/giftz.png" alt="GIFTZ Icon" minW="50px" h="50px" />
                                <Text pr={6} align="center" textAlign={'center'} w="100%">
                                    {Number(GIFTZBalance).toFixed(0)}
                                </Text>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GIFTZ')}>Get GIFTZ</MenuItem>
                                {infoAccount.stuckedGiftz > 0 && (
                                    <MenuItem onClick={() => onOpenUnstuckGiftz()}>Unstuck GIFTZ</MenuItem>
                                )}
                            </MenuList>
                        </Portal>
                    </Menu>
                    <Menu>
                        <MenuButton
                            bgColor={bgColor}
                            color={'black'}
                            borderColor={borderColor}
                            rounded="lg"
                            minW="5rem"
                            maxH={'2.2rem'}
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center">
                                <Image ml={-5} src="images/currency/gem.png" alt="GEM Icon" w="55px" h="50px" />
                                <Text pr={6} w="100%" textAlign="center">
                                    {GEMBalance.toFixed(0)}
                                </Text>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('GEM')}>Send GEM</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GEM')}>Get GEM</MenuItem>
                                <MenuItem onClick={() => addToMetamask('GEM')}>Add to Metamask</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                    <Menu>
                        <MenuButton
                            bgColor={bgColor}
                            color={'black'}
                            borderColor={borderColor}
                            rounded="lg"
                            minW="5rem"
                            maxH={'2.2rem'}
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center">
                                <Image ml={-5} src="images/currency/weth.png" alt="wETH Icon" w="50px" h="50px" />
                                <Text pr={6} w="100%" textAlign="center">
                                    {parseWETH.toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                                </Text>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('WETH')}>Send wETH</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('WETH')}>Get wETH</MenuItem>
                                <MenuItem onClick={() => addToMetamask('WETH')}>Add to Metamask</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>

                    <Menu>
                        <MenuButton
                            bgColor={bgColor}
                            color={'black'}
                            borderColor={borderColor}
                            rounded="lg"
                            minW="5rem"
                            maxH={'2.2rem'}
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center">
                                <Image
                                    ml={-5}
                                    src="images/currency/mana.png"
                                    alt="MANA Icon"
                                    w="55px"
                                    h="55px"
                                    mb={2}
                                />
                                <Text pr={6} w="100%" textAlign="center">
                                    {parseMANA.toFixed(0)}
                                </Text>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('MANA')}>Send MANA</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('MANA')}>Get MANA</MenuItem>
                                <MenuItem onClick={() => addToMetamask('MANA')}>Add to Metamask</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </SimpleGrid>
            </Stack>
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
            {isOpenUnstuckGiftz && (
                <UnStuckGiftz
                    isOpen={isOpenUnstuckGiftz}
                    onClose={onCloseUnstuckGiftz}
                    reference={unstuckReference}
                    username={username}
                />
            )}
        </>
    );
};

export default CurrencyMenu;
