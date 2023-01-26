import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';

const InOutTransaction = ({ type, style = 2 }) => {
    if (style === 1) {
        const color = type === 'in' ? 'green' : 'blue.600';

        let msg = '';
        if (type === 'in') {
            msg = 'Received';
        } else if (type === 'out') {
            msg = 'Sent';
        } else if (type === 'placed') {
            msg = 'Placed';
        }

        return (
            <Stack direction="row">
                <Text color={color}> {msg} </Text>
                {type === 'in' && <ArrowDownIcon fontSize="xl" fontWeight="bolder" color={color} />}
                {type === 'out' && <ArrowUpIcon fontSize="xl" fontWeight="bolder" color={color} />}
                {type === 'placed' && <ArrowUpDownIcon fontSize="xl" fontWeight="bolder" color={color} />}
            </Stack>
        );
    } else {
        const typeTx = type.toLowerCase();
        let color;

        let icon;
        if (typeTx === 'in') {
            color = 'green';
            icon = <ArrowDownIcon fontSize="2xl" border="1px" borderColor="whiteAlpha.400" bgColor={color} rounded="full" />;
        } else if (typeTx === 'out') {
            color = 'blue.600';
            icon = <ArrowUpIcon fontSize="2xl" border="1px" borderColor="whiteAlpha.400" bgColor={color} rounded="full" />;
        } else if (typeTx === 'placed') {
            color = 'orange.600';
            icon = <ArrowUpDownIcon fontSize="2xl" border="1px" borderColor="whiteAlpha.400" bgColor={color} rounded="full" />;
        }

        return icon;
    }
};

export default InOutTransaction;
