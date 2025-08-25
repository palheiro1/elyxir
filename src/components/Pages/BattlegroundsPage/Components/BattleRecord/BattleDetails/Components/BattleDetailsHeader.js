import { Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import { formatAddress, getContinentIcon, getLevelIconInt, getMediumIcon } from '../../../../Utils/BattlegroundsUtils';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name BattleDetailsHeader
 * @description Displays the battle summary header including the winner/loser name, total points,
 * and arena context (name, domain, medium, level). Icons visually represent battle characteristics
 * such as terrain type and difficulty.
 * @param {Object} props - Component props.
 * @param {boolean} props.isDefenderWin - Flag indicating if the defender won the battle.
 * @param {Object} props.attackerInfo - Attacker's info (name, accountRS).
 * @param {number|JSX.Element} props.attackerPoints - Total score achieved by the attacker.
 * @param {string} props.arenaName - Name of the arena where the battle took place.
 * @param {string} props.domainName - Domain name related to the arena (used to determine icon).
 * @param {string} props.medium - Medium type of the arena (e.g., 'Terrestrial', 'Aerial').
 * @param {number} props.arenaLevel - Arena level indicating its difficulty.
 * @returns {JSX.Element} Header bar with player result label, score, and contextual battle information.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const BattleDetailsHeader = ({
    isDefenderWin,
    attackerInfo,
    attackerPoints,
    arenaName,
    domainName,
    medium,
    arenaLevel,
}) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Stack
            direction={'row'}
            bgColor={'#BFD1ED'}
            w={'100%'}
            h={isMobile ? '10%' : '7%'}
            fontFamily={'Chelsea Market, system-ui'}
            borderTopRadius={'25px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            px={4}>
            <Stack direction={'row'}>
                <Text color={'#000'} my={'auto'} fontSize={'large'} ml={10}>
                    {isDefenderWin ? 'LOSER: ' : 'WINNER: '}
                    <Tooltip label={attackerInfo.accountRS} hasArrow>
                        {attackerInfo.name || formatAddress(attackerInfo.accountRS)}
                    </Tooltip>
                </Text>
                <Text
                    color={'#000'}
                    my={'auto'}
                    fontSize={'large'}
                    border={'1px solid #2ba39c'}
                    p={1}
                    borderRadius={'8px'}>
                    {attackerPoints}
                </Text>
            </Stack>
            <Stack direction={'row'} spacing={3} alignItems={'center'} mr={10}>
                <Text textTransform={'uppercase'} color={'#000'} mr={5} fontSize={'large'}>
                    {arenaName}
                </Text>
                <Image src={getContinentIcon(domainName)} w={'30px'} />
                <Image src={getMediumIcon(medium)} w={'30px'} />
                <Image src={getLevelIconInt(arenaLevel)} w={'30px'} />
            </Stack>
        </Stack>
    );
};

export default BattleDetailsHeader;
