import { Stack, Text } from '@chakra-ui/react';
import StatRow from './StatRow';
import {
    getContinentIcon,
    getDiceIcon,
    getLevelIconInt,
    getMediumIconInt,
} from '../../../../../Utils/BattlegroundsUtils';
import CardImage from './CardImage';
import ValueBox from './ValueBox';

/**
 * @name BattleCard
 * @description Renders a single card's stats and visuals for a battle round. Displays key attributes like bonuses, soldier power,
 * dice roll, and total value. Includes conditional styling for heroes, defenders, and defeated cards.
 * Integrates helper components such as `StatRow`, `CardImage` and `ValueBox` for structured rendering.
 * @param {Object} props
 * @param {Object} props.card - Metadata of the card being rendered (includes name, image, channel, etc.).
 * @param {Object} props.soldier - Stats for the card (includes power and mediumId).
 * @param {Object} props.bonuses - Bonuses applied to this card (domainBonus, mediumBonus, heroBonus).
 * @param {number} props.roll - The dice roll result for this card in the current round.
 * @param {number} props.value - The total computed value (power + roll + bonuses) for this card.
 * @param {number} props.opponentValue - The total value of the opposing card, used to determine winner/loser status.
 * @param {boolean} props.isHero - Whether this card is the "hero" card (special frame + styling).
 * @param {string} props.color - Text color for the card name and title.
 * @param {boolean} [props.isDefender=false] - Whether this card belongs to the defending player.
 * @param {number} [props.defenderBonus=0] - Additional bonus for defender hero cards (default 0 if not provided).
 * @returns {JSX.Element} A visually styled component showing a single card with stats, roll, image, and result.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleCard = ({
    card,
    soldier,
    bonuses,
    roll,
    value,
    opponentValue,
    isHero,
    color,
    isDefender = false,
    defenderBonus = 0,
}) => (
    <Stack direction="row" color="#FFF" h="50%" spacing={4}>
        <Stack direction="column" fontSize="xs" align="flex-start" my="auto" w="90%">
            <Text fontSize="large" letterSpacing={2} fontFamily="'Aagaz', sans-serif" color={color}>
                {card.name} {isHero ? '(Alpha)' : null}
            </Text>
            <Stack direction="row" w="95%">
                <Stack direction="column" m="auto">
                    <StatRow icon={getContinentIcon(card.channel)} value={bonuses?.domainBonus ?? 0} />
                    <StatRow icon={getMediumIconInt(soldier.mediumId)} value={bonuses?.mediumBonus ?? 0} />
                    <StatRow icon={getLevelIconInt(soldier.power)} value={soldier.power} />
                    {!isHero && <StatRow icon="/images/battlegrounds/alpha_icon.svg" value={bonuses?.heroBonus ?? 0} />}
                    <StatRow icon={getDiceIcon(roll)} value={roll} />
                    {isDefender && isHero && (
                        <StatRow icon="/images/battlegrounds/defense_icon.svg" value={defenderBonus || 2} />
                    )}
                </Stack>
                <CardImage
                    card={card}
                    isHero={isHero}
                    isDefeated={isDefender ? value <= opponentValue : value >= opponentValue}
                />
            </Stack>
        </Stack>
        <ValueBox value={value} isWinner={isDefender ? value > opponentValue : value < opponentValue} />
    </Stack>
);

export default BattleCard;
