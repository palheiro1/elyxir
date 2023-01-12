import { JACKPOTACCOUNT, JACKPOTHALF, NQTDIVIDER } from "../../data/CONSTANTS";
import { getIgnisBalance } from "../Ardor/ardorInterface";
import { getIgnisPrice } from "../coingecko/utils";

export const getJackpotBalance = async () => {
    // Recover Jackpot balance - IGNIS
    const response = await getIgnisBalance(JACKPOTACCOUNT);
    const balance = response.balanceNQT / NQTDIVIDER;
    return (JACKPOTHALF ? balance / 2 : balance).toFixed(2);
}

export const getJackpotBalanceUSD = async (jackpotBalance) => {
    const ignisPrice = await getIgnisPrice();
    return (
        (JACKPOTHALF ? jackpotBalance / 2 : jackpotBalance) * ignisPrice
    ).toFixed(2);
}