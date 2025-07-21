import { Box, Image, Stack, Text } from '@chakra-ui/react';
import defeatIcon from '../../../../assets/icons/defeat_icon.svg';
import victoryIcon from '../../../../assets/icons/victory_icon.svg';

/**
 * @name BattleCardsSummary
 * @description Generic component to display a summary of army cards used in a battle, either for attacker or defender.
 * Includes overlay for defeated cards and a battle result icon.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - The current user's account info (must include `accountRs`).
 * @param {Object} props.playerInfo - Info of the attacker or defender (must include `accountRS`).
 * @param {Array} props.cards - Full list of cards with metadata (`asset`, `cardImgUrl`, etc.).
 * @param {Object} props.army - Army of the player (must include `asset` array).
 * @param {Object} props.battleInfo - Info about the battle (must include `isDefenderWin`).
 * @param {Object} props.battleResults - Detailed battle results with final card used.
 * @param {('attacker'|'defender')} props.role - Role of the player (used for logic and icon orientation).
 * @returns {JSX.Element} Visual summary of the cards and outcome for the attacker or defender.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleCardsSummary = ({ infoAccount, playerInfo, cards, army, battleInfo, battleResults, role }) => {
    const isUser = infoAccount.accountRs === playerInfo.accountRS;
    const isVictory = role === 'defender' ? battleInfo.isDefenderWin : !battleInfo.isDefenderWin;

    const lastBattleAsset = battleResults.battleResult[battleResults.battleResult.length - 1][`${role}Asset`];

    return (
        <Stack direction="row" mx="auto" w="45%" justifyContent="space-between" mt={role === 'attacker' ? 2 : 0}>
            <Text fontSize="x-small" color="#FFF" fontFamily="Inter, system-ui" my="auto">
                {isUser ? 'MY' : 'OPPONENT'} CARDS:
            </Text>

            {army?.asset.map((item, index) => {
                const card = cards.find(card => card.asset === item);
                const isOverlayVisible =
                    (role === 'defender' && !battleInfo.isDefenderWin) ||
                    (role === 'attacker' && battleInfo.isDefenderWin) ||
                    card.asset !== lastBattleAsset;

                return (
                    <Box position="relative" m="auto" width="12%" key={index}>
                        <Image src={card?.cardImgUrl} width="100%" />
                        {isOverlayVisible && (
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bg="rgba(0, 0, 0, 0.3)">
                                <Text
                                    fontSize="4rem"
                                    color="#E14942"
                                    opacity="0.8"
                                    fontFamily="'Aagaz', sans-serif">
                                    X
                                </Text>
                            </Box>
                        )}
                    </Box>
                );
            })}

            <Image src={isVictory ? victoryIcon : defeatIcon} boxSize="50px" my="auto" />
        </Stack>
    );
};

export default BattleCardsSummary;
