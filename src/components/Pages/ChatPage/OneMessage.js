import { Box, Button, Center, SimpleGrid, Text } from "@chakra-ui/react";

const OneMessage = ({ message }) => {
    const { message:textMsg , senderRS } = message;
    return (
        <Box bgColor="whiteAlpha.200" rounded="lg" py={2}>
            <SimpleGrid columns={3} spacing={4}>
                <Center>
                    <Text align="center">{senderRS}</Text>
                </Center>
                <Center>
                    <Text align="center">Last message 12 minutes ago ({textMsg})</Text>
                </Center>
                <Button variant="outline" mx={12}>
                    Click to decrypt conversation
                </Button>
            </SimpleGrid>
        </Box>
    );
};

export default OneMessage;
