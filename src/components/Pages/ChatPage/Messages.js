import { Box, Stack, Text } from '@chakra-ui/react';
import OneMessage from './OneMessage';

const Messages = ({ messages = [] }) => {
    return (
        <Box>
            <Text fontSize="xs">
                Total unread: <b>{messages.length}</b>
            </Text>
            <Stack w="100%" rounded="md" p={4} my={4} shadow="md" bgColor="whiteAlpha.50">
                {messages.map((message, index) => (
                    <OneMessage key={index} message={message} />
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;
