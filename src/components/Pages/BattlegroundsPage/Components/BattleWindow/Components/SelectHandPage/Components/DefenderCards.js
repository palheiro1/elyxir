import { Box, Image, Stack, Text } from '@chakra-ui/react';
import { formatAddress } from '../../../../../Utils/BattlegroundsUtils';

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
