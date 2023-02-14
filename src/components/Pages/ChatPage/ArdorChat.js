import { Box, Button, Heading, Spacer, Stack } from '@chakra-ui/react';
import Messages from './Messages';
import Warning from './Warning';

const ArdorChat = () => {
    return (
        <Box>
            <Warning />
            <Stack direction={['column', 'row']} spacing={4} mt={4}>
                <Heading fontSize="md" mt={4}>
                    Unread messages
                </Heading>
                <Spacer />
                <Button size="sm">New message</Button>
            </Stack>
            <Messages />
        </Box>
    );
};

export default ArdorChat;
