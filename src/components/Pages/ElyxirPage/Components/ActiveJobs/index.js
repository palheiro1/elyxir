import { Box, Heading, Stack } from '@chakra-ui/react';
import ActiveJobItem from './Components/ActiveJobItem';
import EmptyActiveJobs from './Components/EmptyActiveJobs';

const ActiveJobs = ({ activeJobs, sectionBg, handleCompleteJob, isLoading }) => {
    return (
        <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
            <Heading size="md" mb={4} color="orange.500">
                Active Crafting Jobs
            </Heading>
            {activeJobs.length > 0 ? (
                <Stack direction={'column'} spacing={4}>
                    {activeJobs.map(job => {
                        // Calculate time-based values using block system
                        const currentTime = Date.now();
                        const startTime = new Date(job.createdAt).getTime();
                        const estimatedDuration = job.durationBlocks * 60 * 1000; // Assuming 1 minute per block
                        const completionTime = startTime + estimatedDuration;
                        const timeLeft = Math.max(0, completionTime - currentTime);
                        const totalTime = estimatedDuration;
                        const progress = totalTime > 0 ? Math.min(100, ((totalTime - timeLeft) / totalTime) * 100) : 0;
                        const isComplete = timeLeft <= 0;

                        return (
                            <ActiveJobItem
                                key={job.jobId}
                                job={job}
                                isLoading={isLoading}
                                isComplete={isComplete}
                                progress={progress}
                                handleCompleteJob={handleCompleteJob}
                            />
                        );
                    })}
                </Stack>
            ) : (
                <EmptyActiveJobs />
            )}
        </Box>
    );
};

export default ActiveJobs;
