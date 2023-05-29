import { WETHASSET } from '../../data/CONSTANTS';
import { fetchOmnoMarket } from '../../utils/omno';

const getOmnoAskOrders = (allOffers, asset) => {
    const selectedOffers = allOffers.filter(item => {
        if (item.give.asset === undefined || item.take.asset === undefined) return false;
        return (
            Object.keys(item.give).length === 1 &&
            Object.keys(item.take).length === 1 &&
            item.give.asset[asset] &&
            item.take.asset[WETHASSET]
        );
    });
    // Order by price (lowest first) - take.asset is WETH
    selectedOffers.sort((a, b) => {
        return a.take.asset[WETHASSET] - b.take.asset[WETHASSET];
    });
    return selectedOffers;
};

const getOmnoBidOrders = (allOffers, asset) => {
    const selectedOffers = allOffers.filter(item => {
        if (item.give.asset === undefined || item.take.asset === undefined) return false;
        return (
            Object.keys(item.give).length === 1 &&
            Object.keys(item.take).length === 1 &&
            item.give.asset[WETHASSET] &&
            item.take.asset[asset]
        );
    });
    selectedOffers.sort((a, b) => {
        return a.give.asset[WETHASSET] - b.give.asset[WETHASSET];
    });
    return selectedOffers;
};

export const getOmnoMarketOrdesForAsset = async asset => {
    const allOffers = await fetchOmnoMarket();
    const askOrders = getOmnoAskOrders(allOffers, asset);
    const bidOrders = getOmnoBidOrders(allOffers, asset);
    return { askOrders, bidOrders };
};
