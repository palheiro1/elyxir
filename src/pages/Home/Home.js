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
    GEMASSETACCOUNT,
    NQTDIVIDER,
    REFRESH_BLOCK_TIME,
    REFRESH_DATA_TIME,
    REFRESH_UNWRAP_TIME,
    TARASCACARDACCOUNT,
} from '../../data/CONSTANTS';

import { cleanInfoAccount } from '../../data/DefaultInfo/cleanInfoAccount';

// Services
import { fetchAllCards, fetchGemCards } from '../../utils/cardsUtils';

import {
    checkDataChange,
    getCurrentAskAndBids,
    getGIFTZBalance,
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
    processUnwrapsForAccount,
} from '../../services/Ardor/ardorInterface';
import Exchange from '../Exchange/Exchange';
import ArdorChat from '../../components/Pages/ChatPage/ArdorChat';
import Book from '../../components/Pages/BookPage/Book';
import { okToast } from '../../utils/alerts';

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

    // Navigate
    const navigate = useNavigate();

    // GEM Cards
    const [gemCards, setGemCards] = useState([]);

    // All cards
    const [cards, setCards] = useState([]);

    // Hashes
    const [infoAccountHash, setInfoAccountHash] = useState(cleanInfoAccount);
    const [gemCardsHash, setGemCardsHash] = useState('');
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
    const loadAll = useCallback(async () => {
        console.log('Mythical Beings: Fetching all data...');
        const { accountRs } = infoAccount;
        setIsLoading(true);
        setNeedReload(false);

        // Fetch all info
        const [loadCards, gems, ignis, giftz, txs, unconfirmed, currentAskOrBids, trades, dividends] =
            await Promise.all([
                fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, true),
                fetchGemCards(accountRs, GEMASSETACCOUNT, true),
                getIGNISBalance(accountRs),
                getGIFTZBalance(accountRs),
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

        // -----------------------------------------------------------------
        // Check notifications - Unconfirmed transactions
        const unconfirmedTxs = unconfirmed.unconfirmedTransactions;
        console.log('🚀 ~ file: Home.js:212 ~ loadAll ~ unconfirmedTxs:', unconfirmedTxs);
        handleNotifications({
            unconfirmedTransactions,
            newsTransactions: unconfirmedTxs,
            accountRs,
            cardsNotification,
            setCardsNotification,
            toast,
            cards,
            setUnconfirmedTransactions,
            newTransactionRef,
            confirmedTransactionRef,
        });
        // -----------------------------------------------------------------

        const auxDividends = dividends.entries;
        const auxDividendsPromises = auxDividends.map(dividend => getTransaction(2, dividend.eventHash));
        const dividendsTxs = await Promise.all(auxDividendsPromises);

        // Search in cards attachment.asset and add to dividends
        dividendsTxs.forEach((dividendTx, index) => {
            const { attachment } = dividendTx;
            const card = loadCards.find(card => card.asset === attachment.asset);
            if (card) {
                auxDividends[index].card = card;
            }
        });

        // -----------------------------------------------------------------
        // Rebuild infoAccount
        // -----------------------------------------------------------------

        const _auxInfo = {
            ...infoAccount,
            IGNISBalance: ignis,
            GIFTZBalance: giftz.unitsQNT || 0,
            GEMSBalance: gems[0].quantityQNT / NQTDIVIDER,
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
        checkDataChange('Gems', gemCardsHash, setGemCards, setGemCardsHash, gems[0]);
        checkDataChange('Account info', infoAccountHash, setInfoAccount, setInfoAccountHash, _auxInfo);

        setIsLoading(false);
    }, [
        infoAccount,
        setInfoAccount,
        cards,
        infoAccountHash,
        cardsHash,
        gemCardsHash,
        toast,
        unconfirmedTransactions,
        cardsNotification,
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
        const response = await processUnwrapsForAccount(accountRs);
        if (response && response.starts) {
            okToast('DETECTED UNWRAP: ' + response.starts + ' transfers started.', toast);
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

    const components = useMemo(
        () => [
            <Overview blockchainStatus={blockchainStatus} />,
            <Inventory infoAccount={infoAccount} cards={cardsFiltered} />,
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />,
            <Market infoAccount={infoAccount} cards={cardsFiltered} gemCards={gemCards} />,
            <Bridge infoAccount={infoAccount} cards={cardsFiltered} />,
            <Jackpot infoAccount={infoAccount} cards={cards} blockchainStatus={blockchainStatus} />,
            <Account infoAccount={infoAccount} />,
            '',
            <Exchange infoAccount={infoAccount} />,
            <ArdorChat infoAccount={infoAccount} />,
            <Book cards={cards} />,
        ],
        [infoAccount, cards, cardsFiltered, gemCards, blockchainStatus, haveUnconfirmed]
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
    }, [option, components, onOpen, lastOption]);

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

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

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
            <BuyPackDialog isOpen={isOpen} onClose={onClose} reference={buyRef} infoAccount={infoAccount} />
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
