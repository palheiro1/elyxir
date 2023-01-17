import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';


/**
 * @name InOutTxMarket
 * @description Component to show the type of transaction
 * @param {String} type - Type of transaction
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const InOutTxMarket = ({ type }) => {

    const typeTx = type.toLowerCase();
    const color = typeTx === 'in' ? 'green' : 'blue.600';

    return typeTx === 'in' ? (
        <ArrowDownIcon fontSize="xl" fontWeight="bold" bgColor={color} rounded="full" />
    ) : (
        <ArrowUpIcon fontSize="xl" fontWeight="bold"  bgColor={color} rounded="full" />
    );
};

export default InOutTxMarket;
