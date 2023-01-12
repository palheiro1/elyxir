import { Table, TableContainer, Tbody, Td, Thead } from "@chakra-ui/react";
import TradesOrOrderItem from "./TradesOrOrderItem";

const TradesAndOrderTable = ({ trades, orders }) => {
    return (
        <TableContainer
            mt={4}
            border="1px"
            borderColor="whiteAlpha.100"
            rounded="lg"
            shadow="lg"
            boxShadow="md">
            <Table variant="simple">
                <Thead>
                    <Td></Td>
                    <Td>Title</Td>
                    <Td>Amount</Td>
                    <Td>Price</Td>
                    <Td>Date and Time</Td>
                    <Td>Seller/Buller</Td>
                </Thead>
                <Tbody>
                    <TradesOrOrderItem type="IN" name="Card 1" amount="21" price="300" date="3 Jun, 11:50" sellerOrBuyer="ARDOR-123-321-123-312" />
                    <TradesOrOrderItem type="OUT" name="Card 1" amount="21" price="300" date="3 Jun, 11:50" sellerOrBuyer="ARDOR-123-321-123-312" />
                    <TradesOrOrderItem type="OUT" name="Card 1" amount="21" price="300" date="3 Jun, 11:50" sellerOrBuyer="ARDOR-123-321-123-312" />
                    <TradesOrOrderItem type="IN" name="Card 1" amount="21" price="300" date="3 Jun, 11:50" sellerOrBuyer="ARDOR-123-321-123-312" />
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default TradesAndOrderTable;
