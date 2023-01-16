import { SimpleGrid, Table, TableContainer, Tbody, Td, Text, Thead } from "@chakra-ui/react";
import { NQTDIVIDER } from "../../../../../data/CONSTANTS";
import { getAsset } from "../../../../../utils/cardsUtils";
import AskOrBidItem from "./AskOrBidItem";

const AskAndBidGrid = ({ cards, askOrders, bidOrders, onlyText = true }) => {
    
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
                        {!onlyText && <Td textAlign="center">Asset</Td>}
                        <Td textAlign="center">Ignis</Td>
                        <Td textAlign="center">Amount</Td>
                    </Thead>
                    <Tbody>
                        {askOrders.map((order) => {
                            console.log("🚀 ~ file: AskAndBidGrid.js:29 ~ {askOrders.map ~ order", order)
                            const _asset = onlyText ? Number(order.asset) : getAsset(order.asset, cards);
                            return (
                                <AskOrBidItem
                                    key={order.orderFullHash}
                                    asset={_asset}
                                    ignis={order.priceNQTPerShare/NQTDIVIDER}
                                    amount={order.quantityQNT}
                                />
                            );
                        })}
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
                        {!onlyText && <Td textAlign="center">Asset</Td>}
                        <Td textAlign="center">Ignis</Td>
                        <Td textAlign="center">Amount</Td>
                    </Thead>
                    <Tbody>
                        {bidOrders.map((order) => {
                            const _asset = onlyText ? Number(order.asset) : getAsset(order.asset, cards);
                            return (
                                <AskOrBidItem
                                    key={order.orderFullHash}
                                    asset={_asset}
                                    ignis={Number(order.priceNQTPerShare/NQTDIVIDER)}
                                    amount={order.quantityQNT}
                                />
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </SimpleGrid>
    );
};

export default AskAndBidGrid;