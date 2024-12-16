import {
    Box,
    Center,
    Heading,
    Img,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import CardBadges from '../../../../Cards/CardBadges';
import OmnoCards from './OmnoCards';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const OmnoPage = ({ infoAccount, cards, isMobile, gridColumns }) => {
    const [selectedCards, setSelectedCards] = useState([]);
    const [filters, setFilters] = useState({
        rarity: '',
        element: '',
        domain: '',
    });
    const { soldiers } = useSelector(state => state.soldiers);

    const handleEdit = (card, quantity) => {
        const newSelectedCards = selectedCards.map(selectedCard => {
            if (selectedCard.asset === card) {
                return { ...selectedCard, selectQuantity: Number(quantity) };
            }
            return selectedCard;
        });
        setSelectedCards([...newSelectedCards]);
    };

    const handleDeleteSelectedCard = card => {
        const newSelectedCards = selectedCards.filter(selectedCard => selectedCard.asset !== card);
        setSelectedCards(newSelectedCards);
    };

    const myCards = cards.filter(card => parseInt(card.unconfirmedQuantityQNT) > 0);
    const notSelectedCards = myCards.filter(card => !selectedCards.some(selected => selected.asset === card.asset));

    const handleRarityChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            rarity: event.target.value,
        }));
    };

    const handleElementChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            element: event.target.value,
        }));
    };

    const handleDomainChange = event => {
        setFilters(prevFilters => ({
            ...prevFilters,
            domain: event.target.value,
        }));
    };

    const filteredNotSelectedCards = notSelectedCards
        .filter(card => {
            const rarityMapping = {
                1: 'Common',
                2: 'Rare',
                3: 'Epic',
                4: 'Special',
            };
            return filters.rarity && filters.rarity !== '-1' ? card.rarity === rarityMapping[filters.rarity] : true;
        })
        .filter(card => {
            const cardInfo = soldiers.soldier.find(soldier => soldier.asset === card.asset);
            return filters.element && filters.element !== '-1' ? cardInfo.mediumId === Number(filters.element) : true;
        })
        .filter(card => {
            const domainMapping = {
                1: 'Asia',
                2: 'Oceania',
                3: 'America',
                4: 'Africa',
                5: 'Europe',
            };
            return filters.domain && filters.domain !== '-1' ? card.channel === domainMapping[filters.domain] : true;
        });

    const optionStyle = { backgroundColor: '#FFF', color: '#000' };
    const textColor = useColorModeValue('black', 'white');

    return (
        <>
            <Stack
                direction={'column'}
                color={'#FFF'}
                mb={isMobile ? 3 : 5}
                mt={isMobile && 2}
                mx={'auto'}
                textAlign={'center'}
                maxH={'90%'}>
                <Heading fontFamily={'Chelsea Market, System'} fontWeight={100}>
                    ARMY
                </Heading>
                <Text textTransform={'uppercase'}>
                    In order to play you will have to import your cards to battlegrounds
                </Text>
            </Stack>
            <Stack backgroundColor={'#0F0F0F'} borderRadius={'20px'} h={'85%'}>
                <Heading fontSize="xl" fontWeight="light" textAlign="center" mt={3}>
                    1. Select cards to send to Army
                </Heading>
                <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={'10'}>
                    <Select w={'10%'} onChange={handleRarityChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Rarity
                        </option>
                        <option value="1" style={optionStyle}>
                            Common
                        </option>
                        <option value="2" style={optionStyle}>
                            Rare
                        </option>

                        <option value="3" style={optionStyle}>
                            Epic
                        </option>
                        <option value="4" style={optionStyle}>
                            Special
                        </option>
                    </Select>

                    <Select w={'10%'} onChange={handleElementChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Element
                        </option>
                        <option value="1" style={optionStyle}>
                            Terrestrial
                        </option>
                        <option value="2" style={optionStyle}>
                            Aerial
                        </option>
                        <option value="3" style={optionStyle}>
                            Aquatic
                        </option>
                    </Select>
                    <Select w={'10%'} onChange={handleDomainChange} color={'#FFF'}>
                        <option value="-1" style={optionStyle}>
                            Continent
                        </option>
                        <option value="1" style={optionStyle}>
                            Asia
                        </option>
                        <option value="2" style={optionStyle}>
                            Oceania
                        </option>
                        <option value="3" style={optionStyle}>
                            America
                        </option>
                        <option value="4" style={optionStyle}>
                            Africa
                        </option>
                        <option value="5" style={optionStyle}>
                            Europe
                        </option>
                    </Select>
                </Stack>
                <Stack direction={'row'} pt={2} padding={5} height={isMobile ? '85%' : '90%'}>
                    <Box
                        mb={4}
                        p={2}
                        mt={-2}
                        w={isMobile ? '45%' : '65%'}
                        overflowY={'scroll'}
                        className="custom-scrollbar"
                        mx="auto"
                        display="flex"
                        justifyContent="center">
                        {' '}
                        <SimpleGrid
                            columns={gridColumns()}
                            spacing={4}
                            align={'center'}
                            overflowY={'auto'}
                            className="custom-scrollbar"
                            w={'100%'}
                            p={4}
                            overflow={'scroll'}
                            h={'530px'}>
                            {filteredNotSelectedCards.length > 0 &&
                                filteredNotSelectedCards.map((card, cardIndex) => (
                                    <Box
                                        key={cardIndex}
                                        w={'202px'}
                                        h={'315px'}
                                        bg={'white'}
                                        borderRadius={'10px'}
                                        mx={'auto'}
                                        onClick={() => setSelectedCards([...selectedCards, card])}>
                                        <Center>
                                            <Img src={card.cardImgUrl} w={'90%'} h={'75%'} />
                                        </Center>
                                        <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                            <Stack
                                                direction="column"
                                                spacing={0}
                                                align={{ base: 'center', lg: 'start' }}>
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
                                        </Stack>
                                    </Box>
                                ))}
                        </SimpleGrid>
                        {filteredNotSelectedCards <= 0 && (
                            <Box
                                top={'50%'}
                                transform={'translateY(-50%)'}
                                pos={'absolute'}
                                m={'auto'}
                                boxSize="fit-content">
                                <Text color={textColor}>You dont have more cards</Text>
                            </Box>
                        )}
                    </Box>
                    <Box
                        mb={4}
                        maxW={isMobile ? '80%' : '60%'}
                        backgroundColor={'#0F0F0F'}
                        borderRadius={'20px'}
                        p={4}
                        className="custom-scrollbar"
                        overflowX={'scroll'}>
                        <OmnoCards
                            infoAccount={infoAccount}
                            isMobile={isMobile}
                            selectedCards={selectedCards}
                            setSelectedCards={setSelectedCards}
                            handleEdit={handleEdit}
                            handleDeleteSelectedCard={handleDeleteSelectedCard}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default OmnoPage;
