import { Box, Button, HStack, Heading, IconButton, Img, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import locations from './LocationsEnum';
import cardIMage from './card.png';
import { Overlay } from './Popup';
import { CloseIcon } from '@chakra-ui/icons';
import Inventory from '../../InventoryPage/Inventory';
import { addressToAccountId } from '../../../../services/Ardor/ardorInterface';

const SelectHandPage = ({ arenaInfo, handleOpenInventory }) => {
    const [handBattleCards, setHandBattleCards] = useState(['hoala', '', '', '', '']);

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
            <VStack>
                <Heading color={'#FFF'} fontFamily={'Chelsea Market, system-ui'} mt={2}>
                    {' '}
                    CONQUER <span style={{ color: '#D08FB0' }}>{locations[arenaInfo.id - 1].name}</span>
                </Heading>
                <Text color={'#FFF'}>CHOOSE YOU HAND</Text>
            </VStack>
            <HStack mx={'auto'} mt={3}>
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
                        <Img src={cardIMage} w={'90px'} h={'120px'} /> //Cambiar por la forma de obtener una imagen de una carta por su asset id
                    )
                )}
            </HStack>
            <HStack mx={'auto'} mt={4} fontSize={'small'}>
                {statistics.map((item, index) => (
                    <VStack key={index}>
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
                    </VStack>
                ))}
            </HStack>
            <HStack mx={'auto'} mt={4} fontFamily={'Chelsea Market, system-ui'} fontSize={'small'} fontWeight={100} gap={10}>
                <HStack>
                    <Text color={'#D597B2'}>BONUS</Text>
                    <Text color={'#FFF'}>+2 AQUATIC {<br></br>}+1 EUROPE</Text>
                </HStack>
                <HStack>
                    <Text color={'#D597B2'}>TRIBUTE</Text>
                    <Text color={'#FFF'}>{arenaInfo.battleCost.asset[0]}</Text>
                </HStack>
            </HStack>
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
export const BattleWindow = ({ arenaInfo }) => {
    const [openIventory, setOpenIventory] = useState(false);

    const handleOpenInventory = index => {
        console.log('Index clicked:', index);
        setOpenIventory(true);
    };

    useEffect(() => {
        addressToAccountId(); //Necesito la info del user para pasarla al inventario
    }, []);

    return (
        <>
            <Overlay isVisible={true} />

            <Box
                pos={'absolute'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'611px'}
                h={'435px'}
                borderRadius={'25px'}
                left={'35%'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                />
                {!openIventory && <SelectHandPage arenaInfo={arenaInfo} handleOpenInventory={handleOpenInventory} />}
                {openIventory && <Inventory />}
            </Box>
        </>
    );
};
