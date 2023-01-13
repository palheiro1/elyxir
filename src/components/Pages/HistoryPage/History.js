import { Box, Button, Select, Stack, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane, FaFilter } from 'react-icons/fa';
import { getBlockchainStatus } from '../../../services/Ardor/ardorInterface';
import { getTxTimestamp } from '../../../utils/txUtils';
import {
    handleIncomingGIFTZ,
    handleType0AndSubtype0,
    handleType1AndSubtype0,
    handleType2AndSubtype1,
    handleType2AndSubtype2And3,
    handleType2AndSubtype4And5,
    handleType5AndSubtype3,
} from './TableHandlers';

/**
 * @name History
 * @description History page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the history page
 * @returns {JSX.Element} History component
 *
 */
const History = ({ infoAccount, collectionCardsStatic }) => {
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
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [blockchainStatus, setBlockchainStatus] = useState({});
    const [needReload, setNeedReload] = useState(true);
    const [filter, setFilter] = useState('all');

    // -------------------------------------------------
    const [visibleTransactions, setVisibleTransactions] = useState(10);
    const loadMoreTransactions = () => {
        setVisibleTransactions(prevVisibleTransactions => prevVisibleTransactions + 10);
    };
    // -------------------------------------------------

    const handleFilter = e => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        const fetchBlockchainStatus = async () => {
            const response = await getBlockchainStatus();

            setBlockchainStatus({
                status: response.data,
                epoch_beginning: new Date(
                    response.data.isTestnet ? Date.UTC(2017, 11, 26, 14, 0, 0) : Date.UTC(2018, 0, 1, 0, 0, 0)
                ),
            });
        };

        fetchBlockchainStatus();
    }, []);

    // -------------------------------------------------
    useEffect(() => {
        const processTransactions = () => {
            console.log('Processing transactions...');
            let transactions = [];

            const dirtyTransactions = infoAccount.transactions.slice(0, 50);

            dirtyTransactions.forEach(tx => {
                const timestamp = getTxTimestamp(tx, blockchainStatus.epoch_beginning);
                const type = tx.type;
                const subtype = tx.subtype;
                let handler = null;

                switch (type) {
                    case 0:
                        if (subtype === 0)
                            // Money transfer
                            handler = handleType0AndSubtype0(tx, timestamp, infoAccount);
                        break;
                    case 1:
                        if (subtype === 0)
                            // Message
                            handler = handleType1AndSubtype0(tx, timestamp, infoAccount);
                        break;
                    case 2:
                        if (subtype === 1)
                            // GEM & Card transfer
                            handler = handleType2AndSubtype1(tx, timestamp, infoAccount, collectionCardsStatic);
                        if (subtype === 2 || subtype === 3)
                            // GEM & Card exchange
                            handler = handleType2AndSubtype2And3(tx, timestamp, infoAccount, collectionCardsStatic);
                        if (subtype === 4 || subtype === 5)
                            // Cancelled order
                            handler = handleType2AndSubtype4And5(tx, timestamp, infoAccount);
                        break;
                    case 5:
                        if (subtype === 3)
                            // Currency transfer
                            handler = handleType5AndSubtype3(tx, timestamp, infoAccount);
                        if (subtype === 5 && tx.senderRS === infoAccount.accountRs)
                            // Incoming GIFTZ (NOT WORKING)
                            handler = handleIncomingGIFTZ(tx, timestamp, infoAccount);
                        break;
                    default:
                        break;
                }

                if (handler) transactions.push(handler);
            });

            setTransactions(transactions);
            setNeedReload(false);
        };

        infoAccount.transactions !== undefined &&
            blockchainStatus.epoch_beginning !== undefined &&
            collectionCardsStatic !== undefined &&
            needReload &&
            processTransactions();
    }, [infoAccount, transactions, blockchainStatus.epoch_beginning, needReload, collectionCardsStatic]);

    useEffect(() => {
        if (transactions.length > 0) {
            console.log('Filtering transactions... ' + filter);
            if (filter !== 'all') {
                if (filter === 'placed') {
                    setFilteredTransactions(transactions.filter(tx => tx.type === 'ask' || tx.type === 'bid'));
                } else if (filter === 'cards') {
                    setFilteredTransactions(transactions.filter(tx => tx.isCard === true));
                } else if (filter === 'currency') {
                    setFilteredTransactions(transactions.filter(tx => tx.isCurrency === true));
                } else {
                    setFilteredTransactions(transactions.filter(tx => tx.type === filter));
                }
            } else {
                setFilteredTransactions(transactions);
            }
            setVisibleTransactions(10);
        }
    }, [transactions, filter]);

    return (
        <Box>
            <Stack direction="row" pb={2}>
                <Stack direction="row" border="1px" borderColor="gray.600" rounded="lg" px={2} align="center">
                    <Box pl={1} py={2}>
                        <FaRegPaperPlane />
                    </Box>
                    <Text fontSize="sm" color="gray.400">
                        Sort:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs">
                        <option value="option1">Unnavailable</option>
                    </Select>
                </Stack>

                <Stack position="absolute" right="3%" direction="row">
                    <Stack direction="row" border="1px" borderColor="gray.600" rounded="lg" px={2} align="center">
                        <Box pl={1} py={2}>
                            <FaFilter />
                        </Box>
                        <Text fontSize="sm" color="gray.400">
                            Show:{' '}
                        </Text>
                        <Select border="0px" borderColor="gray.800" size="xs" onChange={handleFilter}>
                            <option value="all">All transactions</option>
                            <option value="in">Received</option>
                            <option value="out">Send</option>
                            <option value="cards">Cards</option>
                            <option value="currency">Currency</option>
                            <option value="placed">From the Market</option>
                        </Select>
                    </Stack>
                </Stack>
            </Stack>

            <TableContainer border="1px" borderColor="gray" rounded="2xl" shadow="inner" boxShadow="md">
                {needReload && <Text>Loading</Text>}
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Td textAlign="center">Title</Td>
                            <Td>Amount</Td>
                            <Td>Date and Time</Td>
                            <Td>To/From</Td>
                            <Td>Status</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {!needReload &&
                            filteredTransactions.slice(0, visibleTransactions).map(transaction => {
                                return <transaction.component />;
                            })}
                    </Tbody>
                </Table>

                {filteredTransactions.length > visibleTransactions && (
                    <Button size="lg" w="100%" p={6} onClick={loadMoreTransactions}>
                        Load More
                    </Button>
                )}
            </TableContainer>
        </Box>
    );
};

export default History;
