import { Box, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BsArrowDownUp } from 'react-icons/bs';
import { ELYXIR_ASSETS, GEMASSET, isElyxirAsset } from '../../data/CONSTANTS';

const SortAndFilterTxs = ({ transactions, setFilteredTransactions, setVisibleTransactions }) => {
    const [/*filter*/, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');

    const handleSort = e => {
        setSort(e.target.value);
    };

    const handleFilter = e => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        // Show only Elyxir-related transactions: items, GEM, and IGNIS
        const filterTransactions = transactions => {
            return transactions.filter(transaction => {
                console.log('Filtering transaction:', {
                    type: transaction.type,
                    attachment: transaction.attachment,
                    asset: transaction.attachment?.asset,
                    isElyxirAsset: transaction.attachment?.asset ? isElyxirAsset(transaction.attachment.asset) : false
                });
                
                // Include IGNIS currency transactions (native currency, no asset ID)
                if (transaction.type === 'payment' && !transaction.attachment?.asset) {
                    console.log('Including IGNIS transaction');
                    return true;
                }
                
                // Include transactions for specific Elyxir assets (including GEM)
                if (transaction.attachment?.asset && isElyxirAsset(transaction.attachment.asset)) {
                    console.log('Including Elyxir asset transaction:', transaction.attachment.asset);
                    return true;
                }
                
                console.log('Excluding transaction');
                return false;
            });
        };

        const sortTransactions = transactions => {
            if (sort === 'older') {
                transactions.reverse();
            }
            return transactions;
        };

        if (transactions.length > 0) {
            const filteredTransactions = filterTransactions([...transactions]);
            console.log('SortAndFilterTxs: Total transactions:', transactions.length);
            console.log('SortAndFilterTxs: Filtered transactions:', filteredTransactions.length);
            console.log('SortAndFilterTxs: First few filtered:', filteredTransactions.slice(0, 3));
            
            const sortedTransactions = sortTransactions(filteredTransactions);
            setFilteredTransactions(sortedTransactions);
            setVisibleTransactions(10);
        }
    }, [transactions, sort, setFilteredTransactions, setVisibleTransactions]);

    const borderColor = '#3b7197';
    const textColor = useColorModeValue('#3b7197', 'white');

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
                    <BsArrowDownUp color="#3b7197" />
                </Box>
                <Text fontSize="sm" color="#3b7197">
                    Sort:{' '}
                </Text>
                <Select border="0px" borderColor="gray.800" size="xs" onChange={handleSort} color={textColor}>
                    <option value="recent">Newest</option>
                    <option value="older">Oldest</option>
                </Select>
            </Stack>

            <Stack direction="row" w={{ base: '100%', md: 'unset' }}>
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
                        <FaFilter color="#3b7197" />
                    </Box>
                    <Text fontSize="sm" color="#3b7197">
                        Filter:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" onChange={handleFilter} color={textColor}>
                        <option value="all">All transactions</option>
                        <option value="in">Received</option>
                        <option value="out">Sent</option>
                        <option value="cards">Cards</option>
                        <option value="items">Items</option>
                        <option value="currency">Currencies</option>
                        <option value="placed">Trades</option>
                    </Select>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SortAndFilterTxs;
