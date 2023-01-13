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
import { COLLECTIONACCOUNT, TARASCACARDACCOUNT } from '../../data/CONSTANTS';

// Services
import { fetchAllCards } from '../../utils/cardsUtils';
import { getGIFTZBalance, getIGNISBalance } from '../../services/Ardor/walletUtils';
import { getBlockchainTransactions, getUnconfirmedTransactions } from '../../services/Ardor/ardorInterface';

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

    // All cards
    const [cards, setCards] = useState([]);
    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    // Need reload data
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            setNeedReload(false);
            const [cards, ignis, giftz, txs, unconfirmed] = await Promise.all([
                fetchAllCards(infoAccount.accountRs, COLLECTIONACCOUNT, TARASCACARDACCOUNT),
                getIGNISBalance(infoAccount.accountRs),
                getGIFTZBalance(infoAccount.accountRs),
                getBlockchainTransactions(2, infoAccount.accountRs, true),
                getUnconfirmedTransactions(2, infoAccount.accountRs),
            ]);

            setCards(cards);
            setInfoAccount({
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT,
                transactions: txs.transactions,
                unconfirmedTxs: unconfirmed.transactions,
            });
            setIsLoading(false);
        };

        if (infoAccount.accountRs && needReload && !isLoading) {
            loadAll();
        }

        const intervalId = setInterval(() => {
            if (!isLoading) {
                setNeedReload(true);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [infoAccount, needReload, isLoading, setInfoAccount]);

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
                setRenderComponent(<Market infoAccount={infoAccount} cards={cardsFiltered} />);
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
    }, [option, infoAccount, cards, cardsFiltered]);

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
