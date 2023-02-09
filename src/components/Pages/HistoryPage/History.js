import React from 'react';
import { Box, Button, Center, Spinner, TableContainer, Text, Table, Thead, Tbody, Tr, Th, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getBlockchainStatus } from '../../../services/Ardor/ardorInterface';
import { getTxTimestamp } from '../../../utils/txUtils';
import SortAndFilterTxs from '../../SortAndFilters/SortAndFilterTxs';
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
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [blockchainStatus, setBlockchainStatus] = useState({});
    const [needReload, setNeedReload] = useState(true);
    const [lastConfirmation, setLastConfirmation] = useState(false);

    // -------------------------------------------------
    const [visibleTransactions, setVisibleTransactions] = useState(10);
    const loadMoreTransactions = () => {
        setVisibleTransactions(prevVisibleTransactions => prevVisibleTransactions + 10);
    };
    // -------------------------------------------------

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

    // -------------------------------------------------
    useEffect(() => {
        const processTransactions = () => {
            let newTransactions = [];

            const dirtyTransactions = infoAccount.transactions;

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

                if (handler) newTransactions.push(handler);
            });

            setTransactions(newTransactions);
            setNeedReload(false);
        };

        infoAccount.transactions !== undefined &&
            blockchainStatus.epoch_beginning !== undefined &&
            collectionCardsStatic !== undefined &&
            needReload &&
            processTransactions();
    }, [infoAccount, transactions, blockchainStatus.epoch_beginning, needReload, collectionCardsStatic]);

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <Box>
            <SortAndFilterTxs
                setFilteredTransactions={setFilteredTransactions}
                setVisibleTransactions={setVisibleTransactions}
                transactions={transactions}
            />

            {needReload ? (
                <Center w="100%" textAlign="center" py={4} gap={4}>
                    <Spinner size="md" />
                    <Text>Loading</Text>
                </Center>
            ) : (
                <TableContainer
                    border="1px"
                    borderColor={borderColor}
                    rounded="lg"
                    bg="blackAlpha"
                    shadow="dark-lg"
                    p={2}
                    boxShadow="inner"
                    textAlign="center"
                    maxW={{ base: '100%', md: '80%', lg: '100%' }}>
                    {haveUnconfirmed && (
                        <Center w="100%" textAlign="center" py={4} gap={4}>
                            <Spinner size="md" />{' '}
                            <Text fontWeight="bolder" bgGradient="linear(to-l, #478299, #957bd2)" bgClip="text">
                                New transactions are being processed.
                            </Text>
                        </Center>
                    )}
                    <Table variant="simple" size={{ base: 'sm', lg: 'md' }}>
                        <Thead>
                            <Tr>
                                <Th />
                                <Th>Title</Th>
                                <Th>Amount</Th>
                                <Th>Date and Time</Th>
                                <Th>To/From</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!needReload &&
                                filteredTransactions.slice(0, visibleTransactions).map((transaction, index) => {
                                    return <transaction.component key={index} />;
                                })}
                        </Tbody>
                    </Table>

                    {filteredTransactions.length > visibleTransactions && (
                        <Button size="lg" w="100%" p={6} onClick={loadMoreTransactions}>
                            Load More
                        </Button>
                    )}
                </TableContainer>
            )}
        </Box>
    );
};

export default History;
