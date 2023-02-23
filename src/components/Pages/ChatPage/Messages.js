import { Box, Stack, useColorModeValue } from '@chakra-ui/react';
import OneSenderMessages from './OneSenderMessages';

const Messages = ({ messages = {}, username, account }) => {
    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    return (
        <Box>
            <Stack
                w="100%"
                rounded="md"
                p={4}
                my={4}
                spacing={3}
                shadow="md"
                border="1px"
                bgColor={bgColor}
                borderColor={borderColor}>
                {Object.keys(messages).map((key, index) => (
                    <OneSenderMessages key={index} sender={key} messages={messages[key]} username={username} account={account} />
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;