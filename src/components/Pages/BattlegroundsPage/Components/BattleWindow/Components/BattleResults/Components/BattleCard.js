import { Box, Image, Stack, Text } from '@chakra-ui/react';
import {
    getContinentIcon,
    getDiceIcon,
    getLevelIconInt,
    getMediumIconInt,
} from '../../../../../Utils/BattlegroundsUtils';

const StatRow = ({ icon, value }) => (
    <Stack direction="row">
        <Image boxSize="20px" borderRadius="5px" p={0.5} bgColor="#FFF" src={icon} />
        <Text>{value}</Text>
    </Stack>
);

/**
 * @name CardImage
 * @description Renders the image of a card with an optional overlay for defeated cards.
 * The image is centered and can be styled differently for hero cards.
 * @param {Object} props
 * @param {Object} props.card - The card object containing image URL and other metadata.
 * @param {boolean} props.isHero - Whether this card is a hero card (applies special styling).
 * @param {boolean} props.isDefeated - Whether this card has been defeated in the battle.
 * @return {JSX.Element} A box containing the card image, with an overlay if defeated.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 * */
const CardImage = ({ card, isHero, isDefeated }) => (
    <Box position="relative" m="auto" width="55%" height="150px" sx={{ border: isHero ? '3px solid #D08FB0' : 'none' }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Image src={card.cardImgUrl} width={isHero ? '90%' : '100%'} m="auto" />
        </Box>
        {isDefeated && (
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
                bg="rgba(0, 0, 0, 0.3)">
                <Text fontSize="9rem" color="#E14942" opacity="0.8" fontFamily="'Aagaz', sans-serif">
                    X
                </Text>
            </Box>
        )}
    </Box>
);

/**
 * @name ValueBox
 * @description Renders a box displaying the value of a card in a rotated square format.
 * Includes conditional styling to highlight the winner.
 * @param {Object} props
 * @param {number} props.value - The value to display inside the box.
 * @param {boolean} props.isWinner - Whether this box represents the winning card.
 * @return {JSX.Element} A styled box with the card value displayed.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ValueBox = ({ value, isWinner }) => (
    <Box
        width="8"
        height="8"
        m="auto"
        bg={isWinner ? '#FFF' : 'transparent'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        border="2px solid #D597B2"
        borderRadius={5}
        transform="rotate(45deg)"
        _after={{ content: '""', display: 'block', paddingBottom: '100%' }}>
        <Text color={isWinner ? '#000' : '#D597B2'} fontSize="xl" transform="rotate(-45deg)" position="absolute">
            {value}
        </Text>
    </Box>
);

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
 *
 * @returns {JSX.Element} A visually styled component showing a single card with stats, roll, image, and result.
 *
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
