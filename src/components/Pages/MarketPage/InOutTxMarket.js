import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

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
