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
import SendGEMsToOmno from './Components/SendGEMsToOmno';
import SendWethToOmno from './Components/SendWethToOmno';
import BattleList from './Components/BattleRecord/BattleList';
import { getActivePlayers, getBattleCount } from '../../../services/Battlegrounds/Battlegrounds';

const Battlegrounds = ({ infoAccount, cards }) => {
    /* Intro pop up managing */
    const { accountRs } = infoAccount;

    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [omnoGEMsBalance, setOmnoGEMsBalance] = useState(null);
    const [omnoWethBalance, setOmnoWethBalance] = useState(null);
    const [gemsModalMode, setGemsModalMode] = useState(null); // True send , false withdraw
    const [wethModalMode, setWethModalMode] = useState(null); // True send , false withdraw
    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBattle, setOpenBattle] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);
    const [openBattleRecord, setOpenBattleRecord] = useState(false);
    const [battleCount, setBattleCount] = useState(0);
    const [activePlayers, setActivePlayers] = useState(0);
    const [parseWETH, setParseWETH] = useState(0);
    const [updateState, setUpdateState] = useState(false);

    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();
    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();

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
        {
            name: 'Battle record',
            onclick: () => {
                setOpenBattleRecord(true);
                setIsScrollLocked(true);
            },
        },
        { name: 'Scoreboard', disabled: true },
        { name: 'Elixir', disabled: true },
        { name: 'Earnings', disabled: true },
        { name: 'FAQ', disabled: true },
    ];

    const statistics = [
        { name: 'Active player', value: activePlayers },
        { name: 'Battles disputed', value: battleCount },
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
        setUpdateState(!updateState);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsScrollLocked(false);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
        setUpdateState(!updateState);
    };

    const handleCloseBattleRecord = () => {
        setOpenBattleRecord(false);
        setIsScrollLocked(false);
    };

    let wEthDecimals = 3;

    useEffect(() => {
        const filterCards = async () => {
            let battleCount = await getBattleCount();
            let activePlayers = await getActivePlayers();
            setBattleCount(battleCount);
            setActivePlayers(activePlayers);

            const userInfo = await getUserState();
            if (userInfo?.balance) {
                const assetIds = Object.keys(userInfo?.balance?.asset);
                setOmnoGEMsBalance(userInfo?.balance?.asset[GEMASSET] || 0);
                setOmnoWethBalance(userInfo?.balance?.asset[WETHASSET] || 0);
                setParseWETH(parseFloat(userInfo?.balance?.asset[WETHASSET] || 0));

                const matchingCards = cards
                    .filter(card => assetIds.includes(card.asset))
                    .map(card => ({
                        ...card,
                        omnoQuantity: userInfo?.balance?.asset[card.asset],
                    }));

                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount, updateState]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    const GemMode = {
        Withdraw: false,
        Send: true,
    };

    const WethMode = {
        Withdraw: false,
        Send: true,
    };

    const handleOpenGemsModal = mode => {
        setGemsModalMode(GemMode[mode]);
        onOpenGems();
    };

    const handleOpenWethModal = mode => {
        setWethModalMode(WethMode[mode]);
        onOpenWeth();
    };

    return (
        <>
            <Box className="landscape-only">
                <SendGEMsToOmno
                    gemsModalMode={gemsModalMode}
                    infoAccount={infoAccount}
                    isOpen={isOpenGems}
                    onClose={onCloseGems}
                />
                <SendWethToOmno
                    wethModalMode={wethModalMode}
                    infoAccount={infoAccount}
                    isOpen={isOpenWeth}
                    onClose={onCloseWeth}
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
                {openBattleRecord && (
                    <BattleList handleClose={handleCloseBattleRecord} infoAccount={infoAccount} cards={cards} />
                )}
                <BattlegroundsIntro visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={5}>
                    <Img src={logo} color={'#FFF'} />
                    <Stack direction={'row'}>
                        <Stack direction={'column'} ml={'80px'} mt={'15px'}>
                            <Text
                                color={useColorModeValue('black', 'white')}
                                fontSize={'sm'}
                                ml={-2}
                                fontFamily={'Chelsea Market, system-ui'}>
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
                                        <MenuItem onClick={() => handleOpenGemsModal('Send')}>
                                            Send GEM to Battlegrounds
                                        </MenuItem>
                                        <MenuItem onClick={() => handleOpenGemsModal('Withdraw')}>
                                            Withdraw GEM from Battlegrounds
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                            <Menu>
                                <MenuButton
                                    mt={1}
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
                                            {parseWETH &&
                                                (parseWETH / NQTDIVIDER).toFixed(
                                                    Math.max(0, wEthDecimals <= 6 ? wEthDecimals : 6)
                                                )}
                                        </Text>
                                    </Stack>
                                </MenuButton>

                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={() => handleOpenWethModal('Send')}>
                                            Send WETH to Battlegrounds
                                        </MenuItem>
                                        <MenuItem onClick={() => handleOpenWethModal('Withdraw')}>
                                            Withdraw WETH from Battlegrounds
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Stack>
                        <Box mt={8} padding={'30px'} pos={'absolute'} top={'12rem'}>
                            {buttons.map((btn, index) => (
                                <Box
                                    className="btn-menu"
                                    m={5}
                                    key={index}
                                    onClick={btn.onclick}
                                    opacity={btn.disabled ? '30%' : null}
                                    cursor={btn.disabled ? 'default' : 'pointer'}
                                    title={btn.disabled ? 'Coming soon...' : null}>
                                    {btn.name}
                                </Box>
                            ))}
                        </Box>
                        <Stack ml={'50px'}>
                            <Maps
                                handleSelectArena={handleSelectArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                            />
                            <Stack direction={'row'} mt={3} mx={'auto'}>
                                <Stack
                                    direction={'row'}
                                    backgroundColor={'#484848'}
                                    border={'2px solid #D597B2'}
                                    borderRadius={'30px'}
                                    w={'fit-content'}
                                    fontFamily={'Chelsea Market, system-ui'}>
                                    {statistics.map((item, index) => (
                                        <Stack direction={'row'} m={3} key={index} cursor={'default'}>
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
                        </Stack>
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
