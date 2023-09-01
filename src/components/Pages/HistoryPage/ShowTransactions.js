import { Button, Center, Spinner, TableContainer, Text } from '@chakra-ui/react';

import { Table } from '../../ResponsiveTable/table';
import { Tbody } from '../../ResponsiveTable/tbody';
import { Thead } from '../../ResponsiveTable/thead';
import { Tr } from '../../ResponsiveTable/tr';
import { Th } from '../../ResponsiveTable/th';

const ShowTransactions = ({
    haveUnconfirmed,
    filteredTransactions,
    setVisibleTransactions,
    visibleTransactions,
    handleClick,
}) => {
    // -------------------------------------------------
    const loadMoreTransactions = () => {
        setVisibleTransactions(prevVisibleTransactions => prevVisibleTransactions + 10);
    };
    // -------------------------------------------------

    return filteredTransactions.length > 0 ? (
        <TableContainer
            border="1px"
            borderColor={'#3b7197'}
            rounded="lg"
            shadow="dark-lg"
            boxShadow="inner"
            textAlign="center"
            maxW={{ base: '100%', md: '80%', lg: '70vw', xl: '100%' }}>
            {haveUnconfirmed && (
                <Center w="100%" textAlign="center" py={4} gap={4}>
                    <Spinner size="md" />{' '}
                    <Text fontWeight="bolder" bgGradient="linear(to-l, #478299, #957bd2)" bgClip="text">
                        New transactions are being processed.
                    </Text>
                </Center>
            )}
            <Table variant="simple" size={{ base: 'sm', lg: 'md' }}>
                <Thead>
                    <Tr w="1rem" >
                        <Th />
                        <Th color="#3b7197">Title</Th>
                        <Th color="#3b7197">Amount</Th>
                        <Th color="#3b7197">Date and Time</Th>
                        <Th color="#3b7197">To/From</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredTransactions &&
                        filteredTransactions.slice(0, visibleTransactions).map((transaction, index) => {
                            return <transaction.Component key={index} handleClick={handleClick} />;
                        })}
                </Tbody>
            </Table>

            {filteredTransactions.length > visibleTransactions && (
                <Button size="lg" w="100%" bgColor="transparent" p={12} onClick={loadMoreTransactions} color="#3b7197">
                    LOAD MORE
                </Button>
            )}
        </TableContainer>
    ) : (
        <Center w="100%" textAlign="center" py={4} gap={4}>
            <Text fontWeight="bolder" bgGradient="linear(to-l, #478299, #957bd2)" bgClip="text">
                No transactions yet
            </Text>
        </Center>
    );
};

export default ShowTransactions;
