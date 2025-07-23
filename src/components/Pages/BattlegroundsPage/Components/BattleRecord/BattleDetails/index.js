import { Box, IconButton, Spinner, Stack, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getBattleById, getSoldiers } from '../../../../../../services/Battlegrounds/Battlegrounds';
import '@fontsource/chelsea-market';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { errorToast } from '../../../../../../utils/alerts';
import locations from '../../../assets/LocationsEnum';
import BattleDetailsHeader from './Components/BattleDetailsHeader';
import BattleRounds from './Components/BattleRounds';
import BattleDetailsFooter from './Components/BattleDetailsFooter';
import { useBattlegroundBreakpoints } from '../../../../../../hooks/useBattlegroundBreakpoints';
import BattleCardsSummary from './Components/BattleCardsSummary';

/**
 * @name BattleDetails
 * @description Displays detailed battle information, including army composition, bonus calculations,
 * results, and the card captured by the winner. Pulls and computes contextual data such as hero bonuses,
 *  domain affinity, and medium match. It also manages data loading and error handling for missing or outdated battle results.
 * @param {Object} props - Component props.
 * @param {Array} props.cards - Full list of user cards with metadata and assets.
 * @param {Object} props.arenaInfo - Current arena data (id, mediumId, level, etc.).
 * @param {Function} props.handleGoBack - Function to go back to the previous screen.
 * @param {Object} props.battleDetails - Initial battle context including attacker and defender info.
 * @param {string|number} props.battleId - ID of the battle to fetch details for.
 * @param {Object} props.infoAccount - Metadata about the user/account.
 * @returns {JSX.Element} Battle detail view with summaries, rounds and results, or a loading spinner if not yet loaded.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleDetails = ({ cards, arenaInfo, handleGoBack, battleDetails, battleId, infoAccount }) => {
    const { attackerDetails: attackerInfo, defenderDetails: defenderInfo, isUserDefending } = battleDetails;
    const [battleInfo, setBattleInfo] = useState(null);
    const [capturedCard, setCapturedCard] = useState(null);
    const [medium, setMedium] = useState();
    const [arenaName, setArenaName] = useState(null);
    const [attackerPoints, setAttackerPoints] = useState(<Spinner />);
    const [defenderPoints, setDefenderPoints] = useState(<Spinner />);
    const [attackerBonus, setAttackerBonus] = useState([]);
    const [defenderBonus, setDefenderBonus] = useState([]);
    const [battleResults, setBattleResults] = useState(null);
    const [domainName, setDomainName] = useState(null);
    const [attackerHero, setAttackerHero] = useState(null);
    const [defenderHero, setDefenderHero] = useState(null);
    const [soldiers, setSoldiers] = useState(null);

    const { isMobile, isMediumScreen } = useBattlegroundBreakpoints();

    const getLastBattle = useCallback(async () => {
        if (arenaInfo) {
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
        }

        setArenaName(locations[arenaInfo.id - 1].name);
        const res = await getBattleById(battleId);
        if (res.battleResult === null || !res.battleResult) {
            errorToast("Old version battle. Can not access to it's results.", toast);
            handleGoBack();
        }
        const capturedCard = cards.filter(obj => Object.keys(res.captured.asset).includes(obj.asset))[0];

        const attackerHero = cards.find(card => card.asset === res.attackerArmy.heroAsset);
        setAttackerHero(attackerHero);

        const defenderHero = cards.find(card => card.asset === res.defenderArmy.heroAsset);
        setDefenderHero(defenderHero);
        setCapturedCard(capturedCard);

        const soldiers = await getSoldiers();
        setSoldiers(soldiers.soldier);
        setBattleResults(res);

        setBattleInfo(res);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arenaInfo, battleId, cards]);

    const calculateBonus = useCallback(
        async (card, isAttacker) => {
            let defenderSoldier = soldiers.find(soldier => soldier.asset === defenderHero.asset);
            let attackerSoldier = soldiers.find(soldier => soldier.asset === attackerHero.asset);
            const hero = isAttacker ? attackerSoldier : defenderSoldier;

            const bonus = {
                mediumBonus: 0,
                domainBonus: 0,
                heroBonus: 0,
            };

            const arenaSoldier = soldiers.find(item => item.arenaId === arenaInfo.id);

            setDomainName(cards.find(card => card.asset === arenaSoldier.asset).channel);
            const cardInfo = soldiers.find(item => item.asset === card.asset);
            if (cardInfo.mediumId === arenaSoldier.mediumId) {
                bonus.mediumBonus += 1;
            }
            if (cardInfo.domainId === arenaSoldier.domainId) {
                bonus.domainBonus += 1;
            }
            if (cardInfo.mediumId === hero.mediumId) {
                bonus.heroBonus += 1;
            }
            if (cardInfo.domainId === hero.domainId) {
                bonus.heroBonus += 1;
            }
            return bonus;
        },
        [arenaInfo.id, attackerHero, cards, defenderHero, soldiers]
    );

    useEffect(() => {
        battleId && getLastBattle();
    }, [battleId, getLastBattle]);

    useEffect(() => {
        const calculateAllBonusesAndPoints = async () => {
            let pointsA = 0;
            let pointsD = 0;
            const attackerResults = [];
            const defenderResults = [];

            await Promise.all(
                battleResults.battleResult.map(async (item, index) => {
                    let { defenderValue, attackerValue } = item;

                    const attackerCard = cards.find(card => String(card.asset) === String(item.attackerAsset));
                    const defenderCard = cards.find(card => String(card.asset) === String(item.defenderAsset));

                    if (attackerCard && defenderCard) {
                        const attackerBonuses = (await calculateBonus(attackerCard, true)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                            heroBonus: 0,
                        };
                        const defenderBonuses = (await calculateBonus(defenderCard, false)) || {
                            mediumBonus: 0,
                            domainBonus: 0,
                            heroBonus: 0,
                        };

                        attackerResults[index] = attackerBonuses;
                        defenderResults[index] = defenderBonuses;

                        pointsA += attackerValue;
                        pointsD += defenderValue;
                    }
                })
            );

            setAttackerPoints(pointsA);
            setDefenderPoints(pointsD);
            setAttackerBonus(attackerResults);
            setDefenderBonus(defenderResults);
        };

        if (battleResults && cards && cards.length > 0 && soldiers && calculateBonus) {
            calculateAllBonusesAndPoints();
        }
    }, [battleDetails.attacker, battleDetails.defender, battleResults, calculateBonus, cards, soldiers]);

    const toast = useToast();
    if (!cards || cards.length <= 0) {
        errorToast('Cards are not loaded. Please refresh the battlegrounds page', toast);
        handleGoBack();
    }

    return cards && cards.length > 0 && battleInfo ? (
        <Stack boxSize="100%">
            <IconButton
                background={'transparent'}
                color={'#000'}
                icon={<ChevronLeftIcon />}
                _hover={{ background: 'transparent' }}
                position="fixed"
                top={2}
                left={3}
                fontSize="2rem"
                zIndex={999}
                onClick={handleGoBack}
            />
            <BattleDetailsHeader
                isDefenderWin={battleInfo.isDefenderWin}
                attackerInfo={attackerInfo}
                attackerPoints={attackerPoints}
                arenaLevel={arenaInfo.level}
                arenaName={arenaName}
                medium={medium}
                domainName={domainName}
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
                battleResults={battleResults}
                battleInfo={battleInfo}
                attackerHero={attackerHero}
                attackerBonus={attackerBonus}
                defenderHero={defenderHero}
                defenderBonus={defenderBonus}
                battleId={battleId}
                isMobile={isMobile}
                isMediumScreen={isMediumScreen}
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

            <BattleDetailsFooter
                isDefenderWin={battleInfo.isDefenderWin}
                defenderInfo={defenderInfo}
                defenderPoints={defenderPoints}
                capturedCard={capturedCard}
                isUserDefending={isUserDefending}
            />
        </Stack>
    ) : (
        <Box
            h={'100%'}
            position={'absolute'}
            color={'#FFF'}
            alignContent={'center'}
            top={'50%'}
            left={'50%'}
            transform={'translate(-50%, -50%)'}
            w={'100%'}
            textAlign={'center'}>
            <Spinner color="#FFF" w={20} h={20} />
        </Box>
    );
};

export default BattleDetails;
