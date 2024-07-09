import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';

export const getArenas = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.arena)
        .catch(error => error);
};
export const getSoldiers = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.definition.soldier)
        .catch(error => error);
};
export const getPendingArmies = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.arena.pendingArmy)
        .catch(error => error);
};

export const getBattleById = async battleId => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameBattle&id=${battleId}`)
        .then(res => res.data.battle)
        .catch(error => error);
};

export const getUserBattles = async accountId => {
    return axios
        .get(`${OMNO_API}/index.php?action=getUserBattles&account=${accountId}`)
        .then(res => res.data.accountBattle.battle)
        .catch(error => error);
};

export const getBattleCount = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.arena.battleCount)
        .catch(error => error);
};

export const getLastUserBattle = async (accountId, currentTime) => {
    return axios
        .get(`${OMNO_API}/index.php?action=getUserBattles&account=${accountId}`)
        .then(res => {
            const battles = res.data.accountBattle.battle;

            if (!battles || battles.length === 0) {
                return false;
            }

            const latestBattle = battles.reduce((latest, current) => {
                return new Date(current.economicCluster.timestamp) > new Date(latest.economicCluster.timestamp)
                    ? current
                    : latest;
            }, battles[0]);

            // Timestamp del último combate en formato UTC
            const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
            const battleStamp = new Date(eb.getTime() + 20000 + latestBattle.economicCluster.timestamp * 1000);

            // Fecha y hora actual en formato UTC
            const currentTimestamp = new Date(currentTime);

            // // Comparar las fechas
            if (battleStamp < currentTimestamp) {
                return 'pending';
            }

            return latestBattle;
        })
        .catch(error => error);
};
