import { Badge, Box, Divider, Progress, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBlock } from '../../../../../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../../../../../utils/blockchain';
import { formatSuccessRate } from '../../../../../../utils/elyxirUtils';
import {
    getDurationBlocks,
    getJobLifecycle,
    getJobProgress,
    getJobStatusLabel,
    getLifecycleCopy,
    getLifecycleTimeline,
    shouldShowCatastropheHeight,
} from '../../../../../../utils/elyxirLifecycle';
import JobLifecycleTimeline from '../../JobLifecycleTimeline';

/**
 * @name ActiveJobItem
 * @description Renders a visual representation of an active crafting job, showing progress, success rate, and remaining blocks until completion.
 * It dynamically updates based on blockchain height and marks the job as complete when the end height is reached.
 * @param {Object} job - The crafting job data, including `creationAssetId`, `flaskMultiplier`, `successProbability`, `startHeight`, and `endHeight`.
 * @param {boolean} isComplete - Indicates whether the crafting job has been completed.
 * @param {number} progress - The completion percentage of the job, between 0 and 100.
 * @returns {JSX.Element} A styled box displaying the job’s potion name, success rate, progress bar, and remaining blocks indicator.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const ActiveJobItem = ({ job, isComplete, progress, currentHeight }) => {
    const [jobBlock, setJobBlock] = useState(null);

    const { items } = useSelector(state => state.items);
    const { prev_height } = useSelector(state => state.blockchain);

    const potions = items.filter(item => item.type === 'potion');
    const craftedPotion = potions?.find(potion => potion?.asset === job?.creationAssetId);

    const height = currentHeight ?? prev_height;
    const jobProgress = getJobProgress(job, height);
    const durationBlocks = getDurationBlocks(job);
    const lifecycle = getJobLifecycle(job);
    const statusLabel = getJobStatusLabel(job, height);
    const timeline = getLifecycleTimeline(job, height);
    const successRate = Number.isFinite(Number(job?.successProbability))
        ? `${formatSuccessRate(job?.successProbability)}%`
        : '-';

    useEffect(() => {
        const getJobBlock = async () => {
            const block = await getBlock(job.startHeight);
            if (!block) return;
            setJobBlock(block);
        };
        getJobBlock();
    }, [job.startHeight]);

    return (
        <Box
            p={4}
            border="1px solid"
            borderColor={isComplete ? 'green.200' : 'orange.200'}
            borderRadius="md"
            w="full"
            bg={isComplete ? 'green.50' : 'orange.50'}>
            <Stack direction={'column'} spacing={3}>
                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={2}>
                    <Stack direction={'row'} align="center" flexWrap="wrap">
                        <Text fontWeight="bold" color={isComplete ? 'green.700' : 'orange.700'}>
                            {craftedPotion?.description || job?.creationAssetId}
                        </Text>
                        <Badge colorScheme="purple" variant="subtle">
                            x{job.flaskMultiplier}
                        </Badge>
                        <Badge colorScheme={lifecycle === 'new' ? 'orange' : 'gray'} variant="subtle">
                            {lifecycle === 'new' ? 'Escrow lifecycle' : 'Legacy lifecycle'}
                        </Badge>
                    </Stack>
                    <Badge colorScheme={isComplete ? 'green' : 'orange'} fontSize="xs" px={2} alignSelf="flex-start">
                        {statusLabel}
                    </Badge>
                </Stack>

                <Text fontSize="sm" color="gray.700">
                    {getLifecycleCopy(job)}
                </Text>

                <SimpleGrid columns={{ base: 2, md: 5 }} spacing={3}>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Start height
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {job.startHeight ?? '-'}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            End height
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {job.endHeight ?? '-'}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Current block
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {height ?? '-'}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Duration
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {durationBlocks} blocks
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Success rate
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {successRate}
                        </Text>
                    </Box>
                </SimpleGrid>

                {shouldShowCatastropheHeight(job) && (
                    <Text fontSize="sm" color="red.600" fontWeight="bold">
                        Catastrophe height: {job.catastropheHeight}
                    </Text>
                )}

                <Box>
                    <Stack direction="row" justify="space-between" mb={1}>
                        <Text fontSize="xs" color="gray.600">
                            {jobProgress.completedBlocks}/{durationBlocks} blocks
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                            {jobProgress.blocksLeft} blocks left
                        </Text>
                    </Stack>
                    <Progress
                        value={progress}
                        colorScheme={isComplete ? 'green' : 'orange'}
                        size="sm"
                        borderRadius="md"
                        bg="gray.100"
                    />
                </Box>

                <Divider />
                <JobLifecycleTimeline steps={timeline} />

                <Text fontSize="xs" color="gray.500">
                    Started at: {jobBlock?.timestamp ? formatTimeStamp(jobBlock.timestamp) : '-'}
                </Text>
            </Stack>
        </Box>
    );
};

export default ActiveJobItem;
