import { Box, Select, Stack, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';
import { FaFilter } from 'react-icons/fa';
/**
 * @name SortAndFilterItems
 * @description Menu to sort and filter items/potions
 * @param {Array} items - Array with the items
 * @param {Function} setItemsFiltered - Function to set the filtered items
 * @param {String} rgbColor - String with the RGB color
 * @returns {JSX.Element} - JSX element
 */
const SortAndFilterItems = ({ items = [], setItemsFiltered, rgbColor = '47, 129, 144' }) => {
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
    }, [computed]);

    const handleTypeChange = e => setType(e.target.value);
    const handleSortChange = e => setSort(e.target.value);

    return (
        <Box>
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} mb={4}>
                <Stack
                    direction="row"
                    border="2px"
                    borderColor={borderButtons}
                    rounded="lg"
                    bg="transparent"
                    px={2}
                    align="center"
                    w={{ base: '100%', lg: 'unset' }}>
                    <Box pl={1} py={2}>
                        <FaFilter color={borderButtons} />
                    </Box>
                    <Text fontSize="sm" color={borderButtons}>
                        Filter:{' '}
                    </Text>
                    <Select value={type} onChange={handleTypeChange} border="0px" borderColor="gray.800" size="xs">
                        <option value="All">All Types</option>
                        <option value="medium">Medium Bonus</option>
                        <option value="domain">Domain Bonus</option>
                    </Select>
                </Stack>

                <Stack
                    direction="row"
                    border="2px"
                    borderColor={borderButtons}
                    rounded="lg"
                    bg="transparent"
                    px={2}
                    align="center"
                    w={{ base: '100%', lg: 'unset' }}>
                    <Box pl={1} py={2}>
                        <BsArrowDownUp color={borderButtons} />
                    </Box>
                    <Text fontSize="sm" color={borderButtons}>
                        Sort:{' '}
                    </Text>
                    <Select value={sort} onChange={handleSortChange} border="0px" borderColor="gray.800" size="xs">
                        <option value="moreQuantity">More Quantity</option>
                        <option value="lessQuantity">Less Quantity</option>
                        <option value="name">Name</option>
                        <option value="bonus">Bonus</option>
                    </Select>
                </Stack>
            </Stack>
        </Box>
    );
};

export default SortAndFilterItems;
