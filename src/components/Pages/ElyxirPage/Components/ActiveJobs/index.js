import { Box, Heading, Stack } from '@chakra-ui/react';
import ActiveJobItem from './Components/ActiveJobItem';
import EmptyActiveJobs from './Components/EmptyActiveJobs';
import { useSelector } from 'react-redux';

/**
 * @name ActiveJobs
 * @description Displays a list of currently active crafting jobs with real-time progress tracking based on blockchain height.
 * If no active jobs are found, it shows an empty state component.
 * @param {Array} activeJobs - List of active crafting jobs. Each job must include `jobId`, `startHeight`, and `endHeight`.
 * @param {string} sectionBg - Background color for the section, used for both the container and sticky header.
 * @param {boolean} isLoading - Indicates whether job data or progress is currently loading.
 * @returns {JSX.Element} A scrollable list of active jobs or an empty state message if no jobs are available.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ActiveJobs = ({ activeJobs, sectionBg, isLoading }) => {
    const { prev_height } = useSelector(state => state.blockchain);
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
            <Heading size="md" mb={4} color="orange.500" position="sticky" top={0} bg={sectionBg} zIndex={1} py={2}>
                Active Crafting Jobs
            </Heading>
            {activeJobs.length > 0 ? (
                <Stack direction={'column'} spacing={4}>
                    {activeJobs.map(job => {
                        const currentHeight = prev_height;

                        const totalBlocks = job.endHeight - job.startHeight;
                        const completedBlocks = Math.max(0, currentHeight - job.startHeight);

                        const progress = totalBlocks > 0 ? Math.min(100, (completedBlocks / totalBlocks) * 100) : 0;
                        const isComplete = currentHeight >= job.endHeight;

                        return (
                            <ActiveJobItem
                                key={job.jobId}
                                job={job}
                                isLoading={isLoading}
                                isComplete={isComplete}
                                progress={progress}
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
