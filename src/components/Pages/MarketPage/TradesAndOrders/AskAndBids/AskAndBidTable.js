import { Table, TableContainer, Tbody, Text, Tfoot, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../../data/CONSTANTS';
import { getAsset } from '../../../../../utils/cardsUtils';
import AskOrBidItem from './AskOrBidItem';

const AskBidTable = ({
    type,
    onlyOneAsset,
    orders,
    cards,
    onOpen,
    setSelectedOrder,
    canDelete,
    isLeft = false,
    newStyle = false,
    textColor = 'black',
}) => {
    const bgHeadColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const borderLeft = isLeft ? 'lg' : 'none';
    const borderRight = !isLeft ? 'lg' : 'none';
    const isAsk = type === 'Asks';

    return (
        <TableContainer
            rounded="lg"
            bg="blackAlpha"
            maxH={newStyle ? '20rem' : '60rem'}
            overflowY={'auto'}
            borderColor={bgHeadColor}
            borderLeftRadius={!newStyle ? borderLeft : 'none'}
            borderRightRadius={!newStyle ? borderRight : 'none'}>
            {(isAsk || newStyle === false) && (
                <Text
                    textAlign="center"
                    p={4}
                    fontSize="lg"
                    borderBottom="2px"
                    borderColor={'#3b6497'}
                    color={newStyle ? (isAsk ? '#eb6473' : '#29a992') : textColor}>
                    {type}
                </Text>
            )}

            <Table variant="simple" color={newStyle ? (isAsk ? '#eb6473' : '#29a992') : textColor}>
                {!newStyle && (
                    <Thead>
                        <Tr>
                            {!onlyOneAsset && (
                                <Th textAlign="center" color={'#3b6497'}>
                                    Asset
                                </Th>
                            )}
                            <Th textAlign="center" color={'#3b6497'}>
                                Ignis
                            </Th>
                            <Th textAlign="center" color={'#3b6497'}>
                                Amount
                            </Th>
                        </Tr>
                    </Thead>
                )}
                <Tbody>
                    {orders.map(order => {
                        const _asset = onlyOneAsset ? order.asset : getAsset(order.asset, cards);
                        if (!_asset) return null;
                        return (
                            <AskOrBidItem
                                key={order.orderFullHash}
                                order={order.order}
                                asset={_asset}
                                ignis={order.priceNQTPerShare / NQTDIVIDER}
                                amount={order.quantityQNT}
                                isAsk={isAsk}
                                onOpen={onOpen}
                                setSelectedOrder={setSelectedOrder}
                                onlyOneAsset={onlyOneAsset}
                                canDelete={canDelete}
                            />
                        );
                    })}
                </Tbody>
                {newStyle && isAsk && (
                    <Tfoot bgColor="whiteAlpha.400">
                        <Tr>
                            {!onlyOneAsset && <Th textAlign="center">Asset</Th>}
                            <Th textAlign="center">Ignis</Th>
                            <Th textAlign="center">Amount</Th>
                        </Tr>
                    </Tfoot>
                )}
            </Table>

            {!isAsk && newStyle && (
                <Text textAlign="center" p={4} fontSize="lg" borderTop="1px" color={isAsk ? '#eb6473' : '#29a992'}>
                    {type}
                </Text>
            )}
        </TableContainer>
    );
};

export default AskBidTable;

/*
__css={{
                    '&::-webkit-scrollbar': {
                        width: '2px',
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        width: '2px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '1px solid slategrey',
                        borderRadius: '24px',
                    },
                }}
                */
