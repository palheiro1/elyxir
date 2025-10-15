import { Badge, Box, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const CompletedJobItem = ({ job }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const craftedPotion = fakeAssets.potions?.find(potion => potion?.asset === job?.creationAssetId);

    const successRate = Math.trunc(job?.successProbability * 10000) / 100;

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
                            🧪 {craftedPotion.name}
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
