import { Box, Center, SimpleGrid, Td, Text, Tr } from '@chakra-ui/react';
import { FaFilter, FaGem, FaCoins } from 'react-icons/fa';

// Components
import InOutTransaction from '../../Tables/InOutTransaction';
import TableCard from '../../Cards/TableCard';

// Utils
import { calculateFixedAmount, getReason, parseJson, parseRecipient, parseSender } from '../../../utils/txUtils';
import { GEMASSET, JACKPOTACCOUNT, NQTDIVIDER } from '../../../data/CONSTANTS';

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
        } else {
            console.log('TXHistory -> Unhandled message received.');
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

    const sender = parseSender(tx);
    if (!sender) return;

    const asset = getAsset(tx, collectionCardsStatic);
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
    const asset = getAsset(tx, collectionCardsStatic);
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

const getAsset = (tx, collectionCardsStatic) => {
    if (tx.attachment.asset === GEMASSET) {
        return 'GEM';
    } else {
        return collectionCardsStatic.find(card => card.asset === tx.attachment.asset);
    }
};

// NOT WORKING - FLOW IS NOT CORRECT
export const handleIncomingGIFTZ = (amount, date) => {
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

export const handleMessage = (type, msg, date) => {
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

export const cancelledOrder = (type, date, account) => {
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

export const handleGEM = (type, amount, date, account) => {
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

export const handleCardTransfer = (type, amount, date, account, card) => {
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

export const handleAssetExchange = (type, amount, date, account, asset) => {
    type = type.toLowerCase();
    // CONTROLAR PARA GEMAS O ASSETS

    const isGem = asset === 'GEM';
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
                    <Box>
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
                    </Box>
                </SimpleGrid>
            </Td>
            <Td>{amount}</Td>
            <Td>{date}</Td>
            <Td>{account}</Td>
            <Td>
                <InOutTransaction type={'placed'} />
            </Td>
        </Tr>
    );
};

export const handleCurrencyTransfer = (type, amount, date, account) => {
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
            <Td>{account}</Td>
            <Td>
                <InOutTransaction type={type} />
            </Td>
        </Tr>
    );
};

export const handleMoneyTransfer = (type, amount, date, account, isJackpot, reason = '') => {
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
            <Td>{account}</Td>
            <Td>
                <InOutTransaction type={type} />
            </Td>
        </Tr>
    );
};
