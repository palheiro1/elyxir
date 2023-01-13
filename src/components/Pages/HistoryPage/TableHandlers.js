import { Center, SimpleGrid, Td, Text, Tr } from '@chakra-ui/react';
import { FaFilter, FaGem, FaCoins } from 'react-icons/fa';

// Components
import InOutTransaction from '../../Tables/InOutTransaction';
import TableCard from '../../Cards/TableCard';

// Utils
import { calculateFixedAmount, getReason, parseRecipient, parseSender } from '../../../utils/txUtils';
import { GEMASSET, JACKPOTACCOUNT, NQTDIVIDER } from '../../../data/CONSTANTS';

// -------------------------------------------- //
// ------------------ HANDLERS ---------------- //
// -------------------------------------------- //
export const handleType0AndSubtype0 = (tx, timestamp, infoAccount) => {
    let inOut = 'in';
    let jackpot = false;
    let reason = null;
    if (tx.senderRS === infoAccount.accountRs) {
        inOut = 'out';
    } else if (tx.recipientRS === infoAccount.accountRs && tx.senderRS === JACKPOTACCOUNT) {
        jackpot = true;
        if (tx.attachment.message) {
            const msg = JSON.parse(tx.attachment.message.replace(/\bNaN\b/g, 'null'));
            reason = getReason(msg);
            if (msg.submittedBy !== 'Jackpot' || msg.source !== 'BLOCK') {
                jackpot = false;
            }
        }
    }
    let account;
    try {
        if (inOut === 'out') {
            account = parseRecipient(tx);
        } else {
            account = parseSender(tx);
        }
    } catch (e) {
        console.log(e);
    }
    if (!account) return;
    account = account === infoAccount.accountRs ? 'You' : account;
    return handleMoneyTransfer(inOut, tx.amountNQT / NQTDIVIDER, timestamp, account, jackpot, reason);
};

export const handleType1AndSubtype0 = (tx, timestamp, infoAccount) => {
    if (tx.recipientRS === infoAccount.accountRs && tx.senderRS === JACKPOTACCOUNT) {
        const msg = JSON.parse(tx.attachment.message.replace(/\bNaN\b/g, 'null'));
        if (msg.reason === 'confirmParticipation') {
            return handleMessage('Participation', 'Our Jackpot contract confirmed your participation.', timestamp);
        } else {
            console.log('TXHistory -> Unhandled message received.');
        }
    }
};

export const handleType2AndSubtype1 = (tx, timestamp, infoAccount, collectionCardsStatic) => {
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
            const fixedAmount = calculateFixedAmount(tx.attachment.quantityQNT);
            let handler = null;
            if (asset === 'GEM') {
                handler = handleGEM(inOut, fixedAmount, timestamp, sender);
            } else {
                handler = handleCardTransfer(inOut, fixedAmount, timestamp, sender, asset);
            }

            return handler;
        }
    }
};

export const handleType2AndSubtype2And3 = (tx, timestamp, infoAccount, collectionCardsStatic) => {
    const card = collectionCardsStatic.find(card => card.asset === tx.attachment.asset);
    const orderType = tx.subtype === 2 ? 'ask' : 'bid';
    const isGem = !card;
    let fixedAmount = calculateFixedAmount(tx.attachment.quantityQNT);
    let sender = parseSender(tx);
    sender = sender === infoAccount.accountRs ? 'You' : sender;
    if (card || tx.attachment.asset === GEMASSET) {
        const handler = handleAssetExchange(orderType, fixedAmount, timestamp, sender, isGem);
        return handler;
    }
};

export const handleType2AndSubtype4And5 = (tx, timestamp, infoAccount) => {
    const orderType = tx.subtype === 4 ? 'ask' : 'bid';
    let sender = parseSender(tx);
    sender = sender === infoAccount.accountRs ? 'You' : sender;
    const handler = cancelledOrder(orderType, timestamp, sender);
    return handler;
};

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

export const handleAssetExchange = (type, amount, date, account, isGem) => {
    type = type.toLowerCase();
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
            <Td>{account}</Td>
            <Td>
                <InOutTransaction type={type} />
            </Td>
        </Tr>
    );
};
