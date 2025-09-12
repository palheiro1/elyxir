import { Box, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BsArrowDownUp } from 'react-icons/bs';
import { isElyxirAsset, GEMASSET } from '../../data/CONSTANTS';

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
        // transactions array now contains processed handler objects: { Component, type, ... }
        const { CURRENCY_ASSETS } = require('../../data/CONSTANTS');

        const normalizeType = t => (t || '').toLowerCase();

        const sortTransactions = list => {
            if (sort === 'older') return [...list].reverse();
            return list;
        };

        if (transactions.length > 0) {
            // We already excluded MANA/WETH/GIFTZ earlier. Just ensure nothing sneaks in.
            const filtered = transactions.filter(t => {
                // Keep everything the processor decided was relevant
                // Defensive: if a future change passes raw tx with attachment we still exclude unwanted currencies
                const rawAsset = t.attachment?.asset || t.assetId;
                if (rawAsset && CURRENCY_ASSETS[rawAsset] && ['MANA','WETH','GIFTZ'].includes(CURRENCY_ASSETS[rawAsset])) {
                    return false;
                }
                return true;
            });

            console.log('SortAndFilterTxs: Total transactions (processed):', transactions.length);
            console.log('SortAndFilterTxs: After light filter:', filtered.length);
            console.log('SortAndFilterTxs: Sample:', filtered.slice(0,3));

            const sorted = sortTransactions(filtered);
            setFilteredTransactions(sorted);
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
