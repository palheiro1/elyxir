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
    Input,
    InputGroup,
    InputLeftElement,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FaBars,
    FaBolt,
    FaBoxes,
    FaBook,
    FaChartLine,
    FaChevronRight,
    FaClock,
    FaFire,
    FaFlask,
    FaGift,
    FaLayerGroup,
    FaLeaf,
    FaSearch,
    FaShieldAlt,
    FaFlagCheckered,
    FaTrophy,
    FaTools,
    FaUserCircle,
    FaUsers,
} from 'react-icons/fa';
import {
    GiBubblingFlask,
    GiCauldron,
    GiBookshelf,
    GiHourglass,
    GiOpenTreasureChest,
} from 'react-icons/gi';
import { useSelector } from 'react-redux';

import Elyxir from './index';
import { addressToAccountId, getAccount, getAsset, getBlock } from '../../../services/Ardor/ardorInterface';
import {
    blocksToDurationLabel,
    buildRaceLeaderboard,
    formatLocalDateTime,
    formatUtcDateTime,
    getApproxDateForHeight,
    getJobResolveHeight,
    isJobSuccessful,
    RACE_START_DATE,
} from '../../../utils/elyxirRace';
import {
    getIncubationOwnership,
    getIncubationSearchText,
    getIncubationSourceByIngredientAsset,
} from './incubationSources';

const NAV_ITEMS = [
    { id: 'overview', label: 'Laboratory', subtitle: 'Home', icon: GiBubblingFlask, tone: 'brass' },
    { id: 'alchemy', label: 'Workbench', subtitle: 'Alchemy', icon: GiCauldron, tone: 'emerald' },
    { id: 'inventory', label: 'Pantry', subtitle: 'Inventory', icon: GiBookshelf, tone: 'cyan' },
    { id: 'jobs', label: 'Brewing Queue', subtitle: 'Jobs', icon: GiHourglass, tone: 'amber' },
    { id: 'airdrops', label: 'Supply Board', subtitle: 'Airdrops', icon: GiOpenTreasureChest, tone: 'violet' },
];

const getInitialView = () => {
    const requestedView = new URLSearchParams(window.location.search).get('view');
    return NAV_ITEMS.some(item => item.id === requestedView) ? requestedView : 'overview';
};

const TYPE_FILTERS = [
    { id: 'all', label: 'All assets' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'tools', label: 'Tools' },
    { id: 'flasks', label: 'Flasks' },
    { id: 'recipes', label: 'Recipes' },
    { id: 'potions', label: 'Potions' },
];

const getInitialInventoryFilter = () => {
    const requestedFilter = new URLSearchParams(window.location.search).get('inventory');
    return TYPE_FILTERS.some(item => item.id === requestedFilter) ? requestedFilter : 'all';
};

const imageFallback = '/images/currency/potions.png';

const theme = {
    bg: '#050809',
    panel: 'rgba(13, 20, 23, 0.66)',
    panelElevated: 'rgba(17, 27, 30, 0.74)',
    panelDeep: 'rgba(8, 13, 15, 0.76)',
    line: 'rgba(172, 206, 197, 0.16)',
    lineStrong: 'rgba(216, 181, 109, 0.34)',
    textMuted: 'rgba(224, 238, 235, 0.58)',
    textFaint: 'rgba(224, 238, 235, 0.38)',
    emerald: '#5be08d',
    brass: '#d8b56d',
    cyan: '#72d9e2',
    violet: '#b99bff',
    amber: '#f4b45f',
    danger: '#ee7d6f',
};

const tones = {
    emerald: { color: theme.emerald, bg: 'rgba(91, 224, 141, 0.12)', border: 'rgba(91, 224, 141, 0.34)' },
    brass: { color: theme.brass, bg: 'rgba(216, 181, 109, 0.12)', border: 'rgba(216, 181, 109, 0.34)' },
    cyan: { color: theme.cyan, bg: 'rgba(114, 217, 226, 0.12)', border: 'rgba(114, 217, 226, 0.32)' },
    violet: { color: theme.violet, bg: 'rgba(185, 155, 255, 0.12)', border: 'rgba(185, 155, 255, 0.30)' },
    amber: { color: theme.amber, bg: 'rgba(244, 180, 95, 0.12)', border: 'rgba(244, 180, 95, 0.32)' },
    danger: { color: theme.danger, bg: 'rgba(238, 125, 111, 0.12)', border: 'rgba(238, 125, 111, 0.32)' },
};

const formatNumber = value => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric);
};

const formatTimeLeftLabel = blocks => {
    const duration = blocksToDurationLabel(blocks);
    return duration === 'Ready now' ? duration : `${duration} left`;
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

const getShortAccountLabel = account => {
    const value = String(account || '');
    if (!value) return 'Unknown account';
    if (value.length <= 14) return value;
    return `${value.slice(0, 8)}...${value.slice(-5)}`;
};

const getOwnerLabel = (job, accountLabels) => {
    const owner = String(job?.owner || '');
    return accountLabels?.[owner]?.label || getShortAccountLabel(owner);
};

const getChanceLabel = job => {
    const chance = Number(job?.successProbability);
    return Number.isFinite(chance) ? `${Math.round(chance * 100)}% chance` : 'Chance pending';
};

const getJobProgress = (job, currentHeight) => {
    const totalBlocks = Math.max(1, Number(job?.endHeight || 0) - Number(job?.startHeight || 0));
    const elapsedBlocks = Math.max(0, Number(currentHeight || 0) - Number(job?.startHeight || 0));
    return Math.min(100, Math.max(0, (elapsedBlocks / totalBlocks) * 100));
};

const formatHeightDateLabel = ({ targetHeight, currentHeight, blockTimestamps = {}, exactPrefix = '' }) => {
    const height = Number(targetHeight);
    if (!Number.isFinite(height)) return 'Date pending';

    const timestamp = blockTimestamps[String(height)];
    if (timestamp != null) {
        const date = new Date(Date.UTC(2018, 0, 1, 0, 0, 0) + Number(timestamp) * 1000);
        return `${exactPrefix}${formatLocalDateTime(date)}`;
    }

    const date = getApproxDateForHeight({ targetHeight: height, currentHeight });
    return date ? `~${formatLocalDateTime(date)}` : 'Date pending';
};

const getJobStatusLabel = job => {
    if (job?.status === 'STARTED') return 'Brewing';
    return isJobSuccessful(job) ? 'Complete' : 'Failed';
};

const useAccountLabels = jobs => {
    const ownersKey = useMemo(
        () =>
            Array.from(new Set((jobs || []).map(job => String(job?.owner || '')).filter(Boolean)))
                .sort()
                .join('|'),
        [jobs]
    );
    const [accountLabels, setAccountLabels] = useState({});

    useEffect(() => {
        const owners = ownersKey ? ownersKey.split('|') : [];
        const missingOwners = owners.filter(owner => !accountLabels[owner]);
        if (!missingOwners.length) return undefined;

        let cancelled = false;

        const loadAccounts = async () => {
            const entries = await Promise.all(
                missingOwners.map(async owner => {
                    const account = await getAccount(owner).catch(() => null);
                    return [
                        owner,
                        {
                            label: account?.name || account?.accountRS || getShortAccountLabel(owner),
                            detail: account?.name ? account.accountRS : null,
                        },
                    ];
                })
            );

            if (!cancelled) {
                setAccountLabels(previous => ({
                    ...previous,
                    ...Object.fromEntries(entries),
                }));
            }
        };

        loadAccounts();

        return () => {
            cancelled = true;
        };
    }, [ownersKey, accountLabels]);

    return accountLabels;
};

const useBlockTimestamps = jobs => {
    const heightsKey = useMemo(
        () =>
            Array.from(
                new Set(
                    (jobs || [])
                        .map(job => getJobResolveHeight(job))
                        .filter(height => Number.isFinite(Number(height)) && Number(height) > 0)
                        .map(height => String(height))
                )
            )
                .sort()
                .join('|'),
        [jobs]
    );
    const [blockTimestamps, setBlockTimestamps] = useState({});

    useEffect(() => {
        const heights = heightsKey ? heightsKey.split('|') : [];
        const missingHeights = heights.filter(height => !(height in blockTimestamps));
        if (!missingHeights.length) return undefined;

        let cancelled = false;

        const loadBlocks = async () => {
            const entries = await Promise.all(
                missingHeights.map(async height => {
                    const block = await getBlock(height).catch(() => null);
                    return [height, block?.timestamp ?? null];
                })
            );

            if (!cancelled) {
                setBlockTimestamps(previous => ({
                    ...previous,
                    ...Object.fromEntries(entries),
                }));
            }
        };

        loadBlocks();

        return () => {
            cancelled = true;
        };
    }, [heightsKey, blockTimestamps]);

    return blockTimestamps;
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

const getRecipeInventoryItems = (recipes = [], potions = [], infoAccount) =>
    recipes.map((recipe, index) => {
        const potion = getPotionForAsset(recipe.creationAssetId, potions);
        const ownedAsset = infoAccount?.assets?.find(asset => String(asset.asset) === String(recipe.recipeAssetId));
        const quantity = Number(ownedAsset?.quantityQNT || 0);

        return {
            asset: recipe.recipeAssetId,
            name: `${potion.name} recipe`,
            description: 'Recipe fragment discovered from GIFTZ rewards.',
            quantityQNT: quantity,
            totalQuantityQNT: 1,
            imgUrl: `/images/elyxir/recipes/recipe${(index % 2) + 1}-transparent.png`,
            type: 'recipes',
            typeLabel: 'Recipe',
            tone: 'violet',
            creationAssetId: recipe.creationAssetId,
        };
    });

const getInventoryItems = (fakeAssets, recipes = [], infoAccount) => [
    ...(fakeAssets.ingredients || []).map(item => ({ ...item, type: 'ingredients', typeLabel: 'Ingredient', tone: 'emerald' })),
    ...(fakeAssets.tools || []).map(item => ({ ...item, type: 'tools', typeLabel: 'Tool', tone: 'brass' })),
    ...(fakeAssets.flasks || []).map(item => ({ ...item, type: 'flasks', typeLabel: 'Flask', tone: 'cyan' })),
    ...getRecipeInventoryItems(recipes, fakeAssets.potions, infoAccount),
    ...(fakeAssets.potions || []).map(item => ({ ...item, type: 'potions', typeLabel: 'Potion', tone: 'amber' })),
];

const getRecipeReadiness = (recipes, fakeAssets, ownedFlasks) => {
    const defaultMultiplier = ownedFlasks[0]?.multiplier || 1;
    return (recipes || [])
        .map(recipe => {
            const flask = ownedFlasks.find(item => getRecipeMissingItems(recipe, fakeAssets, item.multiplier || 1).length === 0) || ownedFlasks[0];
            const missing = getRecipeMissingItems(recipe, fakeAssets, flask?.multiplier || defaultMultiplier);
            const potion = getPotionForAsset(recipe.creationAssetId, fakeAssets.potions);
            const requirementCount = Number(recipe.ingredients?.length || 0) + Number(recipe.tools?.length || 0);
            const readyCount = Math.max(0, requirementCount - missing.length);

            return {
                recipe,
                flask,
                potion,
                missing,
                readiness: requirementCount ? Math.round((readyCount / requirementCount) * 100) : 0,
            };
        })
        .sort((a, b) => {
            if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
            return b.readiness - a.readiness;
        });
};

const getAssetUseCount = (asset, type, recipes = []) =>
    recipes.filter(recipe => {
        if (type === 'ingredients') return recipe.ingredients?.some(item => String(item.assetId) === String(asset));
        if (type === 'tools') return recipe.tools?.some(item => String(item) === String(asset));
        if (type === 'potions') return String(recipe.creationAssetId) === String(asset);
        return false;
    }).length;

const getMissingShelfItems = (recipes, fakeAssets) => {
    const byAsset = new Map();

    recipes.forEach(recipe => {
        recipe.ingredients?.forEach(req => {
            const item = fakeAssets.ingredients?.find(asset => String(asset.asset) === String(req.assetId));
            const have = Number(item?.quantityQNT || 0);
            const needed = Number(req.qtyQNT || 0);
            if (have >= needed) return;
            const key = String(req.assetId);
            const current = byAsset.get(key) || {
                asset: req.assetId,
                type: 'ingredients',
                typeLabel: 'Ingredient',
                name: item?.name || req.name || req.assetId,
                imgUrl: item?.imgUrl,
                have,
                needed: 0,
                recipes: 0,
            };
            current.needed = Math.max(current.needed, needed);
            current.recipes += 1;
            byAsset.set(key, current);
        });

        recipe.tools?.forEach(assetId => {
            const item = fakeAssets.tools?.find(asset => String(asset.asset) === String(assetId));
            const have = Number(item?.quantityQNT || 0);
            if (have > 0) return;
            const key = String(assetId);
            const current = byAsset.get(key) || {
                asset: assetId,
                type: 'tools',
                typeLabel: 'Tool',
                name: item?.name || assetId,
                imgUrl: item?.imgUrl,
                have,
                needed: 1,
                recipes: 0,
            };
            current.recipes += 1;
            byAsset.set(key, current);
        });
    });

    return Array.from(byAsset.values()).sort((a, b) => b.recipes - a.recipes);
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

const CockpitPanel = ({ children, tone = 'neutral', interactive = false, ...props }) => {
    const toneStyle = tones[tone] || { color: theme.textMuted, bg: 'rgba(255, 255, 255, 0.02)', border: theme.line };

    return (
        <Box
            bg={`linear-gradient(180deg, ${theme.panelElevated} 0%, ${theme.panel} 68%, ${theme.panelDeep} 100%)`}
            border="1px solid"
            borderColor={tone === 'neutral' ? theme.line : toneStyle.border}
            borderRadius="8px"
            boxShadow="0 20px 70px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(14px) saturate(1.08)"
            position="relative"
            overflow="hidden"
            transition={interactive ? 'border-color 0.16s ease, transform 0.16s ease, background 0.16s ease' : undefined}
            _before={{
                content: '""',
                position: 'absolute',
                inset: '0 0 auto 0',
                h: '2px',
                bg: tone === 'neutral' ? 'rgba(216, 181, 109, 0.18)' : toneStyle.color,
                opacity: tone === 'neutral' ? 0.8 : 0.95,
            }}
            _hover={interactive ? { borderColor: toneStyle.border, transform: 'translateY(-1px)' } : undefined}
            {...props}
        >
            {children}
        </Box>
    );
};

const Eyebrow = ({ children, tone = 'brass' }) => (
    <Text color={tones[tone]?.color || theme.brass} fontSize="xs" fontWeight="black" letterSpacing="0" textTransform="uppercase">
        {children}
    </Text>
);

const SectionHeader = ({ label, title, action, caption }) => (
    <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} spacing={4}>
        <Box minW={0}>
            <Eyebrow>{label}</Eyebrow>
            <Heading size={{ base: 'md', md: 'lg' }} letterSpacing="0" lineHeight="1.05">
                {title}
            </Heading>
            {caption && (
                <Text color={theme.textMuted} fontSize="sm" mt={1}>
                    {caption}
                </Text>
            )}
        </Box>
        {action}
    </HStack>
);

const ToneIcon = ({ icon, tone = 'emerald', size = '38px' }) => {
    const toneStyle = tones[tone] || tones.emerald;
    return (
        <Circle size={size} bg={toneStyle.bg} color={toneStyle.color} border="1px solid" borderColor={toneStyle.border}>
            <Icon as={icon} />
        </Circle>
    );
};

const MetricCard = ({ icon, label, value, tone = 'violet', caption }) => (
    <CockpitPanel p={4} tone={tone} minH="116px">
        <HStack justify="space-between" align="flex-start" position="relative" zIndex={1}>
            <Box minW={0}>
                <Text color={theme.textMuted} fontSize="xs" fontWeight="black" textTransform="uppercase">
                    {label}
                </Text>
                <Text color="white" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="black" lineHeight="1.05" mt={1}>
                    {value}
                </Text>
                {caption && (
                    <Text color={theme.textFaint} fontSize="xs" mt={2} noOfLines={1}>
                        {caption}
                    </Text>
                )}
            </Box>
            <ToneIcon icon={icon} tone={tone} />
        </HStack>
    </CockpitPanel>
);

const AssetImage = ({ src, boxSize = '48px', ...props }) => (
    <Image src={src || imageFallback} fallbackSrc={imageFallback} boxSize={boxSize} objectFit="contain" {...props} />
);

const StatusChip = ({ children, tone = 'emerald', icon }) => {
    const toneStyle = tones[tone] || tones.emerald;
    return (
        <HStack
            spacing={2}
            px={3}
            py={1.5}
            border="1px solid"
            borderColor={toneStyle.border}
            bg={toneStyle.bg}
            color={toneStyle.color}
            borderRadius="8px"
            fontSize="xs"
            fontWeight="black"
            textTransform="uppercase"
            whiteSpace="nowrap"
        >
            {icon && <Icon as={icon} />}
            <Text>{children}</Text>
        </HStack>
    );
};

const SidebarContent = ({ activeView, infoAccount, onSelect, reserveHostBack = false }) => (
    <Stack h="100%" spacing={5} pt={reserveHostBack ? '82px' : 5} pb={5}>
        <Box px={4}>
            <Stack spacing={2}>
                <Image src="/images/logos/ElixirWhite.png" fallbackSrc="/images/logos/ElyxirColor.png" h="46px" objectFit="contain" objectPosition="left center" />
                <StatusChip tone="brass" icon={FaShieldAlt}>
                    Play Hub
                </StatusChip>
            </Stack>
        </Box>

        <Stack spacing={1.5} px={3}>
            {NAV_ITEMS.map(item => {
                const active = activeView === item.id;
                const toneStyle = tones[item.tone] || tones.emerald;
                return (
                    <Button
                        key={item.id}
                        justifyContent="space-between"
                        h="62px"
                        px={3}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={active ? toneStyle.border : 'transparent'}
                        variant="unstyled"
                        color={active ? '#06110b' : 'rgba(236, 246, 243, 0.82)'}
                        bg={active ? theme.emerald : 'transparent'}
                        _hover={{ bg: active ? theme.emerald : 'rgba(255, 255, 255, 0.07)', borderColor: active ? toneStyle.border : theme.line }}
                        onClick={() => onSelect(item.id)}
                    >
                        <HStack spacing={3} minW={0}>
                            <Circle
                                size="34px"
                                flexShrink={0}
                                bg={active ? 'rgba(5, 8, 9, 0.16)' : toneStyle.bg}
                                color={active ? '#06110b' : toneStyle.color}
                                border="1px solid"
                                borderColor={active ? 'rgba(5, 8, 9, 0.18)' : toneStyle.border}
                            >
                                <Icon as={item.icon} fontSize="20px" />
                            </Circle>
                            <Box minW={0} textAlign="left">
                                <Text lineHeight="1.1" noOfLines={1}>
                                    {item.label}
                                </Text>
                                <Text
                                    color={active ? 'rgba(6, 17, 11, 0.62)' : theme.textFaint}
                                    fontSize="xs"
                                    lineHeight="1.1"
                                    noOfLines={1}
                                    mt={1}
                                >
                                    {item.subtitle}
                                </Text>
                            </Box>
                        </HStack>
                        {active && <Icon as={FaChevronRight} fontSize="12px" />}
                    </Button>
                );
            })}
        </Stack>

        <Box px={4}>
            <HStack spacing={2}>
                <StatusChip tone="emerald" icon={FaShieldAlt}>
                    Embedded
                </StatusChip>
                <StatusChip tone="brass" icon={FaBolt}>
                    Live
                </StatusChip>
            </HStack>
        </Box>

        <Box mt="auto" px={4}>
            <CockpitPanel p={3} bg={theme.panelDeep}>
                <Text color={theme.textFaint} fontSize="xs" textTransform="uppercase">
                    Connected wallet
                </Text>
                <Text fontSize="sm" fontWeight="black" noOfLines={1}>
                    {infoAccount?.name || 'Wallet account'}
                </Text>
                <Text color={theme.textMuted} fontSize="xs" noOfLines={1}>
                    {infoAccount?.accountRs}
                </Text>
            </CockpitPanel>
        </Box>
    </Stack>
);

const ReadinessMeter = ({ value, tone = 'emerald' }) => (
    <Box>
        <HStack justify="space-between" mb={2} color={theme.textMuted} fontSize="xs" fontWeight="black" textTransform="uppercase">
            <Text>Readiness</Text>
            <Text color={tones[tone]?.color || theme.emerald}>{formatNumber(value)}%</Text>
        </HStack>
        <Progress
            value={value}
            h="8px"
            borderRadius="8px"
            bg="rgba(255, 255, 255, 0.07)"
            sx={{
                '& > div': {
                    background: tones[tone]?.color || theme.emerald,
                },
            }}
        />
    </Box>
);

const MiniStat = ({ icon, label, value, tone = 'emerald' }) => (
    <HStack
        spacing={3}
        p={3}
        bg="rgba(255, 255, 255, 0.035)"
        border="1px solid"
        borderColor={theme.line}
        borderRadius="8px"
        minW={0}
    >
        <ToneIcon icon={icon} tone={tone} size="34px" />
        <Box minW={0}>
            <Text color="white" fontWeight="black" lineHeight="1">
                {value}
            </Text>
            <Text color={theme.textMuted} fontSize="xs" mt={1} noOfLines={1}>
                {label}
            </Text>
        </Box>
    </HStack>
);

const JobSummaryRow = ({ job, potions, accountLabels, blockTimestamps = {}, compact = false, bare = false }) => {
    const { prev_height } = useSelector(state => state.blockchain);
    const potion = getPotionForAsset(job?.creationAssetId, potions);
    const active = job?.status === 'STARTED';
    const progress = active ? getJobProgress(job, prev_height) : 100;
    const blocksLeft = Math.max(0, Number(job?.endHeight || 0) - Number(prev_height || 0));
    const resolveHeight = active ? job?.endHeight : getJobResolveHeight(job);
    const resolveLabel = formatHeightDateLabel({
        targetHeight: resolveHeight,
        currentHeight: prev_height,
        blockTimestamps,
    });
    const startLabel = formatHeightDateLabel({
        targetHeight: job?.startHeight,
        currentHeight: prev_height,
        blockTimestamps,
    });
    const statusTone = active ? 'orange' : isJobSuccessful(job) ? 'green' : 'red';

    const content = (
            <HStack align="flex-start" spacing={3}>
                <AssetImage src={potion.imgUrl} boxSize={compact ? '42px' : '54px'} flexShrink={0} />
                <Stack spacing={2} flex="1" minW={0}>
                    <HStack justify="space-between" align="flex-start" spacing={3}>
                        <Box minW={0}>
                            <Text fontWeight="black" noOfLines={1}>
                                {potion.name}
                            </Text>
                            <HStack color={theme.textFaint} fontSize="xs" spacing={2} minW={0}>
                                <Icon as={FaUserCircle} flexShrink={0} />
                                <Text noOfLines={1}>{getOwnerLabel(job, accountLabels)}</Text>
                            </HStack>
                        </Box>
                        <Badge colorScheme={statusTone} borderRadius="6px" flexShrink={0}>
                            {getJobStatusLabel(job)}
                        </Badge>
                    </HStack>
                    <Progress
                        value={progress}
                        h="8px"
                        borderRadius="8px"
                        bg="rgba(255, 255, 255, 0.07)"
                        sx={{ '& > div': { background: active ? theme.amber : isJobSuccessful(job) ? theme.emerald : theme.danger } }}
                    />
                    <SimpleGrid columns={{ base: 1, md: compact ? 2 : 4 }} spacing={2} color={theme.textMuted} fontSize="xs">
                        <Text noOfLines={1}>Start {startLabel}</Text>
                        <Text noOfLines={1}>{active ? `Ends ${resolveLabel}` : `${isJobSuccessful(job) ? 'Delivered' : 'Resolved'} ${resolveLabel}`}</Text>
                        <Text noOfLines={1}>{active ? formatTimeLeftLabel(blocksLeft) : `Height ${formatNumber(resolveHeight)}`}</Text>
                        <Text noOfLines={1}>
                            x{job?.flaskMultiplier || 1} flask, {getChanceLabel(job)}
                        </Text>
                    </SimpleGrid>
                </Stack>
            </HStack>
    );

    if (bare) return content;

    return (
        <Box bg="rgba(255, 255, 255, 0.035)" border="1px solid" borderColor={theme.line} borderRadius="8px" p={compact ? 3 : 4}>
            {content}
        </Box>
    );
};

const BrewingNowPanel = ({ jobs, potions, accountLabels }) => {
    const visibleJobs = (jobs || [])
        .slice()
        .sort((a, b) => Number(a.endHeight || 0) - Number(b.endHeight || 0))
        .slice(0, 4);

    return (
        <CockpitPanel p={5} tone={visibleJobs.length ? 'amber' : 'neutral'} h="100%">
            <Stack spacing={4} position="relative" zIndex={1}>
                <HStack justify="space-between" align="flex-start">
                    <Box>
                        <Eyebrow>Brewing now</Eyebrow>
                        <Text color={theme.textMuted} fontSize="sm" mt={1}>
                            Global active jobs visible to Race participants.
                        </Text>
                    </Box>
                    <StatusChip tone={visibleJobs.length ? 'amber' : 'cyan'} icon={FaClock}>
                        {visibleJobs.length ? `${visibleJobs.length} active` : 'Idle'}
                    </StatusChip>
                </HStack>
                {visibleJobs.length ? (
                    <Stack spacing={3}>
                        {visibleJobs.map(job => (
                            <JobSummaryRow
                                key={job.jobId}
                                job={job}
                                potions={potions}
                                accountLabels={accountLabels}
                                compact
                            />
                        ))}
                    </Stack>
                ) : (
                    <Stack spacing={3} minH="150px" justify="center" align="center" textAlign="center">
                        <ToneIcon icon={FaFlask} tone="cyan" size="62px" />
                        <Box>
                            <Heading size="sm">No potion brewing</Heading>
                            <Text color={theme.textMuted} fontSize="sm" mt={1}>
                                Start an experiment from the Workbench.
                            </Text>
                        </Box>
                    </Stack>
                )}
            </Stack>
        </CockpitPanel>
    );
};

const RecipeStatusPanel = ({ nextCraft, craftableRecipes, setActiveView }) => {
    const ready = craftableRecipes.length > 0;
    return (
        <CockpitPanel p={5} tone={ready ? 'emerald' : 'violet'} h="100%">
            <Stack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
                <HStack justify="space-between" w="100%">
                    <Eyebrow tone="brass">Recipe status</Eyebrow>
                    <Badge bg={ready ? tones.emerald.bg : tones.violet.bg} color={ready ? theme.emerald : theme.violet}>
                        {ready ? `${craftableRecipes.length} ready` : 'No recipe ready'}
                    </Badge>
                </HStack>
                <ToneIcon icon={FaBook} tone={ready ? 'emerald' : 'violet'} size="78px" />
                <Box>
                    <Heading size="md">{ready ? 'Ready recipes available' : 'No recipe ready'}</Heading>
                    <Text color={theme.textMuted} fontSize="sm" mt={2}>
                        {ready
                            ? `${nextCraft?.potion?.name || 'A potion'} can be brewed with your current shelves.`
                            : `You are missing key components for ${nextCraft?.missing?.length || 0} requirement(s).`}
                    </Text>
                </Box>
                <ReadinessMeter value={nextCraft?.readiness || 0} tone={ready ? 'emerald' : 'violet'} />
                <Button
                    size="sm"
                    variant="outline"
                    borderColor={ready ? tones.emerald.border : tones.violet.border}
                    color={ready ? theme.emerald : theme.violet}
                    _hover={{ bg: ready ? tones.emerald.bg : tones.violet.bg }}
                    onClick={() => setActiveView(ready ? 'alchemy' : 'inventory')}
                >
                    {ready ? 'Open Workbench' : 'View missing components'}
                </Button>
            </Stack>
        </CockpitPanel>
    );
};

const ShelvesPanel = ({ fakeAssets, userActiveJobs, recipes, setActiveView }) => (
    <CockpitPanel p={5} tone="brass" h="100%">
        <Stack spacing={4} position="relative" zIndex={1}>
            <Eyebrow>Your shelves</Eyebrow>
            <SimpleGrid columns={2} spacing={3}>
                <MiniStat icon={FaLeaf} label="Ingredients" value={formatNumber(countOwned(fakeAssets.ingredients))} tone="emerald" />
                <MiniStat icon={FaTools} label="Tools" value={formatNumber(countOwned(fakeAssets.tools))} tone="brass" />
                <MiniStat icon={FaFlask} label="Flasks" value={formatNumber(countOwned(fakeAssets.flasks))} tone="cyan" />
                <MiniStat icon={FaBook} label="Recipes" value={formatNumber(recipes.length)} tone="violet" />
                <MiniStat icon={FaFlask} label="Potions" value={formatNumber(countOwned(fakeAssets.potions))} tone="violet" />
                <MiniStat icon={FaClock} label="Active jobs" value={formatNumber(userActiveJobs.length)} tone="amber" />
            </SimpleGrid>
            <Button
                size="sm"
                bg="rgba(216, 181, 109, 0.12)"
                color={theme.brass}
                border="1px solid"
                borderColor={tones.brass.border}
                _hover={{ bg: 'rgba(216, 181, 109, 0.18)' }}
                onClick={() => setActiveView('inventory')}
            >
                Open Pantry
            </Button>
        </Stack>
    </CockpitPanel>
);

const NextActionCard = ({ icon, title, body, action, tone = 'emerald', onClick }) => (
    <CockpitPanel as="button" type="button" p={4} tone={tone} interactive textAlign="left" onClick={onClick}>
        <HStack spacing={4} align="center" position="relative" zIndex={1}>
            <ToneIcon icon={icon} tone={tone} size="58px" />
            <Box minW={0} flex="1">
                <Text color="white" fontWeight="black" noOfLines={2} lineHeight="1.15">
                    {title}
                </Text>
                <Text color={theme.textMuted} fontSize="sm" noOfLines={3} mt={1}>
                    {body}
                </Text>
                <HStack mt={3} color={tones[tone]?.color || theme.emerald} fontSize="sm" fontWeight="black">
                    <Text>{action}</Text>
                    <Icon as={FaChevronRight} fontSize="11px" />
                </HStack>
            </Box>
        </HStack>
    </CockpitPanel>
);

const WorldLedgerPanel = ({ jobs, recipes, supply }) => {
    const activeAlchemists = new Set([...jobs.active, ...jobs.completed].map(job => job.owner).filter(Boolean)).size;
    return (
        <CockpitPanel p={5}>
            <SectionHeader label="World ledger" title="Elyxir economy" />
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mt={5}>
                <MiniStat icon={FaUsers} label="Alchemists at work" value={formatNumber(activeAlchemists)} tone="brass" />
                <MiniStat
                    icon={FaFlask}
                    label="Potions in world"
                    value={supply.loading ? '...' : supply.total != null ? formatNumber(supply.total) : formatNumber(recipes.length)}
                    tone="emerald"
                />
                <MiniStat icon={FaBook} label="Recipes discovered" value={formatNumber(recipes.length)} tone="violet" />
                <MiniStat icon={FaFire} label="Potions brewed" value={formatNumber(jobs.completed.length)} tone="amber" />
            </SimpleGrid>
        </CockpitPanel>
    );
};

const RaceInfoPanel = ({ activeJobsCount, leaderboardCount }) => {
    const raceLive = Date.now() >= RACE_START_DATE.getTime();

    return (
        <CockpitPanel p={5} tone={raceLive ? 'emerald' : 'violet'} h="100%">
            <Stack spacing={4} position="relative" zIndex={1}>
                <HStack justify="space-between" align="flex-start">
                    <Box>
                        <Eyebrow tone={raceLive ? 'emerald' : 'violet'}>Elyxir Race</Eyebrow>
                        <Heading size="md">First delivery wins per potion</Heading>
                    </Box>
                    <StatusChip tone={raceLive ? 'emerald' : 'violet'} icon={FaFlagCheckered}>
                        {raceLive ? 'Live' : 'Scheduled'}
                    </StatusChip>
                </HStack>
                <Stack spacing={2} color={theme.textMuted} fontSize="sm">
                    <Text>
                        Starts {formatUtcDateTime(RACE_START_DATE)} / local {formatLocalDateTime(RACE_START_DATE, { year: true, timeZoneName: true })}.
                    </Text>
                    <Text>Only successful deliveries resolved after the published start count. Brew duration remains part of the strategy.</Text>
                </Stack>
                <SimpleGrid columns={2} spacing={3}>
                    <MiniStat icon={FaClock} label="Active jobs" value={formatNumber(activeJobsCount)} tone="amber" />
                    <MiniStat icon={FaTrophy} label="First deliveries" value={formatNumber(leaderboardCount)} tone="emerald" />
                </SimpleGrid>
            </Stack>
        </CockpitPanel>
    );
};

const RaceResultsPanel = ({ leaderboard, accountLabels, setActiveView }) => (
    <CockpitPanel p={5} tone="emerald" h="100%">
        <SectionHeader
            label="Race board"
            title="First deliveries by potion"
            caption="Source of truth is resolved Elyxir job state and block time."
            action={
                <Button
                    size="sm"
                    variant="ghost"
                    color={theme.textMuted}
                    rightIcon={<FaChevronRight />}
                    onClick={() => setActiveView('jobs')}
                >
                    Queue
                </Button>
            }
        />
        <Stack spacing={3} mt={5}>
            {leaderboard.length === 0 && (
                <Text color={theme.textMuted} fontSize="sm">
                    No verified post-start potion deliveries yet.
                </Text>
            )}
            {leaderboard.slice(0, 8).map(entry => (
                <HStack key={`${entry.creationAssetId}-${entry.jobId}`} justify="space-between" spacing={3}>
                    <HStack minW={0}>
                        <AssetImage src={entry.potion?.imgUrl} boxSize="38px" flexShrink={0} />
                        <Box minW={0}>
                            <Text fontSize="sm" fontWeight="black" noOfLines={1}>
                                {entry.potion?.name || `Potion ${String(entry.creationAssetId).slice(-6)}`}
                            </Text>
                            <Text color={theme.textFaint} fontSize="xs" noOfLines={1}>
                                {getOwnerLabel(entry, accountLabels)}
                            </Text>
                        </Box>
                    </HStack>
                    <Box textAlign="right" flexShrink={0}>
                        <Badge colorScheme={entry.ardorTimestamp != null ? 'green' : 'yellow'} borderRadius="6px">
                            {entry.verification}
                        </Badge>
                        <Text color={theme.textMuted} fontSize="xs" mt={1}>
                            {entry.resolvedDate ? formatLocalDateTime(entry.resolvedDate) : `Height ${formatNumber(entry.resolveHeight)}`}
                        </Text>
                    </Box>
                </HStack>
            ))}
        </Stack>
    </CockpitPanel>
);

const LabJournalPanel = ({ recentJobs, potions, accountLabels, blockTimestamps, setActiveView }) => (
    <CockpitPanel p={5}>
        <SectionHeader
            label="Lab journal"
            title="Recent experiments"
            action={
                <Button
                    size="sm"
                    variant="ghost"
                    color={theme.textMuted}
                    rightIcon={<FaChevronRight />}
                    onClick={() => setActiveView('jobs')}
                >
                    View all
                </Button>
            }
        />
        <Stack spacing={3} mt={5}>
            {recentJobs.length === 0 && <Text color={theme.textMuted}>No experiments recorded yet.</Text>}
            {recentJobs.map(job => (
                <JobSummaryRow
                    key={job.jobId}
                    job={job}
                    potions={potions}
                    accountLabels={accountLabels}
                    blockTimestamps={blockTimestamps}
                    compact
                />
            ))}
        </Stack>
    </CockpitPanel>
);

const OverviewView = ({ infoAccount, setActiveView }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);
    const recipeDefinition = elyxir?.definition?.recipes;
    const recipes = useMemo(() => recipeDefinition || [], [recipeDefinition]);
    const jobs = useMemo(() => getJobCollections(elyxir), [elyxir]);
    const supply = usePotionSupply(recipes);
    const accountId = useMemo(() => getAccountId(infoAccount), [infoAccount]);
    const userActiveJobs = jobs.active.filter(job => String(job.owner) === String(accountId));
    const ownedFlasks = (fakeAssets.flasks || []).filter(item => Number(item.quantityQNT || 0) > 0);
    const recipeReadiness = useMemo(() => getRecipeReadiness(recipes, fakeAssets, ownedFlasks), [recipes, fakeAssets, ownedFlasks]);
    const nextCraft = recipeReadiness[0];
    const craftableRecipes = recipeReadiness.filter(item => item.missing.length === 0);
    const blockTimestamps = useBlockTimestamps(jobs.completed);
    const raceLeaderboard = useMemo(
        () =>
            buildRaceLeaderboard({
                jobs: jobs.completed,
                potions: fakeAssets.potions,
                blockTimestamps,
                currentHeight: prev_height,
            }),
        [jobs.completed, fakeAssets.potions, blockTimestamps, prev_height]
    );
    const recentJobs = useMemo(
        () =>
            [...jobs.active, ...jobs.completed]
                .sort((a, b) => Number(b.startHeight || 0) - Number(a.startHeight || 0))
                .slice(0, 5),
        [jobs.active, jobs.completed]
    );
    const labelJobs = useMemo(() => [...jobs.active, ...recentJobs, ...raceLeaderboard], [jobs.active, recentJobs, raceLeaderboard]);
    const accountLabels = useAccountLabels(labelJobs);
    const playerName = infoAccount?.name || 'Alchemist';
    const ingredientsOwned = countOwned(fakeAssets.ingredients);
    const introText = `${userActiveJobs.length ? `${formatNumber(userActiveJobs.length)} potion${userActiveJobs.length === 1 ? '' : 's'} brewing.` : 'No potion is brewing.'} Your shelves hold ${formatNumber(ingredientsOwned)} ingredients. ${
        craftableRecipes.length ? `${formatNumber(craftableRecipes.length)} recipe${craftableRecipes.length === 1 ? ' is' : 's are'} ready.` : 'No recipe is ready yet.'
    }`;

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Laboratory"
                title={`Welcome back, Alchemist ${playerName}`}
                caption={introText}
            />

            <Grid templateColumns={{ base: '1fr', xl: '1.25fr 0.85fr 0.9fr' }} gap={4}>
                <BrewingNowPanel jobs={jobs.active} potions={fakeAssets.potions} accountLabels={accountLabels} />
                <RaceInfoPanel activeJobsCount={jobs.active.length} leaderboardCount={raceLeaderboard.length} />
                <RecipeStatusPanel nextCraft={nextCraft} craftableRecipes={craftableRecipes} setActiveView={setActiveView} />
            </Grid>

            <Grid templateColumns={{ base: '1fr', xl: 'minmax(320px, 0.75fr) minmax(0, 1.25fr)' }} gap={4}>
                <ShelvesPanel fakeAssets={fakeAssets} userActiveJobs={userActiveJobs} recipes={recipes} setActiveView={setActiveView} />
                <RaceResultsPanel leaderboard={raceLeaderboard} accountLabels={accountLabels} setActiveView={setActiveView} />
            </Grid>

            <CockpitPanel p={5}>
                <SectionHeader label="Next best action" title="Choose the next lab move" />
                <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3} mt={5}>
                    <NextActionCard
                        icon={FaLeaf}
                        title="Gather missing ingredients"
                        body={`${formatNumber(nextCraft?.missing?.length || 0)} component(s) block the nearest recipe.`}
                        action="Go to Pantry"
                        tone="emerald"
                        onClick={() => setActiveView('inventory')}
                    />
                    <NextActionCard
                        icon={FaBook}
                        title="Open recipe book"
                        body="Review recipes and plan the next brew."
                        action="Open Workbench"
                        tone="violet"
                        onClick={() => setActiveView('alchemy')}
                    />
                    <NextActionCard
                        icon={FaClock}
                        title="Check brewing queue"
                        body="Track active experiments and upcoming results."
                        action="View Queue"
                        tone="amber"
                        onClick={() => setActiveView('jobs')}
                    />
                    <NextActionCard
                        icon={FaGift}
                        title="Visit supply board"
                        body="Claim rewards and learn how to obtain rare supplies."
                        action="Open Supply Board"
                        tone="cyan"
                        onClick={() => setActiveView('airdrops')}
                    />
                </SimpleGrid>
            </CockpitPanel>

            <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 0.9fr) minmax(360px, 0.7fr)' }} gap={4}>
                <WorldLedgerPanel jobs={jobs} recipes={recipes} supply={supply} />
                <LabJournalPanel
                    recentJobs={recentJobs}
                    potions={fakeAssets.potions}
                    accountLabels={accountLabels}
                    blockTimestamps={blockTimestamps}
                    setActiveView={setActiveView}
                />
            </Grid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <MetricCard
                    icon={FaLayerGroup}
                    label="Flask tiers"
                    value={formatNumber(Object.keys(elyxir?.definition?.flaskMultipliers || {}).length)}
                    tone="cyan"
                    caption="Available vessel capacities"
                />
                <MetricCard
                    icon={FaChartLine}
                    label="Ruleset version"
                    value={elyxir?.definition?.version || '-'}
                    caption="On-chain Elyxir definition"
                    tone="emerald"
                />
                <MetricCard
                    icon={FaFire}
                    label="Total burned"
                    value={formatNumber(elyxir?.totalBurned)}
                    caption={elyxir?.operationFee ? `Operation fee ${elyxir.operationFee}` : undefined}
                    tone="amber"
                />
            </SimpleGrid>
        </Stack>
    );
};

const FilterButton = ({ filter, active, onClick }) => (
    <Button
        size="sm"
        h="38px"
        px={4}
        borderRadius="8px"
        bg={active ? theme.emerald : 'rgba(255, 255, 255, 0.04)'}
        color={active ? '#06110b' : 'rgba(236, 246, 243, 0.82)'}
        border="1px solid"
        borderColor={active ? 'rgba(91, 224, 141, 0.55)' : theme.line}
        _hover={{ bg: active ? theme.emerald : 'rgba(255, 255, 255, 0.08)' }}
        onClick={onClick}
    >
        {filter.label}
    </Button>
);

const InventoryTile = ({ item, recipes }) => {
    const quantity = Number(item.quantityQNT || 0);
    const tone = tones[item.tone] || tones.emerald;
    const useCount = getAssetUseCount(item.asset, item.type, recipes);
    const helperText =
        item.type === 'flasks'
            ? 'Vessel for brewing'
            : item.type === 'recipes'
              ? 'Recipe fragment'
            : item.type === 'potions'
              ? 'Finished brew'
              : useCount
                ? `Used in ${formatNumber(useCount)} recipe${useCount === 1 ? '' : 's'}`
                : 'Known supply';

    return (
        <CockpitPanel p={3} tone={quantity > 0 ? item.tone : 'neutral'} interactive>
            <HStack align="center" spacing={3} position="relative" zIndex={1} minH="78px">
                <Circle
                    size="62px"
                    bg={quantity > 0 ? tone.bg : 'rgba(255, 255, 255, 0.04)'}
                    border="1px solid"
                    borderColor={quantity > 0 ? tone.border : theme.line}
                    flexShrink={0}
                >
                    <AssetImage src={item.imgUrl} boxSize="46px" />
                </Circle>
                <Box minW={0} flex="1">
                    <Text fontWeight="black" fontSize="sm" noOfLines={1}>
                        {item.name}
                    </Text>
                    <Text color={theme.textFaint} fontSize="xs" noOfLines={1}>
                        {item.typeLabel}
                    </Text>
                    <Badge
                        mt={2}
                        bg="rgba(216, 181, 109, 0.08)"
                        color={theme.brass}
                        border="1px solid rgba(216, 181, 109, 0.16)"
                        borderRadius="6px"
                        fontWeight="normal"
                    >
                        {helperText}
                    </Badge>
                </Box>
                <Badge
                    bg={quantity > 0 ? tone.bg : 'rgba(238, 125, 111, 0.08)'}
                    color={quantity > 0 ? tone.color : theme.danger}
                    border="1px solid"
                    borderColor={quantity > 0 ? tone.border : tones.danger.border}
                    borderRadius="6px"
                >
                    {formatNumber(quantity)}
                </Badge>
            </HStack>
        </CockpitPanel>
    );
};

const InventoryView = ({ infoAccount }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const recipeDefinition = elyxir?.definition?.recipes;
    const recipes = useMemo(() => recipeDefinition || [], [recipeDefinition]);
    const [filter, setFilter] = useState(getInitialInventoryFilter);
    const [search, setSearch] = useState('');
    const inventory = useMemo(() => getInventoryItems(fakeAssets, recipes, infoAccount), [fakeAssets, infoAccount, recipes]);
    const missingItems = useMemo(() => getMissingShelfItems(recipes, fakeAssets).slice(0, 4), [recipes, fakeAssets]);
    const filterCounts = useMemo(
        () =>
            TYPE_FILTERS.reduce((counts, item) => {
                counts[item.id] = item.id === 'all' ? inventory.length : inventory.filter(asset => asset.type === item.id).length;
                return counts;
            }, {}),
        [inventory]
    );
    const visibleItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const filtered = filter === 'all' ? inventory : inventory.filter(item => item.type === filter);
        return filtered
            .filter(item => !normalizedSearch || item.name?.toLowerCase().includes(normalizedSearch) || item.typeLabel?.toLowerCase().includes(normalizedSearch))
            .sort((a, b) => Number(b.quantityQNT || 0) - Number(a.quantityQNT || 0));
    }, [filter, inventory, search]);

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Pantry"
                title="Your shelves"
                caption="A well-kept cabinet keeps the alchemist prepared. Store ingredients, tools, flasks, recipes and potions."
            />

            <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1.25fr) minmax(360px, 0.75fr)' }} gap={4}>
                <CockpitPanel p={4}>
                    <HStack spacing={2} overflowX="auto" pb={2}>
                        {TYPE_FILTERS.map(item => (
                            <FilterButton
                                key={item.id}
                                filter={{ ...item, label: `${item.label} ${formatNumber(filterCounts[item.id] || 0)}` }}
                                active={filter === item.id}
                                onClick={() => setFilter(item.id)}
                            />
                        ))}
                    </HStack>
                    <InputGroup mt={3}>
                        <InputLeftElement pointerEvents="none" color={theme.textFaint}>
                            <FaSearch />
                        </InputLeftElement>
                        <Input
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Search your shelves..."
                            bg="rgba(255, 255, 255, 0.035)"
                            borderColor={theme.line}
                            _placeholder={{ color: theme.textFaint }}
                        />
                    </InputGroup>
                </CockpitPanel>

                <CockpitPanel p={4} tone={missingItems.length ? 'amber' : 'emerald'}>
                    <HStack justify="space-between" mb={3}>
                        <Eyebrow tone={missingItems.length ? 'amber' : 'emerald'}>Missing from your shelves</Eyebrow>
                        <Badge bg="rgba(255,255,255,0.05)" color={theme.textMuted}>
                            {formatNumber(missingItems.length)}
                        </Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} spacing={2}>
                        {missingItems.length === 0 && (
                            <Text color={theme.textMuted} fontSize="sm">
                                No priority missing components for known recipes.
                            </Text>
                        )}
                        {missingItems.map(item => (
                            <HStack
                                key={`${item.type}-${item.asset}`}
                                p={2}
                                border="1px solid"
                                borderColor={tones.amber.border}
                                borderRadius="8px"
                                bg="rgba(244, 180, 95, 0.06)"
                            >
                                <AssetImage src={item.imgUrl} boxSize="38px" flexShrink={0} />
                                <Box minW={0}>
                                    <Text fontSize="sm" fontWeight="black" noOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text color={theme.danger} fontSize="xs">
                                        {formatNumber(item.have)} / {formatNumber(item.needed)}
                                    </Text>
                                </Box>
                            </HStack>
                        ))}
                    </SimpleGrid>
                </CockpitPanel>
            </Grid>

            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
                {visibleItems.length === 0 && (
                    <CockpitPanel p={5} tone="neutral">
                        <Text color={theme.textMuted}>No shelf items match this view.</Text>
                    </CockpitPanel>
                )}
                {visibleItems.map(item => (
                    <InventoryTile key={`${item.type}-${item.asset}`} item={item} recipes={recipes} />
                ))}
            </SimpleGrid>
        </Stack>
    );
};

const JobRow = ({ job, accountLabels, blockTimestamps }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const active = job.status === 'STARTED';

    return (
        <CockpitPanel p={4} tone={active ? 'amber' : isJobSuccessful(job) ? 'emerald' : 'danger'}>
            <Box position="relative" zIndex={1}>
                <JobSummaryRow
                    job={job}
                    potions={fakeAssets.potions}
                    accountLabels={accountLabels}
                    blockTimestamps={blockTimestamps}
                    bare
                />
            </Box>
        </CockpitPanel>
    );
};

const JobsView = ({ infoAccount }) => {
    const { elyxir } = useSelector(state => state.elyxir);
    const accountId = useMemo(() => getAccountId(infoAccount), [infoAccount]);
    const jobs = useMemo(() => getJobCollections(elyxir), [elyxir]);
    const raceWatchJobs = useMemo(
        () => jobs.active.slice().sort((a, b) => Number(a.endHeight || 0) - Number(b.endHeight || 0)),
        [jobs.active]
    );
    const activeJobs = useMemo(() => jobs.active.filter(job => String(job.owner) === String(accountId)), [jobs.active, accountId]);
    const completedJobs = useMemo(
        () =>
            jobs.completed
                .filter(job => String(job.owner) === String(accountId))
                .sort((a, b) => Number(getJobResolveHeight(b) || 0) - Number(getJobResolveHeight(a) || 0)),
        [jobs.completed, accountId]
    );
    const blockTimestamps = useBlockTimestamps(completedJobs);
    const labelJobs = useMemo(() => [...raceWatchJobs, ...activeJobs, ...completedJobs], [raceWatchJobs, activeJobs, completedJobs]);
    const accountLabels = useAccountLabels(labelJobs);

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Laboratory / Brewing Queue"
                title="Potions in preparation"
                caption="Track the global Race watch while keeping your own active and completed jobs separate."
            />

            <CockpitPanel p={5}>
                <SectionHeader
                    label="Race watch"
                    title="Global active brews"
                    caption="Sorted by expected finalization so players can read the field at a glance."
                />
                <Stack spacing={3} mt={5}>
                    {raceWatchJobs.length === 0 && (
                        <Stack align="center" textAlign="center" py={10}>
                            <ToneIcon icon={FaFlask} tone="cyan" size="64px" />
                            <Heading size="sm">No active Race watch jobs</Heading>
                            <Text color={theme.textMuted}>Active Elyxir jobs will appear here as soon as they are submitted.</Text>
                        </Stack>
                    )}
                    {raceWatchJobs.map(job => (
                        <JobRow key={job.jobId} job={job} accountLabels={accountLabels} blockTimestamps={blockTimestamps} />
                    ))}
                </Stack>
            </CockpitPanel>

            <CockpitPanel p={5}>
                <SectionHeader label="My jobs" title="Currently simmering" />
                <Stack spacing={3} mt={5}>
                    {activeJobs.length === 0 && (
                        <Stack align="center" textAlign="center" py={10}>
                            <ToneIcon icon={FaFlask} tone="cyan" size="64px" />
                            <Heading size="sm">No active brews</Heading>
                            <Text color={theme.textMuted}>Start a potion from the Workbench to fill this queue.</Text>
                        </Stack>
                    )}
                    {activeJobs
                        .slice()
                        .sort((a, b) => Number(a.endHeight || 0) - Number(b.endHeight || 0))
                        .map(job => (
                            <JobRow key={job.jobId} job={job} accountLabels={accountLabels} blockTimestamps={blockTimestamps} />
                        ))}
                </Stack>
            </CockpitPanel>

            <CockpitPanel p={5}>
                <SectionHeader label="My lab journal" title="Completed and failed experiments" />
                <Stack spacing={3} mt={5}>
                    {completedJobs.length === 0 && <Text color={theme.textMuted}>No completed experiments yet.</Text>}
                    {completedJobs.map(job => (
                        <JobRow key={job.jobId} job={job} accountLabels={accountLabels} blockTimestamps={blockTimestamps} />
                    ))}
                </Stack>
            </CockpitPanel>
        </Stack>
    );
};

const SUPPLY_FILTERS = [
    { id: 'all', label: 'All supplies' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'tools', label: 'Tools' },
    { id: 'flasks', label: 'Flasks' },
    { id: 'recipes', label: 'Recipes' },
];

const getInitialSupplyFilter = () => {
    const requestedFilter = new URLSearchParams(window.location.search).get('supply');
    return SUPPLY_FILTERS.some(item => item.id === requestedFilter) ? requestedFilter : 'all';
};

const getSupplyMeta = type => {
    if (type === 'ingredients') {
        return {
            kind: 'Ingredient',
            source: 'Incubation',
            method: 'Incubate eligible cards',
            status: 'Active',
            cta: 'Open Incubation',
            section: 1,
            tone: 'emerald',
        };
    }
    if (type === 'tools') {
        return {
            kind: 'Tool',
            source: 'Social campaigns',
            method: 'Rotating quests',
            status: 'Rotating',
            cta: 'Open Market',
            section: 3,
            tone: 'brass',
        };
    }
    if (type === 'flasks') {
        return {
            kind: 'Flask',
            source: 'Bounty cycles',
            method: 'Bounty and collection rewards',
            status: 'Claimable',
            cta: 'Open Inventory',
            section: 1,
            tone: 'cyan',
        };
    }
    if (type === 'recipes') {
        return {
            kind: 'Recipe',
            source: 'GIFTZ recipes',
            method: 'Open GIFTZ packs',
            status: 'Discover',
            cta: 'Open Inventory',
            section: 1,
            tone: 'violet',
        };
    }

    return {
        kind: 'Potion',
        source: 'Workbench',
        method: 'Brew in Alchemy',
        status: 'Craft',
        cta: 'Open Workbench',
        section: 10,
        tone: 'amber',
    };
};

const SupplyRoute = ({ icon, title, body, tone }) => (
    <HStack
        spacing={3}
        p={3}
        border="1px solid"
        borderColor={tones[tone]?.border || theme.line}
        bg={tones[tone]?.bg || 'rgba(255,255,255,0.04)'}
        borderRadius="8px"
        minW="190px"
    >
        <ToneIcon icon={icon} tone={tone} size="36px" />
        <Box minW={0}>
            <Text fontWeight="black" fontSize="sm" noOfLines={1}>
                {title}
            </Text>
            <Text color={theme.textMuted} fontSize="xs" noOfLines={2}>
                {body}
            </Text>
        </Box>
    </HStack>
);

const SupplyCard = ({ item, infoAccount, onNavigate, focusedAssetId }) => {
    const meta = getSupplyMeta(item.type);
    const owned = Number(item.quantityQNT || 0) > 0;
    const actionTone = owned ? 'brass' : meta.tone;
    const source = item.type === 'ingredients' ? getIncubationSourceByIngredientAsset(item.asset) : null;
    const ownership = getIncubationOwnership(source, infoAccount?.assets || []);
    const isFocused = String(focusedAssetId || '') === String(item.asset || '');

    return (
        <CockpitPanel
            p={4}
            tone={meta.tone}
            interactive
            data-supply-asset={item.asset}
            outline={isFocused ? '2px solid rgba(216, 181, 109, 0.86)' : undefined}
            outlineOffset={isFocused ? '2px' : undefined}
        >
            <Stack spacing={4} position="relative" zIndex={1} minH="260px">
                <HStack justify="space-between" align="flex-start">
                    <HStack spacing={2} wrap="wrap">
                        <Badge bg={tones[meta.tone]?.bg} color={tones[meta.tone]?.color} borderRadius="6px">
                            {meta.kind}
                        </Badge>
                        <Badge bg="rgba(185, 155, 255, 0.10)" color={theme.violet} borderRadius="6px">
                            Ardor
                        </Badge>
                        {source && (
                            <Badge bg="rgba(87, 214, 141, 0.12)" color={theme.emerald} borderRadius="6px">
                                {source.rarity}
                            </Badge>
                        )}
                    </HStack>
                    <Badge colorScheme={owned ? 'green' : 'orange'}>{owned ? 'Owned' : meta.status}</Badge>
                </HStack>

                <HStack spacing={4} align="center">
                    <Circle
                        size="94px"
                        bg={tones[meta.tone]?.bg}
                        border="1px solid"
                        borderColor={tones[meta.tone]?.border}
                        flexShrink={0}
                    >
                        <AssetImage src={item.imgUrl} boxSize="70px" />
                    </Circle>
                    <Box minW={0}>
                        <Heading size="sm" noOfLines={2}>
                            {item.name}
                        </Heading>
                        <Text color={theme.textMuted} fontSize="sm" noOfLines={3} mt={2}>
                            {item.description || `${meta.kind} used by Elyxir alchemists.`}
                        </Text>
                    </Box>
                </HStack>

                <Stack spacing={2} mt="auto">
                    {source ? (
                        <>
                            <HStack
                                spacing={3}
                                p={3}
                                border="1px solid"
                                borderColor="rgba(87, 214, 141, 0.22)"
                                bg="rgba(87, 214, 141, 0.07)"
                                borderRadius="8px"
                            >
                                <Image src={source.cardImage} alt={source.cardName} boxSize="48px" objectFit="cover" borderRadius="6px" />
                                <Box minW={0}>
                                    <Text fontSize="xs" color={theme.textMuted}>
                                        Incubate
                                    </Text>
                                    <Text fontWeight="black" fontSize="sm" noOfLines={1}>
                                        {source.cardName}
                                    </Text>
                                    <Text fontSize="xs" color={theme.textMuted}>
                                        {source.minCards} cards = 1 {item.name}
                                    </Text>
                                </Box>
                            </HStack>
                            <HStack justify="space-between" color={theme.textMuted} fontSize="sm">
                                <Text>Cards owned</Text>
                                <Text color="white" textAlign="right">
                                    {formatNumber(ownership?.ownedCards || 0)} / {formatNumber(source.minCards)}
                                </Text>
                            </HStack>
                            <HStack justify="space-between" color={theme.textMuted} fontSize="sm">
                                <Text>Status</Text>
                                <Text color={ownership?.ready ? theme.emerald : theme.brass} textAlign="right" fontWeight="bold">
                                    {ownership?.ready ? 'Ready to incubate' : `Missing ${formatNumber(ownership?.missingCards || source.minCards)}`}
                                </Text>
                            </HStack>
                            <Stack direction={{ base: 'column', sm: 'row' }} spacing={2} mt={2}>
                                <Button
                                    size="sm"
                                    flex="1"
                                    bg={tones.emerald.bg}
                                    color={tones.emerald.color}
                                    border="1px solid"
                                    borderColor={tones.emerald.border}
                                    _hover={{ bg: tones.emerald.bg }}
                                    onClick={() => onNavigate(1, { incubationIngredientId: item.asset })}
                                >
                                    Incubate {source.cardName}
                                </Button>
                                <Button
                                    size="sm"
                                    flex="1"
                                    variant="outline"
                                    borderColor={tones.brass.border}
                                    color={tones.brass.color}
                                    _hover={{ bg: tones.brass.bg }}
                                    onClick={() => onNavigate(3, { marketAssetId: source.cardAssetId })}
                                >
                                    Find card in Market
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <HStack justify="space-between" color={theme.textMuted} fontSize="sm">
                                <Text>Requirement</Text>
                                <Text color="white" textAlign="right">
                                    {meta.source}
                                </Text>
                            </HStack>
                            <HStack justify="space-between" color={theme.textMuted} fontSize="sm">
                                <Text>Method</Text>
                                <Text color="white" textAlign="right">
                                    {meta.method}
                                </Text>
                            </HStack>
                            <Button
                                size="sm"
                                mt={2}
                                bg={tones[actionTone]?.bg}
                                color={tones[actionTone]?.color}
                                border="1px solid"
                                borderColor={tones[actionTone]?.border}
                                _hover={{ bg: tones[actionTone]?.bg }}
                                onClick={() => onNavigate(meta.section)}
                            >
                                {owned ? 'View Details' : meta.cta}
                            </Button>
                        </>
                    )}
                </Stack>
            </Stack>
        </CockpitPanel>
    );
};

const getSupplyFilterForFocus = focus => {
    const type = String(focus?.type || '').toLowerCase();
    if (type.includes('ingredient')) return 'ingredients';
    if (type.includes('tool')) return 'tools';
    if (type.includes('flask')) return 'flasks';
    if (type.includes('recipe')) return 'recipes';
    return 'all';
};

const AirdropsView = ({ goToSection, infoAccount, focus }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const [filter, setFilter] = useState(getInitialSupplyFilter);
    const [search, setSearch] = useState('');
    const recipeDefinition = elyxir?.definition?.recipes;
    const recipes = useMemo(() => recipeDefinition || [], [recipeDefinition]);
    const focusedAssetId = focus?.assetId || focus?.asset || '';
    const recipeItems = useMemo(
        () =>
            recipes.map((recipe, index) => {
                const potion = getPotionForAsset(recipe.creationAssetId, fakeAssets.potions);
                return {
                    asset: recipe.recipeAssetId,
                    name: `${potion.name} recipe`,
                    description: 'Recipe fragment discovered from GIFTZ rewards.',
                    imgUrl: `/images/elyxir/recipes/recipe${(index % 2) + 1}-transparent.png`,
                    quantityQNT: 0,
                    type: 'recipes',
                };
            }),
        [recipes, fakeAssets.potions]
    );
    const supplies = useMemo(
        () => [
            ...(fakeAssets.ingredients || []).map(item => ({ ...item, type: 'ingredients' })),
            ...(fakeAssets.tools || []).map(item => ({ ...item, type: 'tools' })),
            ...(fakeAssets.flasks || []).map(item => ({ ...item, type: 'flasks' })),
            ...recipeItems,
        ],
        [fakeAssets, recipeItems]
    );
    const visibleSupplies = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return supplies.filter(item => {
            const matchesFilter = filter === 'all' || item.type === filter;
            if (!matchesFilter) return false;
            if (!normalizedSearch) return true;

            const source = item.type === 'ingredients' ? getIncubationSourceByIngredientAsset(item.asset) : null;
            const searchText = [item.name, item.asset, item.description, source ? getIncubationSearchText(source) : '']
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchText.includes(normalizedSearch);
        });
    }, [filter, search, supplies]);

    useEffect(() => {
        if (!focusedAssetId) return;
        setFilter(getSupplyFilterForFocus(focus));
        setSearch(focus?.name || focusedAssetId);

        window.setTimeout(() => {
            const target = document.querySelector(`[data-supply-asset="${focusedAssetId}"]`);
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
    }, [focus, focusedAssetId]);

    return (
        <Stack spacing={5}>
            <SectionHeader
                label="Supply Board"
                title="Expeditions & Rewards"
                caption="Venture beyond the lab and gather rare materials from across Elyxir."
            />

            <CockpitPanel p={4}>
                <Eyebrow>Ways to acquire supplies</Eyebrow>
                <HStack spacing={3} overflowX="auto" mt={3} pb={1}>
                    <SupplyRoute icon={FaLeaf} title="Incubation" body="Incubate eligible cards for ingredients." tone="emerald" />
                    <SupplyRoute icon={FaTools} title="Bounty cycles" body="Campaigns and bounty rewards." tone="brass" />
                    <SupplyRoute icon={FaBoxes} title="Collection rewards" body="Complete sets for exclusive flasks." tone="cyan" />
                    <SupplyRoute icon={FaGift} title="GIFTZ recipes" body="Open GIFTZ packs to discover recipes." tone="violet" />
                    <SupplyRoute icon={FaUsers} title="Social campaigns" body="Join quests and community events." tone="amber" />
                </HStack>
            </CockpitPanel>

            <Stack direction={{ base: 'column', lg: 'row' }} spacing={3} align={{ base: 'stretch', lg: 'center' }}>
                <InputGroup maxW={{ base: '100%', lg: '420px' }}>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color={theme.textMuted} />
                    </InputLeftElement>
                    <Input
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Search supply, ingredient, or card"
                        bg="rgba(255,255,255,0.04)"
                        borderColor={theme.line}
                    />
                </InputGroup>
                <HStack spacing={2} overflowX="auto" pb={1}>
                    {SUPPLY_FILTERS.map(item => (
                        <FilterButton key={item.id} filter={item} active={filter === item.id} onClick={() => setFilter(item.id)} />
                    ))}
                </HStack>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
                {visibleSupplies.map(item => (
                    <SupplyCard
                        key={`${item.type}-${item.asset}`}
                        item={item}
                        infoAccount={infoAccount}
                        focusedAssetId={focusedAssetId}
                        onNavigate={goToSection}
                    />
                ))}
            </SimpleGrid>
            {visibleSupplies.length === 0 && (
                <CockpitPanel p={6}>
                    <Text color={theme.textMuted}>No supplies match this search.</Text>
                </CockpitPanel>
            )}
        </Stack>
    );
};

const PlayHubElyxirShell = ({ infoAccount, walletProvider, walletHostOrigin }) => {
    const [activeView, setActiveView] = useState(getInitialView);
    const [supplyFocus, setSupplyFocus] = useState(null);
    const isDesktop = useBreakpointValue({ base: false, lg: true });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const activeItem = NAV_ITEMS.find(item => item.id === activeView) || NAV_ITEMS[0];

    const handleSelect = view => {
        if (view === 'airdrops') setSupplyFocus(null);
        setActiveView(view);
        onClose();
    };

    const handleGoToSection = (section, params = undefined) => {
        if (section === 10) {
            setActiveView('alchemy');
            onClose();
            return;
        }

        window.parent.postMessage(
            {
                type: 'MYTHICAL_WALLET_NAVIGATE',
                section,
                ...(params ? { params } : {}),
            },
            walletHostOrigin
        );
    };

    const handleOpenSupplyBoard = item => {
        const assetId = item?.assetId || item?.asset || '';
        setSupplyFocus(
            assetId
                ? {
                      assetId,
                      type: item?.type,
                      name: item?.name,
                  }
                : null
        );
        setActiveView('airdrops');
        onClose();
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'alchemy':
                return (
                    <Elyxir
                        infoAccount={infoAccount}
                        walletProvider={walletProvider}
                        walletHostOrigin={walletHostOrigin}
                        embedded
                        onOpenPantry={() => setActiveView('inventory')}
                        onOpenSupplyBoard={handleOpenSupplyBoard}
                    />
                );
            case 'inventory':
                return <InventoryView infoAccount={infoAccount} />;
            case 'jobs':
                return <JobsView infoAccount={infoAccount} />;
            case 'airdrops':
                return <AirdropsView goToSection={handleGoToSection} infoAccount={infoAccount} focus={supplyFocus} />;
            case 'overview':
            default:
                return <OverviewView infoAccount={infoAccount} setActiveView={setActiveView} />;
        }
    };

    return (
        <Flex
            minH="100vh"
            bg={theme.bg}
            backgroundImage="linear-gradient(90deg, rgba(5, 8, 9, 0.84) 0%, rgba(5, 8, 9, 0.58) 42%, rgba(5, 8, 9, 0.30) 100%), linear-gradient(180deg, rgba(5, 8, 9, 0.24) 0%, rgba(5, 8, 9, 0.70) 94%), url('/images/elyxir/backgrounds/lab-cockpit-bg-v2.webp')"
            backgroundSize="cover, cover, cover"
            backgroundPosition="center, center, center"
            backgroundAttachment={{ base: 'scroll', lg: 'fixed' }}
            backgroundRepeat="no-repeat"
            color="white"
            position="relative"
            fontFamily="'Inter', system-ui, sans-serif"
            _before={{
                content: '""',
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage:
                    'linear-gradient(rgba(216, 181, 109, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(216, 181, 109, 0.035) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
                opacity: 0.28,
            }}
        >
            {isDesktop && (
                <Box
                    w="252px"
                    flexShrink={0}
                    bg="rgba(7, 12, 13, 0.82)"
                    backdropFilter="blur(16px)"
                    borderRight="1px solid"
                    borderColor={theme.line}
                    position="sticky"
                    top={0}
                    h="100vh"
                    zIndex={5}
                >
                    <SidebarContent activeView={activeView} infoAccount={infoAccount} onSelect={handleSelect} reserveHostBack />
                </Box>
            )}

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="#07100f" color="white">
                    <DrawerCloseButton />
                    <DrawerBody p={0}>
                        <SidebarContent activeView={activeView} infoAccount={infoAccount} onSelect={handleSelect} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Box flex="1" minW={0} position="relative" zIndex={1}>
                <HStack
                    h="66px"
                    px={{ base: 3, md: 5 }}
                    borderBottom="1px solid"
                    borderColor={theme.line}
                    bg="rgba(5, 8, 9, 0.70)"
                    backdropFilter="blur(12px)"
                    justify="space-between"
                    position="sticky"
                    top={0}
                    zIndex={4}
                >
                    <HStack minW={0} spacing={3}>
                        {!isDesktop && (
                            <Tooltip label="Open Elyxir navigation">
                                <IconButton
                                    aria-label="Open Elyxir navigation"
                                    icon={<FaBars />}
                                    onClick={onOpen}
                                    variant="ghost"
                                    color="white"
                                />
                            </Tooltip>
                        )}
                        <ToneIcon icon={activeItem.icon} tone={activeView === 'alchemy' ? 'emerald' : 'brass'} />
                        <Box minW={0}>
                            <Text fontSize="xs" color={theme.textFaint} textTransform="uppercase" fontWeight="black">
                                Elyxir / Play Hub
                            </Text>
                            <Text fontWeight="black" noOfLines={1}>
                                {activeItem.label}
                            </Text>
                        </Box>
                    </HStack>
                    <HStack spacing={2}>
                        <StatusChip tone="emerald" icon={FaShieldAlt}>
                            Play Hub
                        </StatusChip>
                    </HStack>
                </HStack>

                <Box px={{ base: 3, md: 5 }} py={5} maxW="1760px" mx="auto">
                    {renderActiveView()}
                </Box>
            </Box>
        </Flex>
    );
};

export default PlayHubElyxirShell;
