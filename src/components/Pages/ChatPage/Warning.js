import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Warning = () => {
    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    return (
        <Box border="1px" rounded="md" p={2} bgColor={bgColor} borderColor={borderColor}>
            <Text textAlign="center">
                <strong>WARNING: Any user can send messages to other users.</strong>
                <br />
                Mythical Being’s official messages are sent only from the <strong>
                    ARDOR-5NCL-DRBZ-XBWF-DDN5T
                </strong>{' '}
                account.
            </Text>
        </Box>
    );
};

export default Warning;
