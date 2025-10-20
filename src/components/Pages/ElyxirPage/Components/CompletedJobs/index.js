import { Box, Heading, Stack } from '@chakra-ui/react';
import EmptyCompletedJobs from './Components/EmptyCompletedJobs';
import CompletedJobItem from './Components/CompletedJobItem';

/**
 * @name CompletedJobs
 * @description Displays a list of recently completed jobs with a scrollable container.
 * @param {Array} completedJobs - Array of completed job objects.
 * @param {string} sectionBg - Background color of the section.
 * @returns {JSX.Element} A scrollable list of completed jobs or an empty state.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const CompletedJobs = ({ completedJobs, sectionBg }) => {
    return (
        <Box
            bg={sectionBg}
            p={6}
            pt={0}
            borderRadius="lg"
            mb={8}
            maxH="400px"
            overflowY="auto"
            position="relative"
            className="custom-scrollbar">
            <Heading size="md" mb={4} color="green.500" position="sticky" top={0} bg={sectionBg} zIndex={1} py={2}>
                Recent Completed Jobs
            </Heading>

            {completedJobs?.length > 0 ? (
                <Stack direction="column" spacing={3}>
                    {completedJobs.map(job => (
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
