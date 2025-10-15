import { Badge, Box, Progress, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const ActiveJobItem = ({ job, isComplete, progress }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);
    const craftedPotion = fakeAssets.potions?.find(potion => potion?.asset === job?.creationAssetId);

    const successRate = Math.trunc(job?.successProbability * 10000) / 100;

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
                        🧪 {craftedPotion.name}
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
        </Box>
    );
};

export default ActiveJobItem;
