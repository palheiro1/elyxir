import {
    Box,
    Select,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { FaRegPaperPlane, FaFilter } from 'react-icons/fa';
import TableCard from '../Cards/TableCard';
import InOutTransaction from '../Tables/InOutTransaction';

/**
 * @name History
 * @description History page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @dev This page is used to render the history page
 * @returns {JSX.Element} History component
 * 
 */
const History = ({ infoAccount }) => {
    const TableElement = () => {
        return (
            <Tr>
                <Td>
                    <TableCard
                        image={'/images/cards/card.png'}
                        title={'Droemerdene'}
                        continent={'America'}
                        rarity={'Common'}
                    />
                </Td>
                <Td>1</Td>
                <Td>Jan 8, 11:35</Td>
                <Td>ARDOR-J45A-8UPL-XYHR-DAUD8</Td>
                <Td>
                    <InOutTransaction type={'in'} />
                </Td>
            </Tr>
        );
    };

    return (
        <Box>
            <Stack direction="row" pb={2}>
                <Stack
                    direction="row"
                    border="1px"
                    borderColor="gray.600"
                    rounded="lg"
                    px={2}
                    align="center">
                    <Box pl={1} py={2}>
                        <FaRegPaperPlane />
                    </Box>
                    <Text fontSize="sm" color="gray.400">
                        Sort:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" placeholder="Sort option">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                    </Select>
                </Stack>

                <Stack position="absolute" right="3%" direction="row">
                    <Stack
                        direction="row"
                        border="1px"
                        borderColor="gray.600"
                        rounded="lg"
                        px={2}
                        align="center">
                        <Box pl={1} py={2}>
                            <FaFilter />
                        </Box>
                        <Text fontSize="sm" color="gray.400">
                            Show:{' '}
                        </Text>
                        <Select
                            border="0px"
                            borderColor="gray.800"
                            size="xs"
                            placeholder="All transactions">
                            <option value="option1">Received</option>
                            <option value="option2">Send</option>
                            <option value="option2">Cards transactions</option>
                            <option value="option2">Currency TX</option>
                            <option value="option2">From the Market</option>
                        </Select>
                    </Stack>
                </Stack>
            </Stack>

            <TableContainer
                border="1px"
                borderColor="gray"
                rounded="2xl"
                shadow="inner"
                boxShadow="md">
                <Table variant="simple">
                    <Thead>
                        <Td>Title</Td>
                        <Td>Amount</Td>
                        <Td>Date and Time</Td>
                        <Td>To/From</Td>
                        <Td>Status</Td>
                    </Thead>
                    <Tbody>
                        <TableElement />
                        <TableElement />
                        <TableElement />
                        <TableElement />
                        <TableElement />
                        <TableElement />
                        <TableElement />
                        <TableElement />
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default History;
