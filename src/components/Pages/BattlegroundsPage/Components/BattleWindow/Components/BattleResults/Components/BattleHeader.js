import { Stack, Text, Tooltip, Image } from '@chakra-ui/react';
import { getContinentIcon, getMediumIcon, getLevelIconInt } from '../../../../../Utils/BattlegroundsUtils';
import { formatAddress } from '../../../../../Utils/BattlegroundsUtils';
import { useBattlegroundBreakpoints } from '../../../../../../../../hooks/useBattlegroundBreakpoints';

/**
 * @name BattleHeader
 * @description Displays the header of the battle UI, showing the winner/loser label, attacker details, score,
 * and contextual information about the arena (name, domain, medium, level).
 * Dynamically adjusts the labels based on the battle outcome.
 * @param {Object} props
 * @param {boolean} props.isDefenderWin - Indicates whether the defender won the battle (used to determine attacker status).
 * @param {Object} props.attackerInfo - Information about the attacker (name and accountRS).
 * @param {number} props.attackerPoints - Total battle points scored by the attacker.
 * @param {string} props.arenaName - Name of the arena where the battle occurred.
 * @param {string} props.domainName - Domain name (used to get continent icon).
 * @param {string} props.medium - Medium name (used to get medium icon).
 * @param {Object} props.arenaInfo - Additional arena data, including level (used for level icon).
 * @returns {JSX.Element} A styled header displaying battle summary and arena metadata.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleHeader = ({ isDefenderWin, attackerInfo, attackerPoints, arenaName, domainName, medium, arenaInfo }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Stack
            direction="row"
            bgColor="#BFD1ED"
            w="100%"
            h={isMobile ? '10%' : '7%'}
            fontFamily="Chelsea Market, system-ui"
            borderTopRadius="25px"
            justifyContent="space-between"
            alignItems="center"
            px={4}>
            <Stack direction="row">
                <Text color="#000" my="auto" fontSize="large" ml={10}>
                    {isDefenderWin ? 'LOSER: ' : 'WINNER: '}
                    <Tooltip label={attackerInfo.accountRS} hasArrow>
                        {attackerInfo.name || formatAddress(attackerInfo.accountRS)}
                    </Tooltip>
                </Text>
                <Text color="#000" my="auto" fontSize="large" border="1px solid #2ba39c" p={1} borderRadius="8px">
                    {attackerPoints}
                </Text>
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" mr={10}>
                <Text textTransform="uppercase" color="#000" mr={5} fontSize="large">
                    {arenaName}
                </Text>
                <Image src={getContinentIcon(domainName)} w="30px" />
                <Image src={getMediumIcon(medium)} w="30px" />
                <Image src={getLevelIconInt(arenaInfo.level)} w="30px" />
            </Stack>
        </Stack>
    );
};

export default BattleHeader;
