import { Box, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Menu
import LateralMenu from "../../components/LateralMenu/LateralMenu"

// Pages
import History from "../../components/Pages/HistoryPage/History"
import Overview from "../../components/Pages/HomePage/Overview"
import Inventory from "../../components/Pages/InventoryPage/Inventory"
import Jackpot from "../../components/Pages/JackpotPage/Jackpot"
import Market from "../../components/Pages/MarketPage/Market"
import Account from "../../components/Pages/AccountPage/Account"

// Data
import { COLLECTIONACCOUNT, TARASCACARDACCOUNT } from "../../data/CONSTANTS"

// Services
import { fetchAllCards } from "../../utils/cardsUtils"
import { getGIFTZBalance, getIGNISBalance } from "../../services/Ardor/walletUtils"
import { getBlockchainTransactions, getUnconfirmedTransactions } from "../../services/Ardor/ardorInterface"

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
    const navigate = useNavigate()

    // All cards
    const [cards, setCards] = useState([]);

    // Need reload data
    const [ needReload, setNeedReload ] = useState(true)

    // Check if user is logged
    useEffect(() => {
        if(infoAccount.token === null && infoAccount.accountRs === null)
            navigate("/login")

    }, [infoAccount, navigate])

    /**
     * @description Get all cards
     * @param {Object} infoAccount - Account info
     * @returns {Array} - All cards
     */
    useEffect(() => {
        const getAllCards = async () => {
            const response = await fetchAllCards(
                infoAccount.accountRs,
                COLLECTIONACCOUNT,
                TARASCACARDACCOUNT
            );
            setCards(response);
        };

        const fetchBalances = async () => {
            const ignis = await getIGNISBalance(infoAccount.accountRs)
            const giftz = await getGIFTZBalance(infoAccount.accountRs)
            setInfoAccount({
                ...infoAccount,
                IGNISBalance: ignis,
                GIFTZBalance: giftz.unitsQNT
            })
        }

        const fetchAllTxs = async () => {
            const txs = await getBlockchainTransactions(2, infoAccount.accountRs, true)
            const unconfirmed = await getUnconfirmedTransactions(2, infoAccount.accountRs)
            setInfoAccount({
                ...infoAccount,
                transactions: txs.transactions,
                unconfirmedTxs: unconfirmed.transactions
            })
        }

        const loadAll = () => {
            Promise.all([getAllCards(), fetchBalances(), fetchAllTxs()])
            .then(() => setNeedReload(false))
        }

        infoAccount.accountRs && needReload && loadAll();
    }, [infoAccount, setInfoAccount, needReload]);

    /*
    * 0 -> Overview
    * 1 -> Inventory
    * 2 -> History
    * 3 -> Market
    * 4 -> Jackpot
    * 5 -> Account
    * 6 -> Buy pack
    */
    const [ option, setOption ] = useState(0);
    const [ renderComponent, setRenderComponent ] = useState(<Overview />)

    useEffect(() => {
        switch(option) {
            case 0:
                setRenderComponent(<Overview />)
                break;
            case 1:
                setRenderComponent(<Inventory infoAccount={infoAccount} cards={cards} />)
                break;
            case 2:
                setRenderComponent(<History infoAccount={infoAccount} cards={cards} />)
                break;
            case 3:
                setRenderComponent(<Market infoAccount={infoAccount} cards={cards} />)
                break;
            case 4:
                setRenderComponent(<Jackpot cards={cards} />)
                break;
            case 5:
                setRenderComponent(<Account infoAccount={infoAccount} />)
                break;
            case 6:
                setRenderComponent(<Overview />)
                break;
            default:
                setRenderComponent(<Overview />)
                break;
        }
    }, [option, infoAccount, cards])

    const bgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

    return (
        <Box bg={bgColor} m={4} p={8} rounded="lg">
            <LateralMenu option={option} setOption={setOption} children={renderComponent} />
        </Box>
    )
}

export default Home