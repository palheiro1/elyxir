import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';

// -----------------------------------------------------------------
// ------------------------- Components ----------------------------
// -----------------------------------------------------------------

// Menu
import LateralMenu from '../../components/Navigation/LateralMenu/LateralMenu';

// Pages
import History from '../../components/Pages/HistoryPage/History';
import Overview from '../../components/Pages/HomePage/Overview';
import Inventory from '../../components/Pages/InventoryPage/Inventory';
import Jackpot from '../../components/Pages/JackpotPage/Jackpot';
import Market from '../../components/Pages/MarketPage/Market';
import Account from '../../components/Pages/AccountPage/Account';

// Modals
import BuyPackDialog from '../../components/Modals/BuyPackDialog/BuyPackDialog';
import CardReceived from '../../components/Modals/CardReceived/CardReceived';
import Bridge from '../../components/Pages/Bridge/Bridge';
import { isNotLogged } from '../../utils/validators';

// -----------------------------------------------------------------
// ------------------------- Constants -----------------------------
// -----------------------------------------------------------------
// Data
import {
    ASSETS_IDS,
    COLLECTIONACCOUNT,
    GEMASSET,
    GEMASSETACCOUNT,
    GIFTZASSET,
    GIFTZASSETACCOUNT,
    MANAACCOUNT,
    MANAASSET,
    NQTDIVIDER,
    REFRESH_BLOCK_TIME,
    REFRESH_DATA_TIME,
    REFRESH_UNWRAP_TIME,
    TARASCACARDACCOUNT,
    WETHASSET,
    WETHASSETACCOUNT,
} from '../../data/CONSTANTS';

import { cleanInfoAccount } from '../../data/DefaultInfo/cleanInfoAccount';

// Services
import { fetchAllCards, fetchCurrencyAssets } from '../../utils/cardsUtils';

import {
    checkDataChange,
    getCurrentAskAndBids,
    getIGNISBalance,
    handleNotifications,
} from '../../utils/walletUtils';

import {
    getAccountLedger,
    getBlockchainStatus,
    getBlockchainTransactions,
    getTrades,
    getTransaction,
    getUnconfirmedTransactions,
    processUnwrapsFor1155,
    processUnwrapsForGemBridge,
    processUnwrapsForOldBridge,
    processWrapsFor20,
} from '../../services/Ardor/ardorInterface';
import Exchange from '../Exchange/Exchange';
import ArdorChat from '../../components/Pages/ChatPage/ArdorChat';
import Book from '../../components/Pages/BookPage/Book';
import { okToast } from '../../utils/alerts';
import OpenPackDialog from '../../components/Modals/OpenPackDialog/OpenPackDialog';

/**
 * @name Home
 * @description Home page (main page)
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev Load all the data and render the pages
 * @param {Object} infoAccount - Info account
 * @param {Function} setInfoAccount - Set info account
 * @returns {JSX.Element} Home component
 */
const Home = memo(({ infoAccount, setInfoAccount }) => {
    const toast = useToast();

    // Refs
    const newTransactionRef = useRef();
    const confirmedTransactionRef = useRef();

    // Buy pack dialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buyRef = useRef();

    // Card received dialog
    const { isOpen: isOpenCardReceived, onOpen: onOpenCardReceived, onClose: onCloseCardReceived } = useDisclosure();
    const cardReceivedRef = useRef();

    // Open pack dialog
    const { isOpen: isOpenOpenPack, onOpen: onOpenOpenPack, onClose: onCloseOpenPack } = useDisclosure();
    const openPackRef = useRef();

    // Navigate
    const navigate = useNavigate();

    // GEM Cards
    const [gemCards, setGemCards] = useState([]);

    // GIFTZ Cards
    const [giftzCards, setGiftzCards] = useState([]);

    // wETH Cards
    const [wethCards, setWethCards] = useState([]);

    // MANA Cards
    const [manaCards, setManaCards] = useState([]);

    // All cards
    const [cards, setCards] = useState([]);

    // Hashes
    const [infoAccountHash, setInfoAccountHash] = useState(cleanInfoAccount);
    const [gemCardsHash, setGemCardsHash] = useState('');
    const [giftzCardsHash, setGiftzCardsHash] = useState('');
    const [wethCardsHash, setWethCardsHash] = useState('');
    const [manaCardsHash, setManaCardsHash] = useState('');
    const [cardsHash, setCardsHash] = useState('');

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    // Uncorfirmed transactions
    const [unconfirmedTransactions, setUnconfirmedTransactions] = useState([]);

    // Need reload data
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Menu
    const [option, setOption] = useState(0);
    const [lastOption, setLastOption] = useState(0);

    // Component to render
    const [renderComponent, setRenderComponent] = useState(<Overview />);

    // Blockchain status
    const [blockchainStatus, setBlockchainStatus] = useState({
        prev_height: 0,
        epoch_beginning: Date.UTC(2018, 0, 1, 0, 0, 0),
    });

    // -----------------------------------------------------------------
    const [searchParams, setSearchParams] = useSearchParams();
    const directSection = searchParams.get('goToSection') || false;
    const [directSectionToRender, setDirectSectionToRender] = useState(directSection);

    // -----------------------------------------------------------------
    // ------------------------- Functions -----------------------------
    // -----------------------------------------------------------------
    // Stack of cards to notify
    const [cardsNotification, setCardsNotification] = useState(cards);

    // Show all cards - Toggle button
    const [showAllCards, setShowAllCards] = useState(true);
    const handleShowAllCards = () => setShowAllCards(!showAllCards);

    useEffect(() => {
        if (showAllCards) setCardsFiltered(cards);
        else setCardsFiltered(cards.filter(card => Number(card.quantityQNT) > 0));
    }, [showAllCards, cards]);

    // -----------------------------------------------------------------
    // Check if user is logged
    // -----------------------------------------------------------------
    useEffect(() => {
        if (isNotLogged(infoAccount)) navigate('/login');
    }, [infoAccount, navigate]);

    // -----------------------------------------------------------------
    // Handle logout
    // -----------------------------------------------------------------

    const handleLogout = () => {
        setInfoAccount(cleanInfoAccount);
        navigate('/login');
    };

    const handleOnCloseCardReceived = () => {
        setCardsNotification([]);
        onCloseCardReceived();
    };

    // -----------------------------------------------------------------
    // Handle change option with flag
    // -----------------------------------------------------------------

    const handleChangeOption = newOption => {
        setLastOption(option);
        setOption(newOption);
    };

    // -----------------------------------------------------------------
    // Load all data from blockchain - Main flow
    // -----------------------------------------------------------------
    const updateDividendsWithCards = async (auxDividends, allCards) => {
        const auxDividendsPromises = auxDividends.map(dividend => getTransaction(2, dividend.eventHash));
        const dividendsTxs = await Promise.all(auxDividendsPromises);
    
        dividendsTxs.forEach((dividendTx, index) => {
            const { attachment } = dividendTx;
            const card = allCards.find(card => card.asset === attachment.asset);
            if (card) {
                auxDividends[index].card = card;
            }
        });
    };

    const [firstTime, setFirstTime] = useState(true);

    const loadAll = useCallback(async () => {
        const { accountRs } = infoAccount;
        setFirstTime(false);
        setIsLoading(true);
        setNeedReload(false);

        // Fetch all info
        const [loadCards, currencyAssets, ignis, txs, unconfirmed, currentAskOrBids, trades, dividends] =
            await Promise.all([
                fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, firstTime ? false : true),
                fetchCurrencyAssets(accountRs, [GEMASSETACCOUNT, WETHASSETACCOUNT, GIFTZASSETACCOUNT, MANAACCOUNT], true),
                getIGNISBalance(accountRs),
                getBlockchainTransactions(2, accountRs, true),
                getUnconfirmedTransactions(2, accountRs),
                getCurrentAskAndBids(accountRs),
                getTrades(2, accountRs),
                getAccountLedger({
                    accountRs: accountRs,
                    firstIndex: 0,
                    lastIndex: 99,
                    eventType: 'ASSET_DIVIDEND_PAYMENT',
                }),
            ]);

        const gems = currencyAssets[0].find(asset => asset.asset === GEMASSET);
        const weth = currencyAssets[1].find(asset => asset.asset === WETHASSET);
        const giftzAsset = currencyAssets[2].find(asset => asset.asset === GIFTZASSET);
        const mana = currencyAssets[3].find(asset => asset.asset === MANAASSET);

        // -----------------------------------------------------------------
        // Check notifications - Unconfirmed transactions
        const unconfirmedTxs = unconfirmed.unconfirmedTransactions;
        handleNotifications({
            unconfirmedTransactions,
            newsTransactions: unconfirmedTxs,
            accountRs,
            cardsNotification,
            setCardsNotification,
            toast,
            loadCards,
            setUnconfirmedTransactions,
            newTransactionRef,
            confirmedTransactionRef,
        });
        // -----------------------------------------------------------------

        const auxDividends = dividends.entries;
        await updateDividendsWithCards(auxDividends, loadCards);

        // -----------------------------------------------------------------
        // Rebuild infoAccount
        // -----------------------------------------------------------------

        const _auxInfo = {
            ...infoAccount,
            IGNISBalance: ignis,
            GIFTZBalance: giftzAsset.quantityQNT,
            GEMBalance: gems.quantityQNT / NQTDIVIDER,
            WETHBalance: weth.quantityQNT / NQTDIVIDER,
            MANABalance: mana.quantityQNT / NQTDIVIDER,
            transactions: txs.transactions,
            dividends: auxDividends,
            unconfirmedTxs: unconfirmedTxs,
            currentAsks: currentAskOrBids.askOrders,
            currentBids: currentAskOrBids.bidOrders,
            trades: trades.trades,
        };

        // -----------------------------------------------------------------
        // Get all hashes and compare
        // -----------------------------------------------------------------
        checkDataChange('Cards', cardsHash, setCards, setCardsHash, loadCards);
        checkDataChange('Gems', gemCardsHash, setGemCards, setGemCardsHash, gems);
        checkDataChange('GIFTZ', giftzCardsHash, setGiftzCards, setGiftzCardsHash, giftzAsset);
        checkDataChange('wETH', wethCardsHash, setWethCards, setWethCardsHash, weth);
        checkDataChange('MANA', manaCardsHash, setManaCards, setManaCardsHash, mana);
        checkDataChange('Account info', infoAccountHash, setInfoAccount, setInfoAccountHash, _auxInfo);

        setIsLoading(false);
    }, [
        infoAccount,
        setInfoAccount,
        firstTime,
        infoAccountHash,
        cardsHash,
        gemCardsHash,
        toast,
        unconfirmedTransactions,
        cardsNotification,
        giftzCardsHash,
        wethCardsHash,
        manaCardsHash,
    ]);

    useEffect(() => {
        if (infoAccount.accountRs && needReload && !isLoading) {
            loadAll();
        }
    }, [infoAccount, needReload, isLoading, loadAll]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isLoading) {
                setNeedReload(true);
            }
        }, REFRESH_DATA_TIME);

        return () => clearInterval(intervalId);
    }, [isLoading]);

    // -----------------------------------------------------------------
    // Check for new blocks
    // -----------------------------------------------------------------

    const getStatus = useCallback(async () => {
        try {
            const {
                data: { numberOfBlocks },
            } = await getBlockchainStatus();

            if (blockchainStatus.prev_height !== numberOfBlocks) {
                console.log('Mythical Beings: New block detected!');
                setBlockchainStatus(prevBlockchainStatus => ({
                    ...prevBlockchainStatus,
                    prev_height: numberOfBlocks,
                }));
            }
        } catch (error) {
            console.log('Mythical Beings: Error fetching blockchain status', error);
        }
    }, [blockchainStatus]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStatus();
        }, REFRESH_BLOCK_TIME);

        return () => clearInterval(intervalId);
    }, [getStatus]);

    // -----------------------------------------------------------------
    // Check for new cards notifications
    // -----------------------------------------------------------------

    useEffect(() => {
        if (cardsNotification.length > 0 && !isOpenCardReceived) {
            onOpenCardReceived();
        }
    }, [cardsNotification, onOpenCardReceived, isOpenCardReceived]);

    const resetTransactionRefs = useCallback(() => {
        newTransactionRef.current = null;
        confirmedTransactionRef.current = null;
    }, []);

    useEffect(() => {
        const intervalId = setInterval(resetTransactionRefs, REFRESH_DATA_TIME * 4);
        return () => clearInterval(intervalId);
    }, [resetTransactionRefs]);

    // -----------------------------------------------------------------
    // Check for new unwraps
    // -----------------------------------------------------------------

    const checkUnwraps = useCallback(async () => {
        const { accountRs } = infoAccount;
        // TODO: CHECK ALL BRIDGES
        const [ olbBridge, gemBridge, bridge1155, bridge20 ] = await Promise.all([
            processUnwrapsForOldBridge(accountRs),
            processUnwrapsForGemBridge(accountRs),
            processUnwrapsFor1155(accountRs),
            processWrapsFor20(accountRs),
        ]);
        if (olbBridge && olbBridge.starts) {
            okToast('[OLD BRIDGE] DETECTED UNWRAP: ' + olbBridge.starts + ' transfers started.', toast);
        }
        if (bridge1155 && bridge1155.starts) {
            okToast('[ERC-1155] DETECTED UNWRAP: ' + bridge1155.starts + ' transfers started.', toast);
        }
        if (bridge20 && bridge20.starts) {
            okToast('[wETH] DETECTED WRAP: ' + bridge20.starts + ' transfers started.', toast);
        }
        if (gemBridge && gemBridge.starts) {
            okToast('[GEM BRIDGE] DETECTED UNWRAP: ' + gemBridge.starts + ' transfers started.', toast);
        }
    }, [infoAccount, toast]);

    useEffect(() => {
        const intervalId = setInterval(checkUnwraps, REFRESH_UNWRAP_TIME);
        return () => clearInterval(intervalId);
    }, [checkUnwraps]);

    // -----------------------------------------------------------------
    // Load component to render
    // -----------------------------------------------------------------

    const haveUnconfirmed = useMemo(() => {
        if (!infoAccount.unconfirmedTxs) {
            return false;
        }

        return infoAccount.unconfirmedTxs.some(
            tx => tx.attachment && (ASSETS_IDS.includes(tx.attachment.asset) || !tx.attachment.asset)
        );
    }, [infoAccount]);

    const MENU_OPTIONS_COLOR = [
        "#2f9088", // Overview
        "#2f8190", // Inventory
        "#3b7197", // History
        "#3b6497", // Market
        "#573b97", // Bridge
        "#3b5397", // Jackpot
        "#4e3b97", // Account
        "#9f3772", // Buy pack
        "#413b97", // Exchange
        "#3b4397", // Chat
        "#413b97", // Book
        "#e094b3" // Open pack
    ]

    const components = useMemo(
        () => [
            <Overview blockchainStatus={blockchainStatus} />,
            <Inventory infoAccount={infoAccount} cards={cardsFiltered} />,
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />,
            <Market
                infoAccount={infoAccount}
                cards={cardsFiltered}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
            />,
            <Bridge infoAccount={infoAccount} cards={cardsFiltered} />,
            <Jackpot infoAccount={infoAccount} cards={cards} blockchainStatus={blockchainStatus} />,
            <Account infoAccount={infoAccount} />,
            '', // Buy pack
            <Exchange infoAccount={infoAccount} />,
            <ArdorChat infoAccount={infoAccount} />,
            <Book cards={cards} />,
            '',
        ],
        [infoAccount, cards, cardsFiltered, gemCards, blockchainStatus, haveUnconfirmed, giftzCards, wethCards, manaCards]
    );

    useEffect(() => {
        const loadComponent = () => {
            if (option === 7) {
                onOpen();
                setOption(lastOption);
            } else if (option === 11) {
                onOpenOpenPack();
                setOption(lastOption);
            } else {
                setRenderComponent(components[option]);
            }
        };

        loadComponent();
    }, [option, components, onOpen, lastOption, onOpenOpenPack]);

    useEffect(() => {
        const checkAndGo = () => {
            setLastOption(directSectionToRender);
            setOption(directSectionToRender);
            setDirectSectionToRender(false);
            searchParams.delete('goToSection');
            setSearchParams(searchParams);
        };
        directSectionToRender && checkAndGo();
    }, [directSectionToRender, searchParams, setSearchParams]);

    

    const bgColor = useColorModeValue('white', 'whiteAlpha.100');
    const borderColor = MENU_OPTIONS_COLOR[option] || 'whiteAlpha.100';

    return (
        <>
            {/* MAIN COMPONENT - LATERAL MENU & CHILDREN */}
            <Box
                bg={bgColor}
                m={{ base: 2, md: 12 }}
                px={{ base: 2, md: 8 }}
                py={4}
                rounded="lg"
                border="1px"
                borderColor={borderColor}
                shadow="dark-lg">
                <LateralMenu
                    infoAccount={infoAccount}
                    handleLogout={handleLogout}
                    option={option}
                    setOption={handleChangeOption}
                    children={renderComponent}
                    showAllCards={showAllCards}
                    handleShowAllCards={handleShowAllCards}
                    goToSection={handleChangeOption}
                    nextBlock={blockchainStatus.prev_height}
                />
            </Box>

            {/* DIALOGS */}
            {isOpen && <BuyPackDialog isOpen={isOpen} onClose={onClose} reference={buyRef} infoAccount={infoAccount} />}

            {isOpenOpenPack && (
                <OpenPackDialog
                    isOpen={isOpenOpenPack}
                    onClose={onCloseOpenPack}
                    reference={openPackRef}
                    infoAccount={infoAccount}
                />
            )}

            {isOpenCardReceived && cardsNotification.length > 0 && (
                <CardReceived
                    isOpen={isOpenCardReceived}
                    onClose={handleOnCloseCardReceived}
                    reference={cardReceivedRef}
                    cards={cardsNotification}
                />
            )}
        </>
    );
});

export default Home;
