import { useEffect, useMemo, useState } from 'react';
import {
    Badge,
    Box,
    Button,
    Circle,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Progress,
    Select,
    SimpleGrid,
    Stack,
    Text,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FaBars,
    FaBoxes,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaFlask,
    FaGift,
    FaHistory,
    FaLayerGroup,
    FaScroll,
    FaUsers,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

import NewsAirdrops from '../HomePage/NewsAirdrops';
import Elyxir from './index';
import { addressToAccountId, getAsset } from '../../../services/Ardor/ardorInterface';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'alchemy', label: 'Alchemy', icon: FaFlask },
    { id: 'inventory', label: 'Inventory', icon: FaBoxes },
    { id: 'jobs', label: 'Jobs', icon: FaHistory },
    { id: 'airdrops', label: 'Airdrops', icon: FaGift },
];

const TYPE_FILTERS = ['all', 'ingredients', 'tools', 'flasks', 'potions'];

const imageFallback = '/images/currency/potions.png';

const formatNumber = value => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric);
};

const normalizeJobs = source => {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.entries(source).map(([jobId, job]) => ({ ...job, jobId: job?.jobId || jobId }));
};

const getJobCollections = elyxir => {
    const liveJobs = normalizeJobs(elyxir?.jobs);
    const archivedJobs = normalizeJobs(elyxir?.completedJobs).map(job => ({
        ...job,
        status: job.status || 'COMPLETED',
    }));

    return {
        active: liveJobs.filter(job => job.status === 'STARTED'),
        completed: [...liveJobs.filter(job => job.status !== 'STARTED'), ...archivedJobs],
    };
};

const getAccountId = infoAccount => {
    try {
        return infoAccount?.accountRs ? addressToAccountId(infoAccount.accountRs) : null;
    } catch {
        return null;
    }
};

const countOwned = items => (items || []).filter(item => Number(item?.quantityQNT || 0) > 0).length;

const getPotionForAsset = (assetId, potions = []) =>
    potions.find(potion => String(potion?.asset) === String(assetId)) || {
        asset: assetId,
        name: `Potion ${String(assetId || '').slice(-6)}`,
        description: 'Elyxir potion',
        imgUrl: imageFallback,
        quantityQNT: 0,
    };

const getRecipeMissingItems = (recipe, fakeAssets, flaskMultiplier = 1) => {
    const missing = [];

    recipe?.ingredients?.forEach(ingredient => {
        const owned = fakeAssets.ingredients?.find(item => String(item.asset) === String(ingredient.assetId));
        const have = Number(owned?.quantityQNT || 0);
        const needed = Number(ingredient.qtyQNT || 0) * flaskMultiplier;
        if (have < needed) {
            missing.push({
                type: 'ingredient',
                name: owned?.name || ingredient.name || ingredient.assetId,
                have,
                needed,
            });
        }
    });

    recipe?.tools?.forEach(assetId => {
        const owned = fakeAssets.tools?.find(item => String(item.asset) === String(assetId));
        const have = Number(owned?.quantityQNT || 0);
        if (have <= 0) {
            missing.push({
                type: 'tool',
                name: owned?.name || assetId,
                have,
                needed: 1,
            });
        }
    });

    return missing;
};

const usePotionSupply = recipes => {
    const assetIds = useMemo(
        () => Array.from(new Set((recipes || []).map(recipe => recipe.creationAssetId).filter(Boolean))),
        [recipes]
    );
    const idsKey = assetIds.join('|');
    const [supply, setSupply] = useState({ loading: false, total: null, count: 0, failed: false });

    useEffect(() => {
        const ids = idsKey ? idsKey.split('|') : [];
        if (!ids.length) {
            setSupply({ loading: false, total: null, count: 0, failed: false });
            return undefined;
        }

        let cancelled = false;

        const loadSupply = async () => {
            setSupply(previous => ({ ...previous, loading: true }));
            const assets = await Promise.all(ids.map(assetId => getAsset(assetId).catch(() => null)));
            if (cancelled) return;

            const validAssets = assets.filter(Boolean);
            if (!validAssets.length) {
                setSupply({ loading: false, total: null, count: ids.length, failed: true });
                return;
            }

            const total = validAssets.reduce((sum, asset) => sum + Number(asset.quantityQNT || 0), 0);
            setSupply({
                loading: false,
                total,
                count: validAssets.length,
                failed: validAssets.length !== ids.length,
            });
        };

        loadSupply();

        return () => {
            cancelled = true;
        };
    }, [idsKey]);

    return supply;
};

const Surface = ({ children, ...props }) => (
    <Box
        bg="#10171b"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="8px"
        boxShadow="0 18px 60px rgba(0, 0, 0, 0.28)"
        {...props}
    >
        {children}
    </Box>
);

const SectionHeader = ({ label, title, action }) => (
    <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} spacing={4}>
        <Box minW={0}>
            <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                {label}
            </Text>
            <Heading size={{ base: 'md', md: 'lg' }} letterSpacing="0">
                {title}
            </Heading>
        </Box>
        {action}
    </HStack>
);

const MetricCard = ({ icon, label, value, tone = 'violet', caption }) => {
    const tones = {
        emerald: { color: '#57d68d', bg: 'rgba(87, 214, 141, 0.1)' },
        brass: { color: '#d8b56d', bg: 'rgba(216, 181, 109, 0.1)' },
        violet: { color: '#b999ff', bg: 'rgba(185, 153, 255, 0.1)' },
        orange: { color: '#f6ad55', bg: 'rgba(246, 173, 85, 0.1)' },
    };
    const style = tones[tone] || tones.violet;

    return (
        <Surface p={4}>
            <HStack justify="space-between" align="flex-start">
                <Box minW={0}>
                    <Text color="whiteAlpha.600" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                        {label}
                    </Text>
                    <Text color="white" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="black" lineHeight="1.1">
                        {value}
                    </Text>
                    {caption && (
                        <Text color="whiteAlpha.500" fontSize="xs" mt={1}>
                            {caption}
                        </Text>
                    )}
                </Box>
                <Circle size="38px" bg={style.bg} color={style.color}>
                    <Icon as={icon} />
                </Circle>
            </HStack>
        </Surface>
    );
};

const SidebarContent = ({ activeView, infoAccount, onSelect }) => (
    <Stack h="100%" spacing={6} py={5}>
        <Box px={4}>
            <HStack spacing={3}>
                <Image src="/images/logos/ElyxirColor.png" fallbackSrc={imageFallback} boxSize="34px" objectFit="contain" />
                <Box minW={0}>
                    <Text fontWeight="black" fontSize="lg" lineHeight="1">
                        Elyxir
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="xs">
                        Play Hub
                    </Text>
                </Box>
            </HStack>
        </Box>

        <Stack spacing={1} px={3}>
            {NAV_ITEMS.map(item => {
                const active = activeView === item.id;
                return (
                    <Button
                        key={item.id}
                        justifyContent="flex-start"
                        leftIcon={<Icon as={item.icon} />}
                        h="42px"
                        borderRadius="8px"
                        variant="ghost"
                        color={active ? '#07100c' : 'whiteAlpha.800'}
                        bg={active ? '#57d68d' : 'transparent'}
                        _hover={{ bg: active ? '#57d68d' : 'whiteAlpha.100' }}
                        onClick={() => onSelect(item.id)}
                    >
                        {item.label}
                    </Button>
                );
            })}
        </Stack>

        <Box mt="auto" px={4}>
            <Surface p={3} bg="#0b1114">
                <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase">
                    Connected
                </Text>
                <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                    {infoAccount?.name || 'Wallet account'}
                </Text>
                <Text color="whiteAlpha.500" fontSize="xs" noOfLines={1}>
                    {infoAccount?.accountRs}
                </Text>
            </Surface>
        </Box>
    </Stack>
);

const OverviewView = ({ infoAccount, setActiveView }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const recipes = elyxir?.definition?.recipes || [];
    const jobs = useMemo(() => getJobCollections(elyxir), [elyxir]);
    const supply = usePotionSupply(recipes);
    const accountId = useMemo(() => getAccountId(infoAccount), [infoAccount]);
    const userActiveJobs = jobs.active.filter(job => String(job.owner) === String(accountId));
    const activeAlchemists = new Set([...jobs.active, ...jobs.completed].map(job => job.owner).filter(Boolean)).size;
    const ownedFlasks = (fakeAssets.flasks || []).filter(item => Number(item.quantityQNT || 0) > 0);
    const craftableRecipes = recipes.filter(recipe =>
        ownedFlasks.some(flask => getRecipeMissingItems(recipe, fakeAssets, flask.multiplier || 1).length === 0)
    );
    const recentJobs = [...jobs.active, ...jobs.completed]
        .sort((a, b) => Number(b.startHeight || 0) - Number(a.startHeight || 0))
        .slice(0, 5);

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Command view"
                title="Alchemy overview"
                action={
                    <HStack>
                        <Button
                            leftIcon={<Icon as={FaFlask} />}
                            bg="#57d68d"
                            color="#07100c"
                            _hover={{ bg: '#46c47d' }}
                            onClick={() => setActiveView('alchemy')}
                        >
                            Start Alchemy
                        </Button>
                        <Button
                            leftIcon={<Icon as={FaGift} />}
                            variant="outline"
                            borderColor="whiteAlpha.300"
                            color="white"
                            _hover={{ bg: 'whiteAlpha.100' }}
                            onClick={() => setActiveView('airdrops')}
                        >
                            Airdrops
                        </Button>
                    </HStack>
                }
            />

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
                <MetricCard icon={FaClock} label="Active jobs" value={formatNumber(jobs.active.length)} tone="orange" />
                <MetricCard icon={FaCheckCircle} label="Completed jobs" value={formatNumber(jobs.completed.length)} tone="emerald" />
                <MetricCard icon={FaUsers} label="Active alchemists" value={formatNumber(activeAlchemists)} tone="violet" />
                <MetricCard
                    icon={FaFlask}
                    label="Potions in existence"
                    value={supply.loading ? '...' : supply.total != null ? formatNumber(supply.total) : formatNumber(recipes.length)}
                    caption={supply.failed ? `${formatNumber(supply.count)} tracked potion types` : undefined}
                    tone="brass"
                />
                <MetricCard icon={FaScroll} label="Recipes" value={formatNumber(recipes.length)} tone="violet" />
                <MetricCard
                    icon={FaLayerGroup}
                    label="Flask tiers"
                    value={formatNumber(Object.keys(elyxir?.definition?.flaskMultipliers || {}).length)}
                    tone="brass"
                />
                <MetricCard
                    icon={FaChartLine}
                    label="Version"
                    value={elyxir?.definition?.version || '-'}
                    caption="Elyxir ruleset"
                    tone="emerald"
                />
                <MetricCard
                    icon={FaBoxes}
                    label="Total burned"
                    value={formatNumber(elyxir?.totalBurned)}
                    caption={elyxir?.operationFee ? `Fee ${elyxir.operationFee}` : undefined}
                    tone="orange"
                />
            </SimpleGrid>

            <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)' }} gap={4}>
                <Surface p={5}>
                    <SectionHeader label="Wallet status" title="My alchemy status" />
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3} mt={5}>
                        <MetricCard icon={FaFlask} label="Owned flasks" value={formatNumber(ownedFlasks.length)} tone="brass" />
                        <MetricCard
                            icon={FaBoxes}
                            label="Ingredients"
                            value={formatNumber(countOwned(fakeAssets.ingredients))}
                            tone="emerald"
                        />
                        <MetricCard
                            icon={FaScroll}
                            label="Craftable recipes"
                            value={formatNumber(craftableRecipes.length)}
                            tone="violet"
                        />
                        <MetricCard
                            icon={FaClock}
                            label="My active jobs"
                            value={formatNumber(userActiveJobs.length)}
                            tone="orange"
                        />
                    </SimpleGrid>
                </Surface>

                <Surface p={5}>
                    <SectionHeader label="Network" title="Recent activity" />
                    <Stack spacing={3} mt={5}>
                        {recentJobs.length === 0 && (
                            <Text color="whiteAlpha.600" fontSize="sm">
                                No crafting activity yet.
                            </Text>
                        )}
                        {recentJobs.map(job => {
                            const potion = getPotionForAsset(job.creationAssetId, fakeAssets.potions);
                            const active = job.status === 'STARTED';
                            return (
                                <HStack key={job.jobId} justify="space-between" spacing={3}>
                                    <HStack minW={0}>
                                        <Image
                                            src={potion.imgUrl}
                                            fallbackSrc={imageFallback}
                                            boxSize="38px"
                                            objectFit="contain"
                                        />
                                        <Box minW={0}>
                                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                                {potion.name}
                                            </Text>
                                            <Text color="whiteAlpha.500" fontSize="xs">
                                                Height {job.startHeight || '-'}
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Badge colorScheme={active ? 'orange' : job.isSuccess ? 'green' : 'red'}>
                                        {active ? 'Active' : job.isSuccess ? 'Complete' : 'Failed'}
                                    </Badge>
                                </HStack>
                            );
                        })}
                    </Stack>
                </Surface>
            </Grid>
        </Stack>
    );
};

const InventoryTile = ({ item }) => {
    const quantity = Number(item.quantityQNT || 0);
    return (
        <Surface p={3} bg={quantity > 0 ? '#111b1e' : '#0b1114'}>
            <HStack align="center" spacing={3}>
                <Image src={item.imgUrl} fallbackSrc={imageFallback} boxSize="48px" objectFit="contain" flexShrink={0} />
                <Box minW={0} flex="1">
                    <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                        {item.name}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="xs" noOfLines={1}>
                        {item.typeLabel}
                    </Text>
                </Box>
                <Badge
                    colorScheme={quantity > 0 ? 'green' : 'red'}
                    variant={quantity > 0 ? 'solid' : 'outline'}
                    borderRadius="6px"
                >
                    {formatNumber(quantity)}
                </Badge>
            </HStack>
        </Surface>
    );
};

const InventoryView = () => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const [filter, setFilter] = useState('all');
    const inventory = useMemo(
        () => [
            ...(fakeAssets.ingredients || []).map(item => ({ ...item, type: 'ingredients', typeLabel: 'Ingredient' })),
            ...(fakeAssets.tools || []).map(item => ({ ...item, type: 'tools', typeLabel: 'Tool' })),
            ...(fakeAssets.flasks || []).map(item => ({ ...item, type: 'flasks', typeLabel: 'Flask' })),
            ...(fakeAssets.potions || []).map(item => ({ ...item, type: 'potions', typeLabel: 'Potion' })),
        ],
        [fakeAssets]
    );
    const visibleItems = filter === 'all' ? inventory : inventory.filter(item => item.type === filter);

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Vault"
                title="Inventory"
                action={
                    <Select
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                        maxW="190px"
                        bg="#10171b"
                        borderColor="whiteAlpha.300"
                    >
                        {TYPE_FILTERS.map(value => (
                            <option key={value} value={value}>
                                {value === 'all' ? 'All assets' : value}
                            </option>
                        ))}
                    </Select>
                }
            />
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
                {visibleItems.map(item => (
                    <InventoryTile key={`${item.type}-${item.asset}`} item={item} />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

const JobRow = ({ job }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);
    const potion = getPotionForAsset(job.creationAssetId, fakeAssets.potions);
    const active = job.status === 'STARTED';
    const totalBlocks = Math.max(1, Number(job.endHeight || 0) - Number(job.startHeight || 0));
    const elapsedBlocks = Math.max(0, Number(prev_height || 0) - Number(job.startHeight || 0));
    const progress = active ? Math.min(100, Math.max(0, (elapsedBlocks / totalBlocks) * 100)) : 100;
    const blocksLeft = Math.max(0, Number(job.endHeight || 0) - Number(prev_height || 0));

    return (
        <Surface p={4} bg="#0f171a">
            <HStack align="flex-start" spacing={4}>
                <Image src={potion.imgUrl} fallbackSrc={imageFallback} boxSize="54px" objectFit="contain" flexShrink={0} />
                <Stack spacing={2} flex="1" minW={0}>
                    <HStack justify="space-between" align="flex-start">
                        <Box minW={0}>
                            <Text fontWeight="bold" noOfLines={1}>
                                {potion.name}
                            </Text>
                            <Text color="whiteAlpha.500" fontSize="xs">
                                x{job.flaskMultiplier || 1} flask output
                            </Text>
                        </Box>
                        <Badge colorScheme={active ? 'orange' : job.isSuccess ? 'green' : 'red'}>
                            {active ? 'Active' : job.isSuccess ? 'Complete' : 'Failed'}
                        </Badge>
                    </HStack>
                    <Progress value={progress} size="sm" borderRadius="6px" colorScheme={active ? 'orange' : 'green'} bg="#1d282d" />
                    <HStack justify="space-between" color="whiteAlpha.600" fontSize="xs">
                        <Text>{active ? `${formatNumber(blocksLeft)} blocks left` : `Started ${job.startHeight || '-'}`}</Text>
                        <Text>{job.successProbability ? `${Math.round(job.successProbability * 100)}% chance` : 'Chance pending'}</Text>
                    </HStack>
                </Stack>
            </HStack>
        </Surface>
    );
};

const JobsView = ({ infoAccount }) => {
    const { elyxir } = useSelector(state => state.elyxir);
    const accountId = useMemo(() => getAccountId(infoAccount), [infoAccount]);
    const jobs = useMemo(() => getJobCollections(elyxir), [elyxir]);
    const activeJobs = jobs.active.filter(job => String(job.owner) === String(accountId));
    const completedJobs = jobs.completed.filter(job => String(job.owner) === String(accountId));

    return (
        <Stack spacing={5}>
            <SectionHeader label="Crafting queue" title="Jobs" />
            <Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap={4}>
                <Surface p={5}>
                    <SectionHeader label="In progress" title="Active jobs" />
                    <Stack spacing={3} mt={5}>
                        {activeJobs.length === 0 && <Text color="whiteAlpha.600">No active jobs.</Text>}
                        {activeJobs.map(job => (
                            <JobRow key={job.jobId} job={job} />
                        ))}
                    </Stack>
                </Surface>
                <Surface p={5}>
                    <SectionHeader label="Archive" title="Completed history" />
                    <Stack spacing={3} mt={5}>
                        {completedJobs.length === 0 && <Text color="whiteAlpha.600">No completed jobs.</Text>}
                        {completedJobs.map(job => (
                            <JobRow key={job.jobId} job={job} />
                        ))}
                    </Stack>
                </Surface>
            </Grid>
        </Stack>
    );
};

const AirdropsView = ({ goToSection }) => (
    <Stack spacing={5}>
        <Surface p={{ base: 0, md: 2 }} bg="#0b1114">
            <NewsAirdrops goToSection={goToSection} />
        </Surface>
    </Stack>
);

const PlayHubElyxirShell = ({ infoAccount, walletProvider, walletHostOrigin }) => {
    const [activeView, setActiveView] = useState('overview');
    const isDesktop = useBreakpointValue({ base: false, lg: true });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const activeItem = NAV_ITEMS.find(item => item.id === activeView) || NAV_ITEMS[0];

    const handleSelect = view => {
        setActiveView(view);
        onClose();
    };

    const handleGoToSection = section => {
        if (section === 10) {
            setActiveView('alchemy');
            onClose();
            return;
        }

        window.parent.postMessage(
            {
                type: 'MYTHICAL_WALLET_NAVIGATE',
                section,
            },
            walletHostOrigin
        );
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'alchemy':
                return <Elyxir infoAccount={infoAccount} walletProvider={walletProvider} embedded />;
            case 'inventory':
                return <InventoryView />;
            case 'jobs':
                return <JobsView infoAccount={infoAccount} />;
            case 'airdrops':
                return <AirdropsView goToSection={handleGoToSection} />;
            case 'overview':
            default:
                return <OverviewView infoAccount={infoAccount} setActiveView={setActiveView} />;
        }
    };

    return (
        <Flex minH="100vh" bg="#070a0d" color="white">
            {isDesktop && (
                <Box w="244px" flexShrink={0} bg="#090f12" borderRight="1px solid" borderColor="whiteAlpha.200">
                    <SidebarContent activeView={activeView} infoAccount={infoAccount} onSelect={handleSelect} />
                </Box>
            )}

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="#090f12" color="white">
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <SidebarContent activeView={activeView} infoAccount={infoAccount} onSelect={handleSelect} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Box flex="1" minW={0}>
                <HStack
                    h="64px"
                    px={{ base: 3, md: 5 }}
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.200"
                    bg="rgba(7, 10, 13, 0.92)"
                    justify="space-between"
                    position="sticky"
                    top={0}
                    zIndex={4}
                >
                    <HStack minW={0}>
                        {!isDesktop && (
                            <IconButton
                                aria-label="Open Elyxir navigation"
                                icon={<FaBars />}
                                onClick={onOpen}
                                variant="ghost"
                                color="white"
                            />
                        )}
                        <Circle size="34px" bg="rgba(216, 181, 109, 0.12)" color="#d8b56d">
                            <Icon as={activeItem.icon} />
                        </Circle>
                        <Box minW={0}>
                            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase">
                                Elyxir
                            </Text>
                            <Text fontWeight="black" noOfLines={1}>
                                {activeItem.label}
                            </Text>
                        </Box>
                    </HStack>
                    <Badge bg="rgba(87, 214, 141, 0.14)" color="#57d68d" borderRadius="6px" px={3} py={1}>
                        Play Hub
                    </Badge>
                </HStack>

                <Box px={{ base: 3, md: 5 }} py={5} maxW="1680px" mx="auto">
                    {renderActiveView()}
                </Box>
            </Box>
        </Flex>
    );
};

export default PlayHubElyxirShell;
