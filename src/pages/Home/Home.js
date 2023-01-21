import { Box, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Crypto from 'crypto-browserify';
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
import { fetchAllCards, fetchGemCards } from '../../utils/cardsUtils';
import { getCurrentAskAndBids, getGIFTZBalance, getIGNISBalance } from '../../utils/walletUtils';
import { getBlockchainTransactions, getTrades, getUnconfirmedTransactions } from '../../services/Ardor/ardorInterface';
import BuyPackDialog from '../../components/Modals/BuyPackDialog/BuyPackDialog';
import { cleanInfoAccount } from '../../data/DefaultInfo/cleanInfoAccount';
import { handleConfirmateNotification, handleNewNotification } from '../../utils/alerts';

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
        if (infoAccount.token === null && infoAccount.accountRs === null) navigate('/login');
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
            const newUnconfirmedTransactions = [...unconfirmedTransactions];

            // Check for new transactions
            for (const tx of unconfirmedTxs) {
                const index = newUnconfirmedTransactions.findIndex(t => t.transaction === tx.transaction);
                if (index === -1) {
                    const isIncoming = tx.recipient === infoAccount.accountRs;
                    handleNewNotification(tx, isIncoming, toast);
                }
            }
            // Check for confirmed transactions
            for (const tx of unconfirmedTransactions) {
                const index = unconfirmedTxs.findIndex(t => t.transaction === tx.transaction);
                if (index === -1) {
                    const isIncoming = tx.recipient === infoAccount.accountRs;
                    handleConfirmateNotification(tx, isIncoming, toast);
                }
            }

            setUnconfirmedTransactions(unconfirmedTxs.filter(tx => !unconfirmedTransactions.includes(tx)));
        };

        const loadAll = async () => {
            console.log('Mythical Beings: Fetching all data...');
            const { accountRs } = infoAccount;
            setIsLoading(true);
            setNeedReload(false);

            // Fetch all info
            const [loadCards, gems, ignis, giftz, txs, unconfirmed, currentAskOrBids, trades] = await Promise.all([
                fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT, true),
                fetchGemCards(accountRs, GEMASSETACCOUNT, true),
                getIGNISBalance(accountRs),
                getGIFTZBalance(accountRs),
                getBlockchainTransactions(2, accountRs, true),
                getUnconfirmedTransactions(2, accountRs),
                getCurrentAskAndBids(accountRs),
                getTrades(2, accountRs),
            ]);

            const unconfirmedTxs = unconfirmed.unconfirmedTransactions;

            // -----------------------------------------------------------------
            // Rebuild infoAccount
            // -----------------------------------------------------------------

            const _auxInfo = {
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT,
                GEMSBalance: gems[0].quantityQNT / NQTDIVIDER,
                transactions: txs.transactions,
                unconfirmedTxs: unconfirmedTxs,
                currentAsks: currentAskOrBids.askOrders,
                currentBids: currentAskOrBids.bidOrders,
                trades: trades.trades,
            };

            // -----------------------------------------------------------------
            // Check notifications - Unconfirmed transactions
            handleNotifications(unconfirmedTxs);
            // -----------------------------------------------------------------

            // -----------------------------------------------------------------
            // Get all hashes and compare
            // -----------------------------------------------------------------
            const loadCardsHash = Crypto.createHash('sha256').update(JSON.stringify(loadCards)).digest('hex');
            const loadGemCardHash = Crypto.createHash('sha256').update(JSON.stringify(gems[0])).digest('hex');
            const loadInfoAccountHash = Crypto.createHash('sha256').update(JSON.stringify(_auxInfo)).digest('hex');

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
    ]);

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
            <Jackpot infoAccount={infoAccount} cards={cards} yourCards={cardsFiltered} />, // Option 4 - Jackpot
            <Account infoAccount={infoAccount} />, // Option 5 - Account
            // Option 6 - BuyPack - Modal
        ];

        const loadComponent = async () => {
            if (option === 6) {
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

    return (
        <>
            <Box bg={bgColor} m={4} px={4} py={2} rounded="lg">
                <LateralMenu
                    account={infoAccount.accountRs}
                    username={infoAccount.name}
                    handleLogout={handleLogout}
                    option={option}
                    setOption={handleChangeOption}
                    children={renderComponent}
                    showAllCards={showAllCards}
                    handleShowAllCards={handleShowAllCards}
                />
            </Box>
            <BuyPackDialog isOpen={isOpen} onClose={onClose} reference={buyRef} infoAccount={infoAccount} />
        </>
    );
};

export default Home;
