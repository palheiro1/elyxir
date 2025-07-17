import { Box, Image, Stack, Text } from '@chakra-ui/react';
import defeatIcon from '../../../../assets/icons/defeat_icon.svg';
import victoryIcon from '../../../../assets/icons/victory_icon.svg';

/**
 * @name AttackerCardsSummary
 * @description Displays the attacking player's army cards used in a battle, with a visual overlay 
 * indicating which cards were defeated. Shows a victory or defeat icon depending on the battle outcome.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - Info of the currently logged-in user (must include `accountRs`).
 * @param {Object} props.attackerInfo - Info of the attacker (must include `accountRS`).
 * @param {Array} props.cards - List of all available card objects with their metadata (including `cardImgUrl`).
 * @param {Object} props.attackerArmy - Attacker's army, including the list of card asset IDs.
 * @param {Object} props.battleInfo - General information about the battle (must include `isDefenderWin`).
 * @param {Object} props.battleResults - Detailed results of the battle, including `battleResult` with used card info.
 * @returns {JSX.Element} Visual summary of the cards used by the attacker and the final battle result.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const AttackerCardsSummary = ({ infoAccount, attackerInfo, cards, attackerArmy, battleInfo, battleResults }) => {
    return (
        <Stack direction={'row'} mx={'auto'} w={'45%'} justifyContent={'space-between'} mt={2}>
            <Text fontSize={'x-small'} color={'#FFF'} fontFamily={'Inter, system-ui'} my={'auto'}>
                {infoAccount.accountRs === attackerInfo.accountRS ? 'MY' : 'OPPONENT'} CARDS:
            </Text>
            {attackerArmy &&
                attackerArmy.asset.map((item, index) => {
                    const attackerCard = cards.find(card => card.asset === item);
                    const isOverlayVisible =
                        battleInfo.isDefenderWin ||
                        battleResults.battleResult[battleResults.battleResult.length - 1].attackerAsset !==
                            attackerCard.asset;

                    return (
                        <Box position="relative" m={'auto'} width="12%" key={index}>
                            <Image src={attackerCard.cardImgUrl} width="100%" />
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

            <Image src={battleInfo.isDefenderWin ? defeatIcon : victoryIcon} boxSize={'50px'} my={'auto'} />
        </Stack>
    );
};

export default AttackerCardsSummary;
