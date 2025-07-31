import { useState, useEffect, useRef, useCallback } from 'react';
import { Stack } from '@chakra-ui/react';
import { getLastUserBattle, getBattleById, getArenas } from '../../../../../../../services/Battlegrounds/Battlegrounds';
import { addressToAccountId, getAccount } from '../../../../../../../services/Ardor/ardorInterface';
import locations from '../../../../assets/LocationsEnum';
import BattleHeader from './Components/BattleHeader';
import BattleRounds from './Components/BattleRounds';
import BattleFooter from './Components/BattleFooter';
import BattleLoading from './Components/BattleLoading';
import { useSelector } from 'react-redux';
import BattleCardsSummary from '../../../BattleRecord/BattleDetails/Components/BattleCardsSummary';

/**
 * @name BattleResults
 * @description Displays the full summary of a finished battle, including attacker and defender data,
 * card performance, battle rounds, and final scores. Automatically fetches the most recent
 * battle involving the current user, calculates bonuses and points, and renders detailed views.
 * Uses polling every 5 seconds to check for new battle data.
 * @param {Object} props
 * @param {Object} props.infoAccount - Current user's account object (must contain `accountRs`).
 * @param {number} props.currentTime - Current blockchain timestamp (used to fetch latest battle).
 * @param {Object} props.arenaInfo - Current arena metadata (contains `id`, `mediumId`, etc.).
 * @param {string} props.domainName - Name of the domain involved in the battle.
 * @returns {JSX.Element} A full battle results layout with header, summary, rounds, and footer.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleResults = ({ infoAccount, currentTime, cards, arenaInfo, domainName }) => {
    const [battleInfo, setBattleInfo] = useState(null);
    const [capturedCard, setCapturedCard] = useState(null);
    const [medium, setMedium] = useState();
    const [arenaName, setArenaName] = useState(null);
    const intervalRef = useRef(null);
    const [attackerPoints, setAttackerPoints] = useState(null);
    const [defenderPoints, setDefenderPoints] = useState(null);
    const [attackerBonus, setAttackerBonus] = useState([]);
    const [defenderBonus, setDefenderBonus] = useState([]);
    const [battleResults, setBattleResults] = useState(null);
    const [isUserDefending, setIsUserDefending] = useState(false);
    const [attackerInfo, setAttackerInfo] = useState(null);
    const [defenderInfo, setDefenderInfo] = useState(null);
    const [attackerHero, setAttackerHero] = useState(null);
    const [defenderHero, setDefenderHero] = useState(null);

    const { soldier: soldiers } = useSelector(state => state.soldiers.soldiers);

    const getLastBattle = useCallback(async () => {
        if (!currentTime || !arenaInfo) return;

        // Configurar medium y nombre de arena
        switch (arenaInfo.mediumId) {
            case 1:
                setMedium('Terrestrial');
                break;
            case 2:
                setMedium('Aerial');
                break;
            case 3:
                setMedium('Aquatic');
                break;
            default:
                setMedium('Unknown');
        }
        setArenaName(locations[arenaInfo.id - 1].name);

        const accountId = addressToAccountId(infoAccount.accountRs);
        const res = await getLastUserBattle(accountId, currentTime);
        if (res) {
            clearInterval(intervalRef.current);
            const capturedCard = cards.find(card => Object.keys(res.capturedAsset).includes(card.asset));
            setCapturedCard(capturedCard);

            const battle = await getBattleById(res.battleId);
            setAttackerHero(cards.find(card => card.asset === battle.attackerArmy.heroAsset));
            setDefenderHero(cards.find(card => card.asset === battle.defenderArmy.heroAsset));

            setIsUserDefending(res.defenderAccount === accountId);
            setBattleResults(battle);

            const info = await getArenaInfo(arenaInfo.id, res.defenderAccount, res.attackerAccount);
            setAttackerInfo(info.attacker);
            setDefenderInfo(info.defender);
            setBattleInfo(battle);
        }
    }, [currentTime, arenaInfo, infoAccount.accountRs, cards]);

    const getArenaInfo = async (arenaId, defenderAccount, attackerAccount) => {
        const arenasInfo = await getArenas();
        if (!arenasInfo) return null;

        const arena = arenasInfo.arena.find(a => a.id === arenaId);
        const defender = await getAccount(defenderAccount);
        const attacker = await getAccount(attackerAccount);
        const name = locations.find(item => item.id === arenaId);

        return {
            defender,
            attacker,
            arena: { ...name, ...arena },
        };
    };

    const calculateBonus = useCallback(
        async (card, isAttacker) => {
            if (!soldiers || !attackerHero || !defenderHero) return {};

            const hero = isAttacker
                ? soldiers.find(s => s.asset === attackerHero.asset)
                : soldiers.find(s => s.asset === defenderHero.asset);

            const cardInfo = soldiers.find(item => item.asset === card.asset);
            const arenaSoldier = soldiers.find(item => item.arenaId === arenaInfo.id);

            return {
                mediumBonus: cardInfo.mediumId === arenaSoldier.mediumId ? 1 : 0,
                domainBonus: cardInfo.domainId === arenaSoldier.domainId ? 1 : 0,
                heroBonus:
                    (cardInfo.mediumId === hero.mediumId ? 1 : 0) + (cardInfo.domainId === hero.domainId ? 1 : 0),
            };
        },
        [arenaInfo.id, attackerHero, defenderHero, soldiers]
    );

    useEffect(() => {
        if (currentTime) {
            intervalRef.current = setInterval(getLastBattle, 5000);
            return () => clearInterval(intervalRef.current);
        }
    }, [currentTime, getLastBattle]);

    useEffect(() => {
        const calculateAllBonusesAndPoints = async () => {
            if (!battleResults || !cards?.length || !soldiers || !calculateBonus) return;

            let pointsA = 0;
            let pointsD = 0;
            const attackerResults = [];
            const defenderResults = [];

            await Promise.all(
                battleResults.battleResult.map(async (item, index) => {
                    const attackerCard = cards.find(card => String(card.asset) === String(item.attackerAsset));
                    const defenderCard = cards.find(card => String(card.asset) === String(item.defenderAsset));

                    if (attackerCard && defenderCard) {
                        attackerResults[index] = await calculateBonus(attackerCard, true);
                        defenderResults[index] = await calculateBonus(defenderCard, false);
                        pointsA += item.attackerValue;
                        pointsD += item.defenderValue;
                    }
                })
            );

            setAttackerPoints(pointsA);
            setDefenderPoints(pointsD);
            setAttackerBonus(attackerResults);
            setDefenderBonus(defenderResults);
        };

        calculateAllBonusesAndPoints();
    }, [battleResults, cards, soldiers, calculateBonus]);

    if (!battleInfo) {
        return <BattleLoading />;
    }

    return (
        <Stack h="100%" w="100%" direction="column" overflowY={'hidden'}>
            <BattleHeader
                isDefenderWin={battleInfo.isDefenderWin}
                attackerInfo={attackerInfo}
                attackerPoints={attackerPoints}
                arenaName={arenaName}
                domainName={domainName}
                medium={medium}
                arenaInfo={arenaInfo}
            />

            <BattleCardsSummary
                infoAccount={infoAccount}
                playerInfo={attackerInfo}
                cards={cards}
                army={battleInfo.attackerArmy}
                battleInfo={battleInfo}
                battleResults={battleResults}
                role="attacker"
            />

            <BattleRounds
                battleResults={battleResults.battleResult}
                cards={cards}
                battleInfo={battleInfo}
                soldiers={soldiers}
                attackerBonus={attackerBonus}
                defenderBonus={defenderBonus}
                attackerHero={attackerHero}
                defenderHero={defenderHero}
            />

            <BattleCardsSummary
                infoAccount={infoAccount}
                playerInfo={defenderInfo}
                cards={cards}
                army={battleInfo.defenderArmy}
                battleInfo={battleInfo}
                battleResults={battleResults}
                role="defender"
            />

            <BattleFooter
                isDefenderWin={battleInfo.isDefenderWin}
                defenderInfo={defenderInfo}
                defenderPoints={defenderPoints}
                capturedCard={capturedCard}
                isUserDefending={isUserDefending}
            />
        </Stack>
    );
};

export default BattleResults;
