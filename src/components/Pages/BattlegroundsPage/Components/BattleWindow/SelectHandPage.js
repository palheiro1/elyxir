import { Box, Button, Heading, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import locations from '../../assets/LocationsEnum';
import '@fontsource/chelsea-market';
import '@fontsource/inter';
import { BiCross } from 'react-icons/bi';
import { CloseIcon } from '@chakra-ui/icons';

export const SelectHandPage = ({ arenaInfo, handBattleCards, openInventory, infoAccount }) => {
    const statistics = [
        { name: 'Level', value: 'Epic' },
        { name: 'Medium', value: arenaInfo.mediumId },
        { name: 'Team size', value: 5 },
        { name: 'Defender', value: arenaInfo.defender.heroAsset },
    ];
    /* mediums: 
        1 -> aerial
        2 -> terrestial 
        3 -> acuatic
    */

    return (
        <Box display={'flex'} flexDir={'column'}>
            <Stack direction={'column'} mx={'auto'} mt={6}>
                <Heading color={'#FFF'} size={'2xl'} fontFamily={'Chelsea Market, system-ui'}>
                    {' '}
                    CONQUER <span style={{ color: '#D08FB0' }}>{locations[arenaInfo.id - 1].name}</span>
                </Heading>
                <Text color={'#FFF'} textAlign={'center'} fontSize={'large'}>
                    CHOOSE YOU HAND
                </Text>
            </Stack>
            <Stack direction={'row'} mx={'auto'} mt={3}>
                {handBattleCards.map((card, index) =>
                    card !== '' ? (
                        <>
                            <IconButton
                                icon={<CloseIcon boxSize={2} />}
                                pos={'fixed'}
                                onClick={() => console.log('Boton quitar carta')}
                            />
                            <Box
                                key={index}
                                backgroundColor={'#465A5A'}
                                w={'150px'}
                                h={'200px'}
                                gap={'15px'}
                                display={'flex'}>
                                <Image src={card.cardImgUrl} w={'100%'} />
                            </Box>
                        </>
                    ) : (
                        <Box
                            key={index}
                            backgroundColor={'#465A5A'}
                            w={'150px'}
                            h={'200px'}
                            gap={'15px'}
                            display={'flex'}
                            onClick={() => openInventory(index)}>
                            <Text fontFamily={'Chelsea Market, system-ui'} color={'#FFF'} m={'auto'}>
                                +
                            </Text>
                        </Box>
                    )
                )}
            </Stack>
            <Stack direction={'row'} mx={'auto'} mt={6} fontSize={'large'}>
                {statistics.map((item, index) => (
                    <Stack direction={'column'} key={index} textAlign={'center'}>
                        <Text color={'#FFF'} fontFamily={'Chelsea Market, system-ui'}>
                            {item.name}
                        </Text>
                        <Text
                            backgroundColor={'#484848'}
                            border={'2px solid #D597B2'}
                            borderRadius={'30px'}
                            color={'#FFF'}
                            w={'100px'}
                            textAlign={'center'}
                            fontFamily={'Chelsea Market, system-ui'}>
                            {item.name === 'Medium'
                                ? (() => {
                                      switch (item.value) {
                                          case 1:
                                              return 'Aerial';
                                          case 2:
                                              return 'Terrestrial';
                                          case 3:
                                              return 'Aquatic';
                                          default:
                                              return 'Unknown';
                                      }
                                  })()
                                : item.value}
                        </Text>
                    </Stack>
                ))}
            </Stack>
            <Stack
                direction={'row'}
                mx={'auto'}
                mt={6}
                fontFamily={'Chelsea Market, system-ui'}
                fontSize={'md'}
                fontWeight={100}
                gap={10}>
                <Stack direction={'row'}>
                    <Text color={'#D597B2'} my={'auto'}>
                        BONUS
                    </Text>
                    <Text color={'#FFF'}>+2 AQUATIC {<br></br>}+1 EUROPE</Text>
                </Stack>
                <Stack direction={'row'}>
                    <Text color={'#D597B2'} my={'auto'}>
                        TRIBUTE
                    </Text>
                    <Text color={'#FFF'}>{arenaInfo.battleCost.asset[0]}</Text>
                </Stack>
            </Stack>
            <Button
                mx={'auto'}
                style={{
                    background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                    border: '3px solid #EBB2B9',
                }}
                padding={6}
                textTransform={'uppercase'}
                color={'#FFF'}
                fontWeight={'100'}
                borderRadius={'40px'}
                mt={6}
                fontSize={'large'}
                fontFamily={'Chelsea Market, system-ui'}>
                Start battle
            </Button>
        </Box>
    );
};
