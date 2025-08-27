import { Box, Button, Select, Stack, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';

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

    const [type, setType] = useState('All');
    const [sort, setSort] = useState('moreQuantity');

    const computed = useMemo(() => {
        let out = [...items];

        if (type !== 'All') {
            out = out.filter(it => (it?.bonus?.type || '').toLowerCase() === type);
        }

        const byNumber = v => Number(v ?? 0);

        switch (sort) {
            case 'moreQuantity':
                out.sort(
                    (a, b) =>
                        byNumber(b.quantityQNT) - byNumber(a.quantityQNT) || (a.name || '').localeCompare(b.name || '')
                );
                break;
            case 'lessQuantity':
                out.sort(
                    (a, b) =>
                        byNumber(a.quantityQNT) - byNumber(b.quantityQNT) || (a.name || '').localeCompare(b.name || '')
                );
                break;
            case 'name':
                out.sort((a, b) => (a.description || '').localeCompare(b.description || ''));
                break;
            case 'bonus':
                out.sort(
                    (a, b) =>
                        (b?.bonus?.value ?? 0) - (a?.bonus?.value ?? 0) || (a.name || '').localeCompare(b.name || '')
                );
                break;
            default:
                break;
        }

        return out;
    }, [items, type, sort]);

    useEffect(() => {
        setItemsFiltered(computed);
    }, [computed, setItemsFiltered]);

    const handleTypeChange = e => setType(e.target.value);
    const handleSortChange = e => setSort(e.target.value);

    return (
        <Box>
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} mb={4}>
                <Box>
                    <Text fontSize="sm" mb={2} color="gray">
                        Filter by Type
                    </Text>
                    <Select
                        value={type}
                        onChange={handleTypeChange}
                        bg={bgButtons}
                        border={`1px solid ${borderButtons}`}>
                        <option value="All">All Types</option>
                        <option value="medium">Medium Bonus</option>
                        <option value="domain">Continent Bonus</option>
                    </Select>
                </Box>

                <Box>
                    <Text fontSize="sm" mb={2} color="gray">
                        Sort by
                    </Text>
                    <Select
                        value={sort}
                        onChange={handleSortChange}
                        bg={bgButtons}
                        border={`1px solid ${borderButtons}`}>
                        <option value="moreQuantity">More Quantity</option>
                        <option value="lessQuantity">Less Quantity</option>
                        <option value="name">Name</option>
                        <option value="bonus">Bonus</option>
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
                    onClick={() => setSort(prev => (prev === 'moreQuantity' ? 'lessQuantity' : 'moreQuantity'))}>
                    Toggle Quantity
                </Button>
            </Stack>
        </Box>
    );
};

export default SortAndFilterItems;
