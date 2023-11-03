import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { Table } from '../../../../ResponsiveTable/table';
import { Thead } from '../../../../ResponsiveTable/thead';
import { Tr } from '../../../../ResponsiveTable/tr';
import { Tbody } from '../../../../ResponsiveTable/tbody';
import { Td } from '../../../../ResponsiveTable/td';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import CancelDialog from '../../../../Modals/TradeDialog/CancelDialog/CancelDialog';
import { useRef, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';

/**
 * @name AskAndBidList
 * @description List for the asks and bids
 * @param {Array} orders - Array of orders
 * @param {String} name - Name of the asset
 * @param {String} username - Username
 * @param {Boolean} canDelete - Can delete the order
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const AskAndBidList = ({ orders, name, username, canDelete = false }) => {
    const refCancel = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState();

    const handleDelete = value => {
        setSelectedOrder(value);
        onOpen();
    };

    return (
        <>
            <Box>
                <Text fontWeight="bold">Your open orders (for {name})</Text>
                <Table>
                    <Thead>
                        <Tr>
                            <Td>Type</Td>
                            <Td>Amount</Td>
                            <Td>Price</Td>
                            <Td>Cancel</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders &&
                            orders.length > 0 &&
                            orders.map((order, index) => {
                                return (
                                    <Tr key={index} bgColor="whiteAlpha.200" _hover={{ bgColor: 'whiteAlpha.300' }}>
                                        <Td
                                            style={{ color: order.type === 'ask' ? 'red' : 'green' }}
                                            fontWeight="black">
                                            {order.type === 'ask' ? 'SELL' : 'BUY'}
                                        </Td>
                                        <Td>{order.quantityQNT}</Td>
                                        <Td>{order.priceNQTPerShare / NQTDIVIDER}</Td>
                                        <Td>
                                            <Box
                                                onClick={() => handleDelete({ ...order, isAsk: order.type === 'ask' })}
                                                style={{ cursor: 'pointer' }}>
                                                <MdDeleteForever size={30} />
                                            </Box>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        {orders.length === 0 && (
                            <Tr>
                                <Td colSpan="4" textAlign="center" fontWeight="bold">
                                    No orders
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>
            {canDelete && selectedOrder && (
                <CancelDialog
                    reference={refCancel}
                    isOpen={isOpen}
                    onClose={onClose}
                    username={username}
                    selectedOrder={selectedOrder}
                />
            )}
        </>
    );
};

export default AskAndBidList;
