import { Box, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane, FaFilter } from 'react-icons/fa';

const SortAndFilterTxs = ({ transactions, setFilteredTransactions, setVisibleTransactions }) => {
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');

    const handleSort = e => {
        setSort(e.target.value);
    };

    const handleFilter = e => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        const filterTransactions = transactions => {
            switch (filter) {
                case 'all':
                    return transactions;
                case 'placed':
                    return transactions.filter(({ type }) => type === 'ask' || type === 'bid');
                case 'cards':
                    return transactions.filter(({ isCard }) => isCard);
                case 'currency':
                    return transactions.filter(({ isCurrency }) => isCurrency);
                default:
                    return transactions.filter(({ type }) => type === filter);
            }
        };

        const sortTransactions = transactions => {
            if (sort === 'older') {
                transactions.reverse();
            }
            return transactions;
        };

        if (transactions.length > 0) {
            const filteredTransactions = filterTransactions([...transactions]);
            const sortedTransactions = sortTransactions(filteredTransactions);
            setFilteredTransactions(sortedTransactions);
            setVisibleTransactions(10);
        }
    }, [transactions, filter, sort, setFilteredTransactions, setVisibleTransactions]);

    const borderColor = useColorModeValue('blackAlpha.300', '#3b7197');

    return (
        <Stack direction={{ base: 'column', md: 'row' }} pb={2} w="100%">
            <Stack
                direction="row"
                border="2px"
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
                    <option value="older">Oldest</option>
                </Select>
            </Stack>

            <Stack
                direction="row"
                w={{ base: '100%', md: 'unset' }}>
                <Stack
                    direction="row"
                    border="2px"
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
                        Filter:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" onChange={handleFilter}>
                        <option value="all">All transactions</option>
                        <option value="in">Received</option>
                        <option value="out">Sent</option>
                        <option value="cards">Cards</option>
                        <option value="currency">Currencies</option>
                        <option value="placed">Trades</option>
                    </Select>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SortAndFilterTxs;
