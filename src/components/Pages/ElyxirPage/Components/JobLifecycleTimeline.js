import { Badge, Box, Stack, Text } from '@chakra-ui/react';

const STATE_COLOR = {
    complete: 'green',
    current: 'orange',
    pending: 'gray',
};

const STATE_LABEL = {
    complete: 'Done',
    current: 'Now',
    pending: 'Next',
};

const JobLifecycleTimeline = ({ steps = [] }) => {
    if (!steps.length) return null;

    return (
        <Stack spacing={2} align="stretch">
            {steps.map((step, index) => {
                const colorScheme = STATE_COLOR[step.state] || 'gray';
                return (
                    <Box key={`${step.label}-${index}`} borderLeft="3px solid" borderColor={`${colorScheme}.300`} pl={3}>
                        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={1}>
                            <Text fontSize="sm" fontWeight="bold">
                                {step.label}
                            </Text>
                            <Badge alignSelf={{ base: 'flex-start', md: 'center' }} colorScheme={colorScheme}>
                                {STATE_LABEL[step.state] || step.state}
                            </Badge>
                        </Stack>
                        <Text fontSize="xs" color="gray.600">
                            {step.description}
                        </Text>
                    </Box>
                );
            })}
        </Stack>
    );
};

export default JobLifecycleTimeline;
