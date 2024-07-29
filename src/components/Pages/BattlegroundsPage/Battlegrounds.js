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
import { Maps } from './Components/Maps';
import React, { useEffect, useState } from 'react';
import { ScrollLock } from './assets/ScrollLock';
import { BattlegroundsIntro } from './Components/BattlegroundsIntro/BattlegroundsIntro';
import logo from './assets/image.png';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/Modals/AdvertModal';
import { BattleWindow } from './Components/BattleWindow/BattleWindow';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import Inventory from './Components/Inventory/Inventory';
import { NQTDIVIDER } from '../../../data/CONSTANTS';
import SendGEMsToOmno from './Components/Modals/SendGEMsToOmno';
import SendWethToOmno from './Components/Modals/SendWethToOmno';
import BattleList from './Components/BattleRecord/BattleList';
import ChangeName from './Components/Modals/ChangeName';
import { fetchBattleData } from '../../../redux/reducers/BattlegroundsReducer';
import { useDispatch, useSelector } from 'react-redux';

const Battlegrounds = ({ infoAccount, cards }) => {
    const { accountRs } = infoAccount;

    const [visible, setVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(true);
    const [gemsModalMode, setGemsModalMode] = useState(null); // True send , false withdraw
    const [wethModalMode, setWethModalMode] = useState(null); // True send , false withdraw
    const [selectedArena, setSelectedArena] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBattle, setOpenBattle] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);
    const [openBattleRecord, setOpenBattleRecord] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [updateState, setUpdateState] = useState(false);

    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();
    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenName, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();

    const dispatch = useDispatch();
    const { battleCount, activePlayers, landLords, omnoGEMsBalance, omnoWethBalance, parseWETH, filteredCards } =
        useSelector(state => state.battlegrounds);

    useEffect(() => {
        cards && accountRs && dispatch(fetchBattleData({ accountRs, cards }));
    }, [dispatch, accountRs, cards]);

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
        setUpdateState(prevState => !prevState);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    const handleCloseBattle = () => {
        setOpenBattle(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    const handleCloseBattleRecord = () => {
        setOpenBattleRecord(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    let wEthDecimals = 3;

    const statistics = [
        { name: 'Land lords', value: landLords },
        { name: 'Active player', value: activePlayers },
        { name: 'Battles disputed', value: battleCount },
        // { name: 'GEM Rewards', value: '245k' },
        // { name: 'General ranking', value: 7 },
        // { name: 'Time remaining', value: '14 weeks' },
    ];
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

    const [isMobile] = useMediaQuery('(max-width: 1190px)');

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
                            <Img src={logo} color={'#FFF'} h={'15%'} ml={isMobile && 7} />
                            <Stack
                                direction={isMobile ? 'row' : 'column'}
                                position={isMobile && 'absolute'}
                                ml={isMobile ? '220px' : '60px'}
                                mt={isMobile ? '30px' : '15px'}>
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
                                        zIndex={1}
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
                                        zIndex={1}
                                        color={'black'}
                                        my={isMobile && 'auto'}
                                        bgColor={bgColor}
                                        mt={!isMobile && 2}
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

                            <Stack
                                direction={isMobile ? 'row' : 'column'}
                                flexWrap={'wrap'}
                                mt={isMobile ? '-120px' : 8}
                                padding={'30px'}
                                pos={'absolute'}
                                top={'12rem'}
                                ml={isMobile ? -2 : -1}>
                                {buttons.map((btn, index) => (
                                    <Box
                                        className="btn-menu"
                                        m={1}
                                        key={index}
                                        onClick={btn.onclick}
                                        opacity={btn.disabled ? '30%' : null}
                                        cursor={btn.disabled ? 'default' : 'pointer'}
                                        title={btn.disabled ? 'Coming soon...' : null}>
                                        {btn.name}
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack mt={isMobile && '130px'} w={isMobile ? '200%' : '100%'} ml={isMobile && -24}>
                            <Maps
                                handleSelectArena={handleSelectArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                                w={'100%'}
                            />
                            <Stack direction={'row'} mt={isMobile ? '-90px' : 3} mx={'auto'}>
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
