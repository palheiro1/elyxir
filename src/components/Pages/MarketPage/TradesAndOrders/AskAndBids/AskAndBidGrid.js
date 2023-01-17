import {
    SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Thead,
    useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import CancelDialog from '../../../../Modals/TradeDialog/CancelDialog/CancelDialog';
import AskOrBidItem from './AskOrBidItem';

const AskAndBidGrid = ({ cards, askOrders, bidOrders, onlyText = false, username }) => {

    const [selectedOrder, setSelectedOrder] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const refCancel = useRef();

    return (
        <>
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
                            {askOrders.map(order => {
                                const _asset = onlyText
                                    ? Number(order.asset)
                                    : getAsset(order.asset, cards);
                                return (
                                    <AskOrBidItem
                                        key={order.orderFullHash}
                                        order={order.order}
                                        asset={_asset}
                                        ignis={order.priceNQTPerShare / NQTDIVIDER}
                                        amount={order.quantityQNT}
                                        isAsk={true}
                                        onOpen={onOpen}
                                        setSelectedOrder={setSelectedOrder}
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
                            {bidOrders.map(order => {
                                const _asset = onlyText
                                    ? Number(order.asset)
                                    : getAsset(order.asset, cards);
                                return (
                                    <AskOrBidItem
                                        key={order.orderFullHash}
                                        order={order.order}
                                        asset={_asset}
                                        ignis={Number(order.priceNQTPerShare / NQTDIVIDER)}
                                        amount={order.quantityQNT}
                                        onOpen={onOpen}
                                        setSelectedOrder={setSelectedOrder}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </SimpleGrid>
            <CancelDialog reference={refCancel} isOpen={isOpen} onClose={onClose} username={username} selectedOrder={selectedOrder} />
        </>
    );
};

export default AskAndBidGrid;
