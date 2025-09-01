import { Square, Stack } from '@chakra-ui/react';
import BattleCard from './BattleCard';
import { Fragment } from 'react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name BattleRound
 * @description Represents a single round in the battle, showing both the attacker's and defender's cards,
 * their roll values, bonuses, and computed values. Each card is rendered using `BattleCard`
 * and includes optional styling and indicators for hero units.
 * Used inside the horizontal `BattleRounds` list to display sequential rounds.
 * @param {Object} props
 * @param {Object} props.round - Data for this specific round (contains attacker/defender asset, roll, value).
 * @param {number} props.index - Index of the current round (used for array access and key).
 * @param {Array} props.cards - Full list of cards available to match against attacker/defender.
 * @param {Object} props.battleInfo - Full metadata of the ongoing or resolved battle.
 * @param {Array} props.soldiers - Soldier data for each card, used to provide soldier stats to `BattleCard`.
 * @param {Array} props.attackerBonus - List of attacker bonuses per round.
 * @param {Array} props.defenderBonus - List of defender bonuses per round.
 * @param {Object} props.attackerHero - Metadata of the attacker's hero card.
 * @param {Object} props.defenderHero - Metadata of the defender's hero card.
 * @returns {JSX.Element} A column stack with attacker and defender cards for a single battle round.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleRound = ({
    round,
    index,
    cards,
    battleInfo,
    soldiers,
    attackerBonus,
    defenderBonus,
    attackerHero,
    defenderHero,
    potionAsset,
}) => {
    const { defenderValue, attackerValue, attackerRoll, defenderRoll, defenderAsset, attackerAsset } = round;

    const attackerCard = cards.find(card => String(card.asset) === String(attackerAsset));
    const defenderCard = cards.find(card => String(card.asset) === String(defenderAsset));
    const attackerSoldier = soldiers.find(s => s.asset === attackerAsset);
    const defenderSoldier = soldiers.find(s => s.asset === defenderAsset);

    const { isMobile } = useBattlegroundBreakpoints();

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
                <BattleCard
                    card={attackerCard}
                    soldier={attackerSoldier}
                    bonuses={attackerBonus[index]}
                    roll={attackerRoll}
                    value={attackerValue}
                    opponentValue={defenderValue}
                    isHero={attackerHero?.asset === attackerCard.asset}
                    color="#D597B2"
                    potionAsset={potionAsset}
                />

                {/* Defender Card */}
                <BattleCard
                    card={defenderCard}
                    soldier={defenderSoldier}
                    bonuses={defenderBonus[index]}
                    roll={defenderRoll}
                    value={defenderValue}
                    opponentValue={attackerValue}
                    isHero={defenderHero?.asset === defenderCard.asset}
                    color="#D597B2"
                    isDefender
                    defenderBonus={battleInfo.defenderBonus}
                />
            </Stack>
            <Square bgColor="#FFF" height={isMobile ? '1px' : '95%'} width={isMobile ? '90%' : '1px'} m="auto" />
        </Fragment>
    );
};

export default BattleRound;
