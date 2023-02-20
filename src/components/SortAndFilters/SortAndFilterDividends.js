import { Box, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane, FaFilter } from 'react-icons/fa';

const SortAndFilterDividends = ({ dividends, setFilteredDividends, setVisibleDividends }) => {
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');

    const handleSort = e => {
        setSort(e.target.value);
    };

    const handleFilter = e => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        const filterTransactions = dividends => {
            console.log("🚀 ~ file: SortAndFilterDividends.js:19 ~ filterTransactions ~ dividends", dividends)
            console.log('filterTransactions', filter)
            switch (filter) {
                case 'all':
                    return dividends;
                default:
                    return dividends.filter(({ card }) => card.name === filter);
            }
        };

        const sortTransactions = dividends => {
            if (sort === 'older') {
                dividends.reverse();
            }
            return dividends;
        };

        if (dividends.length > 0) {
            const filteredTransactions = filterTransactions([...dividends]);
            const sortedTransactions = sortTransactions(filteredTransactions);
            setFilteredDividends(sortedTransactions);
            setVisibleDividends(10);
        }
    }, [dividends, filter, sort, setFilteredDividends, setVisibleDividends]);

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <Stack direction={{ base: 'column', md: 'row' }} pb={2}>
            <Stack
                direction="row"
                border="1px"
                borderColor={borderColor}
                rounded="lg"
                bg="blackAlpha"
                shadow="md"
                px={2}
                align="center">
                <Box pl={1} py={2}>
                    <FaRegPaperPlane />
                </Box>
                <Text fontSize="sm" color="gray.400">
                    Sort:{' '}
                </Text>
                <Select border="0px" borderColor="gray.800" size="xs" onChange={handleSort}>
                    <option value="recent">Newest</option>
                    <option value="older">Older</option>
                </Select>
            </Stack>

            <Stack
                direction="row"
                w={{ base: '100%', md: 'unset' }}>
                <Stack
                    direction="row"
                    border="1px"
                    borderColor={borderColor}
                    rounded="lg"
                    bg="blackAlpha"
                    shadow="md"
                    px={2}
                    align="center"
                    w={{ base: '100%', md: 'unset' }}>
                    <Box pl={1} py={2}>
                        <FaFilter />
                    </Box>
                    <Text fontSize="sm" color="gray.400">
                        Show:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" onChange={handleFilter}>
                        <option value="all">All dividends</option>
                        <option value="Tarasca">Tarasca</option>
                        <option value="Marakihau">Marakihau</option>
                        <option value="Sasquatch">Sasquatch</option>
                        <option value="Maruxaina">Maruxaina</option>
                        <option value="Grootslang">Grootslang</option>
                    </Select>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SortAndFilterDividends;
