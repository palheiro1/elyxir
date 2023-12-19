import { DEFAULT_CONTACTS, NQTDIVIDER } from '../data/CONSTANTS';
import { formatDate, formatTime } from './dateAndTime';

// ------------------------------------------------
// ----------------- BASIC UTILS ------------------
// ------------------------------------------------

function findContactByAccount(account, contacts) {
    return contacts.find(contact => contact.accountRs === account);
}

export function parseAccount(account, contacts = DEFAULT_CONTACTS) {
    const found = findContactByAccount(account, contacts);
    return found === undefined ? account : found.name;
}

export function parseJson(message) {
    try {
        return JSON.parse(message.replace(/\bNaN\b/g, 'null'));
    } catch (error) {
        return false;
    }
}

export function calculateFixedAmount(quantityQNT) {
    const amount = quantityQNT >= NQTDIVIDER ? Number(quantityQNT / NQTDIVIDER) : Number(quantityQNT);
    return Number.isInteger(amount) ? amount : amount.toFixed(2);
}

// ------------------------------------------------
// ----------------- TX UTILS ---------------------
// ------------------------------------------------

export const getReason = msg => {
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

export function parseSender(tx) {
    const { senderRS: account } = tx;
    const found = findContactByAccount(account, DEFAULT_CONTACTS);

    if (!found) {
        return account;
    } else {
        let nameSuffix = '';
        const { message } = tx.attachment;
        if (message) {
            const msg = parseJson(message);
            if (!msg) return account;
            switch (msg.submittedBy) {
                case 'Jackpot':
                    if (msg.source === 'BLOCK') {
                        nameSuffix = ' Jackpot';
                    }
                    break;
                case 'IgnisAssetLottery':
                    if (msg.source === 'TRANSACTION') {
                        nameSuffix = ' Shop';
                    }
                    break;
                case 'TarascaDAOCardCraft':
                    nameSuffix = ' Crafting';
                    break;
                case 'CardCraftGEM':
                    nameSuffix = ' Crafting';
                    break;
                case 'AssetDistributor':
                    nameSuffix = ' Creator';
                    break;
                case 'TarascaDaoOmno':
                    nameSuffix = ' Morph';
                    break;
                case 'MBOmno':
                    nameSuffix = ' Omno';
                    break;
                default:
                    break;
            }
        }
        return found.name + nameSuffix;
    }
}

export function parseRecipient(tx) {
    const { recipientRS: account } = tx;
    const found = findContactByAccount(account, DEFAULT_CONTACTS);

    if (!found) {
        return account;
    } else {
        let nameSuffix = '';
        const { message } = tx.attachment;

        if (message) {
            const msg = parseJson(message);
            if (!msg) return found.name;

            switch (msg.contract) {
                case 'Jackpot':
                    nameSuffix = ' Jackpot';
                    break;
                case 'IgnisAssetLottery':
                    nameSuffix = ' Shop';
                    break;
                case 'TarascaDAOCardCraft':
                    nameSuffix = ' Crafting';
                    break;
                case 'CardCraftGEM':
                    nameSuffix = ' Crafting';
                    break;
                case 'AssetDistributor':
                    nameSuffix = ' Creator';
                    break;
                case 'TarascaDaoOmno':
                    nameSuffix = ' Morph';
                    break;
                case 'MBOmno':
                    nameSuffix = ' Omno';
                    break;
                default:
                    break;
            }
        }
        return found.name + nameSuffix;
    }
}

export const getTxTimestamp = (tx, eb, showStatus = true) => {
    const txstamp = new Date(eb.getTime() + tx.timestamp * 1000);

    const datestring = formatDate(txstamp, 'yyyy-MM-dd');
    const timestring = formatTime(txstamp, 'HH:mm:ss');
    const CompositeTimestamp = `${datestring} ${timestring}`;

    let confirmationStatus = '';
    if (showStatus) {
        if (tx.confirmations === 0) confirmationStatus = '(unconfirmed)';
        if (tx.confirmations === 1) confirmationStatus = '(just confirmed)';
        return (
            <div>
                {' '}
                {CompositeTimestamp} <br /> {confirmationStatus}
            </div>
        );
    }

    return CompositeTimestamp;
};

export const getTimestampForMessages = msg => {
    const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
    const msgstamp = new Date(eb.getTime() + msg.blockTimestamp * 1000);

    const datestring = formatDate(msgstamp, 'yyyy-MM-dd');
    const timestring = formatTime(msgstamp, 'HH:mm:ss');

    return `${datestring} ${timestring}`;
};
