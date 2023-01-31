import { Box, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import equal from 'fast-deep-equal';

// Menu
import LateralMenu from '../../components/LateralMenu/LateralMenu';

// Pages
import History from '../../components/Pages/HistoryPage/History';
import Overview from '../../components/Pages/HomePage/Overview';
import Inventory from '../../components/Pages/InventoryPage/Inventory';
import Jackpot from '../../components/Pages/JackpotPage/Jackpot';
import Market from '../../components/Pages/MarketPage/Market';
import Account from '../../components/Pages/AccountPage/Account';

// Data
import {
    COLLECTIONACCOUNT,
    GEMASSETACCOUNT,
    NQTDIVIDER,
    REFRESH_DATA_TIME,
    TARASCACARDACCOUNT,
} from '../../data/CONSTANTS';

// Services
import { fetchAllCards, fetchGemCards, getAsset } from '../../utils/cardsUtils';
import { getCurrentAskAndBids, getGIFTZBalance, getIGNISBalance } from '../../utils/walletUtils';
import {
    getAccountLedger,
    getBlockchainTransactions,
    getTrades,
    getUnconfirmedTransactions,
} from '../../services/Ardor/ardorInterface';
import BuyPackDialog from '../../components/Modals/BuyPackDialog/BuyPackDialog';
import { cleanInfoAccount } from '../../data/DefaultInfo/cleanInfoAccount';
import { handleConfirmateNotification, handleNewNotification } from '../../utils/alerts';
import CardReceived from '../../components/Modals/CardReceived/CardReceived';
import Bridge from '../../components/Pages/Bridge/Bridge';
import { generateHash } from '../../utils/hash';

/**
 * @name Home
 * @description Home page (main page)
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render all the pages
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount, setInfoAccount }) => {
    const toast = useToast();

    // Buy pack dialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buyRef = useRef();

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

    const [cardsNotification, setCardsNotification] = useState(cards);

    // -----------------------------------------------------------------
    // Show all cards - Toggle button
    const [showAllCards, setShowAllCards] = useState(true);
    const handleShowAllCards = () => setShowAllCards(!showAllCards);

    useEffect(() => {
        if (showAllCards) {
            setCardsFiltered(cards);
        } else {
            setCardsFiltered(cards.filter(card => Number(card.quantityQNT) > 0));
        }
    }, [showAllCards, cards]);

    // -----------------------------------------------------------------

    // Check if user is logged
    useEffect(() => {
        if (infoAccount.token === null || infoAccount.accountRs === null) navigate('/login');
    }, [infoAccount, navigate]);

    // -----------------------------------------------------------------
    const handleChangeOption = newOption => {
        setLastOption(option);
        setOption(newOption);
    };

    // -----------------------------------------------------------------
    // Load all data from blockchain
    // -----------------------------------------------------------------
    useEffect(() => {
        const handleNotifications = unconfirmedTxs => {
            const unconfirmed = [...unconfirmedTransactions];
            const cardsToNotify = [];

            for (const tx of unconfirmedTxs) {
                const existingTxIndex = unconfirmed.findIndex(t => t.fullHash === tx.fullHash);
                const isIncoming = tx.recipientRS === infoAccount.accountRs;
                if (existingTxIndex === -1) {
                    handleNewNotification(tx, isIncoming, toast);
                    unconfirmed.push(tx);
                } else {
                    const asset = getAsset(tx.attachment.asset, cards);
                    const amount = Number(tx.attachment.quantityQNT);
                    if (asset && asset !== 'GEM' && isIncoming) {
                        cardsToNotify.push({ asset, amount });
                    } else {
                        handleConfirmateNotification(tx, isIncoming, toast, onOpenCardReceived);
                    }
                    unconfirmed.splice(existingTxIndex, 1);
                }
            }
            setCardsNotification(cardsToNotify);
            setUnconfirmedTransactions(unconfirmed);
        };

        const loadAll = async () => {
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
            handleNotifications(unconfirmedTxs);
            // -----------------------------------------------------------------

            // -----------------------------------------------------------------
            // Rebuild infoAccount
            // -----------------------------------------------------------------

            const _auxInfo = {
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT || 0,
                GEMSBalance: gems[0].quantityQNT / NQTDIVIDER,
                transactions: txs.transactions,
                dividends: dividends.entries,
                unconfirmedTxs: unconfirmedTxs,
                currentAsks: currentAskOrBids.askOrders,
                currentBids: currentAskOrBids.bidOrders,
                trades: trades.trades,
            };

            // -----------------------------------------------------------------
            // Get all hashes and compare
            // -----------------------------------------------------------------
            const loadCardsHash = generateHash(loadCards);
            const loadGemCardHash = generateHash(gems[0]);
            const loadInfoAccountHash = generateHash(_auxInfo);

            // Check if cardData has changed
            if (!equal(cardsHash, loadCardsHash)) {
                console.log('Mythical Beings: Cards changed');
                setCards(loadCards);
                setCardsHash(loadCardsHash);
            }

            // Check if gemCards has changed
            if (!equal(gemCardsHash, loadGemCardHash)) {
                console.log('Mythical Beings: Gems changed');
                setGemCards(gems[0]);
                setGemCardsHash(loadGemCardHash);
            }

            // Check if infoAccount has changed
            if (!equal(infoAccountHash, loadInfoAccountHash)) {
                console.log('Mythical Beings: Account info changed');
                setInfoAccount(_auxInfo);
                setInfoAccountHash(loadInfoAccountHash);
            }

            setIsLoading(false);
        };

        if (infoAccount.accountRs && needReload && !isLoading) {
            loadAll();
        }

        const intervalId = setInterval(() => {
            if (!isLoading) {
                setNeedReload(true);
            }
        }, REFRESH_DATA_TIME);

        return () => clearInterval(intervalId);
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
    ]);

    // -----------------------------------------------------------------
    // Check for new cards notifications
    // -----------------------------------------------------------------

    useEffect(() => {
        if (cardsNotification.length > 0) {
            onOpenCardReceived();
        }
    }, [cardsNotification, onOpenCardReceived]);

    // -----------------------------------------------------------------
    // Load component to render
    // -----------------------------------------------------------------

    useEffect(() => {
        const haveUnconfirmed = infoAccount.unconfirmedTxs && infoAccount.unconfirmedTxs.length > 0;

        const components = [
            <Overview />, // Option 0 - Overview
            <Inventory infoAccount={infoAccount} cards={cardsFiltered} />, // Option 1 - Inventory
            <History infoAccount={infoAccount} collectionCardsStatic={cards} haveUnconfirmed={haveUnconfirmed} />, // Option 2 - History
            <Market infoAccount={infoAccount} cards={cardsFiltered} gemCards={gemCards} />, // Option 3 - Market
            <Bridge infoAccount={infoAccount} cards={cardsFiltered} />, // Option 4 - Bridge
            <Jackpot infoAccount={infoAccount} cards={cards} />, // Option 5 - Jackpot
            <Account infoAccount={infoAccount} />, // Option 6 - Account
            // Option 7 - BuyPack - Modal
        ];

        const loadComponent = async () => {
            if (option === 7) {
                onOpen();
                setOption(lastOption);
            } else {
                setRenderComponent(components[option]);
            }
        };

        loadComponent();
    }, [option, infoAccount, cards, cardsFiltered, gemCards, onOpen, lastOption]);

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

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

    const goToSection = (option) => {
        setOption(option);
    };

    return (
        <>
            <Box bg={bgColor} m={{ base: 2, md: 12 }} px={{ base: 2, md: 8 }} py={4} rounded="lg">
                <LateralMenu
                    infoAccount={infoAccount}
                    handleLogout={handleLogout}
                    option={option}
                    setOption={handleChangeOption}
                    children={renderComponent}
                    showAllCards={showAllCards}
                    handleShowAllCards={handleShowAllCards}
                    goToSection={goToSection}
                />
            </Box>
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
