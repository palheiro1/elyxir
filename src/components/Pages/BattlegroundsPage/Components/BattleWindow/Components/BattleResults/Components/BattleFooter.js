import { Stack, Text, Tooltip } from '@chakra-ui/react';
import { formatAddress } from '../../../../../Utils/BattlegroundsUtils';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import CapturedCard from '../../../../BattleRecord/BattleDetails/Components/CapturedCard';

/**
 * @name BattleFooter
 * @description Displays the footer of a battle screen showing the winner/loser label, defender's name, score,
 * and a tooltip preview of the card that was obtained or captured during the battle.
 * It dynamically shows whether the user is the defender and adjusts the text and card accordingly.
 * @param {Object} props
 * @param {boolean} props.isDefenderWin - Indicates whether the defender won the battle.
 * @param {Object} props.defenderInfo - Object containing information about the defender (name, accountRS).
 * @param {number} props.defenderPoints - Total battle points scored by the defender.
 * @param {Object} props.capturedCard - The card object that was either captured or obtained (includes image and name).
 * @param {boolean} props.isUserDefending - Indicates whether the current user is the defender (used to label the card action).
 * @returns {JSX.Element} A styled footer showing battle results, score, and captured/obtained card preview.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleFooter = ({ isDefenderWin, defenderInfo, defenderPoints, capturedCard, isUserDefending }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Stack
            direction="row"
            bgColor="#BFD1ED"
            w="100%"
            h={isMobile ? '10%' : '7%'}
            mt={isMobile ? 0 : 10}
            mb={-2}
            fontFamily="Chelsea Market, system-ui"
            borderBottomRadius="25px"
            justifyContent="space-between"
            alignItems="center"
            px={4}>
            <Stack direction="row" w="100%">
                <Text color="#000" my="auto" fontSize="large" ml={10}>
                    {isDefenderWin ? 'WINNER: ' : 'LOSER: '}
                    <Tooltip label={defenderInfo.accountRS} hasArrow>
                        {defenderInfo.name || formatAddress(defenderInfo.accountRS)}
                    </Tooltip>
                </Text>
                <Text color="#000" my="auto" fontSize="large" border="1px solid #2ba39c" p={1} borderRadius="8px">
                    {defenderPoints}
                </Text>
            </Stack>
            <CapturedCard capturedCard={capturedCard} isDefenderWin={isDefenderWin} isUserDefending={isUserDefending} />
        </Stack>
    );
};

export default BattleFooter;
