import { useCallback, useState } from 'react';
import { Box, Heading, IconButton, Stack, useMediaQuery } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import CardsGrid from './Components/CardsGrid';
import CardsFilter from './Components/CardsFilter';
import { useMemo } from 'react';

const rarityMap = { 1: 'Common', 2: 'Rare', 3: 'Epic', 4: 'Special' };
const domainMap = { 1: 'Asia', 2: 'Oceania', 3: 'America', 4: 'Africa', 5: 'Europe' };

/**
 * @name BattleInventory
 * @description Displays a filtered grid of available battle cards based on arena level and user-selected filters.
 * Allows the user to preview and select a card to place in the battle hand.
 * Handles responsive layout logic and adapts the number of grid columns based on screen size.
 * Pre-selection logic allows users to preview a card before confirming its addition to the battle hand.
 * @param {Function} setOpenIventory - Toggles the visibility of the inventory drawer.
 * @param {Array} filteredCards - List of all cards available to the user, filtered by global context.
 * @param {number} index - Player index (0 = initiator, used to determine card rules).
 * @param {Array} handBattleCards - Cards already selected for the battle hand.
 * @param {Function} updateCard - Function called when the user confirms the selected card.
 * @param {boolean} isMobile - Indicates whether the screen is in mobile mode.
 * @param {Object} arenaInfo - Arena data including `level` for eligibility filtering.
 * @param {Object} filters - Current filter values: `{ rarity, element, domain }`.
 * @param {Function} handleRarityChange - Callback when the rarity filter changes.
 * @param {Function} handleElementChange - Callback when the element filter changes.
 * @param {Function} handleDomainChange - Callback when the domain filter changes.
 * @returns {JSX.Element} A responsive panel showing filters and a grid of eligible cards.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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
    handleResetFilters,
}) => {
    const { soldiers } = useSelector(state => state.soldiers);
    const { level } = arenaInfo;
    const [preSelectedCard, setPreSelectedCard] = useState(null);

    const [isLittleScreen] = useMediaQuery('(min-width: 1190px) and (max-width: 1330px)');
    const [isMediumScreen] = useMediaQuery('(min-width: 1330px) and (max-width: 1600px)');

    const getColumns = useCallback(() => {
        if (isMobile || isLittleScreen) return 4;
        if (isMediumScreen) return 4;
        return 5;
    }, [isMobile, isLittleScreen, isMediumScreen]);

    const enhanceCards = useCallback(
        cards =>
            cards.map(card => ({
                ...card,
                selected: handBattleCards.some(item => item.asset === card.asset),
            })),
        [handBattleCards]
    );

    const availableCards = useMemo(() => {
        const condition = card =>
            (level === 1 && ['Common', 'Rare'].includes(card.rarity)) ||
            (level > 1 &&
                ((index === 0 && ['Epic', 'Special'].includes(card.rarity)) ||
                    (index !== 0 && ['Common', 'Rare'].includes(card.rarity))));
        return enhanceCards(filteredCards.filter(condition));
    }, [filteredCards, index, level, enhanceCards]);

    const filteredAvailableCards = useMemo(() => {
        return availableCards
            .filter(card => filters.rarity === '-1' || card.rarity === rarityMap[filters.rarity])
            .filter(card => {
                if (filters.element === '-1') return true;
                const cardInfo = soldiers.soldier.find(s => s.asset === card.asset);
                return cardInfo?.mediumId === Number(filters.element);
            })
            .filter(card => filters.domain === '-1' || card.channel === domainMap[filters.domain]);
    }, [availableCards, filters, soldiers]);

    const handleCardClick = useCallback(
        card => {
            if (preSelectedCard?.asset === card.asset) {
                updateCard(card);
                setOpenIventory(false);
                setPreSelectedCard(null);
            } else {
                setPreSelectedCard(card);
            }
        },
        [preSelectedCard, updateCard, setOpenIventory]
    );

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

                <CardsFilter
                    filters={filters}
                    handleRarityChange={handleRarityChange}
                    handleElementChange={handleElementChange}
                    handleDomainChange={handleDomainChange}
                    handleResetFilters={handleResetFilters}
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
