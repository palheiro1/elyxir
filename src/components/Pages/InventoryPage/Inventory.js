import { useState, useEffect } from 'react';
import { Alert, AlertIcon, Box, Button, Stack } from '@chakra-ui/react';

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
    const { items, error } = useSelector(state => state.items);
    const [section, setSection] = useState('all');
    const [itemsFiltered, setItemsFiltered] = useState(items);
    const hasPartialDataWarning = (items || []).some(item => {
        return (
            item.metadataLoadFailed ||
            item.marketLoadFailed ||
            item.bonusLoadFailed ||
            item.omnoLoadFailed ||
            item.flaskMultiplierLoadFailed
        );
    });

    useEffect(() => {
        let newItems = items;
        if (section !== 'all') {
            newItems = items.filter(item => item.type === section);
        }
        setItemsFiltered(newItems);
    }, [items, section]);

    return (
        <Box mb={2}>
            {(error || hasPartialDataWarning) && (
                <Alert status="warning" mb={4} borderRadius="md">
                    <AlertIcon />
                    Inventory quantities are loaded from Ardor on-chain balances. Some market, bonus, or metadata details
                    could not be loaded.
                </Alert>
            )}
            <Stack direction="row" spacing={2} mb={4}>
                {['all', 'ingredient', 'tool', 'flask', 'recipe', 'potion'].map(type => (
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
                        onClick={() => setSection(type)}>
                        {type.charAt(0).toUpperCase() + type.slice(1) + (type === 'all' ? '' : 's')}
                    </Button>
                ))}
            </Stack>
            <SortAndFilterItems items={items} setItemsFiltered={setItemsFiltered} />
            <GridItems items={itemsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
        </Box>
    );
};
export default Inventory;
