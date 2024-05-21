import { Box, Button, Heading, Img, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import locations from '../../assets/LocationsEnum';
import cardImage from '../../assets/card.png';
import '@fontsource/chelsea-market';
import '@fontsource/inter';

export const SelectHandPage = ({ arenaInfo, handleOpenInventory }) => {
    const [handBattleCards, setHandBattleCards] = useState(['', '', '', '', '']);

    const updateCard = (index, newValue) => {
        setHandBattleCards(prevCards => {
            const newCards = [...prevCards];
            newCards[index] = newValue;
            return newCards;
        });
    };

    const openInventory = index => {
        handleOpenInventory(index);
    };

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
            <Stack direction={'column'} mx={'auto'}>
                <Heading color={'#FFF'} fontFamily={'Chelsea Market, system-ui'} mt={2}>
                    {' '}
                    CONQUER <span style={{ color: '#D08FB0' }}>{locations[arenaInfo.id - 1].name}</span>
                </Heading>
                <Text color={'#FFF'} textAlign={'center'}>
                    CHOOSE YOU HAND
                </Text>
            </Stack>
            <Stack direction={'row'} mx={'auto'} mt={3}>
                {handBattleCards.map((card, index) =>
                    card === '' ? (
                        <Box
                            key={index}
                            backgroundColor={'#465A5A'}
                            w={'90px'}
                            h={'120px'}
                            gap={'15px'}
                            display={'flex'}
                            onClick={() => openInventory(index)}>
                            <Text fontFamily={'Chelsea Market, system-ui'} color={'#FFF'} m={'auto'}>
                                +
                            </Text>
                        </Box>
                    ) : (
                        <Img src={cardImage} w={'90px'} h={'120px'} /> //Cambiar por la forma de obtener una imagen de una carta por su asset id
                    )
                )}
            </Stack>
            <Stack direction={'row'} mx={'auto'} mt={4} fontSize={'small'}>
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
                mt={4}
                fontFamily={'Chelsea Market, system-ui'}
                fontSize={'small'}
                fontWeight={100}
                gap={10}>
                <Stack direction={'row'}>
                    <Text color={'#D597B2'} my={"auto"}>BONUS</Text>
                    <Text color={'#FFF'}>+2 AQUATIC {<br></br>}+1 EUROPE</Text>
                </Stack>
                <Stack direction={'row'}>
                    <Text color={'#D597B2'} my={"auto"}>TRIBUTE</Text>
                    <Text color={'#FFF'}>{arenaInfo.battleCost.asset[0]}</Text>
                </Stack>
            </Stack>
            <Button
                mx={'auto'}
                style={{
                    background: 'linear-gradient(224.72deg, #5A679B 12.32%, #5A679B 87.76%)',
                    border: '3px solid #EBB2B9',
                }}
                padding={5}
                textTransform={'uppercase'}
                color={'#FFF'}
                fontWeight={'100'}
                borderRadius={'40px'}
                mt={4}
                fontFamily={'Chelsea Market, system-ui'}>
                Start battle
            </Button>
        </Box>
    );
};
