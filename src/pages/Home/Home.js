import { Box, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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

/**
 * @name Home
 * @description Home page (main page)
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render all the pages
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount, setInfoAccount }) => {
    // Navigate
    const navigate = useNavigate();

    // GEM Cards
    const [gemCards, setGemCards] = useState([]);

    // All cards
    const [cards, setCards] = useState([]);

    // Hashes
    const [infoAccountHash, setInfoAccountHash] = useState('');
    const [gemCardsHash, setGemCardsHash] = useState('');
    const [cardsHash, setCardsHash] = useState('');

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    // Need reload data
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Menu
    const [option, setOption] = useState(0);

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

    // Load all data from blockchain
    useEffect(() => {
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

            // -----------------------------------------------------------------
            // Rebuild infoAccount
            // -----------------------------------------------------------------

            const _auxInfo = {
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT,
                GEMSBalance: gems[0].quantityQNT / NQTDIVIDER,
                transactions: txs.transactions,
                unconfirmedTxs: unconfirmed.unconfirmedTransactions,
                currentAsks: currentAskOrBids.askOrders,
                currentBids: currentAskOrBids.bidOrders,
                trades: trades.trades,
            };

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
    }, [infoAccount, needReload, isLoading, setInfoAccount, cards, gemCards, infoAccountHash, cardsHash, gemCardsHash]);

    useEffect(() => {
        switch (option) {
            case 0:
                setRenderComponent(<Overview />);
                break;
            case 1:
                setRenderComponent(<Inventory infoAccount={infoAccount} cards={cardsFiltered} />);
                break;
            case 2:
                setRenderComponent(<History infoAccount={infoAccount} collectionCardsStatic={cards} />);
                break;
            case 3:
                setRenderComponent(<Market infoAccount={infoAccount} cards={cardsFiltered} gemCards={gemCards} />);
                break;
            case 4:
                setRenderComponent(<Jackpot infoAccount={infoAccount} cards={cards} yourCards={cardsFiltered} />);
                break;
            case 5:
                setRenderComponent(<Account infoAccount={infoAccount} />);
                break;
            case 6:
                setRenderComponent(<Overview />);
                break;
            default:
                setRenderComponent(<Overview />);
                break;
        }
    }, [option, infoAccount, cards, cardsFiltered, gemCards]);

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Box bg={bgColor} m={4} p={8} rounded="lg">
            <LateralMenu
                option={option}
                setOption={setOption}
                children={renderComponent}
                showAllCards={showAllCards}
                handleShowAllCards={handleShowAllCards}
            />
        </Box>
    );
};

export default Home;
