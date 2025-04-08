import { BOUNTYACCOUNT, BOUNTYHALF, NQTDIVIDER, WETHASSETACCOUNT } from '../../data/CONSTANTS';
import { fetchCurrencyAssets } from '../../utils/cardsUtils';
import { getBlockchainTransactions } from '../Ardor/ardorInterface';
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

export const getJackpotParticipants = async () => {
    const response = await fetch('https://api.mythicalbeings.io/index.php?action=jackpot');
    return await response.json();
};

export const getBountyTransactions = async () => {
    const res = await getBlockchainTransactions(2, BOUNTYACCOUNT, true, 229348323, -1);

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
/* 229348323 */
