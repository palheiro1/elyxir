import { useEffect, useState, memo, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

// -----------------------------------------------------------------
// ------------------------- Components ----------------------------
// -----------------------------------------------------------------

// Menu
import LateralMenu from '../../components/Navigation/LateralMenu/LateralMenu';

// Pages
import History from '../../components/Pages/HistoryPage/History';
import Overview from '../../components/Pages/HomePage/Overview';
import NewsAirdrops from '../../components/Pages/HomePage/NewsAirdrops';
import Inventory from '../../components/Pages/InventoryPage/Inventory';
// import Bounty from '../../components/Pages/BountyPage/Bounty';
import Market from '../../components/Pages/MarketPage/Market';
import Account from '../../components/Pages/AccountPage/Account';

// Modals
import BuyPackDialog from '../../components/Modals/BuyPackDialog/BuyPackDialog';
import Bridge from '../../components/Pages/Bridge/Bridge';
import { isNotLogged } from '../../utils/validators';

// -----------------------------------------------------------------
// ------------------------- Functions -----------------------------
import { getBlockchainBlocks } from '../../redux/reducers/BlockchainReducer';

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

import {
    checkCardsChange,
    checkDataChange,
    getCurrentAskAndBids,
    getIGNISBalance,
} from '../../utils/walletUtils';

import {
    getAccountAssets,
    getAccountLedger,
    getBlockchainTransactions,
    getTrades,
    getTransaction,
    processUnwrapsFor1155,
    processUnwrapsForGemBridge,
    processWrapsFor20,
} from '../../services/Ardor/ardorInterface';
import Exchange from '../Exchange/Exchange';
import { firstTimeToast, okToast } from '../../utils/alerts';
import { getOmnoGiftzBalance } from '../../services/Ardor/omnoInterface';
import Elyxir from '../../components/Pages/ElyxirPage/Elyxir';
import { setCardsManually } from '../../redux/reducers/CardsReducer';
import ProfileDropdown from '../../components/Navigation/ProfileDropdown';
import { fetchAllItems } from '../../utils/itemsUtils';
import { setItemsManually } from '../../redux/reducers/ItemsReducer';
import apiMonitor from '../../utils/apiMonitor';

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
    const dispatch = useDispatch();

    // Get cards from Redux store
    const { cards } = useSelector(state => state.cards);
    const { items } = useSelector(state => state.items);
    
    // Debug Redux state changes
    useEffect(() => {
        console.log('Home - Redux cards state changed, length:', cards.length);
        console.log('Home - Redux items state changed, length:', items.length);
    }, [cards, items]);

    // Buy pack dialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buyRef = useRef();

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

    // Hashes
    const [infoAccountHash, setInfoAccountHash] = useState(cleanInfoAccount);
    const [gemCardsHash, setGemCardsHash] = useState('');
    const [giftzCardsHash, setGiftzCardsHash] = useState('');
    const [wethCardsHash, setWethCardsHash] = useState('');
    const [manaCardsHash, setManaCardsHash] = useState('');
    const [cardsHash] = useState('');
    const [itemsHash, setItemsHash] = useState('');

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    // Uncorfirmed transactions
    const [unconfirmedTransactions] = useState([]);

    // Need reload data
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // Add request deduplication to prevent multiple simultaneous requests
    const [lastRequestTime, setLastRequestTime] = useState(0);
    const REQUEST_DEBOUNCE_MS = 5000; // Minimum 5 seconds between requests
    
    // Add abort controller for request cancellation
    const abortControllerRef = useRef(null);

    // Menu
    const [option, setOption] = useState(0);
    const [lastOption, setLastOption] = useState(0);

    // Selected bridge type
    const [selectedBridgeType, setSelectedBridgeType] = useState(null);

    // Component to render
    const [renderComponent, setRenderComponent] = useState(<Overview />);

    // -----------------------------------------------------------------
    const [searchParams, setSearchParams] = useSearchParams();
    const directSection = parseInt(searchParams.get('goToSection')) || false;
    const [directSectionToRender, setDirectSectionToRender] = useState(directSection);

    // -----------------------------------------------------------------
    // ------------------------- Functions -----------------------------
    // -----------------------------------------------------------------
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

    useEffect(() => {
        if (!infoAccount.accountRs || !needReload || isLoading) return;

        const loadAll = async () => {
            try {
                // Check API rate limiting before proceeding
                if (!apiMonitor.shouldAllowCall('loadAll')) {
                    console.warn('Home - LoadAll blocked by API monitor');
                    setIsLoading(false);
                    return;
                }
                
                // Cancel previous request if still running
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();
                
                // Prevent overlapping requests with debouncing
                const now = Date.now();
                if (now - lastRequestTime < REQUEST_DEBOUNCE_MS) {
                    console.log('Home - Request debounced, skipping loadAll');
                    return;
                }
                setLastRequestTime(now);
                
                setIsLoading(true);
                setNeedReload(false);
                const { accountRs } = infoAccount;

                console.log('Home - Starting loadAll with debouncing at:', new Date().toISOString());

                // Fetch all info
                const [
                    loadCards,
                    currencyAssets,
                    ignis,
                    txs,
                    currentAskOrBids,
                    trades,
                    dividends,
                    giftzOmnoBalance,
                    loadItems,
                    accountAssets,
                ] = await Promise.all([
                    fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, true),
                    fetchCurrencyAssets(
                        accountRs,
                        [GEMASSETACCOUNT, WETHASSETACCOUNT, GIFTZASSETACCOUNT, MANAACCOUNT],
                        true
                    ),
                    getIGNISBalance(accountRs),
                    getBlockchainTransactions(2, accountRs, true),
                    getCurrentAskAndBids(accountRs),
                    getTrades(2, accountRs),
                    getAccountLedger({
                        accountRs: accountRs,
                        firstIndex: 0,
                        lastIndex: 99,
                        eventType: 'ASSET_DIVIDEND_PAYMENT',
                    }),
                    getOmnoGiftzBalance(accountRs),
                    fetchAllItems(accountRs),
                    getAccountAssets(accountRs),
                ]);

                const gems = currencyAssets[0].find(asset => asset.asset === GEMASSET);
                const weth = currencyAssets[1].find(asset => asset.asset === WETHASSET);
                const giftzAsset = currencyAssets[2].find(asset => asset.asset === GIFTZASSET);
                const mana = currencyAssets[3].find(asset => asset.asset === MANAASSET);

                // Always dispatch cards and items when they're loaded to ensure Redux state is updated
                console.log('Home - Dispatching cards to Redux. LoadCards length:', loadCards.length);
                console.log('Home - Current Redux cards length:', cards.length);
                dispatch(setCardsManually(loadCards));
                
                console.log('Home - Dispatching items to Redux. LoadItems length:', loadItems.length);
                dispatch(setItemsManually(loadItems));
                if (txs.transactions.length === 0) {
                    firstTimeToast(toast);
                }

                // -----------------------------------------------------------------

                const auxDividends = dividends.entries;
                updateDividendsWithCards(auxDividends, loadCards).then(() => {
                    // -----------------------------------------------------------------
                    // Debug account assets
                    // -----------------------------------------------------------------
                    console.log('Home - accountAssets from API:', accountAssets);
                    console.log('Home - accountAssets.accountAssets:', accountAssets?.accountAssets);
                    
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
                        unconfirmedTxs: unconfirmedTransactions,
                        currentAsks: currentAskOrBids.askOrders,
                        currentBids: currentAskOrBids.bidOrders,
                        trades: trades.trades,
                        stuckedGiftz: giftzOmnoBalance,
                        assets: accountAssets.accountAssets,
                    };

                    console.log('Home - _auxInfo.assets:', _auxInfo.assets);
                    console.log('Home - _auxInfo object:', _auxInfo);

                    // -----------------------------------------------------------------
                    // Get all hashes and compare
                    // -----------------------------------------------------------------
                    checkDataChange('Account info', infoAccountHash, setInfoAccount, setInfoAccountHash, _auxInfo);
                });

                checkDataChange('Gems', gemCardsHash, setGemCards, setGemCardsHash, gems);
                checkDataChange('GIFTZ', giftzCardsHash, setGiftzCards, setGiftzCardsHash, giftzAsset);
                checkDataChange('wETH', wethCardsHash, setWethCards, setWethCardsHash, weth);
                checkDataChange('MANA', manaCardsHash, setManaCards, setManaCardsHash, mana);
                // Remove the duplicate card dispatch since we're already dispatching above
                // checkCardsChange('Cards', cardsHash, setCardsHash, dispatch, loadCards, setCardsManually);
                console.log('Home - After loadAll, final Redux cards length should be:', loadCards.length);
                checkCardsChange('Items', itemsHash, setItemsHash, dispatch, loadItems, setItemsManually);
                
                // Log API monitor stats after successful load
                console.log('Home - LoadAll completed successfully');
                apiMonitor.logStats();
            } catch (error) {
                console.error('Mythical Beings: Error loading data', error);
                // On error, add additional delay before allowing next request
                setLastRequestTime(Date.now() + REQUEST_DEBOUNCE_MS);
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        };

        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infoAccount, needReload]);

    // Add page visibility monitoring to reduce API calls when tab is not active
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('Home - Tab became visible, triggering reload');
                setNeedReload(true);
            } else {
                console.log('Home - Tab became hidden, pausing refreshes');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Cleanup effect to cancel ongoing requests when component unmounts
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                console.log('Home - Component unmounting, aborting requests');
            }
        };
    }, []);

    // Only set up this interval once, and use a ref to always get the latest isLoading
    const isLoadingRef = useRef(isLoading);
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isLoadingRef.current) {
                // Only trigger reload if user is active and tab is visible
                if (document.visibilityState === 'visible') {
                    console.log('Home - Interval triggering reload at:', new Date().toISOString());
                    setNeedReload(true);
                } else {
                    console.log('Home - Skipping reload, tab not visible');
                }
            }
        }, REFRESH_DATA_TIME);
        return () => clearInterval(intervalId);
    }, []);

    // -----------------------------------------------------------------
    // Check for new blocks
    // -----------------------------------------------------------------

    // Only set up this interval once
    const dispatchRef = useRef(dispatch);
    useEffect(() => {
        dispatchRef.current = dispatch;
    }, [dispatch]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Only check blocks if tab is visible and API monitor allows it
            if (document.visibilityState === 'visible' && apiMonitor.shouldAllowCall('getBlockchainBlocks')) {
                dispatchRef.current(getBlockchainBlocks());
            }
        }, REFRESH_BLOCK_TIME);
        return () => clearInterval(intervalId);
    }, []);

    // -----------------------------------------------------------------
    // Check for new unwraps
    // -----------------------------------------------------------------

    // Use refs to keep checkUnwraps stable
    const infoAccountRef = useRef(infoAccount);
    const toastRef = useRef(toast);
    useEffect(() => { infoAccountRef.current = infoAccount; }, [infoAccount]);
    useEffect(() => { toastRef.current = toast; }, [toast]);

    const checkUnwraps = useCallback(async () => {
        try {
            const { accountRs } = infoAccountRef.current;
            Promise.all([
                processUnwrapsForGemBridge(accountRs),
                processUnwrapsFor1155(accountRs),
                processWrapsFor20(accountRs),
            ]).then(([gemBridge, bridge1155, bridge20]) => {
                if (gemBridge && gemBridge.starts)
                    okToast('[GEM BRIDGE] DETECTED UNWRAP: ' + gemBridge.starts + ' transfers started.', toastRef.current);
                if (bridge1155 && bridge1155.starts)
                    okToast('[ERC-1155] DETECTED UNWRAP: ' + bridge1155.starts + ' transfers started.', toastRef.current);
                if (bridge20 && bridge20.starts)
                    okToast('[ERC-20] DETECTED WRAP: ' + bridge20.starts + ' transfers started.', toastRef.current);
            });
        } catch (error) {
            console.error('Mythical Beings: Error checking unwraps', error);
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(checkUnwraps, REFRESH_UNWRAP_TIME);
        return () => clearInterval(intervalId);
    }, [checkUnwraps]);

    // -----------------------------------------------------------------
    // Load component to render
    // -----------------------------------------------------------------

    const haveUnconfirmed = useMemo(() => {
        if (!infoAccount || !infoAccount.unconfirmedTxs) {
            return false;
        }

        return infoAccount.unconfirmedTxs.some(
            tx => tx.attachment && (ASSETS_IDS.includes(tx.attachment.asset) || !tx.attachment.asset)
        );
    }, [infoAccount]);

    document.title = 'Mythical Beings | Wallet';

    const MENU_OPTIONS_COLOR = [
        '#2f9088', // Overview
        '#2f8190', // Inventory
        '#3b7197', // History
        '#3b6497', // Market
        '#573b97', // Bridge
        '#3b5397', // Bounty
        '#4e3b97', // Account
        '#9f3772', // Buy pack
        '#413b97', // Exchange
        '#e094b3', // Open pack
        '#B53FEA', // Elyxir
    ];

    const components = useMemo(
        () => [
            <Overview />, // OPTION 0 - Overview
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
                key={`bridge-${selectedBridgeType}`}
                infoAccount={infoAccount}
                cards={cardsFiltered}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
                selectedBridgeType={selectedBridgeType}
            />, // OPTION 4 - Bridge
            <NewsAirdrops />, // OPTION 5 - News & Airdrops
            <Account infoAccount={infoAccount} />, // OPTION 6 - Account
            '', // OPTION 7 - Buy pack
            <Exchange infoAccount={infoAccount} />, // OPTION 8 - Exchange
            '', // OPTION 9 - OPEN PACK
            <Elyxir />, // OPTION 10 - Elyxir
        ],
        [
            infoAccount,
            cards,
            cardsFiltered,
            gemCards,
            haveUnconfirmed,
            giftzCards,
            wethCards,
            manaCards,
            selectedBridgeType,
        ]
    );

    useEffect(() => {
        const loadComponent = () => {
            if (option === 7) {
                onOpen();
                setOption(lastOption);
            } else {
                setRenderComponent(components[option]);
            }
        };

        loadComponent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option, lastOption, selectedBridgeType]);

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
        <Box position={'relative'} overflowX={'hidden'}>
            {/* MAIN COMPONENT - LATERAL MENU & CHILDREN */}
            <ProfileDropdown setOption={setOption} handleLogout={handleLogout} />
            <Box
                bg={bgColor}
                mt={{ base: 'none', md: 12, lg: 'none' }}
                m={{ base: 2, lg: 12 }}
                px={{ base: 2, lg: 8 }}
                mb={0}
                py={4}
                pb={0}
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
                    cardsLoaded={cards.length > 0 ? true : false}
                    setSelectedBridgeType={setSelectedBridgeType}
                />
            </Box>

            {/* DIALOGS */}
            {isOpen && <BuyPackDialog isOpen={isOpen} onClose={onClose} reference={buyRef} infoAccount={infoAccount} />}
        </Box>
    );
});

export default Home;
