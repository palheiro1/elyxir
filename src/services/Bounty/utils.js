import { BOUNTYACCOUNT, BOUNTYHALF, NQTDIVIDER, WETHASSETACCOUNT } from '../../data/CONSTANTS';
import { fetchCurrencyAssets } from '../../utils/cardsUtils';
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
