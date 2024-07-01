import {
    Box,
    Button,
    Image,
    Img,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { Maps } from './Maps';
import React, { useEffect, useState } from 'react';
import { ScrollLock } from './Components/ScrollLock';
import { BattlegroundsIntro } from './Components/BattlegroundsIntro/BattlegroundsIntro';
import logo from './assets/image.png';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/AdvertModal';
import { BattleWindow } from './Components/BattleWindow/BattleWindow';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import Inventory from './Components/Inventory/Inventory';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../services/Ardor/omnoInterface';
import { GEMASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import {
    checkPin,
    sendGEMSToOmno,
    sendWETHToOmno,
    withdrawGEMsFromOmno,
    withdrawWETHFromOmno,
} from '../../../utils/walletUtils';
import { errorToast } from '../../../utils/alerts';
import SendGEMsToOmno from './Components/SendGEMsToOmno';
import SendWethToOmno from './Components/SendWethToOmno';

const Battlegrounds = ({ infoAccount, cards }) => {
    /* Intro pop up managing */
    const { accountRs, GEMRealBalance, WETHRealBalance } = infoAccount;

    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);

    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBattle, setOpenBattle] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);

    const toast = useToast();

    const handleNext = () => {
        setPage(2);
    };

    const handleClose = () => {
        setVisible(false);
        setIsScrollLocked(false);
    };

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');

    /* Buttons menu list */
    const buttons = [
        {
            name: 'Inventory',
            onclick: () => {
                setOpenInventory(true);
                setIsScrollLocked(true);
            },
        },
        { name: 'Scoreboard', tooltip: 'Coming soon', opacity: '30%' },
        { name: 'Elixir', tooltip: 'Coming soon', opacity: '30%' },
        { name: 'Earnings', tooltip: 'Coming soon', opacity: '30%' },
        { name: 'Battle record', tooltip: 'Coming soon', opacity: '30%' },
        { name: 'FAQ', tooltip: 'Coming soon', opacity: '30%' },
    ];

    const statistics = [
        { name: 'Active player', value: 3 },
        { name: 'Battles disputed', value: 24 },
        // { name: 'GEM Rewards', value: '245k' },
        // { name: 'General ranking', value: 7 },
        // { name: 'Time remaining', value: '14 weeks' },
    ];

    const handleStartBattle = () => {
        setOpenBattle(true);
        setIsScrollLocked(true);
    };

    const handleSelectArena = arena => {
        setSelectedArena(arena);
    };

    const handleCloseInventory = () => {
        setOpenInventory(false);
        setIsScrollLocked(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsScrollLocked(false);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
    };

    let wEthDecimals = 0;

    const [filteredCards, setFilteredCards] = useState([]);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [omnoGEMsBalance, setOmnoGEMsBalance] = useState(null);
    const [omnoWethBalance, setOmnoWethBalance] = useState(null);
    const [amount, setAmount] = useState(0);
    const [gemsModalMode, setGemsModalMode] = useState(null); // True send , false withdraw
    const [wethModalMode, setWethModalMode] = useState(null); // True send , false withdraw

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const parseWETH = parseFloat(omnoWethBalance);

    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            if (userInfo.balance) {
                const assetIds = Object.keys(userInfo.balance.asset);
                setOmnoGEMsBalance(userInfo.balance.asset[GEMASSET] || 0);
                setOmnoWethBalance(userInfo.balance.asset[WETHASSET] || 0);

                const matchingCards = cards.filter(card => assetIds.includes(card.asset));
                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();

    const maxAmountGems = GEMRealBalance;
    const maxAmountWeth = WETHRealBalance;

    const increment = () => {
        if (amount < maxAmountGems) {
            setAmount(amount + 1);
        }
    };

    const decrement = () => {
        if (amount > 0) {
            setAmount(amount - 1);
        }
    };
    const incrementWeth = () => {
        if (amount < maxAmountWeth) {
            setAmount(amount + 0.001);
        }
    };

    const decrementWeth = () => {
        if (amount > 0) {
            setAmount(amount - 0.001);
        }
    };

    const handleChange = event => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= maxAmountGems) {
            setAmount(value);
        }
    };

    const handleSendSGEMS = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        await sendGEMSToOmno({ quantity: amount, passPhrase: passphrase });
        setAmount(0);
        onCloseGems();
    };
    const handleWithdrawGems = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        await withdrawGEMsFromOmno({ quantity: amount, passPhrase: passphrase });
        setAmount(0);
        onCloseGems();
    };
    const handleSendWeth = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        await sendWETHToOmno({ quantity: amount, passPhrase: passphrase });
        setAmount(0);
        onCloseWeth();
    };
    const handleWithdrawWeth = async () => {
        if (!isValidPin) {
            return errorToast('The pin is invalid', toast);
        }

        await withdrawWETHFromOmno({ quantity: amount, passPhrase: passphrase });
        setAmount(0);
        onCloseWeth();
    };

    return (
        <>
            <Box className="landscape-only">
                <SendGEMsToOmno
                    isOpen={isOpenGems}
                    onClose={onCloseGems}
                    decrement={decrement}
                    amount={amount}
                    handleChange={handleChange}
                    maxAmount={maxAmountGems}
                    increment={increment}
                    handleCompletePin={handleCompletePin}
                    isValidPin={isValidPin}
                    handleSendSGEMS={handleSendSGEMS}
                    handleWithdrawGems={handleWithdrawGems}
                    gemsModalMode={gemsModalMode}
                />
                <SendWethToOmno
                    isOpen={isOpenWeth}
                    onClose={onCloseWeth}
                    decrement={decrementWeth}
                    amount={amount}
                    handleChange={handleChange}
                    maxAmount={maxAmountWeth}
                    increment={incrementWeth}
                    handleCompletePin={handleCompletePin}
                    isValidPin={isValidPin}
                    handleSendWeth={handleSendWeth}
                    handleWithdrawWeth={handleWithdrawWeth}
                    wethModalMode={wethModalMode}
                />
                {openBattle && (
                    <BattleWindow
                        arenaInfo={selectedArena}
                        handleCloseBattle={handleCloseBattle}
                        infoAccount={infoAccount}
                        cards={cards}
                        filteredCards={filteredCards}
                        omnoGEMsBalance={omnoGEMsBalance}
                        omnoWethBalance={omnoWethBalance}
                    />
                )}
                {openInventory && (
                    <Inventory
                        infoAccount={infoAccount}
                        cards={cards}
                        handleCloseInventory={handleCloseInventory}
                        filteredCards={filteredCards}
                    />
                )}
                <BattlegroundsIntro visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={5}>
                    <Img src={logo} color={'#FFF'} />
                    <Stack direction={'row'} gap={4}>
                        <Stack direction={'column'} gap={4} ml={'80px'} mt={'15px'}>
                            <Text color={'black'} fontSize={'sm'} ml={-2} fontFamily={'Chelsea Market, system-ui'}>
                                CURRENCIES
                            </Text>
                            <Menu>
                                <MenuButton
                                    color={'black'}
                                    bgColor={bgColor}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    w="5rem"
                                    maxH={'2.2rem'}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-5}
                                            src="images/currency/gem.png"
                                            alt="GEM Icon"
                                            w="50 px"
                                            h="50px"
                                        />
                                        <Text>{omnoGEMsBalance / NQTDIVIDER}</Text>
                                    </Stack>
                                </MenuButton>
                                <Portal>
                                    <MenuList>
                                        <MenuItem
                                            onClick={() => {
                                                setGemsModalMode(true);
                                                onOpenGems();
                                            }}>
                                            Add GEM to Game
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setGemsModalMode(false);
                                                onOpenGems();
                                            }}>
                                            Send GEM to Wallet
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                            <Menu>
                                <MenuButton
                                    color={'black'}
                                    bgColor={bgColor}
                                    borderColor={borderColor}
                                    rounded="lg"
                                    w="5rem"
                                    maxH={'2.2rem'}>
                                    <Stack direction="row" align="center">
                                        <Image
                                            ml={-5}
                                            src="images/currency/weth.png"
                                            alt="wETH Icon"
                                            w="50px"
                                            h="50px"
                                        />
                                        <Text>
                                            {parseWETH.toFixed(Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6))}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem
                                            onClick={() => {
                                                setWethModalMode(true);
                                                onOpenWeth();
                                            }}>
                                            Add WETH to Game
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setWethModalMode(false);
                                                onOpenWeth();
                                            }}>
                                            Send WETH to Wallet
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Stack>
                        <Box mt={8} padding={'30px'} pos={'absolute'} top={'12rem'}>
                            {buttons.map(btn => (
                                <Box
                                    className="btn-menu"
                                    m={5}
                                    key={btn.i}
                                    onClick={btn.onclick}
                                    opacity={btn.opacity}
                                    title={btn.tooltip}>
                                    {btn.name}
                                </Box>
                            ))}
                        </Box>
                        <Box ml={'80px'}>
                            <Maps
                                handleSelectArena={handleSelectArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                            />
                        </Box>
                    </Stack>
                    <Stack direction={'row'} mt={6}>
                        <Stack
                            direction={'row'}
                            backgroundColor={'#484848'}
                            border={'2px solid #D597B2'}
                            ml={'100px'}
                            borderRadius={'30px'}
                            w={'fit-content'}
                            fontFamily={'Chelsea Market, system-ui'}>
                            {statistics.map(item => (
                                <Stack direction={'row'} m={3} key={item.i}>
                                    <Text color={'#FFF'}>{item.name}:</Text>
                                    <Text color={'#D597B2'}>{item.value}</Text>
                                </Stack>
                            ))}
                        </Stack>
                        <Button
                            style={{
                                background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                border: '3px solid #EBB2B9',
                            }}
                            padding={6}
                            textTransform={'uppercase'}
                            color={'#FFF'}
                            fontWeight={'100'}
                            borderRadius={'40px'}
                            zIndex={5}
                            fontFamily={'Chelsea Market, system-ui'}
                            onClick={() => setIsModalOpen(true)}>
                            Start battle
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box className="rotate-device" zIndex={999}>
                <Text>Please rotate your device to landscape mode to view this content.</Text>
            </Box>
        </>
    );
};

export default Battlegrounds;
