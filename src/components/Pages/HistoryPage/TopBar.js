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
    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center" justify="center" py={4}>
            {section === 'transactions' && (
                <SortAndFilterTxs
                    setFilteredTransactions={setFilteredTransactions}
                    setVisibleTransactions={setVisibleTransactions}
                    transactions={transactions}
                />
            )}
            {section === 'dividends' && (
                <SortAndFilterDividends
                    dividends={dividends}
                    setFilteredDividends={setFilteredDividends}
                    setVisibleDividends={setVisibleDividends}
                />
            )}
            <Spacer />
            <Stack direction="row" align="center" justify="center">
                <ButtonGroup variant="outline" isAttached size="sm">
                    <Button onClick={() => setSection('transactions')}>Transactions</Button>
                    <Button onClick={() => setSection('dividends')}>Dividends</Button>
                </ButtonGroup>
            </Stack>
        </Stack>
    );
};

export default TopBar;
