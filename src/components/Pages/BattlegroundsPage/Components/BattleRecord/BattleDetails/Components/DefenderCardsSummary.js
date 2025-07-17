import { Box, Image, Stack, Text } from '@chakra-ui/react';
import defeatIcon from '../../../../assets/icons/defeat_icon.svg';
import victoryIcon from '../../../../assets/icons/victory_icon.svg';

/**
 * @name DefenderCardsSummary
 * @description Renders a horizontal summary of the defender's cards in a battle, showing an overlay 
 * with an "X" on defeated cards. It also displays a victory or defeat icon depending on the battle result.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - The current user's account info, used to determine if they are the defender.
 * @param {Object} props.defenderInfo - Information about the defender, including accountRS.
 * @param {Array} props.cards - List of all cards available in the match with metadata (image, asset ID).
 * @param {Object} props.defenderArmy - Defender's card assets participating in the battle.
 * @param {Object} props.battleInfo - Summary of battle result, including isDefenderWin flag.
 * @param {Object} props.battleResults - Full result object containing round-by-round battle data.
 * @returns {JSX.Element} A visual representation of the defender's army cards, highlighting whether each card survived or was defeated.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const DefenderCardsSummary = ({ infoAccount, defenderInfo, cards, defenderArmy, battleInfo, battleResults }) => {
    return (
        <Stack direction={'row'} mx={'auto'} w={'45%'} justifyContent={'space-between'}>
            <Text fontSize={'x-small'} color={'#FFF'} fontFamily={'Inter, system-ui'} my={'auto'}>
                {infoAccount.accountRs === defenderInfo.accountRS ? 'MY' : 'OPPONENT'} CARDS:
            </Text>
            {defenderArmy &&
                defenderArmy.asset.map((item, index) => {
                    const defenderCard = cards.find(card => card.asset === item);
                    const isOverlayVisible =
                        !battleInfo.isDefenderWin ||
                        battleResults.battleResult[battleResults.battleResult.length - 1].defenderAsset !==
                            defenderCard.asset;

                    return (
                        <Box position="relative" m={'auto'} width="12%" key={index}>
                            <Image src={defenderCard.cardImgUrl} width="100%" />
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
            <Image src={battleInfo.isDefenderWin ? victoryIcon : defeatIcon} boxSize={'50px'} my={'auto'} />
        </Stack>
    );
};

export default DefenderCardsSummary;
