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
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [filteredDividends, setFilteredDividends] = useState(dividends);

    const [needReload, setNeedReload] = useState(true);
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
            if (haveUnconfirmed) {
                setLastConfirmation(true);
            }

            if (lastConfirmation && !haveUnconfirmed) {
                setNeedReload(true);
                setLastConfirmation(false);
            }
        };

        checkConfirmation();
    }, [haveUnconfirmed, lastConfirmation]);

    const { items } = useSelector(state => state.items);
    // -------------------------------------------------
    useEffect(() => {
        const processTransactions = () => {
            let newTransactions = [];

            const dirtyTransactions = infoAccount.transactions || [];
            console.log('Processing transactions:', dirtyTransactions?.length, 'total transactions');

            dirtyTransactions.forEach((tx, index) => {
                // Process transactions for both Elyxir items and MB cards
                const isItem = tx.attachment?.asset && isItemAsset(tx.attachment.asset);
                const isCard = tx.attachment?.asset && isMBAsset(tx.attachment.asset);
                
                // Debug logging for first few transactions
                if (index < 5) {
                    console.log(`Transaction ${index}:`, {
                        type: tx.type,
                        subtype: tx.subtype,
                        asset: tx.attachment?.asset,
                        isItem,
                        isCard,
                        fullTx: tx
                    });
                }
                
                if (isItem || isCard || tx.type === 0 || tx.type === 1 || tx.type === 5) {
                    const timestamp = getTxTimestamp(tx, epoch_beginning);
                    const type = tx.type;
                    const subtype = tx.subtype;
                    let handler = null;

                    switch (type) {
                        case 0:
                            if (subtype === 0) {
                                // Money transfer
                                handler = handleType0AndSubtype0(tx, timestamp, infoAccount);
                            }
                            break;
                        case 1:
                            if (subtype === 0) {
                                // Message
                                handler = handleType1AndSubtype0(tx, timestamp, infoAccount);
                            }
                            break;
                        case 2:
                            if (subtype === 1) {
                                if (isItem) {
                                    // Items transfer
                                    handler = handleItemsTransaction(tx, timestamp, infoAccount, items);
                                } else if (isCard) {
                                    // Card transfer
                                    handler = handleType2AndSubtype1(tx, timestamp, infoAccount, collectionCardsStatic);
                                }
                            } else if (subtype === 2 || subtype === 3) {
                                // Asset exchange (ask/bid orders)
                                handler = handleType2AndSubtype2And3(tx, timestamp, infoAccount, collectionCardsStatic);
                            } else if (subtype === 4 || subtype === 5) {
                                // Order cancellation
                                handler = handleType2AndSubtype4And5(tx, timestamp, infoAccount);
                            }
                            break;
                        case 5:
                            if (subtype === 3) {
                                // Account control
                                handler = handleType5AndSubtype3(tx, timestamp, infoAccount);
                            }
                            break;
                        default:
                            break;
                    }

                    if (handler) {
                        newTransactions.push(handler);
                        if (index < 5) {
                            console.log(`Handler result for transaction ${index}:`, handler);
                        }
                    } else if (index < 5) {
                        console.log(`No handler found for transaction ${index}, type: ${type}, subtype: ${subtype}`);
                    }
                }
            });

            console.log('Processed transactions result:', newTransactions.length, 'transactions processed');
            console.log('First few processed transactions:', newTransactions.slice(0, 3));
            setDividends(infoAccount.dividends || []);
            setTransactions(newTransactions);
            setNeedReload(false);
        };

        console.log('History useEffect dependencies check:', {
            hasTransactions: infoAccount.transactions !== undefined,
            hasCollectionCards: collectionCardsStatic !== undefined,
            collectionCardsLength: collectionCardsStatic?.length,
            needReload,
            transactionsLength: infoAccount.transactions?.length,
            collectionCardsType: typeof collectionCardsStatic
        });

    infoAccount.transactions !== undefined &&
        Array.isArray(infoAccount.transactions) &&
        collectionCardsStatic !== undefined &&
        collectionCardsStatic.length > 0 &&
        needReload &&
        processTransactions();
    }, [infoAccount, epoch_beginning, needReload, collectionCardsStatic, items]);

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

                {needReload && <Loader />}

                {!needReload && section === 'transactions' && (
                    <ShowTransactions
                        haveUnconfirmed={haveUnconfirmed}
                        filteredTransactions={filteredTransactions}
                        setVisibleTransactions={setVisibleTransactions}
                        visibleTransactions={visibleTransactions}
                        handleClick={handleClick}
                    />
                )}
                {!needReload && section === 'dividends' && (
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
