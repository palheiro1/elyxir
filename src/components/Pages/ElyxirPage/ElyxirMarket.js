import { Box, Heading, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';

/**
 * @name ElyxirMarket
 * @description Market page for Elyxir ingredients
 * @param {Array} items - Array of elyxir ingredient items (with name, image, quantityQNT, etc)
 * @param {Object} infoAccount - Account info
 * @returns {JSX.Element}
 */
const ElyxirMarket = ({ items, infoAccount }) => {
    // Option: 0 -> Market, 1 -> Orders, 2 -> Trades
    const [option, setOption] = useState(0);
    const [itemsFiltered, setItemsFiltered] = useState(items);
    // Section switcher logic (same as Elyxir inventory)
    const [section, setSection] = useState('INGREDIENT'); // INGREDIENT | TOOL | FLASK | RECIPE | CREATION

    // Map section to elyxirType
    const filterBySection = (base = items, sec = section) => {
        return base.filter(it => (it.elyxirType || 'INGREDIENT').toUpperCase() === sec);
    };

    // Sync itemsFiltered with section
    if (itemsFiltered.length !== filterBySection(items, section).length) {
        setItemsFiltered(filterBySection(items, section));
    }

    return (
        <>


            {option === 0 && (
                <Box>
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
                    <SortAndFilterItems
                        items={itemsFiltered}
                        setItemsFiltered={setItemsFiltered}
                        rgbColor={'47,129,144'}
                    />
                    <GridItems
                        items={itemsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        rgbColor={'47,129,144'}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(47,129,144)">
                        Ingredient Orders
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Ingredient orders feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(47,129,144)">
                        Ingredient Trades
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Ingredient trades feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default ElyxirMarket;
