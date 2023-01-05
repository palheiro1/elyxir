import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

const LatestTransaction = () => {
    return (
        <Box mt={6}>
            <Text mb={4}>Latest game transactions</Text>

            <TableContainer border="1px" rounded="2xl">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Amount</Th>
                            <Th>Date and time</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Game 1</Td>
                            <Td>0.0001 ETH</Td>
                            <Td>2021-10-10 10:10:10</Td>
                            <Td>Won</Td>
                        </Tr>
                        <Tr>
                            <Td>Game 2</Td>
                            <Td>0.0001 ETH</Td>
                            <Td>2021-10-10 10:10:10</Td>
                            <Td>Lost</Td>
                        </Tr>
                        <Tr>
                            <Td>Game 3</Td>
                            <Td>0.0001 ETH</Td>
                            <Td>2021-10-10 10:10:10</Td>
                            <Td>Won</Td>
                        </Tr>
                        <Tr>
                            <Td>Game 4</Td>
                            <Td>0.0001 ETH</Td>
                            <Td>2021-10-10 10:10:10</Td>
                            <Td>Won</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default LatestTransaction;