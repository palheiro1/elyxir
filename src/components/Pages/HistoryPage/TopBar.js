import { Button, ButtonGroup, Spacer, Stack } from '@chakra-ui/react';
import SortAndFilterDividends from '../../SortAndFilters/SortAndFilterDividends';
import SortAndFilterTxs from '../../SortAndFilters/SortAndFilterTxs';

const TopBar = ({
    setFilteredTransactions,
    setFilteredDividends,
    setVisibleTransactions,
    setVisibleDividends,
    transactions,
    dividends,
    section,
    setSection,
}) => {
    const isTransactions = section === 'transactions';
    const isDividends = section === 'dividends';
    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" justify="center" py={4}>
            {isTransactions && (
                <SortAndFilterTxs
                    setFilteredTransactions={setFilteredTransactions}
                    setVisibleTransactions={setVisibleTransactions}
                    transactions={transactions}
                />
            )}
            {isDividends && (
                <SortAndFilterDividends
                    dividends={dividends}
                    setFilteredDividends={setFilteredDividends}
                    setVisibleDividends={setVisibleDividends}
                />
            )}
            <Spacer />
            <Stack direction="row" align="center" justify="center">
                <ButtonGroup variant="outline" isAttached size="sm">
                    <Button
                        bgColor={isTransactions && '#F18800'}
                        color={isTransactions && 'white'}
                        _hover={{ bg: '#F18800', color: 'white' }}
                        onClick={() => setSection('transactions')}>
                        Transactions
                    </Button>
                    <Button
                        bgColor={isDividends && '#F18800'}
                        color={isDividends && 'white'}
                        _hover={{ bg: '#F18800', color: 'white' }}
                        onClick={() => setSection('dividends')}>
                        Dividends
                    </Button>
                </ButtonGroup>
            </Stack>
        </Stack>
    );
};

export default TopBar;
