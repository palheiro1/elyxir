import axios from 'axios';
import {
    BOUNTYACCOUNT,
    BOUNTYHALF,
    NODEURL,
    NQTDIVIDER,
    TARASCACARDACCOUNT,
    WETHASSETACCOUNT,
} from '../../data/CONSTANTS';
import { fetchCurrencyAssets, getBurnTransactions } from '../../utils/cardsUtils';
import { getAccount, getAsset, getBlockchainTransactions } from '../Ardor/ardorInterface';
// import { getIgnisBalance } from '../Ardor/ardorInterface';
import { getEthPrice } from '../coingecko/utils';

export const getBountyBalance = async () => {
    // Recover Bounty balance - IGNIS
    //const response = await getIgnisBalance(BOUNTYACCOUNT);
    const response = await fetchCurrencyAssets(BOUNTYACCOUNT, [WETHASSETACCOUNT], false);
    const unconfirmedBalance = response[0][0].unconfirmedQuantityQNT;
    const balance = unconfirmedBalance / NQTDIVIDER;
    return (BOUNTYHALF ? balance / 2 : balance).toFixed(6);
};

export const swapPriceEthtoUSD = async bountyBalance => {
    // const ignisPrice = await getIgnisPrice();
    const ethPrice = await getEthPrice();
    return (bountyBalance * ethPrice).toFixed(6);
};

export const getBountyParticipants = async () => {
    // Get participants
    const response = await fetch('https://api.mythicalbeings.io/index.php?action=winners');
    return await response.json();
};

export const getBountyMissingCards = async () => {
    const response = await fetch('https://api.mythicalbeings.io/index.php?action=participantsWithMissingCards');
    return await response.json();
};

export const getJackpotInfo = async () => {
    const response = await fetch('https://api.mythicalbeings.io/index.php?action=jackpot');
    return await response.json();
};

export const getBountyTransactions = async (timestamp = 229348323) => {
    const res = await getBlockchainTransactions(2, BOUNTYACCOUNT, true, timestamp, -1);
    const transactions = res.transactions.filter(tx => {
        try {
            const msg = JSON.parse(tx.attachment.message);
            return 'jackpotHeight' in msg;
        } catch (e) {
            return false;
        }
    });

    return transactions;
};

export const getAssetDistributorTransactions = async (timestamp = 229348323) => {
    const res = await getBlockchainTransactions(2, TARASCACARDACCOUNT, true, timestamp, -1);

    const transactions = res.transactions.filter(tx => {
        try {
            const msg = JSON.parse(tx.attachment.message);
            return 'jackpotHeight' in msg;
        } catch (e) {
            return false;
        }
    });

    return transactions;
};

export const getUserParticipations = async accountRs => {
    const jackpotInfo = await getJackpotInfo();
    const block = await getBlock(jackpotInfo.lastJackpotHeight);
    const res = await getBurnTransactions(accountRs, block.timestamp);
    const tickets = {
        common: { burned: 0, multiplier: jackpotInfo.multipliers.common },
        rare: { burned: 0, multiplier: jackpotInfo.multipliers.rare },
        epic: { burned: 0, multiplier: jackpotInfo.multipliers.veryRare },
        special: { burned: 0, multiplier: jackpotInfo.multipliers.special },
    };
    for await (const tx of res) {
        const { attachment } = tx;
        const { asset, quantityQNT } = attachment;
        if (asset) {
            const card = await getAsset(attachment.asset);
            const description = JSON.parse(card.description);
            const quantity = parseInt(quantityQNT) || 0;
            switch (description.rarity) {
                case 'common':
                    tickets.common.burned += quantity;
                    break;
                case 'rare':
                    tickets.rare.burned += quantity;
                    break;
                case 'epic':
                    tickets.epic.burned += quantity;
                    break;
                case 'special':
                    tickets.special.burned += quantity;
                    break;
                default:
                    break;
            }
        }
    }

    const structured = {
        common: {
            rarity: 'Common',
            burned: tickets.common.burned,
            tickets: tickets.common.burned * tickets.common.multiplier,
        },
        rare: {
            rarity: 'Rare',
            burned: tickets.rare.burned,
            tickets: tickets.rare.burned * tickets.rare.multiplier,
        },
        epic: {
            rarity: 'Epic',
            burned: tickets.epic.burned,
            tickets: tickets.epic.burned * tickets.epic.multiplier,
        },
        special: {
            rarity: 'Special',
            burned: tickets.special.burned,
            tickets: tickets.special.burned * tickets.special.multiplier,
        },
    };

    const total = structured.common.tickets + structured.rare.tickets + structured.epic.tickets;
    return { tickets: structured, totalTickets: total };
};
/* 229348323 */

export const getJackpotRewards = async () => {
    const jackpotInfo = await getJackpotInfo();
    const block = await getBlock(jackpotInfo.lastJackpotHeight);

    const [bountyTransactions, distributorTransactions] = await Promise.all([
        getBountyTransactions(block.timestamp),
        getAssetDistributorTransactions(block.timestamp),
    ]);

    const allTransactions = [...bountyTransactions, ...distributorTransactions];

    const rewards = {};

    const uniqueRecipients = new Set();
    const uniqueAssets = new Set();

    allTransactions.forEach(transaction => {
        if (
            transaction.type === 2 &&
            transaction.subtype === 1 &&
            transaction.attachment &&
            transaction.attachment.asset
        ) {
            uniqueRecipients.add(transaction.recipient);
            uniqueAssets.add(transaction.attachment.asset);
        }
    });

    const [accountsInfo, assetsInfo] = await Promise.all([
        Promise.all([...uniqueRecipients].map(recipient => getAccount(recipient))),
        Promise.all([...uniqueAssets].map(asset => getAsset(asset))),
    ]);

    const accountMap = {};
    accountsInfo.forEach(account => {
        accountMap[account.accountRS] = account;
    });

    const assetMap = {};
    assetsInfo.forEach(asset => {
        assetMap[asset.asset] = asset;
    });

    allTransactions.forEach(transaction => {
        if (
            transaction.type === 2 &&
            transaction.subtype === 1 &&
            transaction.attachment &&
            transaction.attachment.asset
        ) {
            const recipient = transaction.recipientRS;
            const asset = transaction.attachment.asset;
            const quantity = Number(transaction.attachment.quantityQNT || 0);
            const message = JSON.parse(transaction.attachment.message);
            let ticketNumber = message.ticketNumber || '0';

            if (!rewards[recipient]) {
                rewards[recipient] = {
                    accountInfo: accountMap[recipient],
                    assets: {},
                };
            }

            if (!rewards[recipient].assets[asset]) {
                rewards[recipient].assets[asset] = {
                    quantity: '0',
                    assetInfo: assetMap[asset],
                };
            }

            rewards[recipient].assets[asset].quantity = Number(rewards[recipient].assets[asset].quantity) + quantity;

            rewards[recipient].assets[asset].ticketNumber = ticketNumber;
        }
    });

    return rewards;
};

export const getJackpotFormattedTickets = async () => {
    const colors = [
        '#B2496C',
        '#7FC0BE',
        '#E1A325',
        '#E53055',
        '#979797',
        '#5BB249',
        '#E43E4A',
        '#0056F5',
        '#D497B2',
        '#5F6368',
        '#39D5D5',
        '#5A679B',
        '#01B29F',
    ];

    const accountColorMap = {};
    let colorIndex = 0;

    const jackpotInfo = await getJackpotInfo();
    const accountsTickets = jackpotInfo.participants;
    for (const account in accountsTickets) {
        accountColorMap[account] = colors[colorIndex % colors.length];
        colorIndex++;
        if (colorIndex >= colors.length) colorIndex = 0;
    }

    const allTickets = [];

    for (const account in accountsTickets) {
        const tickets = accountsTickets[account];
        tickets.forEach(ticket => {
            allTickets.push({
                ticket,
                account,
                color: accountColorMap[account],
            });
        });
    }

    allTickets.sort((a, b) => a.ticket - b.ticket);

    return { allTickets, participants: Object.entries(accountsTickets).length };
};

const getBlock = async height => {
    const response = await axios.get(`${NODEURL}?requestType=getBlock&chain={2}&height=${height}`);
    return response.data;
};

export const prepareTableData = rewards => {
    const tableData = [];

    if (rewards) {
        for (const [address, data] of Object.entries(rewards)) {
            const { accountInfo, assets } = data;
            for (const [assetId, assetData] of Object.entries(assets)) {
                tableData.push({
                    address,
                    accountName: accountInfo.name,
                    assetId,
                    assetName: assetData.assetInfo.name,
                    quantity: assetData.quantity,
                    assetDetails: assetData.assetInfo,
                    accountId: accountInfo.account,
                    ticketNumber: assetData.ticketNumber,
                });
            }
        }
    }

    return tableData;
};
