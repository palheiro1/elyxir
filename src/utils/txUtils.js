import { BRIDGEACCOUNT, DEFAULT_CONTACTS } from '../data/CONSTANTS';
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

function parseJson(message) {
    try {
        return JSON.parse(message.replace(/\bNaN\b/g, 'null'));
    } catch (error) {
        console.log('🚀 ~ file: txUtils.js:11 ~ parseJson ~ error', error);
        return null;
    }
}

// ------------------------------------------------
// ----------------- TX UTILS ---------------------
// ------------------------------------------------

export function parseSender(tx, contacts = DEFAULT_CONTACTS) {
    const { senderRS: account } = tx;
    const found = findContactByAccount(account, contacts);
    if (found === undefined) {
        return account;
    } else {
        let nameSuffix = '';
        const { message } = tx.attachment;
        if (message) {
            const msg = parseJson(message);
            if (!msg) return;
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
                case 'AssetDistributor':
                    nameSuffix = ' Creator';
                    break;
                case 'TarascaDaoOmno':
                    nameSuffix = ' Morph';
                    break;
            }
        }
        return found.name + nameSuffix;
    }
}

export function parseRecipient(tx, contacts = DEFAULT_CONTACTS) {
    const { recipientRS: account } = tx;
    const found = findContactByAccount(account, contacts);
    if (found === undefined) {
        return account;
    } else if (found.accountRs === BRIDGEACCOUNT) {
        return found.name;
    } else {
        let nameSuffix = '';
        const { message } = tx.attachment;

        if (message) {
            const msg = parseJson(message);
            if (!msg) return;

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
                case 'AssetDistributor':
                    nameSuffix = ' Creator';
                    break;
                case 'TarascaDaoOmno':
                    nameSuffix = ' Morph';
                    break;
            }
        }
        return found.name + nameSuffix;
    }
}

export function getTxTimestamp({ tx, eb }) {
    var txstamp = new Date(eb.getTime());
    txstamp.setSeconds(+txstamp.getSeconds() + tx.timestamp);
    let status = 'unconfirmed';
    if (tx.confirmations === 1) {
        status = 'just confirmed';
    } else if (tx.confirmations > 1) {
        status = 'confirmed';
    }
    const Month = txstamp.getMonth() + 1;
    const datestring =
        txstamp.getFullYear().toString() +
        '-' +
        Month.toString().padStart(2, '0') +
        '-' +
        txstamp.getDate().toString().padStart(2, '0');
    const timestring =
        txstamp.getHours().toString().padStart(2, '0') +
        ':' +
        txstamp.getMinutes().toString().padStart(2, '0') +
        ':' +
        txstamp.getSeconds().toString().padStart(2, '0');

    return {
        datestring: datestring,
        timestring: timestring,
        status: status,
    };
}

export function getTxTimestamp({ tx, eb }) {
    const txstamp = new Date(eb.getTime() + tx.timestamp * 1000);
    const status =
        tx.confirmations === 1
            ? 'just confirmed'
            : tx.confirmations > 1
            ? 'confirmed'
            : 'unconfirmed';
    const datestring = formatDate(txstamp, 'yyyy-MM-dd');
    const timestring = formatTime(txstamp, 'HH:mm:ss');

    return {
        datestring,
        timestring,
        status,
    };
}
