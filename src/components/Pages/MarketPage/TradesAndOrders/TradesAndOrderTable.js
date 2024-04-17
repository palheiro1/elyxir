import { Box, TableContainer } from '@chakra-ui/react';
import { Table } from '../../../ResponsiveTable/table';
import { Tbody } from '../../../ResponsiveTable/tbody';
import { Th } from '../../../ResponsiveTable/th';
import { Thead } from '../../../ResponsiveTable/thead';
import { Tr } from '../../../ResponsiveTable/tr';
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

    return (
        <Box maxW={"76vw"}>
            <TableContainer mt={4} bg="blackAlpha">
                <Table>
                    <Thead>
                        <Tr borderBottom={'2px solid #3b6497'} borderTop={'2px solid #3b6497'}>
                            <Th />
                            <Th color="#3b6497">Title</Th>
                            <Th color="#3b6497">Amount</Th>
                            <Th color="#3b6497">Price</Th>
                            <Th color="#3b6497">Date and Time</Th>
                            <Th color="#3b6497">Seller/Buyer</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {trades &&
                            trades.map((trade, index) => {
                                const card = getAsset(trade.asset, cards);
                                if (card === undefined && trade.name !== 'GEM') return null;

                                const type = imSeller(trade) ? 'out' : 'in';
                                const account = imSeller(trade) ? trade.buyerRS : trade.sellerRS;

                                const timestamp = getTxTimestamp(trade, new Date(Date.UTC(2018, 0, 1, 0, 0, 0)), false);

                                const { name, quantityQNT } = trade;
                                const amount =
                                    name === 'GEM' || name === 'wETH' ? quantityQNT / NQTDIVIDER : quantityQNT;

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
        </Box>
    );
};

export default TradesAndOrderTable;
