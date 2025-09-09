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
    Box,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import SendCurrencyDialog from '../Modals/SendCurrencyDialog/SendCurrencyDialog';
import { getIgnisFromFaucet } from '../../services/Faucet/faucet';
import { errorToast, okToast } from '../../utils/alerts';
import { BsInfoCircle } from 'react-icons/bs';
import ResponsiveTooltip from '../ui/ReponsiveTooltip';

const CurrencyMenu = ({ infoAccount = '', goToSection, setSelectedBridgeType }) => {
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
            bridge: 'ERC1155GIFTZ',
        },
        GEM: {
            name: 'GEM',
            balance: GEMBalance,
            handler: () => goToSection(3),
            bridge: 'ERC20GEM',
        },
        WETH: {
            name: 'wETH',
            balance: WETHBalance,
            handler: () => goToSection(3),
            bridge: 'ERC20wETH',
        },
        MANA: {
            name: 'MANA',
            balance: MANABalance,
            handler: () => goToSection(3),
            bridge: 'ERC20Mana',
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

    const handleSwapCurrencyToArdor = currencyName => {
        const { bridge } = currencies[currencyName];
        if (bridge) {
            setSelectedBridgeType(bridge);
            goToSection(4);
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
                            color="black"
                            bgColor={bgColor}
                            borderColor={borderColor}
                            rounded="lg"
                            minW={{ base: '100%', md: '5rem' }}
                            maxH="2.2rem"
                            _hover={{ bg: hoverColor }}>
                            <Stack direction="row" align="center" pr={2}>
                                <Image ml={-5} src="images/currency/ignis.png" alt="IGNIS Icon" w="50px" h="50px" />
                                <Text align="center" w="100%" textAlign="center">
                                    {Number(IGNISBalance).toFixed(0)}
                                </Text>
                                <Box
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    pointerEvents="auto">
                                    <ResponsiveTooltip
                                        label="These mystic flames IGNIS hold the essence of mythical beings. Every transaction needs a small portion of it. Obtain some daily using our faucet or exchange on our market (or on other centralized exchanges)."
                                        placement="bottom"
                                        hasArrow
                                        bgColor="#1F2323"
                                        color="#FFF"
                                        p={2}
                                        border={'1px solid #585858'}
                                        borderRadius={'10px'}
                                        zIndex="tooltip">
                                        <Box as="span" cursor="pointer">
                                            <BsInfoCircle color="#C3C3C3" size="20px" />
                                        </Box>
                                    </ResponsiveTooltip>
                                </Box>
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
                            <Stack direction="row" align="center" pr={2}>
                                <Image ml={-5} src="images/currency/giftz.png" alt="GIFTZ Icon" minW="50px" h="50px" />
                                <Text align="center" textAlign={'center'} w="100%">
                                    {Number(GIFTZBalance).toFixed(0)}
                                </Text>
                                <Box
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    pointerEvents="auto">
                                    <ResponsiveTooltip
                                        label="The very essence of generosity. GIFTZ are tokens of appreciation. They enable you to buy card packs."
                                        placement="bottom"
                                        hasArrow
                                        bgColor="#1F2323"
                                        color="#FFF"
                                        p={2}
                                        borderRadius={'10px'}
                                        border={'1px solid #585858'}
                                        zIndex="tooltip">
                                        <Box as="span" cursor="pointer">
                                            <BsInfoCircle color="#C3C3C3" size="20px" />
                                        </Box>
                                    </ResponsiveTooltip>
                                </Box>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('GIFTZ')}>Send GIFTZ</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GIFTZ')}>Get GIFTZ</MenuItem>
                                <MenuItem onClick={() => handleSwapCurrencyToArdor('GIFTZ')}>Swap to ARDOR</MenuItem>
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
                            <Stack direction="row" align="center" pr={2}>
                                <Image ml={-5} src="images/currency/gem.png" alt="GEM Icon" w="55px" h="50px" />
                                <Text w="100%" textAlign="center">
                                    {GEMBalance.toFixed(0)}
                                </Text>
                                <Box
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    pointerEvents="auto">
                                    <ResponsiveTooltip
                                        label="Rare gems from forgotten treasure troves, GEM stones open doors to secret realms. They are the lifeblood of crafting and morphing, allowing you to shape your cards into new forms."
                                        placement="bottom"
                                        hasArrow
                                        bgColor="#1F2323"
                                        color="#FFF"
                                        p={2}
                                        borderRadius={'10px'}
                                        border={'1px solid #585858'}
                                        zIndex="tooltip">
                                        <Box as="span" cursor="pointer">
                                            <BsInfoCircle color="#C3C3C3" size="20px" />
                                        </Box>
                                    </ResponsiveTooltip>
                                </Box>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('GEM')}>Send GEM</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('GEM')}>Get GEM</MenuItem>
                                <MenuItem onClick={() => handleSwapCurrencyToArdor('GEM')}>Swap to ARDOR</MenuItem>
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
                            <Stack direction="row" align="center" pr={2}>
                                <Image ml={-5} src="images/currency/weth.png" alt="wETH Icon" w="50px" h="50px" />
                                <Text w="100%" textAlign="center">
                                    {parseWETH.toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                                </Text>
                                <Box
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    pointerEvents="auto">
                                    <ResponsiveTooltip
                                        label="WETH are the ethereal threads connecting our world with the mythical blockchain. They act as a bridge, allowing you to exchange them for GIFTZ, other currencies or cards, expanding your collection and influence."
                                        placement="bottom"
                                        hasArrow
                                        bgColor="#1F2323"
                                        color="#FFF"
                                        p={2}
                                        borderRadius={'10px'}
                                        border={'1px solid #585858'}
                                        zIndex="tooltip">
                                        <Box as="span" cursor="pointer">
                                            <BsInfoCircle color="#C3C3C3" size="20px" />
                                        </Box>
                                    </ResponsiveTooltip>
                                </Box>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('WETH')}>Send wETH</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('WETH')}>Get wETH</MenuItem>
                                <MenuItem onClick={() => handleSwapCurrencyToArdor('WETH')}>Swap to ARDOR</MenuItem>
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
                            <Stack direction="row" align="center" pr={2}>
                                <Image
                                    ml={-5}
                                    src="images/currency/mana.png"
                                    alt="MANA Icon"
                                    w="55px"
                                    h="55px"
                                    mb={2}
                                />
                                <Text w="100%" textAlign="center">
                                    {parseMANA.toFixed(0)}
                                </Text>
                                <Box
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    pointerEvents="auto">
                                    <ResponsiveTooltip
                                        label="Crystalline sources of mana, MANA crystals are the essence of magic itself. They serve as governance tokens, allowing you to have a say in the destiny of this enchanted realm."
                                        placement="bottom"
                                        hasArrow
                                        bgColor="#1F2323"
                                        color="#FFF"
                                        p={2}
                                        borderRadius={'10px'}
                                        border={'1px solid #585858'}
                                        zIndex="tooltip">
                                        <Box as="span" cursor="pointer">
                                            <BsInfoCircle color="#C3C3C3" size="20px" />
                                        </Box>
                                    </ResponsiveTooltip>
                                </Box>
                            </Stack>
                        </MenuButton>

                        <Portal>
                            <MenuList>
                                <MenuItem onClick={() => handleOpenSendCurrency('MANA')}>Send MANA</MenuItem>
                                <MenuItem onClick={() => handleOpenGetMoreCurrency('MANA')}>Get MANA</MenuItem>
                                <MenuItem onClick={() => handleSwapCurrencyToArdor('MANA')}>Swap to ARDOR</MenuItem>
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
        </>
    );
};

export default CurrencyMenu;
