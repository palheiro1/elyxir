import {
    Box,
    Heading,
    IconButton,
    Stack,
    Text,
    Select,
    SimpleGrid,
    Img,
    Flex,
    Tooltip,
    Center,
    Spacer,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Overlay } from '../BattlegroundsIntro/Overlay';
import { CloseIcon } from '@chakra-ui/icons';
import OmnoCards from './OmnoCards';
import '@fontsource/chelsea-market';
import ArdorCards from './ArdorCards';
import '../../BattlegroundMap.css';
import CardBadges from '../../../../Cards/CardBadges';
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
                    color={'#000'}
                    fontFamily={'Chelsea Market, System'}
                    fontWeight={100}
                    value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="battlegrounds" style={{ backgroundColor: '#FFF' }}>
                        Battlegrounds
                    </option>
                    <option value="ardor" style={{ backgroundColor: '#FFF' }}>
                        Inventory
                    </option>
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
                    INVENTORY
                </Heading>
                <Text>In order to play you will have to import your cards to battlegrounds</Text>
            </Stack>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={4}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={2}
                    w={'65%'}
                    overflowY={'scroll'}
                    className="custom-scrollbar"
                    mx="auto"
                    display="flex"
                    justifyContent="center">
                    <SimpleGrid
                        columns={[1, 2, 3]}
                        spacing={4}
                        align={'center'}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={4}
                        overflow={'scroll'}
                        h={'750px'}>
                        {filteredCards.map((card, cardIndex) => (
                            <Box key={cardIndex} w={'225px'} h={'350px'} bg={'white'} borderRadius={'10px'}>
                                <Center>
                                    <Img src={card.cardImgUrl} w={'90%'} h={'75%'} />
                                </Center>
                                <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                    <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                                        <Text
                                            fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                            noOfLines={1}
                                            fontWeight="bold"
                                            color={'#000'}>
                                            {card.name}
                                        </Text>
                                        <CardBadges rarity={card.rarity} continent={card.channel} size="sm" />
                                    </Stack>
                                    <Spacer display={{ base: 'none', lg: 'block' }} />
                                    <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                        <Tooltip display={'flex'} placement="bottom">
                                            <Flex w={{ base: 'auto', lg: '100%' }}>
                                                <Text
                                                    textAlign="end"
                                                    minH={{ base: '100%', lg: 'auto' }}
                                                    color={'#000'}>
                                                    <small>Quantity:</small> {card.omnoQuantity}
                                                </Text>
                                            </Flex>
                                        </Tooltip>
                                    </Center>
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box
                    mb={4}
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
                    INVENTORY
                </Heading>
                <Text>Here you can withdraw your cards from the army to your inventory</Text>
            </Stack>
            <Stack direction={'row'} pt={2} padding={5} height={'90%'}>
                <Box
                    mb={4}
                    backgroundColor={'#0F0F0F'}
                    borderRadius={'20px'}
                    p={2}
                    w={'65%'}
                    overflowY={'scroll'}
                    className="custom-scrollbar"
                    mx="auto"
                    display="flex"
                    justifyContent="center">
                    <SimpleGrid
                        columns={[1, 2, 3]}
                        spacing={4}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={4}
                        overflow={'scroll'}
                        h={'750px'}>
                        {userCards.map((card, cardIndex) => (
                            <Box key={cardIndex} w={'225px'} h={'350px'} bg={'white'} borderRadius={'10px'}>
                                <Center>
                                    <Img src={card.cardImgUrl} w={'90%'} h={'75%'} />
                                </Center>
                                <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                    <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                                        <Text
                                            fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                            noOfLines={1}
                                            fontWeight="bold"
                                            color={'#000'}>
                                            {card.name}
                                        </Text>
                                        <CardBadges rarity={card.rarity} continent={card.channel} size="sm" />
                                    </Stack>
                                    <Spacer display={{ base: 'none', lg: 'block' }} />
                                    <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                        <Tooltip display={'flex'} placement="bottom">
                                            <Flex w={{ base: 'auto', lg: '100%' }}>
                                                <Text
                                                    textAlign="end"
                                                    minH={{ base: '100%', lg: 'auto' }}
                                                    color={'#000'}>
                                                    <small>Quantity:</small> {card.quantityQNT}
                                                </Text>
                                            </Flex>
                                        </Tooltip>
                                    </Center>
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
                <Box
                    mb={4}
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
