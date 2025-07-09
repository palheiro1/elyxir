import { useState } from 'react';
import { Box, Heading, IconButton, Stack, useMediaQuery } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import FilterSelects from './FilterSelects';
import CardsGrid from './Components/CardsGrid';

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
        .filter(card => ['Common', 'Rare'].includes(card.rarity))
        .map(card => ({ ...card, selected: handBattleCards.some(item => item.asset === card.asset) }));

    const normalHand = filteredCards
        .filter(
            card =>
                (index === 0 && ['Epic', 'Special'].includes(card.rarity)) ||
                (index !== 0 && ['Common', 'Rare'].includes(card.rarity))
        )
        .map(card => ({ ...card, selected: handBattleCards.some(item => item.asset === card.asset) }));

    const availableCards = level === 1 ? commonHand : normalHand;

    const filteredAvailableCards = availableCards
        .filter(card => {
            const rarityMap = { 1: 'Common', 2: 'Rare', 3: 'Epic', 4: 'Special' };
            return filters.rarity !== '-1' ? card.rarity === rarityMap[filters.rarity] : true;
        })
        .filter(card => {
            const cardInfo = soldiers.soldier.find(s => s.asset === card.asset);
            return filters.element !== '-1' ? cardInfo?.mediumId === Number(filters.element) : true;
        })
        .filter(card => {
            const domainMap = { 1: 'Asia', 2: 'Oceania', 3: 'America', 4: 'Africa', 5: 'Europe' };
            return filters.domain !== '-1' ? card.channel === domainMap[filters.domain] : true;
        });

    const handleCardClick = card => {
        if (preSelectedCard?.asset === card.asset) {
            updateCard(card);
            setOpenIventory(false);
            setPreSelectedCard(null);
        } else {
            setPreSelectedCard(card);
        }
    };

    return (
        <>
            <IconButton
                icon={<ChevronLeftIcon boxSize={8} />}
                mt={3}
                p={5}
                bg="transparent"
                color="#FFF"
                _hover={{ bg: 'transparent' }}
                onClick={() => setOpenIventory(false)}
            />
            <Stack h="90%">
                <Heading fontFamily="Chelsea Market, system-ui" fontSize="large" fontWeight={400} ml="9%">
                    ARMY CARDS
                </Heading>
                <FilterSelects
                    filters={filters}
                    handleRarityChange={handleRarityChange}
                    handleElementChange={handleElementChange}
                    handleDomainChange={handleDomainChange}
                    isMobile={isMobile}
                    index={index}
                    level={level}
                />
                <Stack direction="row" padding={5} pt={0} height={isMobile ? '80%' : '90%'}>
                    <Box
                        mb={2}
                        borderRadius="20px"
                        p={4}
                        pt={0}
                        w="90%"
                        mx="auto"
                        h="100%"
                        overflowY="auto"
                        className="custom-scrollbar">
                        <CardsGrid
                            cards={filteredAvailableCards}
                            preSelectedCard={preSelectedCard}
                            onCardClick={handleCardClick}
                            isMobile={isMobile}
                            getColumns={getColumns}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default BattleInventory;
