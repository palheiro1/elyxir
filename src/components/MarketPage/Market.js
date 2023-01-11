import {
    Box,
    Button,
    SimpleGrid,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { useState } from 'react';
import GridCards from '../Cards/GridCards';
import SortAndFilterMenu from '../SortAndFilters/SortAndFilterMenu';

const Market = ({ infoAccount, cards }) => {
    // Option
    // 0 -> Market
    // 1 -> Trades and orders
    const [option, setOption] = useState(0);

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);

    return (
        <Box>
            <Box>
                <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered} />
            </Box>
            <Box w="100%">
                <Button
                    isActive={option === 0}
                    w="50%"
                    size="lg"
                    rounded="node"
                    fontWeight="medium"
                    fontSize="md"
                    onClick={() => setOption(0)}
                    borderLeftRadius="lg">
                    Market
                </Button>

                <Button
                    isActive={option === 1}
                    w="50%"
                    size="lg"
                    rounded="node"
                    fontWeight="medium"
                    fontSize="md"
                    onClick={() => setOption(1)}
                    borderRightRadius="lg">
                    Trades and orders
                </Button>
            </Box>

            {option === 0 && (
                <Box>
                    <GridCards cards={cardsFiltered} isMarket={true} />
                </Box>
            )}

            {option === 1 && (
                <Box>
                    <TableContainer
                        mt={4}
                        border="1px"
                        borderColor="whiteAlpha.100"
                        rounded="lg"
                        shadow="lg"
                        boxShadow="md">
                        <Table variant="simple">
                            <Thead>
                                <Td> </Td>
                                <Td>Title</Td>
                                <Td>Amount</Td>
                                <Td>Price</Td>
                                <Td>Date and Time</Td>
                                <Td>Seller/Buller</Td>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>X</Td>
                                    <Td>Card 1</Td>
                                    <Td>1</Td>
                                    <Td>0.1</Td>
                                    <Td>Jan 8, 11:35</Td>
                                    <Td>ARDOR-J45A-8UPL-XYHR-DAUD8</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <SimpleGrid columns={2} mt={4} shadow="lg">
                        <TableContainer
                            mt={4}
                            border="2px"
                            borderColor="whiteAlpha.100"
                            shadow="inner"
                            boxShadow="md">
                            <Text textAlign="center" p={4} fontSize="lg" borderBottom="1px">
                                Asks
                            </Text>
                            <Table variant="simple">
                                <Thead backgroundColor="whiteAlpha.300">
                                    <Td textAlign="center">Asset</Td>
                                    <Td textAlign="center">Ignis</Td>
                                    <Td textAlign="center">Amount</Td>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td textAlign="center">X</Td>
                                        <Td textAlign="center">Card 1</Td>
                                        <Td textAlign="center">1</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <TableContainer
                            mt={4}
                            border="2px"
                            borderColor="whiteAlpha.100"
                            shadow="inner"
                            boxShadow="md">
                            <Text textAlign="center" p={4} fontSize="lg" borderBottom="1px">
                                Bids
                            </Text>
                            <Table variant="simple">
                                <Thead backgroundColor="whiteAlpha.300">
                                    <Td textAlign="center">Asset</Td>
                                    <Td textAlign="center">Ignis</Td>
                                    <Td textAlign="center">Amount</Td>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td textAlign="center">X</Td>
                                        <Td textAlign="center">Card 1</Td>
                                        <Td textAlign="center">1</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </SimpleGrid>
                </Box>
            )}
        </Box>
    );
};

export default Market;
