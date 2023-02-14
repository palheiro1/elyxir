import { Box, Button, Center, SimpleGrid, Stack, Text } from '@chakra-ui/react';

const Messages = ({ messages = [] }) => {
    return (
        <Box>
            <Text fontSize="xs">
                Total unread: <b>{messages.length}</b>
            </Text>
            <Stack w="100%" rounded="md" p={4} my={4} shadow="md" bgColor="whiteAlpha.50">
                <Box bgColor="whiteAlpha.200" rounded="lg" py={2}>
                    <SimpleGrid columns={3} spacing={4}>
                        <Center>
                            <Text align="center">ARDOR-5NCL-DRBZ-XBWF-DDN5T</Text>
                        </Center>
                        <Center>
                            <Text align="center">Last message 12 minutes ago</Text>
                        </Center>
                        <Button variant="outline" mx={12}>Click to decrypt conversation</Button>
                    </SimpleGrid>
                </Box>
                <Box bgColor="whiteAlpha.200" rounded="lg" py={2}>
                    <SimpleGrid columns={3} spacing={4}>
                        <Center>
                            <Text align="center">ARDOR-5NCL-DRBZ-XBWF-DDN5T</Text>
                        </Center>
                        <Center>
                            <Text align="center">Last message 12 minutes ago</Text>
                        </Center>
                        <Button variant="outline" mx={12}>Click to decrypt conversation</Button>
                    </SimpleGrid>
                </Box>
                <Box bgColor="whiteAlpha.200" rounded="lg" py={2}>
                    <SimpleGrid columns={3} spacing={4}>
                        <Center>
                            <Text align="center">ARDOR-5NCL-DRBZ-XBWF-DDN5T</Text>
                        </Center>
                        <Center>
                            <Text align="center">Last message 12 minutes ago</Text>
                        </Center>
                        <Button variant="outline" mx={12}>Click to decrypt conversation</Button>
                    </SimpleGrid>
                </Box>
                {messages.map((message, index) => (
                    <Box key={index}>{message}</Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Messages;
