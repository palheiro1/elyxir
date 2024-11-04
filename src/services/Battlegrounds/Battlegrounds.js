import axios from 'axios';
import { OMNO_API } from '../../data/CONSTANTS';
import { addressToAccountId } from '../Ardor/ardorInterface';

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
                return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
            }, battles[0]);

            // Timestamp del último combate en formato UTC
            const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
            const battleStamp = new Date(eb.getTime() + 20000 + latestBattle.timestamp * 1000);

            // Fecha y hora actual en formato UTC
            const currentTimestamp = new Date(currentTime);

            //Comparar las fechas
            if (battleStamp < currentTimestamp) {
                return null;
            }

            return latestBattle;
        })
        .catch(error => error);
};

export const getActivePlayers = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => {
            let activePlayers = res.data.state.activePlayers;
            return activePlayers;
        })
        .catch(error => error);
};

export const getLandLords = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.landLords)
        .catch(error => error);
};

export const getLeaderboards = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getLeaderboards`)
        .then(res => res.data.leaderboards)
        .catch(error => error);
};

export const getAccumulatedBounty = async () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.arena.accumulatedBounty)
        .catch(error => error);
};

export const getAveragesDices = async accountRs => {
    try {
        let accountId = addressToAccountId(accountRs);
        let res = await getUserBattles(accountId);
        let attackerSum = 0;
        let defenderSum = 0;
        let battleCount = 0;

        for (const { battleId } of res) {
            let battle = await getBattleById(battleId);
            if (!battle.battleResult || battle.battleResult.length === 0) continue;
            let { battleResult } = battle;

            // eslint-disable-next-line no-loop-func
            battleResult.forEach(item => {
                defenderSum += parseInt(item.defenderRoll);
                attackerSum += parseInt(item.attackerRoll);
            });

            battleCount++;
        }
        return {
            AttackerAverage: attackerSum / battleCount,
            DefenderAverage: defenderSum / battleCount,
            AttackerSum: attackerSum,
            DefenderSum: defenderSum,
            battleCount: battleCount,
        };
    } catch (error) {
        console.error('Error calculating averages:', error);
    }
};

export const getLeaderboardsResetBlock = () => {
    return axios
        .get(`${OMNO_API}/index.php?action=getOmnoGameState`)
        .then(res => res.data.state.leaderboardsResetBlock)
        .catch(error => error);
};
