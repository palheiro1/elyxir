import { Box, Stack } from '@chakra-ui/react';
import OneMessage from './OneMessage';

const Messages = ({ messages = [], username, account }) => {
    return (
        <Box>
            <Stack w="100%" rounded="md" p={4} my={4} shadow="md" bgColor="whiteAlpha.50">
                {messages.map((message, index) => (
                    <OneMessage key={index} message={message} username={username} account={account} />
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;
