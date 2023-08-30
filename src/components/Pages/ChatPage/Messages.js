import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import OneSenderMessages from './OneSenderMessages';

const Messages = ({ messages = {}, username, account }) => {
    const bgColor = useColorModeValue('blackAlpha.100', 'rgba(59,67,151,0.35)');
    const borderColor = useColorModeValue('blackAlpha.300', 'rgba(59,67,151,1)');
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
                {Object.keys(messages).length === 0 && (
                    <Box>
                        <Text align="center">You don't have any messages yet</Text>
                    </Box>
                )}
                {Object.keys(messages).map((key, index) => (
                    <OneSenderMessages
                        key={index}
                        sender={messages[key][0].senderRS}
                        messages={messages[key]}
                        username={username}
                        account={account}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;
