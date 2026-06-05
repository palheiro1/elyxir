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
import Elyxir from '../../components/Pages/ElyxirPage';
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

import { checkCardsChange, checkDataChange, getCurrentAskAndBids, getIGNISBalance } from '../../utils/walletUtils';

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
import { setCardsManually } from '../../redux/reducers/CardsReducer';
import ProfileDropdown from '../../components/Navigation/ProfileDropdown';
import { fetchAllItems } from '../../utils/itemsUtils';
import { setItemsManually } from '../../redux/reducers/ItemsReducer';
import apiMonitor from '../../utils/apiMonitor';
import { fetchAllElyxirData } from '../../redux/reducers/ElyxirReducer';

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
const Home = memo(({ infoAccount, setInfoAccount, walletProvider = null, embedded = false, initialOption = 0 }) => {
    const toast = useToast();
    const dispatch = useDispatch();

    // Get cards from Redux store
    const { cards } = useSelector(state => state.cards);

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
    const [itemsHash, setItemsHash] = useState('');

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
    const [option, setOption] = useState(initialOption);
    const [lastOption, setLastOption] = useState(initialOption);

    // Selected bridge type
    const [selectedBridgeType, setSelectedBridgeType] = useState(null);

    // Component to render
    const [renderComponent, setRenderComponent] = useState(<Overview />);

    // -----------------------------------------------------------------
    const [searchParams, setSearchParams] = useSearchParams();
    const directSection = parseInt(searchParams.get('goToSection')) || false;
    const [directSectionToRender, setDirectSectionToRender] = useState(directSection);

    // -----------------------------------------------------------------
    // Check if user is logged
    // -----------------------------------------------------------------
    useEffect(() => {
        const hasEmbeddedSession = embedded && Boolean(infoAccount?.accountRs);
        if (!hasEmbeddedSession && isNotLogged(infoAccount)) navigate('/login');
    }, [embedded, infoAccount, navigate]);

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

    const handleChangeOption = useCallback(newOption => {
        setLastOption(option);
        setOption(newOption);
    }, [option]);

    // -----------------------------------------------------------------
    // Load all data from blockchain - Main flow
    // -----------------------------------------------------------------
    const updateDividendsWithCards = async (auxDividends, allCards) => {
        auxDividends.filter(dividend => dividend.attachment && dividend.attachment.asset);
        const auxDividendsPromises = auxDividends.map(dividend => getTransaction(2, dividend.eventHash));
        const dividendsTxs = await Promise.all(auxDividendsPromises);

        dividendsTxs.forEach((dividendTx, index) => {
            const attachment = dividendTx?.attachment;
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
                    return;
                }
                setLastRequestTime(now);

                setIsLoading(true);
                setNeedReload(false);
                const { accountRs } = infoAccount;
                const safeLoad = async (label, promise, fallback) => {
                    try {
                        const value = await promise;
                        return value ?? fallback;
                    } catch (error) {
                        console.error(`Mythical Beings: Error loading ${label}`, error);
                        return fallback;
                    }
                };
                const emptyBalance = { quantityQNT: 0, unconfirmedQuantityQNT: 0 };
                const getAssetBalance = (assetGroup, assetId) =>
                    Array.isArray(assetGroup) ? assetGroup.find(asset => asset.asset === assetId) || emptyBalance : emptyBalance;

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
                    safeLoad('cards', fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, true), []),
                    safeLoad(
                        'currency assets',
                        fetchCurrencyAssets(
                            accountRs,
                            [GEMASSETACCOUNT, WETHASSETACCOUNT, GIFTZASSETACCOUNT, MANAACCOUNT],
                            true
                        ),
                        [[], [], [], []]
                    ),
                    safeLoad('IGNIS balance', getIGNISBalance(accountRs), 0),
                    safeLoad('transactions', getBlockchainTransactions(2, accountRs, true), { transactions: [] }),
                    safeLoad('current orders', getCurrentAskAndBids(accountRs), { askOrders: [], bidOrders: [] }),
                    safeLoad('trades', getTrades(2, accountRs), { trades: [] }),
                    safeLoad(
                        'dividends',
                        getAccountLedger({
                            accountRs: accountRs,
                            firstIndex: 0,
                            lastIndex: 99,
                            eventType: 'ASSET_DIVIDEND_PAYMENT',
                        }),
                        { entries: [] }
                    ),
                    safeLoad('OMNO GIFTZ balance', getOmnoGiftzBalance(accountRs), 0),
                    safeLoad('items', fetchAllItems(accountRs), []),
                    safeLoad('account assets', getAccountAssets(accountRs), { accountAssets: [] }),
                ]);

                const currencyAssetGroups = Array.isArray(currencyAssets) ? currencyAssets : [[], [], [], []];
                const gems = getAssetBalance(currencyAssetGroups[0], GEMASSET);
                const weth = getAssetBalance(currencyAssetGroups[1], WETHASSET);
                const giftzAsset = getAssetBalance(currencyAssetGroups[2], GIFTZASSET);
                const mana = getAssetBalance(currencyAssetGroups[3], MANAASSET);
                const transactions = Array.isArray(txs.transactions) ? txs.transactions : [];
                const dividendEntries = Array.isArray(dividends.entries) ? dividends.entries : [];
                const tradesList = Array.isArray(trades.trades) ? trades.trades : [];
                const accountAssetList = Array.isArray(accountAssets.accountAssets) ? accountAssets.accountAssets : [];

                // Always dispatch cards and items when they're loaded to ensure Redux state is updated
                dispatch(setCardsManually(loadCards));
                dispatch(setItemsManually(loadItems));
                if (transactions.length === 0) {
                    firstTimeToast(toast);
                }

                // -----------------------------------------------------------------

                await updateDividendsWithCards(dividendEntries, loadCards);
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
                    transactions,
                    dividends: dividendEntries,
                    unconfirmedTxs: unconfirmedTransactions,
                    currentAsks: currentAskOrBids.askOrders,
                    currentBids: currentAskOrBids.bidOrders,
                    trades: tradesList,
                    stuckedGiftz: giftzOmnoBalance,
                    assets: accountAssetList,
                };

                dispatch(fetchAllElyxirData({ infoAccount: _auxInfo }));
                checkDataChange('Account info', infoAccountHash, setInfoAccount, setInfoAccountHash, _auxInfo);

                checkDataChange('Gems', gemCardsHash, setGemCards, setGemCardsHash, gems);
                checkDataChange('GIFTZ', giftzCardsHash, setGiftzCards, setGiftzCardsHash, giftzAsset);
                checkDataChange('wETH', wethCardsHash, setWethCards, setWethCardsHash, weth);
                checkDataChange('MANA', manaCardsHash, setManaCards, setManaCardsHash, mana);
                // Remove the duplicate card dispatch since we're already dispatching above
                // checkCardsChange('Cards', cardsHash, setCardsHash, dispatch, loadCards, setCardsManually);
                checkCardsChange('Items', itemsHash, setItemsHash, dispatch, loadItems, setItemsManually);

                // Log API monitor stats after successful load
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
                setNeedReload(true);
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
                    setNeedReload(true);
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
    useEffect(() => {
        infoAccountRef.current = infoAccount;
    }, [infoAccount]);
    useEffect(() => {
        toastRef.current = toast;
    }, [toast]);

    const checkUnwraps = useCallback(async () => {
        try {
            const { accountRs } = infoAccountRef.current;
            Promise.all([
                processUnwrapsForGemBridge(accountRs),
                processUnwrapsFor1155(accountRs),
                processWrapsFor20(accountRs),
            ]).then(([gemBridge, bridge1155, bridge20]) => {
                if (gemBridge && gemBridge.starts)
                    okToast(
                        '[GEM BRIDGE] DETECTED UNWRAP: ' + gemBridge.starts + ' transfers started.',
                        toastRef.current
                    );
                if (bridge1155 && bridge1155.starts)
                    okToast(
                        '[ERC-1155] DETECTED UNWRAP: ' + bridge1155.starts + ' transfers started.',
                        toastRef.current
                    );
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

    document.title = embedded ? 'Mythical Beings | Elyxir' : 'Mythical Beings | Wallet';

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
            <Inventory infoAccount={infoAccount} />, // OPTION 1 - Inventory
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />, // OPTION 2 - History
            <Market
                infoAccount={infoAccount}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
            />, // OPTION 3 - Market
            <Bridge
                key={`bridge-${selectedBridgeType}`}
                infoAccount={infoAccount}
                cards={cards}
                gemCards={gemCards}
                giftzCards={giftzCards}
                wethCards={wethCards}
                manaCards={manaCards}
                selectedBridgeType={selectedBridgeType}
            />, // OPTION 4 - Bridge
            <NewsAirdrops goToSection={handleChangeOption} />, // OPTION 5 - News & Airdrops
            <Account infoAccount={infoAccount} />, // OPTION 6 - Account
            '', // OPTION 7 - Buy pack
            <Exchange infoAccount={infoAccount} />, // OPTION 8 - Exchange
            '', // OPTION 9 - OPEN PACK
            <Elyxir infoAccount={infoAccount} walletProvider={walletProvider} embedded={embedded} />, // OPTION 10 - Elyxir
        ],
        [
            infoAccount,
            walletProvider,
            embedded,
            cards,
            gemCards,
            haveUnconfirmed,
            giftzCards,
            wethCards,
            manaCards,
            selectedBridgeType,
            handleChangeOption,
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
