import { Badge, Box, Divider, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBlock } from '../../../../../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../../../../../utils/blockchain';
import {
    getDurationBlocks,
    getJobLifecycle,
    getJobOutcome,
    getJobStatusLabel,
    getLifecycleTimeline,
    getOutcomeCopy,
    shouldShowCatastropheHeight,
} from '../../../../../../utils/elyxirLifecycle';
import JobLifecycleTimeline from '../../JobLifecycleTimeline';

/**
 * @name CompletedJobItem
 * @description Displays a single completed crafting job, showing the crafted potion, success status, flask multiplier, and actual success probability.
 * Provides visual feedback with color-coded indicators for success or failure.
 * @param {Object} job - The completed job object containing `creationAssetId`, `flaskMultiplier`, `isSuccess`, and `successProbability`.
 * @returns {JSX.Element} A styled box summarizing the completed job’s outcome, including potion name, quantity, success/failure status, and success rate.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CompletedJobItem = ({ job }) => {
    const [jobBlock, setJobBlock] = useState(null);
    const { items } = useSelector(state => state.items);
    const { prev_height } = useSelector(state => state.blockchain);

    const potions = items.filter(item => item.type === 'potion');
    const craftedPotion = potions?.find(potion => potion?.asset === job?.creationAssetId);

    const successRate = Math.trunc(job?.successProbability * 10000) / 100;
    const lifecycle = getJobLifecycle(job);
    const outcome = getJobOutcome(job);
    const statusLabel = getJobStatusLabel(job, prev_height);
    const timeline = getLifecycleTimeline(job, prev_height);
    const durationBlocks = getDurationBlocks(job);
    const colorScheme = outcome === 'success' ? 'green' : outcome === 'catastrophic' ? 'red' : 'orange';

    useEffect(() => {
        const getJobBlock = async () => {
            const block = await getBlock(job?.startHeight);
            if (!block) return;
            setJobBlock(block);
        };
        getJobBlock();
    }, [job?.startHeight]);

    return (
        <Box
            key={job?.jobId}
            p={4}
            border="1px solid"
            borderColor={`${colorScheme}.200`}
            borderRadius="md"
            w="full"
            bg={`${colorScheme}.50`}>
            <Stack direction={'column'} spacing={3}>
                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
                    <Stack direction={'row'} align="center" flexWrap="wrap">
                        <Text fontWeight="bold" fontSize="sm" color={`${colorScheme}.700`}>
                            {craftedPotion?.description || job?.creationAssetId}
                        </Text>
                        <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                            x{job?.flaskMultiplier}
                        </Badge>
                        <Badge colorScheme={lifecycle === 'new' ? 'orange' : 'gray'} variant="subtle" fontSize="xs">
                            {lifecycle === 'new' ? 'Escrow lifecycle' : 'Legacy lifecycle'}
                        </Badge>
                    </Stack>
                    <Badge colorScheme={colorScheme} fontSize="xs" alignSelf="flex-start">
                        {statusLabel}
                    </Badge>
                </Stack>

                <Text fontSize="sm" color={`${colorScheme}.700`} fontWeight="bold">
                    {getOutcomeCopy(job)}
                </Text>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
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
                            {Number.isFinite(successRate) ? `${successRate}%` : '-'}
                        </Text>
                    </Box>
                </SimpleGrid>

                {shouldShowCatastropheHeight(job) && (
                    <Text fontSize="sm" color="red.600" fontWeight="bold">
                        Catastrophe height: {job.catastropheHeight}
                    </Text>
                )}

                <Divider />
                <JobLifecycleTimeline steps={timeline} />

                <Text fontSize="xs" color="gray.500">
                    Started at: {jobBlock?.timestamp ? formatTimeStamp(jobBlock.timestamp) : '-'}
                </Text>
            </Stack>
        </Box>
    );
};

export default CompletedJobItem;
