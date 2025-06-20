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
import { useCallback, useEffect, useState } from 'react';
import { ScrollLock } from './assets/ScrollLock';
import { BattlegroundsIntro } from './Components/BattlegroundsIntro/BattlegroundsIntro';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/Modals/AdvertModal';
import { BattleWindow } from './Components/BattleWindow/BattleWindow';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import Inventory from './Components/Inventory/Inventory';
import { NQTDIVIDER, REFRESH_BLOCK_TIME } from '../../../data/CONSTANTS';
import SendGEMsToOmno from './Components/Modals/SendGEMsToOmno';
import SendWethToOmno from './Components/Modals/SendWethToOmno';
import BattleList from './Components/BattleRecord/BattleList';
import ChangeName from './Components/Modals/ChangeName';
import { fetchBattleData } from '../../../redux/reducers/BattlegroundsReducer';
import { useDispatch, useSelector } from 'react-redux';
import Leaderboards from './Components/Leaderboards/Leaderboards';
import Earnings from './Components/EarnigsPage/Earnings';
import { isNotLogged } from '../../../utils/validators';
import { useNavigate } from 'react-router-dom';
import { getLevelIconInt, getMediumIconInt } from './Utils/BattlegroundsUtils';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import ListButton from './Components/ListButton';
import Rewards from './Components/Rewards';
import { ChevronUpIcon } from '@chakra-ui/icons';
import { getBlockchainBlocks } from '../../../redux/reducers/BlockchainReducer';
import { fetchArenasInfo } from '../../../redux/reducers/ArenasReducer';
import { fetchSoldiers } from '../../../redux/reducers/SoldiersReducer';
import { fetchUserBattles } from '../../../redux/reducers/BattleReducer';
import { fetchLeaderboards } from '../../../redux/reducers/LeaderboardsReducer';

const Battlegrounds = ({ infoAccount }) => {
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
    const [currentBlock, setCurrentBlock] = useState(null);

    const { isOpen: isOpenWeth, onOpen: onOpenWeth, onClose: onCloseWeth } = useDisclosure();
    const { isOpen: isOpenGems, onOpen: onOpenGems, onClose: onCloseGems } = useDisclosure();
    const { isOpen: isOpenName, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isNotLogged(infoAccount)) navigate('/login');
    }, [infoAccount, navigate]);

    const { battleCount, activePlayers, landLords, omnoGEMsBalance, omnoWethBalance, filteredCards, parseWETH } =
        useSelector(state => state.battlegrounds);
    const { cards } = useSelector(state => state.cards);
    const { prev_height } = useSelector(state => state.blockchain);

    useEffect(() => {
        cards && accountRs && dispatch(fetchBattleData({ accountRs, cards }));
    }, [dispatch, accountRs, cards, updateState]);

    const updateBattlegroundStatus = useCallback(() => {
        if (!currentBlock || currentBlock !== prev_height) {
            setCurrentBlock(prev_height);
            setUpdateState(prev => !prev);
            Promise.all([
                dispatch(fetchArenasInfo()),
                dispatch(fetchSoldiers()),
                accountRs && dispatch(fetchUserBattles(accountRs)),
                dispatch(fetchLeaderboards()),
                cards && accountRs && dispatch(fetchBattleData({ accountRs, cards })),
            ]);
        }
    }, [currentBlock, prev_height, dispatch, accountRs, cards]);

    useEffect(() => {
        prev_height && updateBattlegroundStatus();
    }, [prev_height, updateBattlegroundStatus]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(getBlockchainBlocks());
        }, REFRESH_BLOCK_TIME);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleNext = () => {
        setPage(2);
    };

    const handleClose = () => {
        setVisible(false);
        setIsScrollLocked(false);
        localStorage.setItem('showedBattlegroundIntro', 'true');
    };

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');

    /* Buttons menu list */
    const buttons = [
        {
            name: 'Leaderboard',
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
        {
            name: 'Exit to the wallet',
            onclick: () => {
                navigate('/home');
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

    let wEthDecimals = 4;

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

    return (
        <>
            <Box
                className="landscape-only"
                bgImage="url('/images/battlegrounds/battlegroundsBackground.png')"
                bgSize="cover"
                overflow={'hidden'}
                overflowY={isMobile ? 'auto' : 'hidden'}
                bgPosition="center"
                h={'100vh'}
                bgRepeat="repeat">
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
                <BattlegroundsIntro
                    visible={visible}
                    page={page}
                    handleClose={handleClose}
                    handleNext={handleNext}
                    isMobile={isMobile}
                />
                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position={'relative'} ml={6} mt={isMobile ? 0 : 5} h={'100%'}>
                    <Stack direction={'row'} h={'100%'}>
                        <Stack direction={'column'} w={'20%'}>
                            <Img
                                src={'/images/battlegrounds/battlegroundsLogo.svg'}
                                color={'#FFF'}
                                h={'15%'}
                                mx={'auto'}
                                mt={isMobile && 2}
                            />
                            <Rewards mx={'auto'} />
                            {!isMobile ? (
                                <Stack direction={'column'} flexWrap={'wrap'} padding={'30px'} mx={'auto'}>
                                    {buttons.map(({ name, disabled, onclick }, index) => (
                                        <ListButton
                                            disabled={disabled}
                                            onclick={onclick}
                                            isExit={index === buttons.length - 1}
                                            key={index}>
                                            {name}
                                        </ListButton>
                                    ))}
                                </Stack>
                            ) : (
                                <Menu placement="top">
                                    <MenuButton
                                        as={Button}
                                        bgColor={'transparent'}
                                        rightIcon={<ChevronUpIcon />}
                                        fontFamily={'Chelsea market, system-ui'}
                                        color={'#FFF'}>
                                        Menu
                                    </MenuButton>
                                    <MenuList bg={'#202323'} border={'none'}>
                                        {buttons.map(({ name, onclick }, index) => (
                                            <MenuItem
                                                bg={'#202323'}
                                                color={'#FFF'}
                                                key={index}
                                                onClick={onclick}
                                                fontFamily={'Chelsea market, system-ui'}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                        <Stack mx={'auto'} w={'80%'}>
                            <Stack
                                direction="row"
                                fontFamily={'Chelsea Market, system-ui'}
                                mx={'auto'}
                                mt={isMobile && 2}
                                w={isMobile ? '90%' : '70%'}
                                justifyContent={'space-between'}>
                                <Stack direction={'row'} w={'30%'} mx={'auto'} justifyContent={'space-between'} px={10}>
                                    <Menu>
                                        <MenuButton
                                            zIndex={1}
                                            color={'black'}
                                            my={'auto'}
                                            bgColor={bgColor}
                                            borderColor={borderColor}
                                            rounded="full"
                                            w="6rem"
                                            minW={'68px'}
                                            ml={isMobile && 3}
                                            maxH={'1.5rem'}>
                                            <Stack direction="row" align="center">
                                                <Image
                                                    ml={-3}
                                                    src="images/battlegrounds/currencies/ETHBattle.svg"
                                                    alt="wETH Icon"
                                                    w="40px"
                                                    h="40px"
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
                                    <Menu>
                                        <MenuButton
                                            zIndex={1}
                                            my={'auto'}
                                            color={'black'}
                                            bgColor={bgColor}
                                            borderColor={borderColor}
                                            rounded="full"
                                            minW={'68px'}
                                            w="6rem"
                                            ml={isMobile && 3}
                                            maxH={'1.5rem'}>
                                            <Stack direction="row" align="center">
                                                <Image
                                                    ml={-3}
                                                    src="images/battlegrounds/currencies/GEMBattle.svg"
                                                    alt="GEM Icon"
                                                    w="40px"
                                                    h="40px"
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
                                </Stack>
                                <Stack direction={'row'} w={isMobile ? '90%' : '50%'} color={'#FFF'}>
                                    <Text my={'auto'} fontSize={'md'} fontWeight={500} mx={3}>
                                        Lands
                                    </Text>
                                    <Menu>
                                        <MenuButton as={Button} w={'fit-content'} minW={'160px'} bg={'transparent'}>
                                            <Stack direction={'row'} justifyContent={'space-between'} w={'100%'}>
                                                <Stack direction={'row'} color={'#FFF'}>
                                                    <Text fontSize={'md'} fontWeight={500}>
                                                        {rarityFilterOptions[filters.rarity]?.name || 'Rarity'}
                                                    </Text>
                                                    <MdOutlineArrowDropDown size={20} />
                                                    {filters.rarity !== -1 && (
                                                        <Image
                                                            boxSize="20px"
                                                            src={getLevelIconInt(
                                                                rarityFilterOptions[filters.rarity]?.value
                                                            )}
                                                            border={'none'}
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </MenuButton>
                                        <MenuList bg={'#202323'} border={'none'}>
                                            {rarityFilterOptions.map(({ name, value }) => (
                                                <MenuItem
                                                    bg={'#202323'}
                                                    key={value}
                                                    onClick={() => handleRarityChange({ target: { value } })}>
                                                    <Stack direction={'row'}>
                                                        {value !== -1 && (
                                                            <Image
                                                                boxSize="20px"
                                                                src={getLevelIconInt(value)}
                                                                border={'none'}
                                                            />
                                                        )}
                                                        <Text mx={value === -1 && 'auto'}>{name}</Text>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                    <Menu>
                                        <MenuButton as={Button} bg={'transparent'} w={'fit-content'} minW={'160px'}>
                                            <Stack direction={'row'} justifyContent={'space-between'} w={'100%'}>
                                                <Stack direction={'row'} color={'#FFF'}>
                                                    <Text fontSize={'md'} fontWeight={500}>
                                                        {mediumFilterOptions[filters.element]?.name || 'Medium'}
                                                    </Text>
                                                    <MdOutlineArrowDropDown size={20} />
                                                    {filters.element !== -1 && (
                                                        <Image
                                                            boxSize="20px"
                                                            src={getMediumIconInt(
                                                                mediumFilterOptions[filters.element]?.value
                                                            )}
                                                            border={'none'}
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </MenuButton>
                                        <MenuList bg={'#202323'}>
                                            {mediumFilterOptions.map(({ name, value }) => (
                                                <MenuItem
                                                    bg={'#202323'}
                                                    key={value}
                                                    onClick={() => handleElementChange({ target: { value } })}>
                                                    <Stack direction={'row'}>
                                                        {value !== -1 && (
                                                            <Image
                                                                boxSize="20px"
                                                                src={getMediumIconInt(value)}
                                                                border={'none'}
                                                            />
                                                        )}
                                                        <Text mx={value === -1 && 'auto'}>{name}</Text>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                </Stack>
                            </Stack>
                            <Box
                                className="containerMap"
                                zIndex={0}
                                mx="auto"
                                w="100%"
                                h={'80%'}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                overflow="hidden">
                                <Maps
                                    handleSelectArena={handleSelectArena}
                                    infoAccount={infoAccount}
                                    cards={cards}
                                    handleStartBattle={handleStartBattle}
                                    filters={filters}
                                    w={'100%'}
                                    isMobile={isMobile}
                                />
                            </Box>
                            <Stack
                                direction={'row'}
                                mx={'auto'}
                                maxH={'55px'}
                                w={'85%'}
                                justifyContent={'space-between'}>
                                <Stack
                                    direction="row"
                                    backgroundImage="linear-gradient(180deg, rgba(86, 104, 159, 1) 0%, rgba(72, 71, 110, 1) 100%)"
                                    border="2px solid #D597B2"
                                    borderRadius="30px"
                                    justifyContent="space-between"
                                    w={{ base: '70%', md: '65%' }}
                                    fontFamily="'Chelsea Market', system-ui">
                                    {statistics.map(({ name, value }, index) => (
                                        <Text
                                            key={index}
                                            fontSize={isMobile ? 'xs' : 'lg'}
                                            color="#FFF"
                                            my="auto"
                                            p={{
                                                base: 1,
                                                md: isMobile ? 2 : 3,
                                            }}
                                            px={5}
                                            textAlign="center"
                                            cursor="default"
                                            whiteSpace="nowrap">
                                            {name}:
                                            <Text as="span" color="#D08FB0">
                                                {' '}
                                                {value}
                                            </Text>
                                        </Text>
                                    ))}
                                </Stack>
                                {/* <Box
                                    borderRadius="30px"
                                    p="1"
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
                                </Box> */}
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
