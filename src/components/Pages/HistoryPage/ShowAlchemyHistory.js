import { Badge, Box, Button, Center, Divider, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
    getDurationBlocks,
    getJobStatusLabel,
    getLifecycleCopy,
    getLifecycleTimeline,
    getOutcomeCopy,
} from '../../../utils/elyxirLifecycle';
import JobLifecycleTimeline from '../ElyxirPage/Components/JobLifecycleTimeline';

const STATUS_COLOR = {
    STARTED: 'orange',
    FINALIZED: 'green',
    EXPLODED: 'red',
    CATASTROPHIC: 'red',
    ALREADY_SETTLED: 'green',
    REJECTED: 'red',
    ASSETS_SENT: 'blue',
    SETTLEMENT: 'green',
};

const formatTxDate = (timestamp, epochBeginning) => {
    if (!timestamp || !epochBeginning) return '-';
    return new Date(epochBeginning.getTime() + Number(timestamp) * 1000).toLocaleString();
};

const getItemName = (assetId, items) => {
    const item = items.find(candidate => candidate.asset === assetId);
    return item?.description || item?.name || assetId || '-';
};

const getEventTitle = (event, items) => {
    const assetId = event.job?.creationAssetId || event.parameter?.creationAssetId || event.movements?.[0]?.assetId;
    const itemName = getItemName(assetId, items);

    if (event.kind === 'job') return `Alchemy job: ${itemName}`;
    if (event.kind === 'create') return `Alchemy create request: ${itemName}`;
    return `Alchemy asset movement: ${itemName}`;
};

const getEventDescription = event => {
    if (event.job) {
        if (event.job.status === 'STARTED') return getLifecycleCopy(event.job);
        return getOutcomeCopy(event.job);
    }

    if (event.status === 'ALREADY_SETTLED') {
        return 'No active job was found for this create request, but settlement movements exist in the transaction logs.';
    }

    if (event.status === 'REJECTED') {
        return 'No active job or potion pending was found for this create request.';
    }

    return 'Unlinked Omno asset movement. Related job data was not available for this transaction.';
};

const getCreateOnlyTimeline = event => {
    const hasMovements = event.movements?.length > 0;
    const settled = event.status === 'ALREADY_SETTLED';

    return [
        {
            label: 'Submitted',
            description: 'Create request confirmed on-chain.',
            state: 'complete',
        },
        {
            label: hasMovements ? 'Asset movements detected' : 'No linked asset movements',
            description: hasMovements
                ? 'Related Omno asset movements were found near this create request.'
                : 'No related settlement movement was found in the current transaction window.',
            state: hasMovements ? 'complete' : 'pending',
        },
        {
            label: settled ? 'Already settled' : 'Rejected',
            description: settled
                ? 'The operation appears settled according to transaction logs.'
                : 'The operation is not present as an active or completed backend job.',
            state: settled ? 'complete' : 'current',
        },
    ];
};

const AlchemyEvent = ({ event, epochBeginning, items, currentHeight }) => {
    const statusColor = STATUS_COLOR[event.status] || 'gray';
    const jobTimeline = event.job ? getLifecycleTimeline(event.job, currentHeight) : getCreateOnlyTimeline(event);
    const statusLabel = event.job ? getJobStatusLabel(event.job, currentHeight) : event.statusLabel;
    const durationBlocks = event.job ? getDurationBlocks(event.job) : event.parameter?.durationBlocks;

    return (
        <Box border="1px solid" borderColor={`${statusColor}.200`} bg={`${statusColor}.50`} borderRadius="md" p={4}>
            <Stack spacing={3}>
                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={2}>
                    <Box>
                        <Text fontWeight="bold">{getEventTitle(event, items)}</Text>
                        <Text fontSize="xs" color="gray.600">
                            Job ID: {event.id}
                        </Text>
                    </Box>
                    <Stack direction="row" align="center" flexWrap="wrap">
                        <Badge colorScheme={statusColor}>{statusLabel}</Badge>
                        {event.lifecycle !== 'unknown' && (
                            <Badge colorScheme={event.lifecycle === 'new' ? 'orange' : 'gray'} variant="subtle">
                                {event.lifecycle === 'new' ? 'Escrow lifecycle' : 'Legacy lifecycle'}
                            </Badge>
                        )}
                    </Stack>
                </Stack>

                <Text fontSize="sm" color={`${statusColor}.700`} fontWeight="bold">
                    {getEventDescription(event)}
                </Text>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Submitted
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {formatTxDate(event.createTx?.timestamp || event.timestamp, epochBeginning)}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Start height
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {event.job?.startHeight || event.parameter?.blockId || '-'}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            End height
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {event.job?.endHeight || '-'}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color="gray.500">
                            Duration
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                            {durationBlocks ? `${durationBlocks} blocks` : '-'}
                        </Text>
                    </Box>
                </SimpleGrid>

                <Divider />
                <JobLifecycleTimeline steps={jobTimeline} />

                {event.movements?.length > 0 && (
                    <>
                        <Divider />
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Related asset movements
                            </Text>
                            <Stack spacing={2}>
                                {event.movements.map(movement => (
                                    <Stack
                                        key={movement.id}
                                        direction={{ base: 'column', md: 'row' }}
                                        justify="space-between"
                                        border="1px solid"
                                        borderColor="blackAlpha.100"
                                        borderRadius="md"
                                        p={2}>
                                        <Stack direction="row" align="center" flexWrap="wrap">
                                            <Badge colorScheme={movement.direction === 'in' ? 'green' : 'blue'}>
                                                {movement.direction === 'in' ? 'Settlement' : 'Submitted asset'}
                                            </Badge>
                                            <Text fontSize="sm">{movement.itemName}</Text>
                                        </Stack>
                                        <Text fontSize="sm" color="gray.600">
                                            {movement.quantityQNT} QNT - {formatTxDate(movement.timestamp, epochBeginning)}
                                        </Text>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </>
                )}
            </Stack>
        </Box>
    );
};

const ShowAlchemyHistory = ({ alchemyEvents, visibleAlchemy, setVisibleAlchemy, epochBeginning }) => {
    const { items } = useSelector(state => state.items);
    const { prev_height } = useSelector(state => state.blockchain);

    const loadMore = () => setVisibleAlchemy(prev => prev + 10);

    return alchemyEvents.length > 0 ? (
        <Stack spacing={4} maxW={{ base: '100%', lg: '70vw', xl: '100%' }}>
            {alchemyEvents.slice(0, visibleAlchemy).map(event => (
                <AlchemyEvent
                    key={`${event.kind}-${event.id}`}
                    event={event}
                    items={items}
                    currentHeight={prev_height}
                    epochBeginning={epochBeginning}
                />
            ))}

            {alchemyEvents.length > visibleAlchemy && (
                <Button size="lg" w="100%" bgColor="transparent" p={8} onClick={loadMore} color="#3b7197">
                    LOAD MORE
                </Button>
            )}
        </Stack>
    ) : (
        <Center w="100%" textAlign="center" py={4} gap={4}>
            <Text fontWeight="bolder" bgGradient="linear(to-l, #478299, #957bd2)" bgClip="text">
                No alchemy events yet
            </Text>
        </Center>
    );
};

export default ShowAlchemyHistory;
