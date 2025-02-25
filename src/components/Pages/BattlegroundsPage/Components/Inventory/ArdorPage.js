import {
    Box,
    Center,
    Flex,
    Heading,
    Img,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import CardBadges from '../../../../Cards/CardBadges';
import ArdorCards from './ArdorCards';
import { useEffect, useState } from 'react';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';
import { getUsersState } from '../../../../../services/Ardor/omnoInterface';
import { useSelector } from 'react-redux';

const ArdorPage = ({ cards, infoAccount, isMobile, gridColumns }) => {
    const { accountRs } = infoAccount;
    const [selectedCards, setSelectedCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [filters, setFilters] = useState({
        rarity: '',
        element: '',
        domain: '',
    });
    const { soldiers } = useSelector(state => state.soldiers);

    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            if (userInfo?.balance) {
                const assetIds = Object.keys(userInfo?.balance?.asset);

                const matchingCards = cards
                    .filter(card => assetIds.includes(card.asset))
                    .map(card => ({
                        ...card,
                        omnoQuantity: userInfo?.balance?.asset[card.asset],
                    }));

                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    const handleDeleteSelectedCard = card => {
        const newSelectedCards = selectedCards.filter(selectedCard => selectedCard.asset !== card);
        setSelectedCards(newSelectedCards);
    };

    const handleEdit = (card, quantity) => {
        const newSelectedCards = selectedCards.map(selectedCard => {
            if (selectedCard.asset === card) {
                return { ...selectedCard, selectQuantity: Number(quantity) };
            }
            return selectedCard;
        });
        setSelectedCards([...newSelectedCards]);
    };

    const notSelectedCards = filteredCards.filter(
        card => !selectedCards.some(selected => selected.asset === card.asset)
    );

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
                    INVENTORY
                </Heading>
                <Text>Here you can withdraw your cards from the army to your inventory</Text>
            </Stack>
            <Stack backgroundColor={'#0F0F0F'} borderRadius={'20px'} h={'85%'}>
                <Heading fontSize="xl" fontWeight="light" textAlign="center" mt={3}>
                    1. Select cards to send to Inventory
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
                <Stack direction={'row'} pt={2} padding={5} height={'inherit'}>
                    <Box
                        mb={4}
                        backgroundColor={'#0F0F0F'}
                        borderRadius={'20px'}
                        p={2}
                        w={isMobile ? '45%' : '65%'}
                        overflowY={'scroll'}
                        className="custom-scrollbar"
                        mx="auto"
                        display="flex"
                        justifyContent="center">
                        <SimpleGrid
                            columns={gridColumns()}
                            gap={4}
                            align={'center'}
                            overflowY={'auto'}
                            className="custom-scrollbar"
                            w={'100%'}
                            p={4}
                            overflow={'scroll'}
                            height={'100%'}>
                            {filteredNotSelectedCards.length > 0 &&
                                filteredNotSelectedCards.map((card, cardIndex) => {
                                    const { name, cardImgUrl, rarity, channel, omnoQuantity } = card;
                                    return (
                                        <Box
                                            key={cardIndex}
                                            bg={'white'}
                                            borderRadius={'10px'}
                                            mx={'auto'}
                                            onClick={() => setSelectedCards([...selectedCards, card])}>
                                            <Center>
                                                <Img src={cardImgUrl} w={'90%'} h={'75%'} />
                                            </Center>
                                            <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2} mb={1}>
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                    align={{ base: 'center', lg: 'start' }}>
                                                    <Text
                                                        fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                                        noOfLines={1}
                                                        fontWeight="bold"
                                                        color={'#000'}>
                                                        {name}
                                                    </Text>
                                                    <CardBadges rarity={rarity} continent={channel} size="sm" />
                                                </Stack>
                                                <Spacer display={{ base: 'none', lg: 'block' }} />
                                                <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                                    <Tooltip display={'flex'} placement="bottom">
                                                        <Flex w={{ base: 'auto', lg: '100%' }}>
                                                            <Text
                                                                textAlign="end"
                                                                minH={{ base: '100%', lg: 'auto' }}
                                                                fontSize={'x-small'}
                                                                color={'#000'}>
                                                                Quantity: {omnoQuantity}
                                                            </Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Center>
                                            </Stack>
                                        </Box>
                                    );
                                })}
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
                        <ArdorCards
                            infoAccount={infoAccount}
                            cards={filteredCards}
                            isMobile={isMobile}
                            selectedCards={selectedCards}
                            setSelectedCards={setSelectedCards}
                            notSelectedCards={notSelectedCards}
                            handleEdit={handleEdit}
                            handleDeleteSelectedCard={handleDeleteSelectedCard}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default ArdorPage;
