import { useState } from 'react';
import { Box, Button, ButtonGroup } from '@chakra-ui/react';

import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import { useSelector } from 'react-redux';

/**
 * Inventory component
 * @name Inventory
 * @description This component is the inventory page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - All cards
 * @returns {JSX.Element} - Inventory component
 */
const Inventory = ({ infoAccount }) => {
    const [viewMode, setViewMode] = useState('cards');

    const { cards } = useSelector(state => state.cards);
    const { items } = useSelector(state => state.items);

    // Filtered cards and items
    const [cardsFiltered, setCardsFiltered] = useState(cards);
    const [itemsFiltered, setItemsFiltered] = useState(items);

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
                    <SortAndFilterItems items={items} setItemsFiltered={setItemsFiltered} />
                    <GridItems items={itemsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
                </>
            )}
        </Box>
    );
};

export default Inventory;
