import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBlock } from '../../../../../../services/Ardor/ardorInterface';
import { formatTimeStamp } from '../../../../../../utils/blockchain';

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

    const potions = items.filter(item => item.type === 'potion');
    const craftedPotion = potions?.find(potion => potion?.asset === job?.creationAssetId);

    const successRate = Math.trunc(job?.successProbability * 10000) / 100;

    useEffect(() => {
        const getJobBlock = async () => {
            const block = await getBlock(job?.startHeight);
            if (!block) return;
            setJobBlock(block);
        };
        getJobBlock();
    });

    return (
        <Box
            key={job?.jobId}
            p={3}
            border="1px solid"
            borderColor={job?.isSuccess ? 'green.200' : 'red.200'}
            borderRadius="md"
            w="full"
            bg={job?.success ? 'green.50' : 'red.50'}>
            <Stack direction={'row'} justify="space-between">
                <Stack direction={'column'} align="start" spacing={1}>
                    <Stack direction={'row'}>
                        <Text fontWeight="bold" fontSize="sm" color={job?.isSuccess ? 'green.700' : 'red.700'}>
                            🧪 {craftedPotion?.description}
                        </Text>
                        <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                            x{job?.flaskMultiplier}
                        </Badge>
                    </Stack>
                    <Text fontSize="xs" color="gray.600">
                        {job?.isSuccess
                            ? `✅ Success: Crafted ${job?.flaskMultiplier} potion${job?.flaskMultiplier > 1 ? 's' : ''}`
                            : `❌ Failed`}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        📊 ({successRate}% success rate)
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        Started at: {formatTimeStamp(jobBlock?.timestamp)}
                    </Text>
                </Stack>
                <Stack direction={'column'} align="end" spacing={0}>
                    <Badge colorScheme={job?.isSuccess ? 'green' : 'red'} fontSize="xs">
                        {job?.isSuccess ? 'COMPLETED' : 'FAILED'}
                    </Badge>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CompletedJobItem;
