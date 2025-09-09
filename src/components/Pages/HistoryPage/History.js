import { useEffect, useMemo, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';

import { handleItemsTransaction } from './TableHandlers';

import ShowTransactions from './ShowTransactions';
import Loader from './Loader';
import TopBar from './TopBar';
import ShowDividends from './ShowDividens';
// import { isMBAsset } from '../../../utils/cardsUtils';
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

            const dirtyTransactions = infoAccount.transactions;

            dirtyTransactions.forEach(tx => {
                // Only process transactions for Elyxir items (elyxirType or isItem)
                if (isItemAsset(tx.attachment.asset)) {
                    const timestamp = getTxTimestamp(tx, epoch_beginning);
                    const type = tx.type;
                    // const subtype = tx.subtype;
                    let handler = null;

                    switch (type) {
                        case 2:
                            if (isItemAsset(tx.attachment.asset)) {
                                // Items transfer
                                handler = handleItemsTransaction(tx, timestamp, infoAccount, items);
                            }
                            break;
                        default:
                            break;
                    }

                    if (handler) newTransactions.push(handler);
                }
            });

            setDividends(infoAccount.dividends);
            setTransactions(newTransactions);
            setNeedReload(false);
        };

        infoAccount.transactions !== undefined &&
            collectionCardsStatic !== undefined &&
            needReload &&
            processTransactions();
    }, [infoAccount, transactions, epoch_beginning, needReload, collectionCardsStatic, items]);

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
