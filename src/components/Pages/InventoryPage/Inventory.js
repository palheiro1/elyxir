import { useState } from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';

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
    // Only Elyxir items
    const { items } = useSelector(state => state.items);
    const [section, setSection] = useState('INGREDIENT'); // INGREDIENT | TOOL | FLASK | RECIPE | CREATION
    const [itemsFiltered, setItemsFiltered] = useState([]);

    // Map section to elyxirType
    const filterBySection = (base = items, sec = section) => {
        return base.filter(it => (it.elyxirType || 'INGREDIENT').toUpperCase() === sec);
    };

    // Sync itemsFiltered with section
    if (itemsFiltered.length !== filterBySection(items, section).length) {
        setItemsFiltered(filterBySection(items, section));
    }

    return (
        <Box mb={2}>
            <Stack direction="row" spacing={2} mb={4}>
                {['INGREDIENT', 'TOOL', 'FLASK', 'RECIPE', 'CREATION'].map(type => (
                    <Button
                        key={type}
                        isActive={section === type}
                        color="white"
                        _active={{ bgColor: 'rgba(47,129,144,1)', color: 'white' }}
                        bgColor={section === type ? 'rgba(47,129,144,1)' : 'rgba(47,129,144,0.5)'}
                        _hover={{ bgColor: 'rgba(47,129,144,0.7)' }}
                        size="sm"
                        fontWeight="medium"
                        fontSize="sm"
                        onClick={() => {
                            setSection(type);
                            setItemsFiltered(filterBySection(items, type));
                        }}
                    >
                        {type.charAt(0) + type.slice(1).toLowerCase() + (type === 'INGREDIENT' ? 's' : 's')}
                    </Button>
                ))}
            </Stack>
            <SortAndFilterItems items={itemsFiltered} setItemsFiltered={setItemsFiltered} rgbColor={'47,129,144'} />
            <GridItems items={itemsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
        </Box>
    );
};

export default Inventory;
