import { Square, Stack, Text } from '@chakra-ui/react';
import { getBattleRoundInfo, getDiceIcon } from '../../../../Utils/BattlegroundsUtils';
import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import ScoreBox from './ScoreBox';
import RoundCard from './RoundCard';

/**
 * @name BattleRound
 * @description Displays a single battle round between attacker and defender. Shows each card, the assigned
 * soldier, bonuses, dice roll, and resulting score. Highlights the winner for each side.
 * Data is retrieved from Redux store for cards and soldiers. Also handles rendering of
 * hero indicators, round bonuses, and optional defense bonus rules based on battle ID.
 * @param {Object} props - Component props.
 * @param {Object} props.item - Object containing attacker/defender roll results and asset references.
 * @param {number} props.index - Round index used to fetch bonuses.
 * @param {Object} props.battleInfo - Battle metadata used for rendering extra bonus info.
 * @param {Object} props.attackerHero - Hero card object of the attacker.
 * @param {number[]} props.attackerBonus - Array of attacker's per-round bonuses.
 * @param {Object} props.defenderHero - Hero card object of the defender.
 * @param {number[]} props.defenderBonus - Array of defender's per-round bonuses.
 * @param {number} props.battleId - Unique battle ID (used for conditional logic).
 * @param {boolean} props.isMobile - Whether the component is rendered in mobile view.
 * @returns {JSX.Element} Round layout showing attacker and defender details with visual results.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRound = ({
    item,
    index,
    battleInfo,
    attackerHero,
    attackerBonus,
    defenderHero,
    defenderBonus,
    battleId,
    isMobile,
    potionAsset,
}) => {
    const { cards } = useSelector(state => state.cards);
    const { soldiers: rawSoldiers } = useSelector(state => state.soldiers);
    const soldiers = rawSoldiers.soldier;

    const { defenderValue, attackerValue, attackerRoll, defenderRoll, defenderAsset, attackerAsset } = item;
    const { attackerCard, defenderCard, defenderSoldier, attackerSoldier } = getBattleRoundInfo(
        defenderAsset,
        attackerAsset,
        cards,
        battleInfo,
        soldiers
    );

    const isAttackerWinner = attackerValue > defenderValue;
    const isDefenderWinner = defenderValue > attackerValue;

    return (
        <Fragment key={index}>
            <Stack
                direction={isMobile ? 'row' : 'column'}
                minW="250px"
                w={isMobile ? '90%' : '250px'}
                h={isMobile ? '250px' : '100%'}
                mx={'auto'}
                justifyContent={isMobile && 'space-between'}
                flexShrink={0}>
                <Stack
                    direction="row"
                    color="#FFF"
                    h={!isMobile && '50%'}
                    mr={isMobile && 2}
                    w={isMobile && '50%'}
                    spacing={4}>
                    <Stack direction="column" fontSize="xs" align="flex-start" my="auto" w={'90%'}>
                        <Text fontSize="large" letterSpacing={2} fontFamily="'Aagaz', sans-serif" color="#D597B2">
                            {attackerCard.name} {attackerHero.asset === attackerCard.asset ? '(Alpha)' : null}
                        </Text>
                        <RoundCard
                            card={attackerCard}
                            soldier={attackerSoldier}
                            bonus={attackerBonus[index]}
                            isHero={attackerHero.asset === attackerCard.asset}
                            isWinner={isAttackerWinner}
                            isMobile={isMobile}
                            cardImgUrl={attackerCard.cardImgUrl}
                            roll={attackerRoll}
                            rollIcon={getDiceIcon(attackerRoll)}
                            potionAsset={potionAsset}
                        />
                    </Stack>
                    <ScoreBox value={attackerValue} isWinner={isAttackerWinner} />
                </Stack>

                <Stack
                    direction={isMobile ? 'row-reverse' : 'row'}
                    color="#FFF"
                    w={isMobile && '50%'}
                    h={!isMobile && '50%'}
                    spacing={4}
                    ml={isMobile && 2}>
                    <Stack
                        direction="column"
                        fontSize="xs"
                        align={isMobile ? 'flex-end' : 'flex-start'}
                        my="auto"
                        w="90%">
                        <Text fontSize="large" letterSpacing={2} fontFamily="'Aagaz', sans-serif" color="#D597B2">
                            {defenderCard.name} {defenderHero.asset === defenderCard.asset ? '(Alpha)' : null}
                        </Text>
                        <RoundCard
                            card={defenderCard}
                            soldier={defenderSoldier}
                            bonus={defenderBonus[index]}
                            isHero={defenderHero.asset === defenderCard.asset}
                            isWinner={isDefenderWinner}
                            isMobile={isMobile}
                            cardImgUrl={defenderCard.cardImgUrl}
                            roll={defenderRoll}
                            rollIcon={getDiceIcon(defenderRoll)}
                            defenseBonus={
                                defenderHero.asset === defenderCard.asset || battleId < 913
                                    ? battleInfo.defenderBonus || 2
                                    : undefined
                            }
                            isDefender
                        />
                    </Stack>
                    <ScoreBox value={defenderValue} isWinner={isDefenderWinner} />
                </Stack>
            </Stack>
            <Square bgColor="#FFF" height={isMobile ? '1px' : '95%'} width={isMobile ? '90%' : '1px'} m="auto" />
        </Fragment>
    );
};

export default BattleRound;
