import { Center, Spinner, Text } from "@chakra-ui/react";

const Loader = () => {
    return (
        <Center w="100%" textAlign="center" py={4} gap={4}>
            <Spinner size="md" />
            <Text>Loading</Text>
        </Center>
    );
};

export default Loader;
