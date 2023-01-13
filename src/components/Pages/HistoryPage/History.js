import { Box, Select, Stack, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane, FaFilter } from 'react-icons/fa';
import { getBlockchainStatus } from '../../../services/Ardor/ardorInterface';
import { getTxTimestamp } from '../../../utils/txUtils';
import {
    handleIncomingGIFTZ, handleType0AndSubtype0, handleType1AndSubtype0, handleType2AndSubtype1, handleType2AndSubtype2And3, handleType2AndSubtype4And5, handleType5AndSubtype3,
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
const History = ({ infoAccount, cards }) => {
    const collectionCardsStatic = cards;
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
    const [blockchainStatus, setBlockchainStatus] = useState({});
    const [needReload, setNeedReload] = useState(true);
    //const [filter, setFilter] = useState('all');

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

            const dirtyTransactions = infoAccount.transactions.slice(0, 10);

            dirtyTransactions.forEach(tx => {
                const timestamp = getTxTimestamp(tx, blockchainStatus.epoch_beginning);
                const type = tx.type;
                const subtype = tx.subtype;
                let handler = null;

                switch (type) {
                    case 0:
                        if(subtype === 0) // Money transfer
                            handler = handleType0AndSubtype0(tx, timestamp, infoAccount);
                        break;
                    case 1:
                        if(subtype === 0) // Message
                            handler = handleType1AndSubtype0(tx, timestamp, infoAccount);
                        break;
                    case 2:
                        if(subtype === 1) // GEM & Card transfer
                            handler = handleType2AndSubtype1(tx, timestamp, infoAccount, collectionCardsStatic);
                        if(subtype === 2 || subtype === 3) // GEM & Card exchange
                            handler = handleType2AndSubtype2And3(tx, timestamp, infoAccount, collectionCardsStatic);
                        if(subtype === 4 || subtype === 5) // Cancelled order
                            handler = handleType2AndSubtype4And5(tx, timestamp, infoAccount);
                        break;
                    case 5:
                        if(subtype === 3) // Currency transfer
                            handler = handleType5AndSubtype3(tx, timestamp, infoAccount);
                        if(subtype === 5 && tx.senderRS === infoAccount.accountRs) // Incoming GIFTZ (NOT WORKING)
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
                    <Select border="0px" borderColor="gray.800" size="xs" placeholder="Sort option">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
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
                        <Select border="0px" borderColor="gray.800" size="xs" placeholder="All transactions">
                            <option value="option1">Received</option>
                            <option value="option2">Send</option>
                            <option value="option2">Cards transactions</option>
                            <option value="option2">Currency TX</option>
                            <option value="option2">From the Market</option>
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
                            transactions.map(transaction => {
                                return transaction;
                            })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default History;
