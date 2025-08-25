import { useState } from 'react';
import { Box, Button, ButtonGroup } from '@chakra-ui/react';

import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';

/**
 * Inventory component
 * @name Inventory
 * @description This component is the inventory page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - All cards
 * @param {Array} items - All items/potions
 * @returns {JSX.Element} - Inventory component
 */
const Inventory = ({ infoAccount, cards, items = [] }) => {
    const [viewMode, setViewMode] = useState('cards');

    // Filtered cards and items
    const [cardsFiltered, setCardsFiltered] = useState(cards);
    const [itemsFiltered, setItemsFiltered] = useState(items);

    // Mock items data for testing
    const mockItems = [
        {
            id: 1,
            name: 'Terrestrial Elixir',
            image: '/images/items/Lava copia.png',
            type: 'medium',
            bonus: 1,
            quantity: 3,
            description: 'A mystical potion that enhances the power of terrestrial creatures.',
            element: 'Terrestrial',
        },
        {
            id: 2,
            name: 'Asian Spirit Brew',
            image: '/images/items/Blood copia.png',
            type: 'continent',
            bonus: 1,
            quantity: 2,
            description: 'An ancient brew that strengthens creatures from the Asian continent.',
            continent: 'Asia',
        },
        {
            id: 3,
            name: 'Power Surge Potion',
            image: '/images/items/Holi Water2 copia.png',
            type: 'power',
            bonus: 2,
            quantity: 1,
            description: 'A rare potion that provides raw power boost to any creature.',
        },
    ];

    const actualItems = items.length > 0 ? items : mockItems;

    const SectionSwitch = () => {
        const ButtonSwitch = ({ isActive, onClick, text }) => {
            return (
                <Button
                    isActive={isActive}
                    color="white"
                    _active={{ bgColor: 'rgba(47, 129, 144, 1)', color: 'white' }}
                    bgColor={'rgba(47, 129, 144, 0.5)'}
                    _hover={{ bgColor: 'rgba(47, 129, 144, 0.7)' }}
                    w="50%"
                    size="lg"
                    fontWeight="medium"
                    fontSize="md"
                    onClick={onClick}>
                    {text}
                </Button>
            );
        };

        return (
            <ButtonGroup w="100%" my={6} shadow="md" isAttached>
                <ButtonSwitch isActive={viewMode === 'cards'} onClick={() => setViewMode('cards')} text={'Cards'} />
                <ButtonSwitch isActive={viewMode === 'items'} onClick={() => setViewMode('items')} text={'Items'} />
            </ButtonGroup>
        );
    };

    return (
        <Box mb={2}>
            <SectionSwitch />

            {viewMode === 'cards' && (
                <>
                    <SortAndFilterCards cards={cards} setCardsFiltered={setCardsFiltered} />
                    <GridCards cards={cardsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
                </>
            )}

            {viewMode === 'items' && (
                <>
                    <SortAndFilterItems items={actualItems} setItemsFiltered={setItemsFiltered} />
                    <GridItems items={itemsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
                </>
            )}
        </Box>
    );
};

export default Inventory;
