import { useState } from 'react';
import { Box } from '@chakra-ui/react';

import GridCards from '../../Cards/GridCards';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';

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
const Inventory = ({ infoAccount, cards }) => {
    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box mb={2}>
            <SortAndFilterCards cards={cards} setCardsFiltered={setCardsFiltered} />
            <GridCards cards={cardsFiltered} infoAccount={infoAccount} rgbColor="47, 129, 144" />
        </Box>
    );
};

export default Inventory;
