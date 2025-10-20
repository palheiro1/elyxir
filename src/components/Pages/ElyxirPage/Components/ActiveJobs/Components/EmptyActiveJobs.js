import { Stack, Text } from '@chakra-ui/react';

/**
 * @name EmptyActiveJobs
 * @description Displays an empty state message when there are no active crafting jobs available.
 * Encourages the user to start crafting potions by showing a friendly visual cue and explanatory text.
 * @returns {JSX.Element} A centered message stack with an emoji, title, and subtitle indicating no active jobs are present.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
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
