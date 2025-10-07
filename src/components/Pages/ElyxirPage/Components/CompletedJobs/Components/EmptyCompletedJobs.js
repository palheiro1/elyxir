import { Stack, Text } from '@chakra-ui/react';

const EmptyCompletedJobs = () => (
    <Stack direction={'column'} spacing={3} py={8}>
        <Text fontSize="4xl" textAlign="center">
            📜
        </Text>
        <Text color="gray.500" textAlign="center" fontWeight="medium">
            No completed jobs yet
        </Text>
        <Text color="gray.400" textAlign="center" fontSize="sm">
            Your crafting history will appear here
        </Text>
    </Stack>
);

export default EmptyCompletedJobs;
