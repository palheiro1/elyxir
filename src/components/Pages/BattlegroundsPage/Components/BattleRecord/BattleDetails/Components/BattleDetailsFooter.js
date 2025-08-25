import { Stack, Text, Tooltip } from '@chakra-ui/react';
import { formatAddress } from '../../../../Utils/BattlegroundsUtils';
import CapturedCard from './CapturedCard';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name BattleDetailsFooter
 * @description Displays the footer section of the battle result, showing defender info
 * (name or address), points, and the captured card if any. The visual state adapts based
 * on whether the defender won or lost the battle.
 * @param {Object} props - Component props.
 * @param {boolean} props.isDefenderWin - Whether the defender won the battle.
 * @param {Object} props.defenderInfo - Information about the defender (accountRS, name).
 * @param {number} props.defenderPoints - Points earned by the defender in the battle.
 * @param {Object|null} props.capturedCard - Card data captured during the battle, if any.
 * @param {boolean} props.isUserDefending - Whether the current user is the defender.
 * @returns {JSX.Element} Footer layout with defender summary and captured card component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleDetailsFooter = ({ isDefenderWin, defenderInfo, defenderPoints, capturedCard, isUserDefending }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Stack
            direction={'row'}
            bgColor={'#BFD1ED'}
            w={'100%'}
            h={isMobile ? '10%' : '7%'}
            fontFamily={'Chelsea Market, system-ui'}
            borderBottomRadius={'25px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mt={isMobile ? 0 : 10}
            px={4}>
            <Stack direction={'row'} w={'100%'}>
                <Text color={'#000'} my={'auto'} fontSize={'large'} ml={10}>
                    {isDefenderWin ? 'WINNER: ' : 'LOSER: '}
                    <Tooltip label={defenderInfo.accountRS} hasArrow>
                        {defenderInfo.name || formatAddress(defenderInfo.accountRS)}
                    </Tooltip>
                </Text>
                <Text
                    color={'#000'}
                    my={'auto'}
                    fontSize={'large'}
                    border={'1px solid #2ba39c'}
                    p={1}
                    borderRadius={'8px'}>
                    {defenderPoints}
                </Text>
            </Stack>
            <CapturedCard capturedCard={capturedCard} isDefenderWin={isDefenderWin} isUserDefending={isUserDefending} />
        </Stack>
    );
};

export default BattleDetailsFooter;
