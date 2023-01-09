import { Box, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import TableCard from "../../Cards/TableCard";

import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'

const LatestTransaction = () => {

    const InOutTransaction = ({ type }) => {
        const color = type === "in" ? "green" : "blue.600"
        const msg = type === "in" ? "Received" : "Sent"
        return(
            <Stack direction="row">
                <Text color={color}> {msg} </Text>
                {type === "in" ? <ArrowDownIcon fontSize="xl" fontWeight="bold" color={color} /> : <ArrowUpIcon fontSize="xl" color={color} />}
            </Stack>
        )
    }

    return (
        <Box mt={8}>
            <Text mb={4} fontSize="2xl">Latest game transactions</Text>

            <TableContainer border="1px" borderColor="gray" rounded="2xl" shadow="inner" boxShadow={"2xl"}>
                <Table variant="simple">
                    <Thead border="1px">
                        <Tr>
                            <Th textAlign={"center"} textTransform="inherit" fontSize="sm" fontWeight="medium">Title</Th>
                            <Th textAlign={"center"} textTransform="inherit" fontSize="sm" fontWeight="medium">Amount</Th>
                            <Th textAlign={"center"} textTransform="inherit" fontSize="sm" fontWeight="medium">Date and time</Th>
                            <Th textAlign={"center"} textTransform="inherit" fontSize="sm" fontWeight="medium">Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody border="1px">
                        <Tr>
                            <Td>
                                <TableCard image={"/images/cards/card.png"} title={"Droemerdene"} continent={"America"} rarity={"Common"} />
                            </Td>
                            <Td>5</Td>
                            <Td>Jan 8, 11:35</Td>
                            <Td><InOutTransaction type={"in"}/></Td>
                        </Tr>
                        <Tr>
                            <Td><TableCard image={"/images/cards/card.png"} title={"Kel Essuf"} continent={"America"} rarity={"Common"} /></Td>
                            <Td>1</Td>
                            <Td>Sep 24, 16:35</Td>
                            <Td><InOutTransaction type={"in"}/></Td>
                        </Tr>
                        <Tr>
                            <Td><TableCard image={"/images/cards/card.png"} title={"Rompo"} continent={"Oceania"} rarity={"Rare"} /></Td>
                            <Td>7</Td>
                            <Td>Aug 23, 16:35</Td>
                            <Td><InOutTransaction type={"out"}/></Td>
                        </Tr>
                        <Tr>
                            <Td><TableCard image={"/images/cards/card.png"} title={"Kel Essuf"} continent={"America"} rarity={"Common"} /></Td>
                            <Td>5</Td>
                            <Td>Jan 8, 11:35</Td>
                            <Td><InOutTransaction type={"in"}/></Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default LatestTransaction;