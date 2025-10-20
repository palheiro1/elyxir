import { Stack, Text } from '@chakra-ui/react';

/**
 * @name EmptyCompletedJobs
 * @description Displays an empty state message when there are no completed crafting jobs.
 * Provides a visual cue and explanatory text to indicate that the user's crafting history is currently empty.
 * @returns {JSX.Element} A centered stack with an emoji, title, and subtitle informing the user that no completed jobs exist yet.
 * author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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
