import { Box, Heading } from '@chakra-ui/react';

import { useState } from 'react';

import GridItems from '../../Items/GridItems';
import SortAndFilterItems from '../../SortAndFilters/SortAndFilterItems';
import SectionSwitch from './SectionSwitch';

const ItemMarket = ({ items, infoAccount, textColor }) => {
    // Mock items for marketplace
    const mockItems = [
        {
            id: 1,
            name: 'Terrestrial Elixir',
            image: '/images/items/Lava copia.png',
            type: 'medium',
            bonus: 1,
            quantity: 0, // User doesn't have this item
            description: 'A mystical potion that enhances the power of terrestrial creatures.',
            element: 'Terrestrial',
        },
        {
            id: 2,
            name: 'Asian Spirit Brew',
            image: '/images/items/Blood copia.png',
            type: 'continent',
            bonus: 1,
            quantity: 0,
            description: 'An ancient brew that strengthens creatures from the Asian continent.',
            continent: 'Asia',
        },
        {
            id: 3,
            name: 'Power Surge Potion',
            image: '/images/items/Holi Water2 copia.png',
            type: 'power',
            bonus: 2,
            quantity: 0,
            description: 'A rare potion that provides raw power boost to any creature.',
        },
        {
            id: 4,
            name: 'Oceanic Essence',
            image: '/images/items/Water sea.png',
            type: 'continent',
            bonus: 1,
            quantity: 0,
            description: 'A rare essence that empowers creatures from Oceania.',
            continent: 'Oceania',
        },
        {
            id: 5,
            name: 'Aerial Boost Potion',
            image: '/images/items/Wind copia.png',
            type: 'medium',
            bonus: 1,
            quantity: 0,
            description: 'A light potion that enhances aerial creatures.',
            element: 'Aerial',
        },
        {
            id: 6,
            name: 'Legendary Amplifier',
            image: '/images/items/WaterCristaline copia.png',
            type: 'power',
            bonus: 3,
            quantity: 0,
            description: 'An extremely rare potion that provides massive power boost.',
        },
    ];

    // Option
    // 0 -> Market
    // 1 -> Orders
    // 2 -> Trades
    const [option, setOption] = useState(0);
    // Filtered items
    const [itemsFiltered, setItemsFiltered] = useState(items.length > 0 ? items : mockItems);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            {option === 0 && (
                <Box>
                    <SortAndFilterItems
                        items={items.length > 0 ? items : mockItems}
                        setItemsFiltered={setItemsFiltered}
                        rgbColor={'59,100,151'}
                    />

                    <GridItems
                        items={itemsFiltered}
                        isMarket={true}
                        infoAccount={infoAccount}
                        rgbColor={'59,100,151'}
                    />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Orders
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Item orders feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}

            {option === 2 && (
                <Box>
                    <Heading textAlign="center" mt={4} color="rgb(59,100,151)">
                        Item Trades
                    </Heading>
                    <Box p={8} textAlign="center">
                        <Heading size="md" color="gray.400">
                            Item trades feature coming soon!
                        </Heading>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default ItemMarket;
