import { Box, Button, Select, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';
import equal from 'fast-deep-equal';
import Crypto from 'crypto-browserify';

/**
 * @name SortAndFilterItems
 * @description Menu to sort and filter items/potions
 * @param {Array} items - Array with the items
 * @param {Function} setItemsFiltered - Function to set the filtered items
 * @param {String} rgbColor - String with the RGB color
 * @returns {JSX.Element} - JSX element
 */
const SortAndFilterItems = ({ items = [], setItemsFiltered, rgbColor = '47, 129, 144' }) => {
    const bgButtons = `rgba(${rgbColor}, 0.35)`;
    const borderButtons = `rgba(${rgbColor}, 1)`;

    const [rarity, setRarity] = useState('All');
    const [type, setType] = useState('All');
    const [sort, setSort] = useState('moreQuantity');
    const [needReload, setNeedReload] = useState(true);
    const [actualItems, setActualItems] = useState(items);
    const [itemsHash, setItemsHash] = useState('');

    /**
     * @description Filter items by rarity and type
     */
    useEffect(() => {
        const filterItems = () => {
            setNeedReload(false);
            let filteredItems = [...items];

            if (rarity !== 'All') {
                filteredItems = filteredItems.filter(item => item.rarity === rarity);
            }

            if (type !== 'All') {
                filteredItems = filteredItems.filter(item => item.type === type);
            }

            if (sort === 'moreQuantity') {
                filteredItems = filteredItems.sort((a, b) => b.quantity - a.quantity);
            } else if (sort === 'lessQuantity') {
                filteredItems = filteredItems.sort((a, b) => a.quantity - b.quantity);
            } else if (sort === 'name') {
                filteredItems = filteredItems.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sort === 'rarity') {
                const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Special': 4 };
                filteredItems = filteredItems.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
            }

            setItemsFiltered(filteredItems);
            setActualItems(filteredItems);
        };

        const checkForChanges = () => {
            const hash = Crypto.createHash('sha256').update(JSON.stringify(items)).digest('hex');
            if (!equal(itemsHash, hash)) {
                setItemsHash(hash);
                setNeedReload(true);
            }
        };

        checkForChanges();

        if (needReload) {
            filterItems();
        }
    }, [items, rarity, type, sort, needReload, itemsHash, setItemsFiltered]);

    const handleRarityChange = event => {
        setRarity(event.target.value);
    };

    const handleTypeChange = event => {
        setType(event.target.value);
    };

    const handleSortChange = event => {
        setSort(event.target.value);
    };

    return (
        <Box>
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} mb={4}>
                <Box>
                    <Text fontSize="sm" mb={2} color="gray">
                        Filter by Rarity
                    </Text>
                    <Select value={rarity} onChange={handleRarityChange} bg={bgButtons} border={`1px solid ${borderButtons}`}>
                        <option value="All">All Rarities</option>
                        <option value="Common">Common</option>
                        <option value="Rare">Rare</option>
                        <option value="Epic">Epic</option>
                        <option value="Special">Special</option>
                    </Select>
                </Box>

                <Box>
                    <Text fontSize="sm" mb={2} color="gray">
                        Filter by Type
                    </Text>
                    <Select value={type} onChange={handleTypeChange} bg={bgButtons} border={`1px solid ${borderButtons}`}>
                        <option value="All">All Types</option>
                        <option value="medium">Medium Bonus</option>
                        <option value="continent">Continent Bonus</option>
                        <option value="power">Power Bonus</option>
                    </Select>
                </Box>

                <Box>
                    <Text fontSize="sm" mb={2} color="gray">
                        Sort by
                    </Text>
                    <Select value={sort} onChange={handleSortChange} bg={bgButtons} border={`1px solid ${borderButtons}`}>
                        <option value="moreQuantity">More Quantity</option>
                        <option value="lessQuantity">Less Quantity</option>
                        <option value="name">Name</option>
                        <option value="rarity">Rarity</option>
                    </Select>
                </Box>
            </Stack>

            <Stack direction="row" spacing={2} mb={4}>
                <Button
                    size="sm"
                    bg={bgButtons}
                    border={`1px solid ${borderButtons}`}
                    _hover={{ bg: borderButtons }}
                    leftIcon={<BsArrowDownUp />}
                    onClick={() => setSort(sort === 'moreQuantity' ? 'lessQuantity' : 'moreQuantity')}>
                    Toggle Quantity
                </Button>
            </Stack>
        </Box>
    );
};

export default SortAndFilterItems;
