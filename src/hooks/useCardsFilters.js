import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * @name useCardsFilters
 * @description Custom hook that manages and applies rarity, element, and domain filters on a list of card assets
 * for the Omno battle selection. It filters out already-selected cards and returns only those available
 * and matching the selected filters.
 * @param {Array<Object>} selectedCards - Cards that have already been selected.
 * @param {Array<Object>} cards - Full list of card assets owned by the user.
 * @returns {Object} Object containing:
 * - `filters`: Current filter state.
 * - `filteredNotSelectedCards`: Filtered list of cards ready to be displayed.
 * - `handleRarityChange`: Event handler to update rarity filter.
 * - `handleElementChange`: Event handler to update element filter.
 * - `handleDomainChange`: Event handler to update domain filter.
 *
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
export const useCardsFilters = ({ selectedCards, cards, quantityKey = 'quantityQNT' }) => {
    const [filters, setFilters] = useState({ rarity: '-1', element: '-1', domain: '-1' });

    const { soldiers } = useSelector(state => state.soldiers);

    const myCards = useMemo(() => cards.filter(card => parseInt(card[quantityKey]) > 0), [cards, quantityKey]);
    const notSelectedCards = useMemo(
        () => myCards.filter(card => !selectedCards.some(selected => selected.asset === card.asset)),
        [myCards, selectedCards]
    );

    const filteredNotSelectedCards = useMemo(() => {
        const rarityMap = { 1: 'Common', 2: 'Rare', 3: 'Epic', 4: 'Special' };
        const domainMap = { 1: 'Asia', 2: 'Oceania', 3: 'America', 4: 'Africa', 5: 'Europe' };

        return notSelectedCards
            .filter(card => {
                return filters.rarity !== '-1' ? card.rarity === rarityMap[filters.rarity] : true;
            })
            .filter(card => {
                const cardInfo = soldiers.soldier.find(s => s.asset === card.asset);
                return filters.element !== '-1' ? cardInfo?.mediumId === Number(filters.element) : true;
            })
            .filter(card => {
                return filters.domain !== '-1' ? card.channel === domainMap[filters.domain] : true;
            });
    }, [notSelectedCards, filters, soldiers]);

    const handleChange = key => e => setFilters(prev => ({ ...prev, [key]: e.target.value }));

    const handleReset = () => {
        setFilters({ rarity: '-1', element: '-1', domain: '-1' });
    };

    return {
        filters,
        filteredNotSelectedCards,
        handleRarityChange: handleChange('rarity'),
        handleElementChange: handleChange('element'),
        handleDomainChange: handleChange('domain'),
        handleReset,
    };
};
