import { Box, Text } from "@chakra-ui/react";
import { Table } from "../../../../ResponsiveTable/table";
import { Thead } from "../../../../ResponsiveTable/thead";
import { Tr } from "../../../../ResponsiveTable/tr";
import { Tbody } from "../../../../ResponsiveTable/tbody";
import { Td } from "../../../../ResponsiveTable/td";
import { NQTDIVIDER } from "../../../../../data/CONSTANTS";

const AskAndBidList = ({ orders, name }) => {
    return (
        <Box>
            <Text fontWeight="bold">Your open orders (for {name})</Text>
            <Table>
                <Thead>
                    <Tr>
                        <Td>
                            Type
                        </Td>
                        <Td>
                            Amount
                        </Td>
                        <Td>
                            Price
                        </Td>
                        <Td>
                            Cancel
                        </Td>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders && orders.length > 0 && orders.map((order, index) => {
                        return (
                            <Tr key={index}>
                                <Td style={{ color: order.type === "ask" ? "red" : "green" }}>
                                    {order.type === "ask" ? "Sell" : "Buy"}
                                </Td>
                                <Td>
                                    {order.quantityQNT}
                                </Td>
                                <Td>
                                    {order.priceNQTPerShare / NQTDIVIDER}
                                </Td>
                                <Td>
                                    SOON
                                </Td>
                            </Tr>
                        )
                    })}
                    {orders.length === 0 && <Tr>
                        <Td colSpan="4" textAlign="center" fontWeight="bold">
                            No orders
                        </Td>
                    </Tr>
                    }
                </Tbody>
            </Table>
        </Box>
    )
}

export default AskAndBidList;