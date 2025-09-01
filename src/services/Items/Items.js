import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';

export const getItemsForBonus = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.definition.itemForBonus)
        .catch(error => error);
};

export const getOmnoItemsBalance = async (accountId, itemsAssets) => {
    const response = await axios.get('https://api.mythicalbeings.io/index.php?action=getOmnoUserState');

    const accountData = response.data.find(item => item.id === accountId);
    if (!accountData || !accountData.balance?.asset) return [];

    const userBalance = accountData.balance.asset;

    const itemsBalance = itemsAssets
        .map(asset => {
            const quantityQNT = Number(userBalance[asset.asset] || 0);
            return {
                asset: asset.asset,
                quantityQNT,
            };
        })
        .filter(item => item.quantityQNT > 0);

    return itemsBalance;
};
