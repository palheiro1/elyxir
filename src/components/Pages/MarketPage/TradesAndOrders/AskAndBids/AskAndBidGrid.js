import {
    SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import CancelDialog from '../../../../Modals/TradeDialog/CancelDialog/CancelDialog';
import AskOrBidItem from './AskOrBidItem';

/**
 * @name AskAndBidGrid
 * @description Grid for the asks and bids
 * @param {Array} cards - Array of cards
 * @param {Array} askOrders - Array of ask orders
 * @param {Array} bidOrders - Array of bid orders
 * @param {Boolean} onlyOneAsset - Only show text -> One asset
 * @param {String} username - Username
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const AskAndBidGrid = ({ cards, askOrders, bidOrders, onlyOneAsset = false, username, canDelete }) => {
    const [selectedOrder, setSelectedOrder] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const refCancel = useRef();

    const bgTitleColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const bgHeadColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 2 }} mt={2} shadow="lg">
                <TableContainer
                    mt={4}
                    border="2px"
                    borderColor={borderColor}
                    borderLeftRadius="lg"
                    shadow="inner"
                    boxShadow="md">
                    <Text textAlign="center" p={4} fontSize="lg" borderBottom="1px" bgColor={bgTitleColor}>
                        Asks
                    </Text>

                    <Table variant="simple">
                        <Thead backgroundColor={bgHeadColor}>
                            <Tr>
                                {!onlyOneAsset && <Th textAlign="center">Asset</Th>}
                                <Th textAlign="center">Ignis</Th>
                                <Th textAlign="center">Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {askOrders.map(order => {
                                const _asset = onlyOneAsset ? order.asset : getAsset(order.asset, cards);
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
                                        onlyOneAsset={onlyOneAsset}
                                        canDelete={canDelete}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                <TableContainer
                    mt={4}
                    border="2px"
                    borderColor={borderColor}
                    borderRightRadius="lg"
                    shadow="inner"
                    boxShadow="md">
                    <Text textAlign="center" p={4} fontSize="lg" borderBottom="1px" bgColor={bgTitleColor}>
                        Bids
                    </Text>
                    <Table variant="simple">
                        <Thead backgroundColor={bgHeadColor}>
                            <Tr>
                                {!onlyOneAsset && <Th textAlign="center">Asset</Th>}
                                <Th textAlign="center">Ignis</Th>
                                <Th textAlign="center">Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bidOrders.map(order => {
                                const _asset = onlyOneAsset ? order.asset : getAsset(order.asset, cards);
                                return (
                                    <AskOrBidItem
                                        key={order.orderFullHash}
                                        order={order.order}
                                        asset={_asset}
                                        ignis={Number(order.priceNQTPerShare / NQTDIVIDER)}
                                        amount={order.quantityQNT}
                                        onOpen={onOpen}
                                        setSelectedOrder={setSelectedOrder}
                                        onlyOneAsset={onlyOneAsset}
                                        canDelete={canDelete}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </SimpleGrid>
            <CancelDialog
                reference={refCancel}
                isOpen={isOpen}
                onClose={onClose}
                username={username}
                selectedOrder={selectedOrder}
            />
        </>
    );
};

export default AskAndBidGrid;
