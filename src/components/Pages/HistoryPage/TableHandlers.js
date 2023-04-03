import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Tr } from '../../ResponsiveTable/tr';
import { Td } from '../../ResponsiveTable/td';
import { FaFilter, FaInbox } from 'react-icons/fa';

// Components
import InOutTransaction from '../../Tables/InOutTransaction';
import TableCard from '../../Cards/TableCard';

// Utils
import { calculateFixedAmount, getReason, parseJson, parseRecipient, parseSender } from '../../../utils/txUtils';
import { JACKPOTACCOUNT, NQTDIVIDER } from '../../../data/CONSTANTS';
import { getAsset } from '../../../utils/cardsUtils';
import GemCard from '../../Cards/GemCard';
import IgnisCard from '../../Cards/IgnisCard';
import GIFTZCard from '../../Cards/GIFTZCard';

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
    const realAmount = amount.attachment.unitsQNT;
    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={'in'} />
                </Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <GIFTZCard />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                INCOMING GIFTZ
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{realAmount}</Td>
                <Td>{date}</Td>
                <Td>You</Td>
            </Tr>
        );
    };

    return {
        Component,
        type: 'in',
        isCurrency: true,
    };
};

export const handleMessage = (type, msg, date) => {
    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>{msg}</Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <FaInbox />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                Message
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{date}</Td>
                <Td>You</Td>
                <Td>{type}</Td>
            </Tr>
        );
    };
    return {
        Component,
        type,
    };
};

export const cancelledOrder = (type, date, account) => {
    type = type.toLowerCase();
    // Type - bid/ask
    // Calcular TIMESTAMP!!!

    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <FaFilter />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                Cancelled Order
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>-</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };

    return {
        Component,
        type,
    };
};

export const handleGEM = (type, amount, date, account) => {
    type = type.toLowerCase();
    if (amount > 1000000) {
        amount = amount / NQTDIVIDER;
    }
    amount = Number(amount);
    const fixedAmount = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);
    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                borderColor="whiteAlpha.300"
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <GemCard />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                GEM
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{fixedAmount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };
    return {
        Component,
        type,
        isCurrency: true,
    };
};

export const handleCardTransfer = (type, amount, date, account, card) => {
    type = type.toLowerCase();
    const { cardImgUrl: image, name: title, channel: continent, rarity } = card;

    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                borderColor="whiteAlpha.300"
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
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
        Component,
        type,
        isCard: true,
    };
};

export const handleAssetExchange = (type, amount, date, account, asset) => {
    type = type.toLowerCase();
    // CONTROLAR PARA GEMAS O ASSETS

    const isGem = asset === 'GEM';
    const fixedType = type === 'ask' ? 'Market ASK' : 'Market BID';

    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                borderColor="whiteAlpha.300"
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={'placed'} />
                </Td>
                <Td>
                    {isGem ? (
                        <GemCard />
                    ) : (
                        <TableCard
                            title={asset.name}
                            image={asset.cardImgUrl}
                            continent={asset.channel}
                            rarity={asset.rarity}
                        />
                    )}
                </Td>
                <Td>{amount}</Td>
                <Td>{date}</Td>
                <Td>{fixedType}</Td>
            </Tr>
        );
    };

    return {
        Component,
        type,
    };
};

export const handleCurrencyTransfer = (type, amount, date, account) => {
    type = type.toLowerCase();
    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                borderColor="whiteAlpha.300"
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <GIFTZCard />
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
        Component,
        type,
        isCurrency: true,
    };
};

export const handleMoneyTransfer = (type, amount, date, account, isJackpot, reason = '') => {
    if (reason !== null && reason !== undefined && reason !== '') {
        console.log('🚀 ~ file: TableHandlers.js:396 ~ handleMoneyTransfer ~ reason', reason);
    }

    type = type.toLowerCase();
    let fixedAmount = Number.isInteger(amount) ? amount : amount.toFixed(1);

    const Component = () => {
        return (
            <Tr
                _hover={{ bgColor: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                border={{ base: '2px', md: '0px' }}
                borderColor="whiteAlpha.300"
                rounded={{ base: 'md', md: 'unset' }}
                m={{ base: 2, md: 0 }}>
                <Td>
                    <InOutTransaction type={type} />
                </Td>
                <Td>
                    <Stack direction="row" align="center" spacing={24}>
                        <Box>
                            <IgnisCard />
                        </Box>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                {isJackpot ? 'Jackpot' : ''}
                            </Text>
                        </Box>
                    </Stack>
                </Td>
                <Td>{fixedAmount}</Td>
                <Td>{date}</Td>
                <Td>{account}</Td>
            </Tr>
        );
    };

    return {
        Component,
        type,
        isCurrency: true,
    };
};
