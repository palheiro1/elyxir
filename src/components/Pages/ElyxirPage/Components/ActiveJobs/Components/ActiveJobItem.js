import { Badge, Box, Button, Progress, Stack, Text } from '@chakra-ui/react';

const ActiveJobItem = ({ job, isComplete, timeLeft, handleCompleteJob, progress, isLoading }) => {
    return (
        <Box
            p={4}
            border="1px solid"
            borderColor={isComplete ? 'green.200' : 'orange.200'}
            borderRadius="md"
            w="full"
            bg={isComplete ? 'green.50' : 'orange.50'}>
            <Stack direction={'column'} justify="space-between" mb={2}>
                <Stack direction={'row'}>
                    <Text fontWeight="bold" color={isComplete ? 'green.700' : 'orange.700'}>
                        🧪 {job.potionName}
                    </Text>
                    <Badge colorScheme="purple" variant="subtle">
                        x{job.flaskMultiplier}
                    </Badge>
                </Stack>
                <Badge colorScheme={isComplete ? 'green' : 'orange'} fontSize="xs" px={2}>
                    {isComplete ? '✅ Ready!' : `⏱️ ${Math.ceil(timeLeft / 60000)} min left`}
                </Badge>
            </Stack>

            <Stack direction={'row'} spacing={4} mb={2}>
                <Text fontSize="sm" color="gray.600">
                    📊 Success Rate: <strong>{Math.round(job.successChance || 80)}%</strong>
                </Text>
                <Text fontSize="sm" color="gray.600">
                    ⛏️ Duration: <strong>{job.durationBlocks} blocks</strong>
                </Text>
            </Stack>

            <Progress
                value={progress}
                colorScheme={isComplete ? 'green' : 'orange'}
                size="sm"
                mb={3}
                borderRadius="md"
                bg="gray.100"
            />

            <Stack direction={'row'} justify="space-between" align="center">
                <Stack direction={'column'} align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">
                        🕐 Started: {new Date(job.createdAt).toLocaleTimeString()}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        🔗 Blocks: {job.startBlock} → {job.endBlock}
                    </Text>
                </Stack>
                {isComplete && (
                    <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleCompleteJob(job.jobId)}
                        isLoading={isLoading}
                        leftIcon={<span>🎯</span>}>
                        Complete Crafting
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ActiveJobItem;
