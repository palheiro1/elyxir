import { Box, Heading, Stack } from '@chakra-ui/react';
import EmptyCompletedJobs from './Components/EmptyCompletedJobs';
import CompletedJobItem from './Components/CompletedJobItem';

const CompletedJobs = ({ completedJobs, sectionBg }) => {
    return (
        <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
            <Heading size="md" mb={4} color="green.500">
                Recent Completed Jobs
            </Heading>
            {completedJobs.length > 0 ? (
                <Stack direction={'column'} spacing={3}>
                    {completedJobs.slice(-5).map(job => (
                        <CompletedJobItem key={job.jobId} job={job} />
                    ))}
                </Stack>
            ) : (
                <EmptyCompletedJobs />
            )}
        </Box>
    );
};
export default CompletedJobs;
