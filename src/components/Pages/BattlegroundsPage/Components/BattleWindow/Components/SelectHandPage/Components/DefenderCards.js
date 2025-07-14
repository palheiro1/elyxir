import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { formatAddress } from '../../../../../Utils/BattlegroundsUtils';

/**
 * @name DefenderCards
 * @description Displays the defender's hand of cards along with their bonuses.
 * Shows the defender's name (or formatted account address) and bonus stats related to medium and domain.
 * Renders the defender's cards as images inside styled boxes, responsive to mobile or desktop views.
 * @param {boolean} isMobile - Flag indicating if the view is mobile to adjust styling.
 * @param {Object} defenderInfo - Information about the defender (name, accountRS).
 * @param {Object} defenderBonus - Object containing defender bonus counts for medium and domain.
 * @param {string} medium - The name of the medium type (e.g., "Terrestrial").
 * @param {string} domainName - The name of the domain.
 * @param {Array} defenderCards - Array of card objects with at least `cardImgUrl` property.
 * @returns {JSX.Element} A styled stack component showing defender info, bonuses, and cards.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const DefenderCards = ({ isMobile, defenderInfo, defenderBonus, medium, domainName, defenderCards }) => {
    return (
        <Stack bgColor={'#5A679B'} mt={5} w={isMobile && '100%'}>
            <Stack
                my={!isMobile ? 5 : 2}
                direction={'column'}
                fontSize={isMobile ? 'xs' : 'md'}
                textAlign={'center'}
                mx={'auto'}
                textTransform={'uppercase'}>
                <Stack direction={'row'} w={'100%'} justifyContent={'space-between'}>
                    <Text
                        color={'#FFF'}
                        p={isMobile ? 0 : 1}
                        w={'fit-content'}
                        fontFamily={'Chelsea Market, system-ui'}
                        fontSize={'larger'}
                        my={'auto'}>
                        {defenderInfo.name || formatAddress(defenderInfo.accountRS)}'S HAND
                    </Text>
                    <Stack direction={'row'} marginRight={2} spacing={8}>
                        <Text color={'#D597B2'} my={'auto'} fontFamily={'Chelsea Market, system-ui'} fontSize={'lg'}>
                            BONUS
                        </Text>
                        <Text
                            color={'#FFF'}
                            my={'auto'}
                            fontFamily={'Inter, system-ui'}
                            fontWeight={500}
                            textAlign={'end'}
                            fontSize={'sm'}>
                            +{defenderBonus.medium} {medium}
                            {<br></br>}+{defenderBonus.domain} {domainName}
                        </Text>
                    </Stack>
                </Stack>
                <Stack direction={'row'} mt={1}>
                    {defenderCards &&
                        defenderCards.map((card, index) => (
                            <Box
                                key={index}
                                backgroundColor={'#465A5A'}
                                w={isMobile ? '76px' : '127px'}
                                h={isMobile ? '103px' : '172px'}
                                gap={'15px'}
                                display={'flex'}>
                                <Image src={card.cardImgUrl} w={'100%'} />
                            </Box>
                        ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default DefenderCards;
