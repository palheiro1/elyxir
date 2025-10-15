import { Box, Heading, Stack } from '@chakra-ui/react';
import ActiveJobItem from './Components/ActiveJobItem';
import EmptyActiveJobs from './Components/EmptyActiveJobs';
import { useSelector } from 'react-redux';

const ActiveJobs = ({ activeJobs, sectionBg, handleCompleteJob, isLoading }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    return (
        <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
            <Heading size="md" mb={4} color="orange.500">
                Active Crafting Jobs
            </Heading>
            {activeJobs.length > 0 ? (
                <Stack direction={'column'} spacing={4}>
                    {activeJobs.map(job => {
                        const currentHeight = prev_height;

                        const totalBlocks = job.endHeight - job.startHeight;
                        const completedBlocks = Math.max(0, currentHeight - job.startHeight);
                        const remainingBlocks = Math.max(0, job.endHeight - currentHeight);

                        // Si 1 bloque = 1 minuto
                        const totalTimeMs = totalBlocks * 60 * 1000;
                        const timeLeftMs = remainingBlocks * 60 * 1000;

                        // Cálculo de progreso y estado
                        const progress = totalBlocks > 0 ? Math.min(100, (completedBlocks / totalBlocks) * 100) : 0;
                        const isComplete = currentHeight >= job.endHeight;

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
