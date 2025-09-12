import { useEffect, useMemo, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';

import { handleItemsTransaction } from './TableHandlers';
import { 
    handleType2AndSubtype1, 
    handleType2AndSubtype2And3, 
    handleType2AndSubtype4And5,
    handleType0AndSubtype0,
    handleType1AndSubtype0,
    handleType5AndSubtype3
} from './TableHandlers';

import ShowTransactions from './ShowTransactions';
import Loader from './Loader';
import TopBar from './TopBar';
import ShowDividends from './ShowDividens';
import { isMBAsset } from '../../../utils/cardsUtils';
import { getTxTimestamp } from '../../../utils/txUtils';
import DetailedCard from '../../Cards/DetailedCard';
import { useSelector } from 'react-redux';
import { isItemAsset } from '../../../utils/itemsUtils';

/**
 * @name History
 * @description History page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the history page
 * @returns {JSX.Element} History component
 *
 */
const History = ({ infoAccount, collectionCardsStatic, haveUnconfirmed = false }) => {
    /**
     * Tipos
     * 1. IncomingGEM
     * 2. OutgoingGEM
     *
     * 3. IncomingCardTransferMobile
     * 4. OutgoingCardTransferMobile
     *
     * 5. AssetExchange
     * 6. AssetExchangeGEMAskOrBid
     *
     * 7. CancelledOrder
     *
     * 8. OutgoingCurrencyTransfer
     * 9. IncomingCurrencyTransfer
     *
     * 10. IncomingMoneyTransfer
     * 11. OutgoingMoneyTransfer
     * 12. IncomingMoneyTransferReason
     *
     * 13. IncomingMessage
     *
     * 14. IncomingGiftzOrder
     *
     */
    const [transactions, setTransactions] = useState([]);
    const [dividends, setDividends] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filteredDividends, setFilteredDividends] = useState([]);
    
    // Get items from Redux store early in component
    const { items } = useSelector(state => state.items);
    
    // Keep filteredTransactions in sync with transactions
    useEffect(() => {
        // After refactor, currency filtering happens during processing; just mirror transactions
        setFilteredTransactions(transactions);
    }, [transactions]);

    useEffect(() => {
        setFilteredDividends(dividends);
    }, [dividends]);

    // Loading state - show loader only when we're expecting data but don't have it yet
    const isLoading = useMemo(() => {
        // Show loading if we don't have basic required data
        const hasBasicData = infoAccount && infoAccount.transactions !== undefined && 
                            collectionCardsStatic !== undefined && items !== undefined;
        return !hasBasicData;
    }, [infoAccount, collectionCardsStatic, items]);
    const [lastConfirmation, setLastConfirmation] = useState(false);
    const [section, setSection] = useState('transactions'); // transactions/dividends

    // -------------------------------------------------
    const [visibleTransactions, setVisibleTransactions] = useState(10);
    const [visibleDividends, setVisibleDividends] = useState(10);
    // -------------------------------------------------
    const epoch_beginning = useMemo(() => new Date(Date.UTC(2018, 0, 1, 0, 0, 0)), []);

    const { isOpen, onClose, onOpen } = useDisclosure();
    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    // Card clicked
    const [cardClicked, setCardClicked] = useState();

    useEffect(() => {
        const checkConfirmation = () => {
            if (haveUnconfirmed && !lastConfirmation) {
                setLastConfirmation(true);
            } else if (!haveUnconfirmed && lastConfirmation) {
                // Transactions will auto-update through memoized dependencies
                setLastConfirmation(false);
            }
        };        checkConfirmation();
    }, [haveUnconfirmed, lastConfirmation]);

    // Memoize stable dependencies to prevent unnecessary re-renders
    const transactionData = useMemo(() => ({
        transactions: infoAccount.transactions || [],
        transactionsLength: infoAccount.transactions?.length || 0,
        dividends: infoAccount.dividends || []
    }), [infoAccount.transactions?.length, infoAccount.dividends?.length]);
    
    const cardsDataLength = useMemo(() => 
        collectionCardsStatic?.length || 0, 
        [collectionCardsStatic?.length]
    );
    
    const itemsDataLength = useMemo(() => 
        items?.length || 0, 
        [items?.length]
    );
    
    // Memoized transaction processing function
    const processedTransactions = useMemo(() => {
        if (!transactionData.transactions.length || !cardsDataLength || !itemsDataLength) {
            return [];
        }
        
        console.log('Processing transactions:', transactionData.transactions.length, 'total transactions');
        let newTransactions = [];

        transactionData.transactions.forEach((tx, index) => {
            // Process transactions for both Elyxir items and MB cards
            const isItem = tx.attachment?.asset && isItemAsset(tx.attachment.asset) && tx.attachment.asset !== require('../../../data/CONSTANTS').GEMASSET;
            const isCard = tx.attachment?.asset && isMBAsset(tx.attachment.asset);
            
            // Debug logging for first few transactions (only in dev mode)
            if (index < 3 && process.env.NODE_ENV === 'development') {
                console.log(`Transaction ${index}:`, {
                    type: tx.type,
                    subtype: tx.subtype,
                    asset: tx.attachment?.asset,
                    isItem,
                    isCard
                });
            }
            
            if (isItem || isCard || tx.type === 0 || tx.type === 1 || tx.type === 5) {
                // Early currency exclusion (MANA, WETH, GIFTZ) before handler creation
                try {
                    const { CURRENCY_ASSETS } = require('../../../data/CONSTANTS');
                    const assetIdForFilter = tx.attachment?.asset;
                    const symbol = assetIdForFilter ? CURRENCY_ASSETS[assetIdForFilter] : null;
                    if (symbol && ['MANA', 'WETH', 'GIFTZ'].includes(symbol)) {
                        return; // skip adding this transaction
                    }
                } catch (e) {
                    console.warn('Currency pre-filter failed', e);
                }
                
                const timestamp = getTxTimestamp(tx, epoch_beginning);
                const type = tx.type;
                const subtype = tx.subtype;
                let handler = null;

                switch (type) {
                    case 0:
                        if (subtype === 0) {
                            handler = handleType0AndSubtype0(tx, timestamp, infoAccount);
                        }
                        break;
                    case 1:
                        if (subtype === 0) {
                            handler = handleType1AndSubtype0(tx, timestamp, infoAccount);
                        }
                        break;
                    case 2:
                        if (subtype === 1) {
                            if (isItem) {
                                handler = handleItemsTransaction(tx, timestamp, infoAccount, items);
                            } else if (isCard) {
                                handler = handleType2AndSubtype1(tx, timestamp, infoAccount, collectionCardsStatic);
                            }
                        } else if (subtype === 2 || subtype === 3) {
                            handler = handleType2AndSubtype2And3(tx, timestamp, infoAccount, collectionCardsStatic);
                        } else if (subtype === 4 || subtype === 5) {
                            handler = handleType2AndSubtype4And5(tx, timestamp, infoAccount);
                        }
                        break;
                    case 5:
                        if (subtype === 3) {
                            handler = handleType5AndSubtype3(tx, timestamp, infoAccount);
                        }
                        break;
                    default:
                        break;
                }

                if (handler) {
                    newTransactions.push(handler);
                }
            }
        });

        console.log('Processed transactions result:', newTransactions.length, 'transactions processed');
        return newTransactions;
    }, [transactionData.transactions, cardsDataLength, itemsDataLength, infoAccount, epoch_beginning, collectionCardsStatic, items]);
    
    // Update state only when processed transactions change
    useEffect(() => {
        setTransactions(processedTransactions);
        setDividends(transactionData.dividends);
    }, [processedTransactions, transactionData.dividends]);

    // Items are now handled by the memoized processedTransactions, no need for separate effect

    return (
        <>
            <Box>
                <TopBar
                    setFilteredTransactions={setFilteredTransactions}
                    setFilteredDividends={setFilteredDividends}
                    setVisibleTransactions={setVisibleTransactions}
                    setVisibleDividends={setVisibleDividends}
                    transactions={transactions}
                    dividends={dividends}
                    section={section}
                    setSection={setSection}
                />

                {isLoading && <Loader />}

                {!isLoading && section === 'transactions' && (
                    <ShowTransactions
                        haveUnconfirmed={haveUnconfirmed}
                        filteredTransactions={filteredTransactions}
                        setVisibleTransactions={setVisibleTransactions}
                        visibleTransactions={visibleTransactions}
                        handleClick={handleClick}
                    />
                )}
                {!isLoading && section === 'dividends' && (
                    <ShowDividends
                        filteredDividends={filteredDividends}
                        setVisibleDividends={setVisibleDividends}
                        visibleDividends={visibleDividends}
                        epoch_beginning={epoch_beginning}
                    />
                )}
            </Box>
            {isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} />}
        </>
    );
};

export default History;
