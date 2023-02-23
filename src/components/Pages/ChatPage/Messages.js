import { Box, Stack, useColorModeValue } from '@chakra-ui/react';
import OneMessage from './OneMessage';

const Messages = ({ messages = [], username, account }) => {
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
                {messages.map((message, index) => (
                    <OneMessage key={index} message={message} username={username} account={account} />
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;
