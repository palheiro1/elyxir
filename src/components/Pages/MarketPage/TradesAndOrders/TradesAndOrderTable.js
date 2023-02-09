import { Table, TableContainer, Tbody, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';
import { getAsset } from '../../../../utils/cardsUtils';
import { getTxTimestamp } from '../../../../utils/txUtils';
import TradesOrOrderItem from './TradesOrOrderItem';

/**
 * @name TradesAndOrderTable
 * @description Component to show the trades and orders of a user - TABLE
 * @param {String} account - Account of the user
 * @param {Array} trades - Array with the trades of the user
 * @param {Array} cards - Array with the cards data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const TradesAndOrderTable = ({ account, trades, cards }) => {
    const imSeller = trade => {
        return trade.sellerRS === account;
    };

    const bgHeadColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    return (
        <TableContainer
            mt={4}
            border="1px"
            rounded="lg"
            boxShadow="inner"
            borderColor={bgHeadColor}
            bg="blackAlpha"
            shadow="dark-lg">
            <Table>
                <Thead>
                    <Tr>
                        <Th />
                        <Th>Title</Th>
                        <Th>Amount</Th>
                        <Th>Price</Th>
                        <Th>Date and Time</Th>
                        <Th>Seller/Buyer</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {trades.map((trade, index) => {
                        const card = getAsset(trade.asset, cards);
                        if (card === undefined && trade.name !== 'GEM') return null;
                        const type = imSeller(trade) ? 'out' : 'in';
                        const account = imSeller(trade) ? trade.buyerRS : trade.sellerRS;
                        const eb = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
                        const timestamp = getTxTimestamp(trade, eb, false);
                        const amount = trade.name === 'GEM' ? trade.quantityQNT / NQTDIVIDER : trade.quantityQNT;

                        return (
                            <TradesOrOrderItem
                                key={index}
                                name={trade.name}
                                type={type}
                                sellerOrBuyer={account}
                                price={trade.priceNQTPerShare / NQTDIVIDER}
                                amount={amount}
                                date={timestamp}
                                card={card}
                            />
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default TradesAndOrderTable;
