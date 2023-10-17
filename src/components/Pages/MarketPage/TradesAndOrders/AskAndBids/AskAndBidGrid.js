import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import CancelDialog from '../../../../Modals/TradeDialog/CancelDialog/CancelDialog';
import AskBidTable from './AskAndBidTable';

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
const AskAndBidGrid = ({ cards, askOrders, bidOrders, onlyOneAsset = false, username, canDelete, setSelectedItem, columns = 2, textColor }) => {
    const [selectedOrder, setSelectedOrder] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const refCancel = useRef();

    useEffect(() => {
        const checkSelectedOrder = () => {
            if (setSelectedItem && selectedOrder) {
                setSelectedItem(selectedOrder);
            }
        };
        checkSelectedOrder();
    }, [selectedOrder, setSelectedItem]);

    return (
        <>
            <SimpleGrid columns={{ base: 1, lg: columns }} mt={2}>
                <AskBidTable
                    type={'Asks'}
                    onlyOneAsset={onlyOneAsset}
                    orders={askOrders}
                    cards={cards}
                    onOpen={onOpen}
                    setSelectedOrder={setSelectedOrder}
                    canDelete={canDelete}
                    isLeft={true}
                    newStyle = {columns === 1}
                    textColor={columns === 1}
                />
                <AskBidTable
                    type={'Bids'}
                    onlyOneAsset={onlyOneAsset}
                    orders={bidOrders}
                    cards={cards}
                    onOpen={onOpen}
                    setSelectedOrder={setSelectedOrder}
                    canDelete={canDelete}
                    newStyle = {columns === 1}
                    textColor={textColor}
                />
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
