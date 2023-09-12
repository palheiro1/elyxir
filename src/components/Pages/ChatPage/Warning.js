import { Box, Text } from '@chakra-ui/react';
import { TARASCACARDACCOUNT } from '../../../data/CONSTANTS';

const Warning = () => {
    const bgColor = 'rgba(59,67,151,0.5)';
    const borderColor = 'rgba(59,67,151,1)';

    return (
        <Box border="1px" rounded="md" p={2} bgColor={bgColor} borderColor={borderColor}>
            <Text textAlign="center" color="white">
                <strong>WARNING: Any user can send messages to other users.</strong>
                <br />
                Mythical Being’s official messages are sent only from the <strong>{TARASCACARDACCOUNT}</strong> account.
            </Text>
        </Box>
    );
};

export default Warning;
