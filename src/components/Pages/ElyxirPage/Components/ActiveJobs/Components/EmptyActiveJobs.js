import { Stack, Text } from '@chakra-ui/react';

const EmptyActiveJobs = () => (
    <Stack direction={'column'} spacing={3} py={8}>
        <Text fontSize="4xl" textAlign={'center'}>
            ⚗️
        </Text>
        <Text color="gray.500" textAlign="center" fontWeight="medium">
            No active crafting jobs
        </Text>
        <Text color="gray.400" textAlign="center" fontSize="sm">
            Start crafting potions to see progress here
        </Text>
    </Stack>
);

export default EmptyActiveJobs;
