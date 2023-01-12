import { SimpleGrid, Table, TableContainer, Tbody, Td, Text, Thead } from "@chakra-ui/react";
import AskOrBidItem from "./AskOrBidItem";

const AskAndBidGrid = () => {
    return (
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
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
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
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
                        <AskOrBidItem asset="123" ignis="321" amount="1" />
                    </Tbody>
                </Table>
            </TableContainer>
        </SimpleGrid>
    );
};

export default AskAndBidGrid;