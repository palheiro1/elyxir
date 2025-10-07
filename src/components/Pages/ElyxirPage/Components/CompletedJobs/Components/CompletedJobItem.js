import { Badge, Box, Stack, Text } from '@chakra-ui/react';

const CompletedJobItem = ({ job }) => {
    return (
        <Box
            key={job.jobId}
            p={3}
            border="1px solid"
            borderColor={job.success ? 'green.200' : 'red.200'}
            borderRadius="md"
            w="full"
            bg={job.success ? 'green.50' : 'red.50'}>
            <Stack direction={'row'} justify="space-between">
                <Stack direction={'column'} align="start" spacing={1}>
                    <Stack direction={'row'}>
                        <Text fontWeight="bold" fontSize="sm" color={job.success ? 'green.700' : 'red.700'}>
                            🧪 {job.potionName}
                        </Text>
                        <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                            x{job.flaskMultiplier}
                        </Badge>
                    </Stack>
                    <Text fontSize="xs" color="gray.600">
                        {job.success
                            ? `✅ Success: Crafted ${job.flaskMultiplier} potion${job.flaskMultiplier > 1 ? 's' : ''}`
                            : `❌ Failed (${Math.round(job.successChance || 80)}% success rate)`}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        ⛏️ {job.durationBlocks} blocks • 📊 {Math.round(job.successChance || 80)}% rate
                    </Text>
                </Stack>
                <Stack direction={'column'} align="end" spacing={0}>
                    <Badge colorScheme={job.success ? 'green' : 'red'} fontSize="xs">
                        {job.success ? 'COMPLETED' : 'FAILED'}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                        {new Date(job.completedAt || job.createdAt).toLocaleDateString()}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        {new Date(job.completedAt || job.createdAt).toLocaleTimeString()}
                    </Text>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CompletedJobItem;
