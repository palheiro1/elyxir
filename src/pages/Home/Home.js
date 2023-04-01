import { useEffect, useRef, useState } from 'react';
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
    BLOCKTIME,
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
const Home = ({ infoAccount, setInfoAccount }) => {
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
        timer: BLOCKTIME,
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
    useEffect(() => {
        const loadAll = async () => {
            console.log('Mythical Beings: Fetching all data...');
            const { accountRs } = infoAccount;
            setIsLoading(true);
            setNeedReload(false);

            // Fetch all info
            const [
                loadCards,
                gems,
                ignis,
                giftz,
                txs,
                unconfirmed,
                currentAskOrBids,
                trades,
                dividends,
            ] = await Promise.all([
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
        };

        if (infoAccount.accountRs && needReload && !isLoading) {
            loadAll();
        }
    }, [
        infoAccount,
        needReload,
        isLoading,
        setInfoAccount,
        cards,
        gemCards,
        infoAccountHash,
        cardsHash,
        gemCardsHash,
        toast,
        unconfirmedTransactions,
        onOpenCardReceived,
        cardsNotification,
        blockchainStatus,
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

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const auxBlockchainStatus = await getBlockchainStatus();
            const nBlocks = auxBlockchainStatus.data.numberOfBlocks;
            if (blockchainStatus.prev_height !== nBlocks) {
                console.log("Mythical Beings: New block detected!");
                setBlockchainStatus({
                    prev_height: nBlocks,
                    timer: BLOCKTIME,
                });
            }
        }, REFRESH_BLOCK_TIME);

        return () => clearInterval(intervalId);
    }, [blockchainStatus]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(blockchainStatus.timer <= 0) return;
            setBlockchainStatus({
                ...blockchainStatus,
                timer: blockchainStatus.timer - 1,
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [blockchainStatus]);

    // -----------------------------------------------------------------
    // Check for new cards notifications
    // -----------------------------------------------------------------

    useEffect(() => {
        if (cardsNotification.length > 0) onOpenCardReceived();
    }, [cardsNotification, onOpenCardReceived]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            newTransactionRef.current = null;
            confirmedTransactionRef.current = null;
        }, REFRESH_DATA_TIME * 4);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const checkUnwraps = async () => {
                const { accountRs } = infoAccount;
                const response = await processUnwrapsForAccount(accountRs);
                if (response && response.starts) {
                    okToast('DETECTED UNWRAP: ' + response.starts + ' transfers started.', toast);
                }
            };
            checkUnwraps();
        }, REFRESH_UNWRAP_TIME);

        return () => clearInterval(intervalId);
    }, [infoAccount, toast]);

    // -----------------------------------------------------------------
    // Load component to render
    // -----------------------------------------------------------------

    useEffect(() => {
        const haveUnconfirmed = infoAccount.unconfirmedTxs && infoAccount.unconfirmedTxs.length > 0;

        const components = [
            <Overview blockchainStatus={blockchainStatus} />, // Option 0 - Overview
            <Inventory infoAccount={infoAccount} cards={cardsFiltered} />, // Option 1 - Inventory
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />, // Option 2 - History
            <Market infoAccount={infoAccount} cards={cardsFiltered} gemCards={gemCards} />, // Option 3 - Market
            <Bridge infoAccount={infoAccount} cards={cardsFiltered} />, // Option 4 - Bridge
            <Jackpot infoAccount={infoAccount} cards={cards} blockchainStatus={blockchainStatus} />, // Option 5 - Jackpot
            <Account infoAccount={infoAccount} />, // Option 6 - Account
            '', // Option 7 - Buy packs
            <Exchange infoAccount={infoAccount} />, // Option 8 - Exchange
            <ArdorChat infoAccount={infoAccount} />, // Option 9 - Ardor Chat
            <Book />, // Option 10 - Book
        ];

        const loadComponent = () => {
            if (option === 7) {
                onOpen();
                setOption(lastOption);
            } else {
                setRenderComponent(components[option]);
            }
        };

        loadComponent();
    }, [option, infoAccount, cards, cardsFiltered, gemCards, onOpen, lastOption, blockchainStatus]);

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
                    nextBlock={blockchainStatus.timer}
                />
            </Box>

            {/* DIALOGS */}
            <BuyPackDialog isOpen={isOpen} onClose={onClose} reference={buyRef} infoAccount={infoAccount} />
            <CardReceived
                isOpen={isOpenCardReceived}
                onClose={handleOnCloseCardReceived}
                reference={cardReceivedRef}
                cards={cardsNotification}
            />
        </>
    );
};

export default Home;
