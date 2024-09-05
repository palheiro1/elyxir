import { Box, Center, Flex, IconButton, Img, Select, SimpleGrid, Spacer, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useState } from 'react';
import CardBadges from '../../../../Cards/CardBadges';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';

const BattleInventory = ({
    setOpenIventory,
    filteredCards,
    index,
    handBattleCards,
    updateCard,
    isMobile,
    arenaInfo,
}) => {
    const { soldiers } = useSelector(state => state.soldiers);
    const { armyRankMaximum } = arenaInfo;
    const [filters, setFilters] = useState({
        rarity: '',
        element: '',
        domain: '',
    });

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

    const commonHand = filteredCards
        .filter(card => card.rarity === 'Common' || card.rarity === 'Rare')
        .filter(card => !handBattleCards.find(item => item.asset === card.asset));

    const normalHand = filteredCards
        .filter(
            card =>
                (index === 0 && (card.rarity === 'Epic' || card.rarity === 'Special')) ||
                (index !== 0 && (card.rarity === 'Common' || card.rarity === 'Rare'))
        )
        .filter(card => !handBattleCards.find(item => item.asset === card.asset));

    const availableCards = armyRankMaximum[0] === 5 ? commonHand : normalHand;

    const filteredAvailableCards = availableCards
        .filter(card => {
            const rarityMapping = {
                1: 'Common',
                2: 'Rare',
                3: 'Epic',
                4: 'Special',
            };
            return filters.rarity ? card.rarity === rarityMapping[filters.rarity] : true;
        })
        .filter(card => {
            const cardInfo = soldiers.soldier.find(soldier => soldier.asset === card.asset);
            return filters.element ? cardInfo.mediumId === Number(filters.element) : true;
        })
        .filter(card => {
            const domainMapping = {
                1: 'Asia',
                2: 'Oceania',
                3: 'America',
                4: 'Africa',
                5: 'Europe',
            };
            return filters.domain ? card.channel === domainMapping[filters.domain] : true;
        });

    return (
        <>
            <IconButton
                icon={<ChevronLeftIcon boxSize={8} />}
                mt={3}
                p={5}
                bg={'transparent'}
                color={'#FFF'}
                _hover={{ bg: 'transparent' }}
                onClick={() => setOpenIventory(false)}>
                Go back
            </IconButton>
            <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={'9%'}>
                <Text my={'auto'} fontSize={'lg'}>
                    Cards' filters:{' '}
                </Text>
                <Select placeholder="Rarity" w={'20%'} onChange={handleRarityChange}>
                    {armyRankMaximum[0] === 5 && (
                        <>
                            <option value="1">Common</option>
                            <option value="2">Rare</option>
                        </>
                    )}
                    {armyRankMaximum[0] !== 5 && (
                        <>
                            {index !== 0 && (
                                <>
                                    <option value="1">Common</option>
                                    <option value="2">Rare</option>
                                </>
                            )}
                            {index === 0 && (
                                <>
                                    <option value="3">Epic</option>
                                    <option value="4">Special</option>
                                </>
                            )}
                        </>
                    )}
                </Select>

                <Select placeholder="Element" w={'20%'} onChange={handleElementChange}>
                    <option value="1">Terrestrial</option>
                    <option value="2">Aerial</option>
                    <option value="3">Aquatic</option>
                </Select>
                <Select placeholder="Continent" w={'20%'} onChange={handleDomainChange}>
                    <option value="1">Asia</option>
                    <option value="2">Oceania</option>
                    <option value="3">America</option>
                    <option value="4">Africa</option>
                    <option value="5">Europe</option>
                </Select>
            </Stack>
            <Stack direction={'row'} padding={5} pt={1} height={'90%'}>
                <Box
                    mb={2}
                    borderRadius={'20px'}
                    p={4}
                    w={'90%'}
                    mx={'auto'}
                    overflowY={'scroll'}
                    className="custom-scrollbar">
                    <SimpleGrid
                        columns={isMobile ? 2 : 4}
                        spacing={5}
                        overflowY={'auto'}
                        className="custom-scrollbar"
                        p={5}
                        overflow={'scroll'}
                        h={'750px'}>
                        {filteredAvailableCards.length > 0 ? (
                            filteredAvailableCards.map((card, i) => {
                                const { cardImgUrl, name, rarity, channel, omnoQuantity } = card;
                                return (
                                    <Box
                                        key={i}
                                        w={'225px'}
                                        h={'350px'}
                                        cursor={'pointer'}
                                        bg={'white'}
                                        onClick={() => {
                                            setOpenIventory(false);
                                            updateCard(card);
                                        }}
                                        borderRadius={'10px'}>
                                        <Center>
                                            <Img src={cardImgUrl} w={'90%'} h={'75%'} />
                                        </Center>
                                        <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} mx={2}>
                                            <Stack
                                                direction="column"
                                                spacing={0}
                                                align={{ base: 'center', lg: 'start' }}>
                                                <Text
                                                    fontSize={{
                                                        base: 'sm',
                                                        md: 'md',
                                                        '2xl': 'xl',
                                                    }}
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
                                                            mb={isMobile && 3}
                                                            color={'#000'}>
                                                            <small>Quantity:</small> {omnoQuantity}
                                                        </Text>
                                                    </Flex>
                                                </Tooltip>
                                            </Center>
                                        </Stack>
                                    </Box>
                                );
                            })
                        ) : (
                            <Text
                                position={'absolute'}
                                fontFamily={'Chelsea Market, system-ui'}
                                color={'#FFF'}
                                fontSize={'xl'}
                                top={'50%'}
                                left={'50%'}
                                transform={'translate(-50%, -50%)'}>
                                No cards left
                            </Text>
                        )}
                    </SimpleGrid>
                </Box>
            </Stack>
        </>
    );
};

export default BattleInventory;
