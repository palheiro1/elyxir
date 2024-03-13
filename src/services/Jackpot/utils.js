import { JACKPOTACCOUNT, JACKPOTHALF, NQTDIVIDER, WETHASSETACCOUNT } from '../../data/CONSTANTS';
import { fetchCurrencyAssets } from '../../utils/cardsUtils';
// import { getIgnisBalance } from '../Ardor/ardorInterface';
import { getEthPrice } from '../coingecko/utils';

export const getJackpotBalance = async () => {
    // Recover Jackpot balance - IGNIS
    //const response = await getIgnisBalance(JACKPOTACCOUNT);
    const response = await fetchCurrencyAssets(JACKPOTACCOUNT, [WETHASSETACCOUNT], false);
    const unconfirmedBalance = response[0][0].unconfirmedQuantityQNT;
    const balance = unconfirmedBalance / NQTDIVIDER;
    return (JACKPOTHALF ? balance / 2 : balance).toFixed(6);
};

export const swapPriceEthtoUSD = async jackpotBalance => {
    // const ignisPrice = await getIgnisPrice();
    const ethPrice = await getEthPrice();
    return (jackpotBalance * ethPrice).toFixed(6);
};

export const getJackpotParticipants = async () => {
    // Get participants
    const response = await fetch('https://api.mythicalbeings.io/index.php?action=winners');
    return await response.json();
};
