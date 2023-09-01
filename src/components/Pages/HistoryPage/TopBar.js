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
        <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: 0, lg: 4 }}
            align={{ base: 'start', lg: 'center' }}
            justify={{ base: 'center', lg: 'space-between' }}
            minW={{ base: '100%', lg: 'auto' }}
            pb={4}>
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
            <Stack direction="row" align="center" justify="center" minW={{ base: '100%', md: 'auto' }}>
                <ButtonGroup variant="outline" isAttached size="sm" w="100%">
                    <Button
                        w="100%"
                        border="2px"
                        borderColor="#367197"
                        bgColor={isTransactions && '#3b7197'}
                        color={isTransactions && 'white'}
                        _hover={{ color: 'white' }}
                        onClick={() => setSection('transactions')}>
                        Transactions
                    </Button>
                    <Button
                        w="100%"
                        border="2px"
                        borderColor="#367197"
                        bgColor={isDividends && '#3b7197'}
                        color={isDividends && 'white'}
                        _hover={{ color: 'white' }}
                        onClick={() => setSection('dividends')}>
                        Dividends
                    </Button>
                </ButtonGroup>
            </Stack>
        </Stack>
    );
};

export default TopBar;
