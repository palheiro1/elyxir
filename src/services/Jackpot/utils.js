import { JACKPOTACCOUNT, JACKPOTHALF, NQTDIVIDER } from "../../data/CONSTANTS";
import { getIgnisBalance } from "../Ardor/ardorInterface";

export const getJackpotBalance = async () => {
    // Recover Jackpot balance - IGNIS
    const response = await getIgnisBalance(JACKPOTACCOUNT);
    const balance = response.balanceNQT / NQTDIVIDER;
    return (JACKPOTHALF ? balance / 2 : balance).toFixed(2);
}

export const getJackpotBalanceUSD = async (jackpotBalance) => {
    const responseUSD = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ignis&vs_currencies=usd'
    );
    const data = await responseUSD.json();
    return (
        (JACKPOTHALF ? jackpotBalance / 2 : jackpotBalance) * data.ignis.usd
    ).toFixed(2);
}