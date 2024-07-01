import { Box, Heading, IconButton, Stack, Text, Select, SimpleGrid, Img } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { CloseIcon } from '@chakra-ui/icons';
import OmnoCards from './OmnoCards';
import '@fontsource/chelsea-market';
import ArdorCards from './ArdorCards';
import '../../BattlegroundMap.css';
const Inventory = ({ infoAccount, cards, handleCloseInventory, filteredCards }) => {
    const [selectedOption, setSelectedOption] = useState('battlegrounds');

    const handleSelectChange = event => {
        setSelectedOption(event.target.value);
    };

    const closeInvetory = () => {
        handleCloseInventory();
    };

    return (
        <>
            <Overlay isVisible={true} handleClose={handleCloseInventory} />

            <Box
                pos={'fixed'}
                top={'50%'}
                left={'50%'}
                transform={'translate(-50%, -50%)'}
                bgColor={'#1F2323'}
                zIndex={99}
                w={'98%'}
                p={4}
                display={'flex'}
                flexDir={'column'}
                h={'90%'}
                borderRadius={'25px'}>
                <IconButton
                    background={'transparent'}
                    color={'#FFF'}
                    icon={<CloseIcon />}
                    _hover={{ background: 'transparent' }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => closeInvetory()}
                />
                <Select
                    position="absolute"
                    top={8}
                    left={8}
                    w={'fit-content'}
                    bg={'#FFF'}
                    fontFamily={'Chelsea Market, System'}
                    fontWeight={100}
                    value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="battlegrounds">Battlegrounds</option>
                    <option value="ardor">Inventory</option>
                </Select>
                {selectedOption === 'battlegrounds' && (
                    <OmnoPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
                {selectedOption === 'ardor' && (
                    <ArdorPage filteredCards={filteredCards} infoAccount={infoAccount} cards={cards} />
                )}
            </Box>
        </>
    );
};

const OmnoPage = ({ filteredCards, infoAccount, cards }) => {
    return (
        <>
            <Stack direction={'column'} color={'#FFF'} mb={5} mx={'auto'} textAlign={'center'} maxH={'90%'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    INVERTORY
                </Heading>
                <Text>In order to play you will have to import your cards to battlegrounds</Text>
            </Stack>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={2}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    minW={'70%'}
                    maxW={'70%'}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <SimpleGrid
                        columns={[1, 2, 4]}
                        spacing={5}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={5}
                        overflow={'scroll'}
                        h={'750px'}>
                        {filteredCards.map((card, cardIndex) => (
                            <Box key={cardIndex} w={'200px'} h={'300px'} bg={'white'} borderRadius={'10px'}>
                                <Img src={card.cardImgUrl} w={'100%'} h={'100%'} />
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box
                    maxW={'60%'}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    className="custom-scrollbar"
                    overflowX={'scroll'}>
                    <OmnoCards infoAccount={infoAccount} cards={cards} />
                </Box>
            </Stack>
        </>
    );
};

const ArdorPage = ({ cards, filteredCards, infoAccount }) => {
    const userCards = cards.filter(card => card.unconfirmedQuantityQNT >= 1);

    return (
        <>
            <Stack direction={'column'} color={'#FFF'} mb={5} mx={'auto'} textAlign={'center'} maxH={'90%'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    INVERTORY
                </Heading>
                <Text>Here you can withdraw your cards from the army to your inventory</Text>
            </Stack>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={2}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    minW={'70%'}
                    maxW={'70%'}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <SimpleGrid
                        columns={[1, 2, 4]}
                        spacing={5}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={5}
                        overflow={'scroll'}
                        h={'750px'}>
                        {userCards.map((card, cardIndex) => (
                            <Box key={cardIndex} w={'200px'} h={'300px'} bg={'white'} borderRadius={'10px'}>
                                <Img src={card.cardImgUrl} w={'100%'} h={'100%'} />
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box
                    maxW={'60%'}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={4}
                    className="custom-scrollbar"
                    overflowX={'scroll'}>
                    <ArdorCards infoAccount={infoAccount} cards={filteredCards} />
                </Box>
            </Stack>
        </>
    );
};

export default Inventory;
