import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';

const InOutTransaction = ({ type }) => {
    const color = type === 'in' ? 'green' : 'blue.600';
    const msg = type === 'in' ? 'Received' : 'Sent';
    return (
        <Stack direction="row">
            <Text color={color}> {msg} </Text>
            {type === 'in' ? (
                <ArrowDownIcon fontSize="xl" fontWeight="bold" color={color} />
            ) : (
                <ArrowUpIcon fontSize="xl" color={color} />
            )}
        </Stack>
    );
};

export default InOutTransaction;
