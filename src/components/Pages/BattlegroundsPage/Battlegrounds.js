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
    useMediaQuery,
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
import { getActivePlayers, getBattleCount, getLandLords } from '../../../services/Battlegrounds/Battlegrounds';
import ChangeName from './ChangeName';

const Battlegrounds = ({ infoAccount, cards }) => {
    /* Intro pop up managing */
    const { accountRs } = infoAccount;

    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);
    const [filteredCards, setFilteredCards] = useState([]);
    const [omnoGEMsBalance, setOmnoGEMsBalance] = useState(0);
    const [omnoWethBalance, setOmnoWethBalance] = useState(0);
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
    const [landLords, setLandLords] = useState(0);

    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();
    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenName, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();

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
        {
            name: 'Change name',
            onclick: () => {
                onOpenName();
            },
        },
        { name: 'Elixir', disabled: true },
        { name: 'Earnings', disabled: true },
        { name: 'FAQ', disabled: true },
    ];

    const statistics = [
        { name: 'Land lords', value: landLords },
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
        setUpdateState(!updateState);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
        setUpdateState(!updateState);
    };

    const handleCloseBattleRecord = () => {
        setOpenBattleRecord(false);
        setIsScrollLocked(false);
        setUpdateState(!updateState);
    };

    let wEthDecimals = 3;

    useEffect(() => {
        const filterCards = async () => {
            let [battleCount, activePlayers, landLords] = await Promise.all([
                getBattleCount(),
                getActivePlayers(),
                getLandLords(),
            ]);
            setBattleCount(battleCount);
            setActivePlayers(activePlayers);
            setLandLords(landLords);

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
    }, [cards, infoAccount]);

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

    const [isMobile] = useMediaQuery('(max-width: 950px)');

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
                <ChangeName isOpen={isOpenName} onClose={onCloseName} infoAccount={infoAccount} />
                {openBattle && (
                    <BattleWindow
                        arenaInfo={selectedArena}
                        handleCloseBattle={handleCloseBattle}
                        infoAccount={infoAccount}
                        cards={cards}
                        filteredCards={filteredCards}
                        omnoGEMsBalance={omnoGEMsBalance}
                        omnoWethBalance={omnoWethBalance}
                        isMobile={isMobile}
                    />
                )}
                {openInventory && (
                    <Inventory
                        infoAccount={infoAccount}
                        cards={cards}
                        handleCloseInventory={handleCloseInventory}
                        filteredCards={filteredCards}
                        isMobile={isMobile}
                    />
                )}
                {openBattleRecord && (
                    <BattleList
                        handleClose={handleCloseBattleRecord}
                        infoAccount={infoAccount}
                        cards={cards}
                        isMobile={isMobile}
                    />
                )}
                <BattlegroundsIntro visible={visible} page={page} handleClose={handleClose} handleNext={handleNext} />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={5}>
                    <Stack direction={'row'}>
                        <Stack direction={isMobile ? 'row' : 'column'}>
                            <Img src={logo} color={'#FFF'} h={'15%'} ml={isMobile && 6} />
                            <Stack
                                direction={isMobile ? 'row' : 'column'}
                                position={isMobile && 'absolute'}
                                ml={isMobile ? '190px' : '80px'}
                                mt={isMobile ? '0px' : '15px'}>
                                <Text
                                    color={useColorModeValue('black', 'white')}
                                    fontSize={'sm'}
                                    ml={-2}
                                    my={'auto'}
                                    fontFamily={'Chelsea Market, system-ui'}>
                                    CURRENCIES
                                </Text>
                                <Menu>
                                    <MenuButton
                                        zIndex={5}
                                        my={'auto'}
                                        color={'black'}
                                        bgColor={bgColor}
                                        borderColor={borderColor}
                                        rounded="lg"
                                        w="5rem"
                                        ml={isMobile && 3}
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
                                        <MenuList zIndex={10}>
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
                                        zIndex={5}
                                        color={'black'}
                                        my={'auto'}
                                        bgColor={bgColor}
                                        borderColor={borderColor}
                                        rounded="lg"
                                        w="5rem"
                                        ml={isMobile && 3}
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
                                        <MenuList zIndex={10}>
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

                            <Box
                                mt={isMobile ? '-150px' : 8}
                                padding={'30px'}
                                pos={'absolute'}
                                top={'12rem'}
                                ml={isMobile && -6}>
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
                        </Stack>
                        <Stack ml={'50px'} mt={isMobile && '-70px'}>
                            <Maps
                                handleSelectArena={handleSelectArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                                w={'100%'}
                            />
                            <Stack direction={'row'} mt={isMobile ? '-120px' : 3} mx={'auto'}>
                                <Stack
                                    direction={'row'}
                                    backgroundColor={'#484848'}
                                    border={'2px solid #D597B2'}
                                    borderRadius={'30px'}
                                    w={'fit-content'}
                                    fontFamily={'Chelsea Market, system-ui'}>
                                    {statistics.map((item, index) => (
                                        <Text
                                            key={index}
                                            fontSize={isMobile && 'xs'}
                                            color={'#FFF'}
                                            my={'auto'}
                                            p={isMobile ? 2 : 3}
                                            textAlign={'center'}
                                            cursor={'default'}>
                                            {item.name}:<span style={{ color: '#D08FB0' }}> {item.value}</span>
                                        </Text>
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
