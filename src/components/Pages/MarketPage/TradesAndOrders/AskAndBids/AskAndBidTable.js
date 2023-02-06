import { Table, TableContainer, Tbody, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import AskOrBidItem from './AskOrBidItem';

const AskBidTable = ({ type, onlyOneAsset, orders, cards, onOpen, setSelectedOrder, canDelete, isLeft = false }) => {
    const bgTitleColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const bgHeadColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    const borderLeft = isLeft ? 'lg' : 'none';
    const borderRight = !isLeft ? 'lg' : 'none';

    return (
        <TableContainer
            mt={4}
            border="2px"
            borderColor={borderColor}
            borderLeftRadius={borderLeft}
            borderRightRadius={borderRight}
            shadow="inner"
            boxShadow="md">
            <Text textAlign="center" p={4} fontSize="lg" borderBottom="1px" bgColor={bgTitleColor}>
                {type}
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
                    {orders.map(order => {
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
    );
};

export default AskBidTable;
