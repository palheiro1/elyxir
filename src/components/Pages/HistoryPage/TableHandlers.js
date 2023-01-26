import { Box, Center, SimpleGrid, Stack, Td, Text, Tr } from '@chakra-ui/react';
import { FaFilter, FaGem, FaCoins } from 'react-icons/fa';

// Components
import InOutTransaction from '../../Tables/InOutTransaction';
import TableCard from '../../Cards/TableCard';

// Utils
import { calculateFixedAmount, getReason, parseJson, parseRecipient, parseSender } from '../../../utils/txUtils';
import { JACKPOTACCOUNT, NQTDIVIDER } from '../../../data/CONSTANTS';
import { getAsset } from '../../../utils/cardsUtils';

// -------------------------------------------- //
// ------------------ HANDLERS ---------------- //
// -------------------------------------------- //

//account = account === infoAccount.accountRs ? 'You' : account;

/**
 * @description Handles money transfer transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 */
export const handleType0AndSubtype0 = (tx, timestamp, infoAccount) => {
    const inOut = getInOut(tx, infoAccount);
    if (!inOut) return;

    const account = inOut === 'out' ? parseRecipient(tx) : parseSender(tx);
    if (!account) return;

    const { jackpot, reason } = getJackpotAndReason(tx);
    return handleMoneyTransfer(inOut, tx.amountNQT / NQTDIVIDER, timestamp, account, jackpot, reason);
};

/**
 * @description Handles message transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 */
export const handleType1AndSubtype0 = (tx, timestamp, infoAccount) => {
    if (tx.recipientRS === infoAccount.accountRs && tx.senderRS === JACKPOTACCOUNT) {
        const msg = parseJson(tx.attachment.message);
        if (msg.reason === 'confirmParticipation') {
            return handleMessage('Participation', 'Our Jackpot contract confirmed your participation.', timestamp);
        } else if (msg.submittedBy === 'TarascaDAOCardCraft') {
            return;
        } else {
            console.log('TXHistory -> Unhandled message received.', msg);
        }
    }
};

/**
 * @description Handles GEM & Assets transfer transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 * @param {array} collectionCardsStatic - static collection of cards
 */
export const handleType2AndSubtype1 = (tx, timestamp, infoAccount, collectionCardsStatic) => {
    const inOut = getInOut(tx, infoAccount);
    if (!inOut) return;

    const sender = inOut === 'in' ? parseSender(tx) : parseRecipient(tx);
    if (!sender) return;

    const asset = getAsset(tx.attachment.asset, collectionCardsStatic);
    if (!asset) return;

    const amount = calculateFixedAmount(tx.attachment.quantityQNT);
    const fixedAmount = amount === 0 ? tx.unitsQNT : amount;
    let handler = null;
    if (asset === 'GEM') {
        handler = handleGEM(inOut, fixedAmount, timestamp, sender);
    } else {
        handler = handleCardTransfer(inOut, fixedAmount, timestamp, sender, asset);
    }
    return handler;
};

/**
 * @description Handles GEM & Assets exchange transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 * @param {array} collectionCardsStatic - static collection of cards
 */
export const handleType2AndSubtype2And3 = (tx, timestamp, infoAccount, collectionCardsStatic) => {
    const asset = getAsset(tx.attachment.asset, collectionCardsStatic);
    if (!asset) return;

    const orderType = tx.subtype === 2 ? 'ask' : 'bid';
    let fixedAmount = calculateFixedAmount(tx.attachment.quantityQNT);

    let sender = parseSender(tx);
    sender = sender === infoAccount.accountRs ? 'You' : sender;

    return handleAssetExchange(orderType, fixedAmount, timestamp, sender, asset);
};

/**
 * @description Handles cancelled order transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 */
export const handleType2AndSubtype4And5 = (tx, timestamp, infoAccount) => {
    const orderType = tx.subtype === 4 ? 'ask' : 'bid';
    let sender = parseSender(tx);
    sender = sender === infoAccount.accountRs ? 'You' : sender;
    return cancelledOrder(orderType, timestamp, sender);
};

/**
 * @description Handles currency transfer transactions
 * @param {string} tx - transaction object
 * @param {number} timestamp - timestamp of transaction
 * @param {object} infoAccount - account info
 */
export const handleType5AndSubtype3 = (tx, timestamp, infoAccount) => {
    let handler = null;
    if (tx.senderRS === infoAccount.accountRs) {
        handler = handleCurrencyTransfer('out', tx.attachment.unitsQNT, timestamp, 'You');
    } else {
        let sender = parseSender(tx);
        sender = sender === infoAccount.accountRs ? 'You' : sender;
        handler = handleCurrencyTransfer('in', tx.attachment.unitsQNT, timestamp, sender);
    }
    return handler;
};

// -------------------------------------------- //
// ------- AUX FUNCTIONS FOR COMPONENTES ------ //
// -------------------------------------------- //

const getInOut = (tx, infoAccount) => {
    if (tx.senderRS === infoAccount.accountRs) {
        return 'out';
    } else if (tx.recipientRS === infoAccount.accountRs) {
        return 'in';
    }
    return null;
};

const getJackpotAndReason = tx => {
    let jackpot = tx.senderRS === JACKPOTACCOUNT;
    let reason = null;
    if (tx.attachment.message) {
        const msg = parseJson(tx.attachment.message);
        reason = getReason(msg);
        if (msg.submittedBy !== 'Jackpot' || msg.source !== 'BLOCK') {
            jackpot = false;
        }
    }
    return { jackpot, reason };
};

// NOT WORKING - FLOW IS NOT CORRECT
export const handleIncomingGIFTZ = (amount, date) => {
    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={'in'} />
                </Td>
                <Td>
                    <FaFilter /> INCOMING GIFTZ
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>You</Td>
            </Tr>
        );
    };

    return {
        component,
        type: 'in',
        isCurrency: true,
    };
};

export const handleMessage = (type, msg, date) => {
    const component = () => {
        return (
            <Tr>
                <Td>{msg}</Td>
                <Td>
                    <FaFilter /> Message
                </Td>
                <Td>{date}</Td>
                <Td>You</Td>
                <Td>{type}</Td>
            </Tr>
        );
    };
    return {
        component,
        type,
    };
};

export const cancelledOrder = (type, date, account) => {
    type = type.toLowerCase();
    // Type - bid/ask
    // Calcular TIMESTAMP!!!

    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <FaFilter /> Cancelled Order
                </Td>
                <Td>-</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };

    return {
        component,
        type,
    };
};

export const handleGEM = (type, amount, date, account) => {
    // MANEAJR DATE CON TIMESTAMP!!!
    type = type.toLowerCase();

    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction={['column', 'row']} align="start" spacing={24}>
                        <Box>
                            <FaGem />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                GEM
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };
    return {
        component,
        type,
        isCurrency: true,
    };
};

export const handleCardTransfer = (type, amount, date, account, card) => {
    type = type.toLowerCase();
    const { cardImgUrl: image, name: title, channel: continent, rarity } = card;

    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <TableCard image={image} title={title} continent={continent} rarity={rarity} />
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };
    return {
        component,
        type,
        isCard: true,
    };
};

export const handleAssetExchange = (type, amount, date, account, asset) => {
    type = type.toLowerCase();
    // CONTROLAR PARA GEMAS O ASSETS

    const isGem = asset === 'GEM';
    const fixedType = type === 'ask' ? 'ASK' : 'BID';

    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={'placed'} />
                </Td>
                <Td>
                    <SimpleGrid columns={2}>
                        <Center>
                            {isGem ? (
                                <FaGem />
                            ) : (
                                <TableCard
                                    title={asset.name}
                                    image={asset.cardImgUrl}
                                    continent={asset.channel}
                                    rarity={asset.rarity}
                                />
                            )}
                        </Center>
                        <Center>
                            <Text fontSize="xl" fontWeight="bold">
                                {fixedType}
                            </Text>
                        </Center>
                    </SimpleGrid>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };

    return {
        component,
        type,
    };
};

export const handleCurrencyTransfer = (type, amount, date, account) => {
    type = type.toLowerCase();
    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction={['column', 'row']} align="start" spacing={24}>
                        <Box>
                            <FaGem />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                GIFTZ
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };
    return {
        component,
        type,
        isCurrency: true,
    };
};

export const handleMoneyTransfer = (type, amount, date, account, isJackpot, reason = '') => {
    type = type.toLowerCase();
    // CONTROLAR SI ES JACKPOT!!

    const component = () => {
        return (
            <Tr>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction={['column', 'row']} align="start" spacing={24}>
                        <Box>
                            <FaCoins />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                IGNIS
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };

    return {
        component,
        type,
        isCurrency: true,
    };
};
