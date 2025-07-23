import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { getContinentIcon, getLevelIconInt, getMediumIconInt } from '../../../../Utils/BattlegroundsUtils';
import { useBattlegroundBreakpoints } from '../../../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name RoundCard
 * @description Displays detailed information about a battle round card, including
 * soldier stats, bonuses, roll results, and card image. Highlights if the card belongs
 * to a hero or if it lost the round.
 * @param {Object} props - Component properties.
 * @param {Object} props.card - The card object with data such as channel for continent icon.
 * @param {Object} props.soldier - Soldier details including mediumId and power.
 * @param {Object} props.bonus - Bonus stats object with domainBonus, mediumBonus, heroBonus.
 * @param {number|string} props.roll - The roll result for the card.
 * @param {boolean} props.isWinner - Indicates if this card won the round.
 * @param {boolean} props.isHero - Indicates if this card is a hero card.
 * @param {boolean} props.isMobile - Responsive flag for mobile view adjustments.
 * @param {string} props.cardImgUrl - URL of the card's image.
 * @param {string} props.rollIcon - URL for the icon representing the roll.
 * @param {number} [props.defenseBonus] - Optional defense bonus to display.
 * @returns {JSX.Element} Rendered battle round card component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RoundCard = ({
    card,
    soldier,
    bonus,
    roll,
    isWinner,
    isHero,
    cardImgUrl,
    rollIcon,
    defenseBonus,
    isDefender,
}) => {
    const { isMobile } = useBattlegroundBreakpoints();
    const isRowReversed = isMobile && isDefender;

    return (
        <Stack direction={isRowReversed ? 'row-reverse' : 'row'} w={isMobile ? '70%' : '95%'}>
            <Stack direction="column" m="auto">
                <Stack direction="row">
                    <Image
                        boxSize="20px"
                        borderRadius="5px"
                        p={0.5}
                        bgColor="#FFF"
                        src={getContinentIcon(card.channel)}
                    />
                    <Text>{bonus?.domainBonus ?? 0}</Text>
                </Stack>
                <Stack direction="row">
                    <Image
                        boxSize="20px"
                        borderRadius="5px"
                        p={0.5}
                        bgColor="#FFF"
                        src={getMediumIconInt(soldier.mediumId)}
                    />
                    <Text>{bonus?.mediumBonus ?? 0}</Text>
                </Stack>
                <Stack direction="row">
                    <Image w="20px" borderRadius="full" bgColor="#FFF" src={getLevelIconInt(soldier.power)} />
                    <Text>{soldier.power}</Text>
                </Stack>
                {!isHero && (
                    <Stack direction="row">
                        <Image
                            boxSize="20px"
                            borderRadius="5px"
                            bgColor="#FFF"
                            src="/images/battlegrounds/alpha_icon.svg"
                        />
                        <Text>{bonus?.heroBonus ?? 0}</Text>
                    </Stack>
                )}
                <Stack direction="row">
                    <Image boxSize="20px" borderRadius="5px" bgColor="#FFF" src={rollIcon} />
                    <Text>{roll}</Text>
                </Stack>
                {defenseBonus !== undefined && (
                    <Stack direction="row">
                        <Image boxSize="20px" borderRadius="5px" src="/images/battlegrounds/defense_icon.svg" />
                        <Text>{defenseBonus}</Text>
                    </Stack>
                )}
            </Stack>
            <Box
                position="relative"
                m="auto"
                mt={isMobile && 0}
                width={isMobile ? '60%' : '55%'}
                height={isMobile ? '100%' : '150px'}
                sx={{ border: isHero ? '3px solid #D08FB0' : 'none' }}>
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Image src={cardImgUrl} width={isHero ? '90%' : '100%'} m="auto" />
                </Box>
                {!isWinner && (
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
                        <Text
                            fontSize={isMobile ? '7rem' : '9rem'}
                            color="#E14942"
                            opacity="0.8"
                            fontFamily="'Aagaz', sans-serif">
                            X
                        </Text>
                    </Box>
                )}
            </Box>
        </Stack>
    );
};

export default RoundCard;
