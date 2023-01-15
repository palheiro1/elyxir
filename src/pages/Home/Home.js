import { Box, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { COLLECTIONACCOUNT, GEMASSETACCOUNT, REFRESH_DATA_TIME, TARASCACARDACCOUNT } from '../../data/CONSTANTS';

// Services
import { fetchAllCards, fetchGemCards } from '../../utils/cardsUtils';
import { getAskAndBids, getCurrentAskAndBids, getGIFTZBalance, getIGNISBalance } from '../../utils/walletUtils';
import {
    getBlockchainTransactions,
    getTrades,
    getUnconfirmedTransactions,
} from '../../services/Ardor/ardorInterface';

/**
 * @name Home
 * @description Home page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the home page
 * @returns {JSX.Element} Home component
 */
const Home = ({ infoAccount, setInfoAccount }) => {
    // Navigate
    const navigate = useNavigate();

    // GEM Cards
    const [gemCards, setGemCards] = useState([]);

    // All cards
    const [cards, setCards] = useState([]);

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    // Need reload data
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [marketFetched, setMarketFetched] = useState(false);

    /*
     * 0 -> Overview
     * 1 -> Inventory
     * 2 -> History
     * 3 -> Market
     * 4 -> Jackpot
     * 5 -> Account
     * 6 -> Buy pack
     */
    const [option, setOption] = useState(0);
    const [renderComponent, setRenderComponent] = useState(<Overview />);
    const [showAllCards, setShowAllCards] = useState(true);
    const handleShowAllCards = () => setShowAllCards(!showAllCards);

    // Check if user is logged
    useEffect(() => {
        if (infoAccount.token === null && infoAccount.accountRs === null) navigate('/login');
    }, [infoAccount, navigate]);

    useEffect(() => {
        if (showAllCards) {
            setCardsFiltered(cards);
        } else {
            setCardsFiltered(cards.filter(card => Number(card.quantityQNT) > 0));
        }
    }, [showAllCards, cards]);

    /**
     * @description Get all cards
     * @param {Object} infoAccount - Account info
     * @returns {Array} - All cards
     */
    useEffect(() => {
        const loadAll = async () => {
            console.log('Loading all data...');
            const { accountRs } = infoAccount;
            setIsLoading(true);
            setNeedReload(false);

            // Fetch all info
            const [loadCards, gems, ignis, giftz, txs, unconfirmed, currentAskOrBids, trades] = await Promise.all([
                fetchAllCards(accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT),
                fetchGemCards(accountRs, GEMASSETACCOUNT, true),
                getIGNISBalance(accountRs),
                getGIFTZBalance(accountRs),
                getBlockchainTransactions(2, accountRs, true),
                getUnconfirmedTransactions(2, accountRs),
                getCurrentAskAndBids(accountRs),
                getTrades(2,accountRs)
            ]);

            // Get "quantityQNT" from "cards" and "loadCards" and compare them
            const cardsQuantity = cards.map(card => card.quantityQNT);
            const loadCardsQuantity = loadCards.map(card => card.quantityQNT);
            if (JSON.stringify(cardsQuantity) !== JSON.stringify(loadCardsQuantity)) {
                console.log('Cards changed');
                setCards(loadCards);
                setMarketFetched(false);
            }

            if(JSON.stringify(gemCards) !== JSON.stringify(gems[0]) && gems.length > 0) {
                console.log('Gems changed');
                setGemCards(gems[0]);
            }

            const _auxInfo = {
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT,
                transactions: txs.transactions,
                unconfirmedTxs: unconfirmed.transactions,
                currentAsks: currentAskOrBids.askOrders,
                currentBids: currentAskOrBids.bidOrders,
                trades: trades.trades
            }

            if(JSON.stringify(infoAccount) !== JSON.stringify(_auxInfo)) {
                console.log('Account info changed');
                setInfoAccount(_auxInfo);
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
    }, [infoAccount, needReload, isLoading, setInfoAccount, cards, gemCards]);

    useEffect(() => {
        const fetchAskAndBids = async () => {
            setMarketFetched(true);
            console.log('Fetching ask and bids...');
            const cardsWithAskAndBids = await Promise.all(
                cards.map(async card => {
                    const { askOrders, bidOrders, assetCount } = await getAskAndBids(card.asset);
                    return { ...card, askOrders: askOrders, bidOrders: bidOrders, assetCount: assetCount };
                })
            );
            console.log('Ask and bids fetched', cardsWithAskAndBids);
            setCards(cardsWithAskAndBids);
        };

        !marketFetched && cards.length > 0 && fetchAskAndBids();
    }, [cards, marketFetched]);

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
                setRenderComponent(<Jackpot cards={cards} />);
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
