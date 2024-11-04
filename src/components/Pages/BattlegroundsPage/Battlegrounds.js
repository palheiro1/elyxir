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
    Select,
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
import Leaderboards from './Components/Leaderboards/Leaderboards';
import Earnings from './Components/EarnigsPage/Earnings';

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
    const [openLeaderboards, setOpenLeaderboards] = useState(false);
    const [openEarnings, setOpenEarnings] = useState(false);
    const [updateState, setUpdateState] = useState(false);
    const [filters, setFilters] = useState({
        rarity: -1,
        element: -1,
    });

    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();
    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenName, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();

    const dispatch = useDispatch();
    const { battleCount, activePlayers, landLords, omnoGEMsBalance, omnoWethBalance, filteredCards, parseWETH } =
        useSelector(state => state.battlegrounds);

    useEffect(() => {
        cards && accountRs && dispatch(fetchBattleData({ accountRs, cards }));
    }, [dispatch, accountRs, cards, updateState]);

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
            name: 'Leaderboards',
            onclick: () => {
                setOpenLeaderboards(true);
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
            name: 'Earnings',
            onclick: () => {
                setOpenEarnings(true);
                setIsScrollLocked(true);
            },
        },
        {
            name: 'Army',
            onclick: () => {
                setOpenInventory(true);
                setIsScrollLocked(true);
            },
        },
        {
            name: 'FAQ',
            onclick: () => {
                window.open('https://mythicalbeings.io/how-to-play-battlegrounds.html', '_blank');
            },
        },
        {
            name: 'Change name',
            onclick: () => {
                onOpenName();
            },
        },
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

    const handleCloseEarnings = () => {
        setOpenEarnings(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    const handleCloseLeaderboards = () => {
        setOpenLeaderboards(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    let wEthDecimals = 3;

    const statistics = [
        { name: 'Guardians', value: landLords },
        { name: 'Active players', value: activePlayers },
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

    const handleRarityChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            rarity: Number(event.target.value),
        }));
    };

    const handleElementChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            element: Number(event.target.value),
        }));
    };

    const rarityFilterOptions = [
        { name: 'Rarity', value: -1 },
        { name: 'Common', value: 1 },
        { name: 'Rare', value: 2 },
        { name: 'Epic', value: 3 },
        { name: 'Special', value: 4 },
    ];
    const mediumFilterOptions = [
        { name: 'Element', value: -1 },
        { name: 'Terrestrial', value: 1 },
        { name: 'Aerial', value: 2 },
        { name: 'Aquatic', value: 3 },
    ];
    const selectBgColor = useColorModeValue('#FFF', '#000');
    const selectColor = useColorModeValue('#000', '#FFF');

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
                {openEarnings && (
                    <Earnings
                        isMobile={isMobile}
                        closeEarnigs={handleCloseEarnings}
                        infoAccount={infoAccount}
                        cards={cards}
                    />
                )}

                {openLeaderboards && <Leaderboards handleClose={handleCloseLeaderboards} isMobile={isMobile} />}
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
                                            <Text>{(omnoGEMsBalance / NQTDIVIDER).toFixed(0)}</Text>
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
                                            <Text ml={parseWETH !== 0 ? -3 : 2}>
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
                                {buttons.map(({ name, disabled, onclick }, index) => (
                                    <Box
                                        className="btn-menu"
                                        m={1}
                                        key={index}
                                        onClick={onclick}
                                        opacity={disabled ? '30%' : null}
                                        cursor={disabled ? 'default' : 'pointer'}
                                        title={disabled ? 'Coming soon...' : null}>
                                        {name}
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack mt={isMobile && '130px'} w={isMobile ? '200%' : '100%'} ml={isMobile && -24}>
                            <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} justifyContent={'flex-end'}>
                                <Text my={'auto'} fontSize={'lg'} mx={3}>
                                    Lands' filters:{' '}
                                </Text>
                                <Select w={'15%'} onChange={handleRarityChange}>
                                    {rarityFilterOptions.map(({ name, value }, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={value}
                                                style={{ backgroundColor: selectBgColor, color: selectColor }}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </Select>
                                <Select w={'15%'} onChange={handleElementChange}>
                                    {mediumFilterOptions.map(({ name, value }, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={value}
                                                style={{ backgroundColor: selectBgColor, color: selectColor }}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </Stack>
                            <Maps
                                handleSelectArena={handleSelectArena}
                                infoAccount={infoAccount}
                                cards={cards}
                                handleStartBattle={handleStartBattle}
                                filters={filters}
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
                                    {statistics.map(({ name, value }, index) => (
                                        <Text
                                            key={index}
                                            fontSize={isMobile && 'xs'}
                                            color={'#FFF'}
                                            my={'auto'}
                                            p={isMobile ? 2 : 3}
                                            textAlign={'center'}
                                            cursor={'default'}>
                                            {name}:<span style={{ color: '#D08FB0' }}> {value}</span>
                                        </Text>
                                    ))}
                                </Stack>
                                <Box
                                    mx="auto"
                                    borderRadius="30px"
                                    p="3px"
                                    background="linear-gradient(49deg, rgba(235,178,185,1) 0%, rgba(32,36,36,1) 100%)"
                                    display="inline-block">
                                    <Button
                                        sx={{
                                            background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                                            borderRadius: '30px',
                                            color: '#FFF',
                                            textTransform: 'uppercase',
                                            fontWeight: '400',
                                            letterSpacing: '1px',
                                            fontSize: 'lg',
                                            fontFamily: "'Chelsea Market', system-ui",
                                            padding: '6',
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        }}
                                        onClick={() => setIsModalOpen(true)}>
                                        Start a Battle
                                    </Button>
                                </Box>
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
