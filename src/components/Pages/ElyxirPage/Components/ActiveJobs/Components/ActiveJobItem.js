import { Badge, Box, Progress, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBlock } from '../../../../../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../../../../../utils/blockchain';

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
const ActiveJobItem = ({ job, isComplete, progress }) => {
    const [jobBlock, setJobBlock] = useState(null);

    const { items } = useSelector(state => state.items);
    const { prev_height } = useSelector(state => state.blockchain);

    const potions = items.filter(item => item.type === 'potion');
    const craftedPotion = potions?.find(potion => potion?.asset === job?.creationAssetId);

    const successRate = Math.trunc(job?.successProbability * 10000) / 100;

    useEffect(() => {
        const getJobBlock = async () => {
            const block = await getBlock(job.startHeight);
            if (!block) return;
            setJobBlock(block);
        };
        getJobBlock();
    });

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
                        🧪 {craftedPotion?.name}
                    </Text>
                    <Badge colorScheme="purple" variant="subtle">
                        x{job.flaskMultiplier}
                    </Badge>
                </Stack>
                <Badge colorScheme={isComplete ? 'green' : 'orange'} fontSize="xs" px={2}>
                    {isComplete ? '✅ Ready!' : `⏱️ Blocks left: ${job.endHeight - prev_height}`}
                </Badge>
            </Stack>
            <Stack direction={'row'} spacing={4} mb={2}>
                <Text fontSize="sm" color="gray.600">
                    📊 Success Rate: <strong>{successRate}%</strong>
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
            <Text fontSize="xs" color="gray.500">
                Started at: {formatTimeStamp(jobBlock?.timestamp)}
            </Text>
        </Box>
    );
};

export default ActiveJobItem;
