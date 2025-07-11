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
import { Fragment, useCallback, useEffect, useState } from 'react';
import { ScrollLock } from './assets/ScrollLock';
import './BattlegroundMap.css';
import { AdvertModal } from './Components/Modals/AdvertModal';
import { BattleWindow } from './Components/BattleWindow';
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
import QuickStartModal from './Components/QuickStart';
import NewPlayersModal from './Components/NewPlayersModal';

const Battlegrounds = ({ infoAccount }) => {
    const { accountRs, IGNISBalance } = infoAccount;

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
    const [openQuickStart, setOpenQuickStart] = useState(false);
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

    const {
        battleCount,
        activePlayers,
        landLords,
        omnoGEMsBalance,
        omnoWethBalance,
        filteredCards,
        parseWETH,
        loading,
    } = useSelector(state => state.battlegrounds);
    const { cards } = useSelector(state => state.cards);
    const { prev_height } = useSelector(state => state.blockchain);

    const [openNewPlayersModal, setOpenNewPlayersModal] = useState(false);
    const [hasSeenNewPlayersModal, setHasSeenNewPlayersModal] = useState(false);

    // Mock items for battlegrounds
    const mockItems = [
        {
            id: 'pot1',
            name: 'Lava Elixir',
            image: '/images/items/Lava copia.png',
            medium: 'Terrestrial',
            type: 'Buff',
            description: '+1 Power to Terrestrial creatures',
            quantity: 3,
            bonus: { medium: 'Terrestrial', value: 1 }
        },
        {
            id: 'pot2',
            name: 'Wind Essence',
            image: '/images/items/Wind copia.png',
            medium: 'Aerial',
            type: 'Buff',
            description: '+1 Power to Aerial creatures',
            quantity: 2,
            bonus: { medium: 'Aerial', value: 1 }
        },
        {
            id: 'pot3',
            name: 'Aquatic Essence',
            image: '/images/items/Water sea.png',
            medium: 'Aquatic',
            type: 'Buff',
            description: '+1 Power to Aquatic creatures',
            quantity: 2,
            bonus: { medium: 'Aquatic', value: 1 }
        },
    ];

    useEffect(() => {
        if (!hasSeenNewPlayersModal && !loading) {
            if (filteredCards === null || filteredCards?.length === 0) {
                setOpenNewPlayersModal(true);
            } else {
                setHasSeenNewPlayersModal(true);
            }
        }
    }, [filteredCards, loading, hasSeenNewPlayersModal]);

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

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const bgColor = useColorModeValue('rgba(234, 234, 234, 0.5)', 'rgba(234, 234, 234, 1)');

    /* Buttons menu list */
    const buttonsGroups = [
        {
            title: 'Combat operations',
            color: '#56689F',
            buttons: [
                {
                    name: 'Leaderboard',
                    onclick: () => {
                        setOpenLeaderboards(true);
                        setIsScrollLocked(true);
                    },
                    tooltip: "See who's dominating Battlegrounds and track your global rankings",
                },
                {
                    name: 'Battle record',
                    onclick: () => {
                        setOpenBattleRecord(true);
                        setIsScrollLocked(true);
                    },
                    tooltip: 'Review your previous fights - victories, defeats and tactical information',
                },

                {
                    name: 'Earnings',
                    onclick: () => {
                        setOpenEarnings(true);
                        setIsScrollLocked(true);
                    },
                    tooltip: 'Check the rewards obtained for your battles and the performance of your pantheons',
                },
                {
                    name: 'Deploy army',
                    onclick: () => {
                        setOpenInventory(true);
                        setIsScrollLocked(true);
                    },
                    tooltip: 'Send your creature cards from your NFT wallet to Battlegrounds',
                },
            ],
        },
        {
            title: 'Player settings',
            color: '#7FC0BE',
            buttons: [
                {
                    name: 'Quick start',
                    onclick: () => {
                        setOpenQuickStart(true);
                        setIsScrollLocked(true);
                    },
                    tooltip:
                        'Summary of first steps: deploy some cards to Battlegrounds, select a country, build your army, and battle',
                },
                {
                    name: 'FAQ',
                    onclick: () => {
                        window.open('https://mythicalbeings.io/how-to-play-battlegrounds.html', '_blank');
                    },
                    tooltip: 'Learn how the game works',
                },
                {
                    name: 'Change name',
                    onclick: () => {
                        onOpenName();
                    },
                    tooltip: 'Customize your in-game name as it appears in the leaderboard and battles',
                },
            ],
        },
        {
            color: '#994068',
            buttons: [
                {
                    name: 'Return to wallet',
                    onclick: () => {
                        navigate('/home');
                    },
                    tooltip: 'Back to your NFT portfolio to manage your collection and cards',
                },
            ],
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

    const handleCloseQuickStart = () => {
        setOpenQuickStart(false);
        setIsScrollLocked(false);
        setUpdateState(prevState => !prevState);
    };

    const handleCloseNewPlayers = () => {
        setOpenNewPlayersModal(false);
        setHasSeenNewPlayersModal(true); // ✅ Para que no se vuelva a abrir
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

    const [isMobile] = useMediaQuery('(max-width: 1179px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1180px) and (max-width: 1400px)');
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
                maxH="100vh"
                h="100vh"
                overflowY={isMobile ? 'auto' : 'hidden'}
                overflowX="hidden"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgImage="url('/images/battlegrounds/battlegroundsBackground.png')"
                bgSize="cover"
                bgRepeat="no-repeat"
                bgPosition="center">
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
                        items={mockItems}
                    />
                )}
                {openInventory && (
                    <Inventory
                        infoAccount={infoAccount}
                        cards={cards}
                        items={mockItems}
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
                {openQuickStart && (
                    <QuickStartModal
                        handleClose={handleCloseQuickStart}
                        isMobile={isMobile}
                        isMediumScreen={isMediumScreen}
                    />
                )}
                {openNewPlayersModal && (
                    <NewPlayersModal
                        handleClose={handleCloseNewPlayers}
                        setOpenInventory={setOpenInventory}
                        isMobile={isMobile}
                    />
                )}

                <AdvertModal isOpen={isModalOpen} onClose={closeModal} />
                <ScrollLock isLocked={isScrollLocked} />
                <Box position="relative" pl={4} pt={4} boxSize="fit-content" overflow="auto" my="auto" w={'100%'}>
                    <Stack direction={'row'} h={'100%'} mb={'150px'}>
                        <Stack direction={'column'} w={'20%'}>
                            <Img
                                src={'/images/battlegrounds/battlegroundsLogo.svg'}
                                color={'#FFF'}
                                w={'160px'}
                                mx={'auto'}
                                mt={isMobile && 2}
                            />

                            <Rewards mx={'auto'} />
                            {!isMobile ? (
                                <Stack direction={'column'} mx={'auto'}>
                                    {buttonsGroups.map(({ title, buttons, color }, index) => (
                                        <Box key={index} mt={3} textAlign={'center'}>
                                            <Text
                                                fontFamily="'Chelsea Market', system-ui"
                                                textTransform={'uppercase'}
                                                fontSize={'xs'}>
                                                {title}
                                            </Text>
                                            {buttons.map(({ name, disabled, tooltip, onclick }, index) => (
                                                <ListButton
                                                    disabled={disabled}
                                                    onclick={onclick}
                                                    tooltip={tooltip}
                                                    color={color}
                                                    key={index}>
                                                    {name}
                                                </ListButton>
                                            ))}
                                        </Box>
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
                                        {buttonsGroups.map(({ buttons }, index) => (
                                            <Fragment key={index}>
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
                                            </Fragment>
                                        ))}
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                        <Stack mx={'auto'} w={'100%'}>
                            <Stack
                                direction="row"
                                fontFamily={'Chelsea Market, system-ui'}
                                mx={'auto'}
                                mt={isMobile && 2}
                                w={'100%'}
                                justifyContent={'space-between'}>
                                <Stack direction={'row'} ml={'5%'}>
                                    <Box
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
                                        <Stack direction="row" align="center" mt={-2}>
                                            <Image
                                                ml={-3}
                                                src="images/currency/ignis.png"
                                                alt="wETH Icon"
                                                w="40px"
                                                h="40px"
                                            />
                                            <Text ml={-2}>{Number(IGNISBalance).toFixed(0)}</Text>
                                        </Stack>
                                    </Box>
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
                                            mx={4}
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
                                <Stack direction={'row'} color={'#FFF'}>
                                    <Text my={'auto'} fontSize={'md'} fontWeight={500} mx={3}>
                                        Lands
                                    </Text>
                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            w={'fit-content'}
                                            minW={!isMobile && '160px'}
                                            bg={'transparent'}>
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
                                        <MenuButton
                                            as={Button}
                                            bg={'transparent'}
                                            w={'fit-content'}
                                            minW={!isMobile && '160px'}>
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
                                w={isMediumScreen ? '80%' : '90%'}
                                h={!isMobile && '80%'}
                                display="flex"
                                my={isMobile ? -20 : isMediumScreen ? -15 : 20}
                                justifyContent="center"
                                alignItems="center">
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
                                    mx={'auto'}
                                    backgroundImage="linear-gradient(180deg, rgba(86, 104, 159, 1) 0%, rgba(72, 71, 110, 1) 100%)"
                                    border="2px solid #D597B2"
                                    borderRadius="30px"
                                    justifyContent="space-between"
                                    w={{ base: '70%', md: isMobile ? '80%' : '70%' }}
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
