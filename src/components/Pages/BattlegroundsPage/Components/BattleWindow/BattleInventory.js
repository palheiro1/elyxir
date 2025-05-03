import React, { useState } from 'react';
import {
    Box,
    Center,
    Flex,
    Heading,
    IconButton,
    Img,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    Tooltip,
    useMediaQuery,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import CardBadges from '../../../../Cards/CardBadges';

const BattleInventory = ({
    setOpenIventory,
    filteredCards,
    index,
    handBattleCards,
    updateCard,
    isMobile,
    arenaInfo,
    filters,
    handleRarityChange,
    handleElementChange,
    handleDomainChange,
}) => {
    const { soldiers } = useSelector(state => state.soldiers);
    const { level } = arenaInfo;

    const [preSelectedCard, setPreSelectedCard] = useState(null);

    const [isLittleScreen] = useMediaQuery('(min-width: 1190px) and (max-width: 1330px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1330px) and (max-width: 1600px)');

    const getColumns = () => {
        if (isMobile || isLittleScreen) return 3;
        if (isMediumScreen) return 4;
        return 5;
    };

    const commonHand = filteredCards
        .filter(card => card.rarity === 'Common' || card.rarity === 'Rare')
        .map(card => ({
            ...card,
            selected: handBattleCards.some(item => item.asset === card.asset),
        }));

    const normalHand = filteredCards
        .filter(
            card =>
                (index === 0 && (card.rarity === 'Epic' || card.rarity === 'Special')) ||
                (index !== 0 && (card.rarity === 'Common' || card.rarity === 'Rare'))
        )
        .map(card => ({
            ...card,
            selected: handBattleCards.some(item => item.asset === card.asset),
        }));

    const availableCards = level === 1 ? commonHand : normalHand;

    const filteredAvailableCards = availableCards
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

    const handleCardClick = card => {
        if (preSelectedCard && preSelectedCard.asset === card.asset) {
            updateCard(card);
            setOpenIventory(false);
            setPreSelectedCard(null);
        } else {
            setPreSelectedCard(card);
        }
    };

    const optionStyle = { backgroundColor: '#FFF', color: '#000' };

    return (
        <>
            <IconButton
                icon={<ChevronLeftIcon boxSize={8} />}
                mt={3}
                p={5}
                bg={'transparent'}
                color={'#FFF'}
                _hover={{ bg: 'transparent' }}
                onClick={() => setOpenIventory(false)}
            />
            <Stack h={'90%'}>
                <Heading fontFamily={'Chelsea Market, system-ui'} fontSize={'large'} fontWeight={400} ml={'9%'}>
                    ARMY CARDS
                </Heading>
                <Stack direction="row" fontFamily={'Chelsea Market, system-ui'} ml={'9%'}>
                    <Select w={'10%'} onChange={handleRarityChange} color={'#FFF'} defaultValue={filters.rarity}>
                        <option value="-1" style={optionStyle}>
                            Rarity
                        </option>
                        {level === 1 && (
                            <>
                                <option style={optionStyle} value="1">
                                    Common
                                </option>
                                <option value="2" style={optionStyle}>
                                    Rare
                                </option>
                            </>
                        )}
                        {level !== 1 && (
                            <>
                                {index !== 0 && (
                                    <>
                                        <option value="1" style={optionStyle}>
                                            Common
                                        </option>
                                        <option value="2" style={optionStyle}>
                                            Rare
                                        </option>
                                    </>
                                )}
                                {index === 0 && (
                                    <>
                                        <option value="3" style={optionStyle}>
                                            Epic
                                        </option>
                                        <option value="4" style={optionStyle}>
                                            Special
                                        </option>
                                    </>
                                )}
                            </>
                        )}
                    </Select>

                    <Select w={'10%'} onChange={handleElementChange} color={'#FFF'} defaultValue={filters.element}>
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
                    <Select w={'10%'} onChange={handleDomainChange} color={'#FFF'} defaultValue={filters.domain}>
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
                <Stack direction={'row'} padding={5} pt={0} height={'90%'}>
                    <Box
                        mb={2}
                        borderRadius={'20px'}
                        p={4}
                        pt={0}
                        w={'90%'}
                        mx={'auto'}
                        h={'100%'}
                        overflowY={'auto'}
                        className="custom-scrollbar">
                        <SimpleGrid
                            columns={getColumns()}
                            spacing={3}
                            p={3}
                            h={'100%'}
                            overflowY={'auto'}
                            className="custom-scrollbar">
                            {filteredAvailableCards.length > 0 ? (
                                filteredAvailableCards.map((card, i) => {
                                    const { cardImgUrl, name, rarity, channel, selected } = card;
                                    const isPreSelected = preSelectedCard?.asset === card.asset;

                                    return (
                                        <Box
                                            key={i}
                                            position="relative"
                                            w={'214px'}
                                            h={'333px'}
                                            cursor={'pointer'}
                                            bg={'white'}
                                            onClick={() => !selected && handleCardClick(card)}
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
                                                                color={'#000'}></Text>
                                                        </Flex>
                                                    </Tooltip>
                                                </Center>
                                            </Stack>
                                            {selected && (
                                                <Box
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="rgba(0, 0, 0, 0.3)"
                                                />
                                            )}
                                            {isPreSelected && (
                                                <Box
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    display="flex"
                                                    borderRadius={'inherit'}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="rgba(1, 151, 135, 0.5)"
                                                    fontFamily={'Chelsea Market, system-ui'}>
                                                    CHOOSE
                                                </Box>
                                            )}
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
            </Stack>
        </>
    );
};

export default BattleInventory;
