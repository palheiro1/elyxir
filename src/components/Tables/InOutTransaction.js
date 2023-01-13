import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';

const InOutTransaction = ({ type }) => {
    const color = type === 'in' ? 'green' : 'blue.600';
    
    let msg = '';
    if(type === 'in') {
        msg = 'Received';
    } else if(type === 'out') {
        msg = 'Sent';
    } else if(type === 'placed') {
        msg = 'Placed';
    }

    return (
        <Stack direction="row">
            <Text color={color}> {msg} </Text>
            {type === 'in' && (
                <ArrowDownIcon fontSize="xl" fontWeight="bold" color={color} />
            )}
            {type === 'out' && (
                <ArrowUpIcon fontSize="xl" color={color} />
            )}
            {type === 'placed' && (
                <ArrowUpDownIcon fontSize="xl" color={color} />
            )}
        </Stack>
    );
};

export default InOutTransaction;
