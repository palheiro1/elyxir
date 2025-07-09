import { Box, Image, Stack, Text } from '@chakra-ui/react';

const AttackerCards = ({
    handBattleCards,
    preSelectedCard,
    handleDeleteCard,
    openInventory,
    isMobile,
    isLowHeight,
    mediumBonus,
    medium,
    domainBonus,
    domainName,
}) => {
    return (
        <>
            <Stack
                direction={'row'}
                mx={'auto'}
                mt={isMobile ? 1 : 4}
                w={isLowHeight ? '90%' : '80%'}
                justifyContent={'space-between'}
                fontSize={isMobile ? 'xs' : 'md'}
                fontWeight={100}
                gap={10}>
                <Text
                    color={'#FFF'}
                    textAlign={'center'}
                    my={'auto'}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={isMobile ? 'md' : 'large'}>
                    CHOOSE YOUR HAND
                </Text>
                <Stack direction={'row'} marginRight={2} spacing={8}>
                    <Text color={'#D597B2'} my={'auto'} fontFamily={'Chelsea Market, system-ui'} fontSize={'lg'}>
                        BONUS
                    </Text>
                    <Text
                        color={'#FFF'}
                        textTransform={'uppercase'}
                        my={'auto'}
                        fontFamily={'Inter, system-ui'}
                        textAlign={'end'}
                        fontWeight={500}
                        fontSize={'sm'}>
                        +{mediumBonus} {medium}
                        {<br></br>}+{domainBonus} {domainName}
                    </Text>
                </Stack>
            </Stack>
            <Stack direction={'row'} mx={'auto'} mt={3}>
                {handBattleCards.map((card, index) => {
                    const isPreSelected = preSelectedCard?.asset === card.asset;

                    return card !== '' ? (
                        <Box key={index} position="relative" onClick={() => handleDeleteCard(card, index)}>
                            {isPreSelected && (
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize={'xl'}
                                    bg="rgba(1, 151, 135, 0.5)"
                                    fontFamily={'Chelsea Market, system-ui'}>
                                    x
                                </Box>
                            )}
                            <Box
                                backgroundColor={'#465A5A'}
                                w={isMobile ? '76px' : '127px'}
                                h={isMobile ? '103px' : '172px'}
                                gap={'15px'}
                                display={'flex'}>
                                <Image src={card.cardImgUrl} w={'100%'} />
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            key={index}
                            backgroundColor="#465A5A"
                            cursor={'pointer'}
                            w={isMobile ? '76px' : '127px'}
                            h={isMobile ? '103px' : '172px'}
                            position="relative"
                            gap="15px"
                            display="flex"
                            sx={{
                                border: index === 0 ? '2px solid #D08FB0' : 'none',
                            }}
                            onClick={() => openInventory(index)}>
                            <Text fontFamily={'Chelsea Market, system-ui'} fontSize={'xl'} color={'#FFF'} m={'auto'}>
                                +
                            </Text>
                            {index === 0 ? (
                                <Text
                                    fontSize={isMobile && 'small'}
                                    pos={'absolute'}
                                    bottom={0}
                                    left={1}
                                    fontFamily={'Chelsea Market, system-ui'}
                                    color={'#fff'}>
                                    Alpha slot{' '}
                                </Text>
                            ) : null}
                        </Box>
                    );
                })}
            </Stack>
        </>
    );
};

export default AttackerCards;
