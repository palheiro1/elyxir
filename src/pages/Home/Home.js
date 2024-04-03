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
import { fetchAllCards, fetchCurrencyAssets, isMBAsset } from '../../utils/cardsUtils';

import { checkDataChange, getCurrentAskAndBids, getIGNISBalance, handleNotifications } from '../../utils/walletUtils';

import {
    getAccountLedger,
    getBlockchainStatus,
    getBlockchainTransactions,
    getTrades,
    getTransaction,
    getUnconfirmedTransactions,
    processUnwrapsFor1155,
    processUnwrapsForGemBridge,
    processWrapsFor20,
} from '../../services/Ardor/ardorInterface';
import Exchange from '../Exchange/Exchange';
import ArdorChat from '../../components/Pages/ChatPage/ArdorChat';
import Book from '../../components/Pages/BookPage/Book';
import { firstTimeToast, okToast } from '../../utils/alerts';
import OpenPackDialog from '../../components/Modals/OpenPackDialog/OpenPackDialog';
import { getOmnoGiftzBalance } from '../../services/Ardor/omnoInterface';

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
    const cardsNotificationRef = useRef();

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
    const directSection = parseInt(searchParams.get('goToSection')) || false;
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
        auxDividends.filter(dividend => dividend.attachment && dividend.attachment.asset);
        const auxDividendsPromises = auxDividends.map(dividend => getTransaction(2, dividend.eventHash));
        const dividendsTxs = await Promise.all(auxDividendsPromises);

        dividendsTxs.forEach((dividendTx, index) => {
            const { attachment } = dividendTx;
            if (attachment && attachment.asset && isMBAsset(attachment.asset)) {
                const card = allCards.find(card => card?.asset === attachment.asset);
                if (card) {
                    auxDividends[index].card = card;
                }
            }
        });
    };

    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        if (!infoAccount.accountRs || !needReload || isLoading) return;

        const loadAll = async () => {
            try {
                setFirstTime(false);
                setIsLoading(true);
                setNeedReload(false);
                const { accountRs } = infoAccount;

                // Fetch all info
                const [
                    loadCards,
                    currencyAssets,
                    ignis,
                    txs,
                    unconfirmed,
                    currentAskOrBids,
                    trades,
                    dividends,
                    giftzOmnoBalance,
                ] = await Promise.all([
                    fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, firstTime ? false : true),
                    fetchCurrencyAssets(
                        accountRs,
                        [GEMASSETACCOUNT, WETHASSETACCOUNT, GIFTZASSETACCOUNT, MANAACCOUNT],
                        true
                    ),
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
                    getOmnoGiftzBalance(accountRs),
                ]);

                const gems = currencyAssets[0].find(asset => asset.asset === GEMASSET);
                const weth = currencyAssets[1].find(asset => asset.asset === WETHASSET);
                const giftzAsset = currencyAssets[2].find(asset => asset.asset === GIFTZASSET);
                const mana = currencyAssets[3].find(asset => asset.asset === MANAASSET);

                if (txs.transactions.length === 0) {
                    firstTimeToast(toast);
                }

                // -----------------------------------------------------------------
                // Check notifications - Unconfirmed transactions
                const unconfirmedTxs = unconfirmed.unconfirmedTransactions;
                if (cardsNotificationRef.current !== cardsNotification) {
                    handleNotifications({
                        unconfirmedTransactions,
                        newsTransactions: unconfirmedTxs,
                        accountRs,
                        cardsNotification,
                        setCardsNotification,
                        toast,
                        cards: loadCards,
                        setUnconfirmedTransactions,
                        newTransactionRef,
                        confirmedTransactionRef,
                    });
                }

                // -----------------------------------------------------------------

                const auxDividends = dividends.entries;
                updateDividendsWithCards(auxDividends, loadCards).then(() => {
                    // -----------------------------------------------------------------
                    // Rebuild infoAccount
                    // -----------------------------------------------------------------

                    const _auxInfo = {
                        ...infoAccount,
                        IGNISBalance: ignis,
                        GIFTZBalance: giftzAsset.quantityQNT,
                        GEMBalance: gems.quantityQNT / NQTDIVIDER,
                        GEMRealBalance: gems.unconfirmedQuantityQNT / NQTDIVIDER,
                        WETHBalance: weth.quantityQNT / NQTDIVIDER,
                        WETHRealBalance: weth.unconfirmedQuantityQNT / NQTDIVIDER,
                        MANABalance: mana.quantityQNT / NQTDIVIDER,
                        MANARealBalance: mana.unconfirmedQuantityQNT / NQTDIVIDER,
                        transactions: txs.transactions,
                        dividends: auxDividends,
                        unconfirmedTxs: unconfirmedTxs,
                        currentAsks: currentAskOrBids.askOrders,
                        currentBids: currentAskOrBids.bidOrders,
                        trades: trades.trades,
                        stuckedGiftz: giftzOmnoBalance,
                    };

                    // -----------------------------------------------------------------
                    // Get all hashes and compare
                    // -----------------------------------------------------------------
                    checkDataChange('Account info', infoAccountHash, setInfoAccount, setInfoAccountHash, _auxInfo);
                });

                checkDataChange('Cards', cardsHash, setCards, setCardsHash, loadCards);
                checkDataChange('Gems', gemCardsHash, setGemCards, setGemCardsHash, gems);
                checkDataChange('GIFTZ', giftzCardsHash, setGiftzCards, setGiftzCardsHash, giftzAsset);
                checkDataChange('wETH', wethCardsHash, setWethCards, setWethCardsHash, weth);
                checkDataChange('MANA', manaCardsHash, setManaCards, setManaCardsHash, mana);
            } catch (error) {
                console.error('Mythical Beings: Error loading data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAll();
    }, [
        infoAccount,
        needReload,
        isLoading,
        firstTime,
        cardsHash,
        gemCardsHash,
        giftzCardsHash,
        wethCardsHash,
        manaCardsHash,
        infoAccountHash,
        setInfoAccount,
        setCards,
        cardsNotification,
        toast,
        unconfirmedTransactions,
    ]);

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

    const handleOnCloseCardReceived = () => {
        cardsNotificationRef.current = cardsNotification;
        onCloseCardReceived();
        setCardsNotification([]);
    };

    useEffect(() => {
        const handleOpenCardReceived = () => {
            // Wait 45 seconds to show the notification
            setTimeout(() => {
                if (!isOpenCardReceived && cardsNotification.length > 0) {
                    onOpenCardReceived();
                }
            }, 45000);
        };
        if (cardsNotification.length > 0 && !isOpenCardReceived) {
            handleOpenCardReceived();
        }

        if (cardsNotification.length === 0 && isOpenCardReceived) {
            onCloseCardReceived();
        }

        if (cardsNotification.length > 0 && cardsNotificationRef.current === cardsNotification) {
            setCardsNotification([]);
            onCloseCardReceived();
        }
    }, [cardsNotification, onOpenCardReceived, onCloseCardReceived, isOpenCardReceived]);

    useEffect(() => {
        const resetTransactionRefs = () => {
            newTransactionRef.current = null;
            confirmedTransactionRef.current = null;
        };

        const intervalId = setInterval(resetTransactionRefs, REFRESH_DATA_TIME * 4);
        return () => clearInterval(intervalId);
    }, []);

    // -----------------------------------------------------------------
    // Check for new unwraps
    // -----------------------------------------------------------------

    const checkUnwraps = useCallback(async () => {
        try {
            const { accountRs } = infoAccount;

            // TODO: CHECK ALL BRIDGES
            Promise.all([
                processUnwrapsForGemBridge(accountRs),
                processUnwrapsFor1155(accountRs),
                processWrapsFor20(accountRs),
            ]).then(([gemBridge, bridge1155, bridge20]) => {
                if (gemBridge && gemBridge.starts)
                    okToast('[GEM BRIDGE] DETECTED UNWRAP: ' + gemBridge.starts + ' transfers started.', toast);

                if (bridge1155 && bridge1155.starts)
                    okToast('[ERC-1155] DETECTED UNWRAP: ' + bridge1155.starts + ' transfers started.', toast);

                if (bridge20 && bridge20.starts)
                    okToast('[ERC-20] DETECTED WRAP: ' + bridge20.starts + ' transfers started.', toast);
            });
        } catch (error) {
            console.error('Mythical Beings: Error checking unwraps', error);
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
        '#2f9088', // Overview
        '#2f8190', // Inventory
        '#3b7197', // History
        '#3b6497', // Market
        '#573b97', // Bridge
        '#3b5397', // Jackpot
        '#4e3b97', // Account
        '#9f3772', // Buy pack
        '#413b97', // Exchange
        '#3b4397', // Chat
        '#413b97', // Book
        '#e094b3', // Open pack
    ];

    const components = useMemo(
        () => [
            <Overview blockchainStatus={blockchainStatus} />, // OPTION 0 - Overview
            <Inventory infoAccount={infoAccount} cards={cardsFiltered} />, // OPTION 1 - Inventory
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />, // OPTION 2 - History
            <Market
                infoAccount={infoAccount}
                cards={cardsFiltered}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
            />, // OPTION 3 - Market
            <Bridge
                infoAccount={infoAccount}
                cards={cardsFiltered}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
            />, // OPTION 4 - Bridge
            <Jackpot infoAccount={infoAccount} cards={cards} blockchainStatus={blockchainStatus} />, // OPTION 5 - Jackpot
            <Account infoAccount={infoAccount} />, // OPTION 6 - Account
            '', // OPTION 7 - Buy pack
            <Exchange infoAccount={infoAccount} />, // OPTION 8 - Exchange
            <ArdorChat infoAccount={infoAccount} />, // OPTION 9 - Chat
            <Book cards={cards} />, // OPTION 10 - Book
            '', // OPTION 11 - OPEN PACK
        ],
        [
            infoAccount,
            cards,
            cardsFiltered,
            gemCards,
            blockchainStatus,
            haveUnconfirmed,
            giftzCards,
            wethCards,
            manaCards,
        ]
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option, lastOption]);

    useEffect(() => {
        const checkAndGo = () => {
            setLastOption(directSectionToRender);
            setOption(directSectionToRender);
            setDirectSectionToRender(false);
        };
        directSectionToRender && checkAndGo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directSectionToRender, searchParams, setSearchParams]);

    useEffect(() => {
        if (directSection) {
            if (directSection === 7) onOpen();
            else if (directSection === 11) onOpenOpenPack();
            else {
                setDirectSectionToRender(directSection);
            }
            searchParams.delete('goToSection');
            setSearchParams(searchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directSection]);

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
                borderColor={borderColor}>
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
