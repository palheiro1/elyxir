import {
    Box,
    Center,
    Grid,
    GridItem,
    Select,
    SimpleGrid,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane, FaFilter, FaGem, FaCoins } from 'react-icons/fa';
import { GEMASSET, JACKPOTACCOUNT, NQTDIVIDER } from '../../../data/CONSTANTS';
import { getBlockchainStatus } from '../../../services/Ardor/ardorInterface';
import { getTxTimestamp, parseRecipient, parseSender } from '../../../utils/txUtils';
import TableCard from '../../Cards/TableCard';
import InOutTransaction from '../../Tables/InOutTransaction';

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

    useEffect(() => {
        const getReason = msg => {
            let reason = '';
            if (msg.reason === 'referral') {
                reason = '- Referral Pay';
            } else if (msg.reason === 'confirmParticipation') {
                reason = 'participation confirmed - should not occur with type 0 subtype 0';
            } else if (msg.reason === 'sendPrize') {
                reason = '- Jackpot Prize';
            }
            return reason;
        };

        const processTransactions = () => {
            console.log('Processing transactions...');
            let transactions = [];
            // Cortar las 50 primeras transacciones
            const dirtyTransactions = infoAccount.transactions.slice(0, 10);
            dirtyTransactions.forEach(tx => {
                console.log(tx);
                const timestamp = getTxTimestamp(tx, blockchainStatus.epoch_beginning);
                // IN/OUT -> GEM & CarTransferMobile
                if (tx.type === 2 && tx.subtype === 1) {
                    let asset = null;
                    if (tx.attachment.asset === GEMASSET) {
                        asset = 'GEM';
                    } else {
                        asset = collectionCardsStatic.find(card => card.asset === tx.attachment.asset);
                    }

                    if (asset) {
                        let inOut = tx.recipientRS === infoAccount.accountRs ? 'in' : 'out';
                        let sender = parseSender(tx);

                        if (inOut && sender) {
                            const gemAmount = Number(tx.attachment.quantityQNT / NQTDIVIDER)
                            let fixedAmount = 0;
                            if(gemAmount > 0) {
                                fixedAmount = gemAmount - Math.floor(gemAmount) === 0 ? Number(tx.attachment.quantityQNT / NQTDIVIDER).toFixed(0) : Number(tx.attachment.quantityQNT / NQTDIVIDER).toFixed(2);
                            }
                            console.log("🚀 ~ file: History.js:119 ~ processTransactions ~ fixedAmount", fixedAmount)
                            let handler = null;
                            if (asset === 'GEM') {
                                handler = handleGEM(inOut, fixedAmount, timestamp, sender);
                            } else {
                                handler = handleCardTransfer(inOut, tx.attachment.quantityQNT, timestamp, sender, asset);
                            }

                            transactions.push(handler);
                        }
                    }
                }

                // Ask & Bid Card & GEMs -> AssetExchange
                if (tx.type === 2 && (tx.subtype === 2 || tx.subtype === 3)) {
                    const card = collectionCardsStatic.find(card => card.asset === tx.attachment.asset);
                    const orderType = tx.subtype === 2 ? 'ask' : 'bid';
                    const isGem = !card;
                    const amount = tx.attachment.quantityQNT;
                    let fixedAmount = 0;
                    if(amount > 0) {
                        console.log("🚀 ~ file: History.js:143 ~ processTransactions ~ amount", amount)
                        fixedAmount = amount - Math.floor(amount) === 0 ? Number(amount / NQTDIVIDER).toFixed(0) : Number(amount / NQTDIVIDER).toFixed(2);
                    }
                    if (card || tx.attachment.asset === GEMASSET) {
                        const handler = handleAssetExchange(
                            orderType,
                            fixedAmount,
                            timestamp,
                            parseSender(tx),
                            isGem
                        );
                        transactions.push(handler);
                    }
                }

                // Cancelled Order ASK & BID -> CancelledOrder
                if (tx.type === 2 && (tx.subtype === 4 || tx.subtype === 5)) {
                    const orderType = tx.subtype === 4 ? 'ask' : 'bid';
                    const handler = cancelledOrder(orderType, timestamp, parseSender(tx));
                    transactions.push(handler);
                }

                if (tx.type === 5 && tx.subtype === 3) {
                    if (tx.senderRS === infoAccount.accountRs) {
                        console.log(tx.attachment);
                        const handler = handleCurrencyTransfer('out', tx.attachment.unitsQNT, timestamp, 'You');
                        transactions.push(handler);
                    } else {
                        const handler = handleCurrencyTransfer(
                            'in',
                            tx.attachment.unitsQNT,
                            timestamp,
                            parseSender(tx)
                        );
                        transactions.push(handler);
                    }
                }

                // IN/OUT -> MoneyTransfer
                if (tx.type === 0 && tx.subtype === 0) {
                    let inOut = 'in';
                    let jackpot = false;
                    let reason = null;
                    if (tx.senderRS === infoAccount.accountRs) {
                        inOut = 'out';
                    } else if (tx.recipientRS === infoAccount.accountRs && tx.senderRS === JACKPOTACCOUNT) {
                        jackpot = true;
                        if (tx.attachment.message) {
                            const msg = JSON.parse(tx.attachment.message.replace(/\bNaN\b/g, 'null'));
                            console.log("🚀 ~ file: History.js:182 ~ processTransactions ~ msg", msg)
                            reason = getReason(msg);
                            if (msg.submittedBy !== 'Jackpot' || msg.source !== 'BLOCK') {
                                jackpot = false;
                            }
                        }
                    }
                    let account;
                    try {
                        if(inOut === 'out') {
                            account = parseRecipient(tx);
                        } else {
                            account = parseSender(tx);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    if (!account) return;
                    console.log("------------>", tx);
                    const handler = handleMoneyTransfer(
                        inOut,
                        tx.amountNQT/NQTDIVIDER,
                        timestamp,
                        account,
                        jackpot,
                        reason
                    );
                    transactions.push(handler);
                }

                if (tx.type === 1 && tx.subtype === 0) {
                    if (tx.recipientRS === infoAccount.accountRs && tx.senderRS === JACKPOTACCOUNT) {
                        const msg = JSON.parse(tx.attachment.message.replace(/\bNaN\b/g, 'null'));
                        if (msg.reason === 'confirmParticipation') {
                            const handler = handleMessage(
                                'Participation',
                                'Our Jackpot contract confirmed your participation.',
                                timestamp
                            );
                            transactions.push(handler);
                        } else {
                            console.log('TXHistory -> Unhandled message received.');
                        }
                    }
                }

                if (tx.type === 5 && tx.subtype === 5 && tx.senderRS === infoAccount.accountRs) {
                    const handler = handleIncomingGIFTZ(tx.attachment.unitsQNT, timestamp);
                    console.log('🚀 ~ file: History.js:207 ~ processTransactions ~ tx.attachment', tx.attachment);
                    transactions.push(handler);
                }
            });

            setTransactions(transactions);
            setNeedReload(false);
            console.log('🚀 ~ file: History.js:208 ~ processTransactions ~ transactions', transactions);
        };

        infoAccount.transactions !== undefined &&
            blockchainStatus.epoch_beginning !== undefined &&
            collectionCardsStatic !== undefined &&
            needReload &&
            processTransactions();
    }, [infoAccount, transactions, blockchainStatus.epoch_beginning, needReload, collectionCardsStatic]);

    // POR AQUI NO ENTRA
    const handleIncomingGIFTZ = (amount, date) => {
        console.log('🚀 ~ file: History.js:222 ~ handleIncomingGIFTZ ~ amount', amount);

        return (
            <Tr>
                <Td>
                    <FaFilter /> INCOMING GIFTZ
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>You</Td>
                <Td>
                    <InOutTransaction type={'in'} />
                </Td>
            </Tr>
        );
    };

    const handleMessage = (type, msg, date) => {
        return (
            <Tr>
                <Td>{msg}</Td>
                <Td>
                    <FaFilter /> Message
                </Td>
                <Td>{date}</Td>
                <Td>YOU</Td>
                <Td>{type}</Td>
            </Tr>
        );
    };

    const cancelledOrder = (type, date, account) => {
        type = type.toLowerCase();
        // Type - bid/ask
        // Calcular TIMESTAMP!!!
        return (
            <Tr>
                <Td>
                    <FaFilter /> Cancelled Order
                </Td>
                <Td>-</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
            </Tr>
        );
    };

    const handleGEM = (type, amount, date, account) => {
        // MANEAJR DATE CON TIMESTAMP!!!
        type = type.toLowerCase();
        return (
            <Tr>
                <Td>
                    <SimpleGrid columns={2} spacing={2}>
                        <Center>
                            <FaGem />
                        </Center>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                GEM
                            </Text>
                        </Center>
                    </SimpleGrid>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
            </Tr>
        );
    };

    const handleCardTransfer = (type, amount, date, account, card) => {
        console.log('🚀 ~ file: History.js:306 ~ handleCardTransfer ~ card', card);
        type = type.toLowerCase();
        const { cardImgUrl: image, name: title, channel: continent, rarity } = card;
        return (
            <Tr>
                <Td>
                    <TableCard image={image} title={title} continent={continent} rarity={rarity} />
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
            </Tr>
        );
    };

    const handleAssetExchange = (type, amount, date, account, isGem) => {
        type = type.toLowerCase();
        // Type: 0 - bid | 1 - ask
        // MANEAJR DATE CON TIMESTAMP!!!
        // CONTROLAR PARA GEMAS O ASSETS

        const icon = isGem ? <FaGem scale={5} /> : <FaFilter />;
        const msg = isGem ? 'GEM' : 'Asset';
        const fixedType = type === 'ask' ? 'Ask' : 'Bid';
        return (
            <Tr>
                <Td>
                    <SimpleGrid columns={2}>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                {fixedType}
                            </Text>
                        </Center>
                        <Center>
                            {icon}
                            <Text fontSize="xl" fontWeight="bold" mx={2}>
                                {msg}
                            </Text>
                        </Center>
                    </SimpleGrid>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account === infoAccount.accountRs ? 'You' : account}</Td>
                <Td>
                    <InOutTransaction type={'placed'} />
                </Td>
            </Tr>
        );
    };

    const handleCurrencyTransfer = (type, amount, date, account) => {
        type = type.toLowerCase();
        return (
            <Tr>
                <Td>
                    <SimpleGrid columns={2}>
                        <Center>
                            <FaGem />
                        </Center>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                GIFTZ
                            </Text>
                        </Center>
                    </SimpleGrid>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account === infoAccount.accountRs ? 'You' : account}</Td>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
            </Tr>
        );
    };

    const handleMoneyTransfer = (type, amount, date, account, isJackpot, reason = '') => {
        console.log('🚀 ~ file: History.js:389 ~ handleMoneyTransfer ~ account', account);
        console.log('🚀 ~ file: History.js:389 ~ handleMoneyTransfer ~ type', type);
        console.log('🚀 ~ file: History.js:389 ~ handleMoneyTransfer ~ amount', amount);
        type = type.toLowerCase();
        // CONTROLAR SI ES JACKPOT!!
        return (
            <Tr>
                <Td>
                    <SimpleGrid columns={2}>
                        <Center>
                            <FaCoins />
                        </Center>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                IGNIS
                            </Text>
                        </Center>
                    </SimpleGrid>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account === infoAccount.accountRs ? 'You' : account}</Td>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
            </Tr>
        );
    };

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
