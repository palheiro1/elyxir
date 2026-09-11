/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Badge,
    Box,
    Button,
    Circle,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    Progress,
    SimpleGrid,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {
    FaCheckCircle,
    FaBook,
    FaBoxes,
    FaClock,
    FaExclamationTriangle,
    FaFlask,
    FaMinus,
    FaPlus,
    FaScroll,
    FaTools,
    FaUndo,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { checkPin } from '../../../utils/walletUtils';
import CraftingConfirmation from './Components/Modals/CraftingConfirmation';
import PinModal from './Components/Modals/PinModal';
import {
    getUserJobs,
    requestCraftPotionBatch,
    sendCraftPotionAssets,
    sendCraftPotionMessage,
} from '../../../services/Elyxir/elyxir';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';
import { getOmnoAssetBalances, withdrawElyxirAssetsFromOmno } from '../../../services/Ardor/omnoInterface';
import { calculateSuccessRateWithBlocks } from '../../../utils/elyxirUtils';
import {
    blocksToDurationLabel,
    clampDurationBlocks,
    formatLocalDateTime,
    getApproxDateForBlocks,
    getDurationBounds,
    getDurationPresets,
} from '../../../utils/elyxirRace';

const imageFallback = '/images/currency/potions.png';

const formatNumber = value => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric);
};

const getPotionForRecipe = (recipe, potions = []) =>
    potions.find(potion => String(potion?.asset) === String(recipe?.creationAssetId)) || {
        asset: recipe?.creationAssetId,
        name: `Potion ${String(recipe?.creationAssetId || '').slice(-6)}`,
        description: 'Elyxir potion',
        imgUrl: imageFallback,
        quantityQNT: 0,
    };

const getAccountAssetQuantity = (infoAccount, assetId) => {
    const ownedAsset = infoAccount?.assets?.find(asset => String(asset.asset) === String(assetId));
    return Number(ownedAsset?.quantityQNT || 0);
};

const getRecipeImage = (recipes = [], recipe) => {
    const index = recipes.findIndex(item => String(item.recipeAssetId) === String(recipe?.recipeAssetId));
    return `/images/elyxir/recipes/recipe${((Math.max(0, index) % 2) + 1)}-transparent.png`;
};

const getCraftBatchProgressText = progress => {
    const status = progress?.status;
    const remaining = Number(progress?.remaining);
    const total = Number(progress?.total);
    const remainingText =
        Number.isFinite(remaining) && Number.isFinite(total)
            ? ` ${remaining} of ${total} transaction${total === 1 ? '' : 's'} remaining.`
            : '';
    const labels = {
        preparing: 'Preparing crafting transactions...',
        broadcasting: 'Broadcasting required asset transfers...',
        transferring: 'Broadcasting required asset transfers...',
        awaiting_confirmations: 'Waiting for one blockchain confirmation on every transfer...',
        ready_to_finalize: 'Transfers confirmed. Finalizing the Elyxir craft...',
        finalizing: 'Sending the final Elyxir crafting message...',
        complete: 'Crafting job submitted.',
        stale: 'A transfer needs wallet recovery before Elyxir can finalize this craft.',
        error: 'Wallet batch failed.',
    };

    return `${labels[status] || 'Processing crafting transactions...'}${remainingText}`;
};

const Panel = ({ children, ...props }) => (
    <Box
        bg="rgba(16, 23, 27, 0.72)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="8px"
        boxShadow="0 18px 60px rgba(0, 0, 0, 0.28)"
        backdropFilter="blur(14px) saturate(1.08)"
        {...props}
    >
        {children}
    </Box>
);

const AssetImage = ({ src, boxSize = '52px', ...props }) => (
    <Image src={src || imageFallback} fallbackSrc={imageFallback} boxSize={boxSize} objectFit="contain" {...props} />
);

const MiniMetric = ({ label, value, icon, tone = '#57d68d' }) => (
    <Box bg="rgba(11, 17, 20, 0.70)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3} minH="74px">
        <HStack justify="space-between">
            <Box minW={0} flex="1">
                <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" fontWeight="bold" noOfLines={1}>
                    {label}
                </Text>
                <Text fontWeight="black" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.1" noOfLines={2} overflowWrap="anywhere">
                    {value}
                </Text>
            </Box>
            <Circle size="28px" bg="whiteAlpha.100" color={tone} flexShrink={0}>
                <Icon as={icon} />
            </Circle>
        </HStack>
    </Box>
);

const findAssetById = (fakeAssets, assetId) => {
    const collections = [fakeAssets.ingredients, fakeAssets.tools, fakeAssets.flasks, fakeAssets.potions];
    return collections.flatMap(collection => collection || []).find(item => String(item.asset) === String(assetId));
};

const getAssetFallbackName = (assetId, type) => `${type} ${String(assetId || '').slice(-6)}`;

const RecipeCard = ({ recipe, potion, selected, missingCount, statusLabel, statusScheme, onSelect }) => {
    const ready = statusScheme === 'green';

    return (
        <Box
            as="button"
            type="button"
            textAlign="left"
            w="100%"
            minH="88px"
            p={3}
            border="1px solid"
            borderColor={selected ? '#57d68d' : 'whiteAlpha.200'}
            bg={selected ? 'rgba(87, 214, 141, 0.14)' : 'rgba(11, 17, 20, 0.68)'}
            borderRadius="8px"
            transition="border-color 0.16s ease, background 0.16s ease"
            _hover={{ borderColor: ready ? '#57d68d' : '#f6ad55', bg: '#121d21' }}
            onClick={() => onSelect(recipe)}
        >
            <HStack spacing={3} align="center">
                <AssetImage src={potion?.imgUrl} boxSize="54px" flexShrink={0} />
                <Box minW={0} flex="1">
                    <Text color="white" fontWeight="black" fontSize="sm" noOfLines={1}>
                        {potion?.name}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="xs" noOfLines={1}>
                        {potion?.description || `Recipe ${String(recipe.recipeAssetId || '').slice(-6)}`}
                    </Text>
                    <HStack mt={2} spacing={2}>
                        <Badge colorScheme={statusScheme} borderRadius="6px">
                            {statusLabel || (ready ? 'Ready' : `${missingCount} missing`)}
                        </Badge>
                    </HStack>
                </Box>
            </HStack>
        </Box>
    );
};

const FlaskOption = ({ flask, selected, onSelect }) => {
    const quantity = Number(flask?.quantityQNT || 0);

    return (
        <Box
            as="button"
            type="button"
            disabled={quantity <= 0}
            opacity={quantity <= 0 ? 0.45 : 1}
            w="100%"
            minH="86px"
            p={2}
            border="1px solid"
            borderColor={selected ? '#d8b56d' : 'whiteAlpha.200'}
            bg={selected ? 'rgba(216, 181, 109, 0.14)' : 'rgba(11, 17, 20, 0.66)'}
            borderRadius="8px"
            _hover={{ borderColor: quantity > 0 ? '#d8b56d' : 'whiteAlpha.200' }}
            onClick={() => quantity > 0 && onSelect(flask)}
        >
            <Stack align="center" spacing={1}>
                <AssetImage src={flask?.imgUrl} boxSize="36px" />
                <Text color="white" fontWeight="bold" fontSize="xs" noOfLines={1}>
                    {flask?.name}
                </Text>
                <HStack spacing={2}>
                    <Badge colorScheme="cyan" borderRadius="6px">
                        x{flask?.multiplier || 0}
                    </Badge>
                    <Badge colorScheme={quantity > 0 ? 'green' : 'red'} borderRadius="6px">
                        {formatNumber(quantity)}
                    </Badge>
                </HStack>
            </Stack>
        </Box>
    );
};

const RequirementRow = ({ item, onFind }) => {
    const ok = item.have >= item.needed;

    return (
        <HStack
            justify="space-between"
            spacing={3}
            p={2}
            border="1px solid"
            borderColor={ok ? 'rgba(87, 214, 141, 0.22)' : 'rgba(246, 173, 85, 0.35)'}
            bg={ok ? 'rgba(87, 214, 141, 0.07)' : 'rgba(246, 173, 85, 0.08)'}
            borderRadius="8px"
        >
            <HStack minW={0} spacing={2}>
                <AssetImage src={item.imgUrl} boxSize="34px" flexShrink={0} />
                <Box minW={0}>
                    <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                        {item.name}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="xs">
                        {item.type}
                    </Text>
                </Box>
            </HStack>
            <Stack spacing={1} align="flex-end" flexShrink={0}>
                <Badge colorScheme={ok ? 'green' : 'red'} borderRadius="6px">
                    {formatNumber(item.have)} / {formatNumber(item.needed)}
                </Badge>
                {!ok && onFind && (
                    <Button size="xs" variant="outline" colorScheme="orange" onClick={onFind}>
                        Find source
                    </Button>
                )}
            </Stack>
        </HStack>
    );
};

const JobMiniRow = ({ job }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);
    const potion = fakeAssets.potions?.find(item => String(item.asset) === String(job.creationAssetId));
    const totalBlocks = Math.max(1, Number(job.endHeight || 0) - Number(job.startHeight || 0));
    const elapsedBlocks = Math.max(0, Number(prev_height || 0) - Number(job.startHeight || 0));
    const progress = Math.min(100, Math.max(0, (elapsedBlocks / totalBlocks) * 100));
    const blocksLeft = Math.max(0, Number(job.endHeight || 0) - Number(prev_height || 0));
    const finishDate = getApproxDateForBlocks(blocksLeft);

    return (
        <Box bg="rgba(11, 17, 20, 0.70)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
            <HStack spacing={3} align="flex-start">
                <AssetImage src={potion?.imgUrl} boxSize="38px" flexShrink={0} />
                <Stack spacing={2} flex="1" minW={0}>
                    <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                            {potion?.name || 'Potion'}
                        </Text>
                        <Badge colorScheme="orange" borderRadius="6px">
                            x{job.flaskMultiplier || 1}
                        </Badge>
                    </HStack>
                    <Progress value={progress} colorScheme="orange" size="sm" borderRadius="6px" bg="#1d282d" />
                    <Text color="whiteAlpha.500" fontSize="xs">
                        {formatNumber(blocksLeft)} blocks left, ends {finishDate ? formatLocalDateTime(finishDate) : 'pending'}
                    </Text>
                </Stack>
            </HStack>
        </Box>
    );
};

const Elyxir = ({
    infoAccount,
    walletProvider = null,
    walletHostOrigin = null,
    embedded = false,
    onOpenPantry = null,
    onOpenSupplyBoard = null,
}) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);
    const recipes = elyxir?.definition?.recipes || [];
    const durationBounds = useMemo(() => getDurationBounds(elyxir?.definition), [elyxir?.definition]);
    const durationPresets = useMemo(() => getDurationPresets(durationBounds), [durationBounds]);
    const flasks = fakeAssets.flasks || [];

    const [selectedFlask, setSelectedFlask] = useState(null);
    const [craftDurationBlocks, setCraftDurationBlocks] = useState(durationBounds.min);
    const [activeJobs, setActiveJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userPassphrase, setUserPassphrase] = useState(null);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [craftBatchProgress, setCraftBatchProgress] = useState(null);
    const [omnoRecoverableAssets, setOmnoRecoverableAssets] = useState([]);
    const [isRecoveringAssets, setIsRecoveringAssets] = useState(false);
    const [isLoadingRecoverableAssets, setIsLoadingRecoverableAssets] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const isEmbeddedMode = Boolean(embedded);
    const usesEmbeddedWallet = Boolean(isEmbeddedMode && walletProvider);

    const selectedPotion = useMemo(() => getPotionForRecipe(selectedRecipe, fakeAssets.potions), [selectedRecipe, fakeAssets.potions]);
    const selectedMultiplier = selectedFlask?.multiplier || 1;
    const selectedFlaskOwned = Number(selectedFlask?.quantityQNT || 0) > 0;
    const successRate = Math.trunc(calculateSuccessRateWithBlocks(craftDurationBlocks) * 10000) / 100;
    const brewTimeLabel = blocksToDurationLabel(craftDurationBlocks);
    const finishDate = getApproxDateForBlocks(craftDurationBlocks);
    const finishDateLabel = finishDate ? formatLocalDateTime(finishDate) : 'Date pending';
    const targetHeight = Number(prev_height) > 0 ? Number(prev_height) + craftDurationBlocks : null;
    const durationRange = Math.max(1, durationBounds.max - durationBounds.min);
    const durationProgress = Math.round(((craftDurationBlocks - durationBounds.min) / durationRange) * 100);
    const craftBatchProgressText = getCraftBatchProgressText(craftBatchProgress);
    const selectedRecipeOwned = selectedRecipe ? getAccountAssetQuantity(infoAccount, selectedRecipe.recipeAssetId) > 0 : false;
    const recoverableAssetCatalog = useMemo(() => {
        const byAsset = new Map();

        [
            ...(fakeAssets.ingredients || []).map(item => ({ ...item, type: 'Ingredient' })),
            ...(fakeAssets.tools || []).map(item => ({ ...item, type: 'Tool' })),
            ...(fakeAssets.flasks || []).map(item => ({ ...item, type: 'Flask' })),
        ].forEach(item => {
            if (item?.asset) byAsset.set(String(item.asset), item);
        });

        return Array.from(byAsset.values());
    }, [fakeAssets.ingredients, fakeAssets.tools, fakeAssets.flasks]);
    const recoverableAssetIds = useMemo(() => recoverableAssetCatalog.map(item => String(item.asset)), [recoverableAssetCatalog]);
    const recoverableAssetLookup = useMemo(
        () => new Map(recoverableAssetCatalog.map(item => [String(item.asset), item])),
        [recoverableAssetCatalog]
    );
    const recoverableAssetTotal = omnoRecoverableAssets.reduce((total, item) => total + Number(item.quantityQNT || 0), 0);

    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];
            const recipeQuantity = getAccountAssetQuantity(infoAccount, recipe?.recipeAssetId);
            const potion = getPotionForRecipe(recipe, fakeAssets.potions);

            if (recipe && recipeQuantity < 1) {
                missing.push({
                    type: 'recipe',
                    name: `${potion.name} recipe`,
                    assetId: recipe.recipeAssetId,
                    have: recipeQuantity,
                    needed: 1,
                });
            }

            recipe?.ingredients?.forEach(req => {
                const item = findAssetById(fakeAssets, req.assetId);
                const have = item ? Number(item.quantityQNT || 0) : 0;
                const needed = Number(req.qtyQNT || 0) * flaskMultiplier;
                if (have < needed) {
                    missing.push({
                        type: 'ingredient',
                        name: item?.name || req.name || getAssetFallbackName(req.assetId, 'Ingredient'),
                        assetId: req.assetId,
                        have,
                        needed,
                    });
                }
            });

            recipe?.tools?.forEach(asset => {
                const item = findAssetById(fakeAssets, asset);
                const have = item ? Number(item.quantityQNT || 0) : 0;
                if (have <= 0) {
                    missing.push({
                        type: 'tool',
                        name: item?.name || getAssetFallbackName(asset, 'Tool'),
                        assetId: asset,
                        have,
                        needed: 1,
                    });
                }
            });

            return missing;
        },
        [fakeAssets.ingredients, fakeAssets.tools, fakeAssets.potions, infoAccount?.assets]
    );

    const requirementRows = useMemo(() => {
        if (!selectedRecipe) return [];
        const recipeItem = {
            type: 'Recipe',
            name: `${selectedPotion?.name || 'Selected potion'} recipe`,
            assetId: selectedRecipe.recipeAssetId,
            imgUrl: getRecipeImage(recipes, selectedRecipe),
            have: getAccountAssetQuantity(infoAccount, selectedRecipe.recipeAssetId),
            needed: 1,
        };
        const ingredients = selectedRecipe.ingredients?.map(req => {
            const item = findAssetById(fakeAssets, req.assetId);
            return {
                type: 'Ingredient',
                name: item?.name || req.name || getAssetFallbackName(req.assetId, 'Ingredient'),
                assetId: req.assetId,
                imgUrl: item?.imgUrl,
                have: item ? Number(item.quantityQNT || 0) : 0,
                needed: Number(req.qtyQNT || 0) * selectedMultiplier,
            };
        }) || [];

        const tools = selectedRecipe.tools?.map(asset => {
            const item = findAssetById(fakeAssets, asset);
            return {
                type: 'Tool',
                name: item?.name || getAssetFallbackName(asset, 'Tool'),
                assetId: asset,
                imgUrl: item?.imgUrl,
                have: item ? Number(item.quantityQNT || 0) : 0,
                needed: 1,
            };
        }) || [];

        return [recipeItem, ...ingredients, ...tools];
    }, [selectedRecipe, selectedPotion, recipes, infoAccount?.assets, fakeAssets.ingredients, fakeAssets.tools, selectedMultiplier]);

    const missingItems = useMemo(
        () => (selectedRecipe ? getMissingItems(selectedRecipe, selectedMultiplier) : []),
        [selectedRecipe, selectedMultiplier, getMissingItems]
    );
    const hasOwnedFlask = flasks.some(flask => Number(flask.quantityQNT || 0) > 0);
    const selectedPotionAlreadyBrewing = activeJobs.some(job => String(job.creationAssetId) === String(selectedRecipe?.creationAssetId));
    const primaryAction = useMemo(() => {
        if (!selectedRecipe) return { label: 'Open recipe first', tone: 'gray', action: 'select' };
        if (selectedPotionAlreadyBrewing) return { label: 'Already brewing', tone: 'orange', action: 'wait' };
        if (!selectedRecipeOwned) return { label: 'Find recipe', tone: 'orange', action: 'supply' };
        if (!selectedFlask || !selectedFlaskOwned) return { label: 'Find a flask', tone: 'orange', action: 'supply' };
        if (missingItems.length > 0) return { label: `Gather ${missingItems.length} missing component${missingItems.length === 1 ? '' : 's'}`, tone: 'red', action: 'supply' };
        return { label: 'Begin brewing', tone: 'green', action: 'craft' };
    }, [selectedRecipe, selectedPotionAlreadyBrewing, selectedRecipeOwned, selectedFlask, selectedFlaskOwned, missingItems.length]);

    const groupedRequirements = useMemo(
        () => ({
            recipes: requirementRows.filter(item => item.type === 'Recipe'),
            ingredients: requirementRows.filter(item => item.type === 'Ingredient'),
            tools: requirementRows.filter(item => item.type === 'Tool'),
            flask: selectedFlask
                ? [
                      {
                          type: 'Flask',
                          name: selectedFlask.name,
                          imgUrl: selectedFlask.imgUrl,
                          have: selectedFlaskOwned ? 1 : 0,
                          needed: 1,
                      },
                  ]
                : [],
        }),
        [requirementRows, selectedFlask, selectedFlaskOwned]
    );

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('mythical-product-event', {detail: {name: 'product_opened', properties: {}}}));
    }, []);

    useEffect(() => {
        if (!selectedRecipe && recipes.length) setSelectedRecipe(recipes[0]);
    }, [recipes, selectedRecipe]);

    useEffect(() => {
        if (!selectedFlask && flasks.length) {
            setSelectedFlask(flasks.find(flask => Number(flask.quantityQNT || 0) > 0) || flasks[0]);
        }
    }, [flasks, selectedFlask]);

    useEffect(() => {
        setCraftDurationBlocks(current => clampDurationBlocks(current, durationBounds));
    }, [durationBounds.min, durationBounds.max]);

    useEffect(() => {
        const loadJobs = async () => {
            if (!infoAccount?.accountRs) return;
            const accountId = addressToAccountId(infoAccount.accountRs);
            const jobs = await getUserJobs({ accountId });

            setActiveJobs(jobs.filter(job => job.status === 'STARTED'));
            setCompletedJobs(jobs.filter(job => job.status !== 'STARTED'));
        };

        loadJobs();

        const interval = setInterval(loadJobs, 10000);
        return () => clearInterval(interval);
    }, [infoAccount?.accountRs]);

    const loadRecoverableAssets = useCallback(async () => {
        if (!infoAccount?.accountRs || recoverableAssetIds.length === 0) {
            setOmnoRecoverableAssets([]);
            return;
        }

        setIsLoadingRecoverableAssets(true);

        try {
            const balances = await getOmnoAssetBalances({
                account: infoAccount.accountRs,
                assetIds: recoverableAssetIds,
            });

            setOmnoRecoverableAssets(
                balances.map(balance => {
                    const catalogItem = recoverableAssetLookup.get(String(balance.asset));
                    return {
                        ...catalogItem,
                        asset: balance.asset,
                        quantityQNT: balance.quantityQNT,
                        name: catalogItem?.name || getAssetFallbackName(balance.asset, 'Elyxir asset'),
                        type: catalogItem?.type || 'Elyxir asset',
                    };
                })
            );
        } catch (error) {
            console.error('Failed to load deposited Elyxir assets:', error);
        } finally {
            setIsLoadingRecoverableAssets(false);
        }
    }, [infoAccount?.accountRs, recoverableAssetIds, recoverableAssetLookup]);

    useEffect(() => {
        loadRecoverableAssets();
    }, [loadRecoverableAssets]);

    const requestPinForAction = useCallback(action => {
        setPendingAction(action);
        setShowPinInput(true);
    }, []);

    const handleStartCrafting = useCallback(
        recipe => {
            if (!recipe || !selectedFlask || !selectedFlaskOwned || !selectedRecipeOwned || missingItems.length > 0) {
                toast({
                    title: 'Crafting blocked',
                    description: 'Hold the recipe in this wallet, select an available flask and complete every required asset.',
                    status: 'warning',
                    duration: 3500,
                    isClosable: true,
                });
                return;
            }

            setSelectedRecipe(recipe);
            onOpen();
        },
        [selectedFlask, selectedFlaskOwned, selectedRecipeOwned, missingItems, onOpen, toast]
    );

    const executeCrafting = useCallback(
        async ({ passphrase, walletProvider: craftingWalletProvider } = {}) => {
            setIsLoading(true);
            setCraftBatchProgress(null);
            window.dispatchEvent(new CustomEvent('mythical-product-event', {detail: {name: 'operation_started', properties: {operation: 'alchemy'}}}));

            try {
                if (!selectedRecipe || !selectedFlask) throw new Error('Select a recipe and flask first');
                if (getAccountAssetQuantity(infoAccount, selectedRecipe.recipeAssetId) < 1) {
                    throw new Error('You must hold this recipe in your Ardor account before brewing. The recipe is not transferred or consumed.');
                }

                const accountId = addressToAccountId(infoAccount.accountRs);
                const recipePotion = getPotionForRecipe(selectedRecipe, fakeAssets.potions);
                const multiplier = selectedFlask.multiplier || 1;
                const mergedAssets = [{ asset: selectedFlask.asset, qnt: 1 }];

                selectedRecipe.tools.forEach(asset => {
                    mergedAssets.push({ asset, qnt: 1 });
                });

                selectedRecipe.ingredients.forEach(ing => {
                    mergedAssets.push({ asset: ing.assetId, qnt: ing.qtyQNT * multiplier });
                });

                const durationBlocks = craftDurationBlocks;
                const signingStrategy = craftingWalletProvider ? { walletProvider: craftingWalletProvider } : { passphrase };

                if (craftingWalletProvider) {
                    setCraftBatchProgress({ status: 'preparing' });

                    const response = await requestCraftPotionBatch({
                        walletHostOrigin,
                        recipeAssetId: selectedRecipe.recipeAssetId,
                        creationAssetId: recipePotion.asset || selectedRecipe.creationAssetId,
                        flaskAssetId: selectedFlask.asset,
                        durationBlocks,
                        blockId: prev_height,
                        onProgress: progress => setCraftBatchProgress(progress),
                    });

                    if (!response) throw new Error('Failed to start crafting');

                    toast({
                        title: 'Crafting started',
                        description: `Started crafting ${multiplier}x ${recipePotion.name}.`,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    return;
                }

                const totalTransactions = mergedAssets.length + 1;
                setCraftBatchProgress({
                    status: 'preparing',
                    completed: 0,
                    total: totalTransactions,
                    remaining: totalTransactions,
                });

                const transfered = await sendCraftPotionAssets({
                    mergedAssets,
                    ...signingStrategy,
                    onProgress: progress => {
                        const completed = Number(progress?.completed || 0);
                        setCraftBatchProgress({
                            status: 'transferring',
                            completed,
                            total: totalTransactions,
                            remaining: totalTransactions - completed,
                        });
                    },
                });
                if (!transfered) throw new Error('Failed transfering crafting asset');

                setCraftBatchProgress({
                    status: 'finalizing',
                    completed: mergedAssets.length,
                    total: totalTransactions,
                    remaining: 1,
                });

                const response = await sendCraftPotionMessage({
                    accountId,
                    recipeAssetId: selectedRecipe.recipeAssetId,
                    creationAssetId: recipePotion.asset || selectedRecipe.creationAssetId,
                    flaskAssetId: selectedFlask.asset,
                    durationBlocks,
                    ...signingStrategy,
                    blockId: prev_height,
                });

                if (!response) throw new Error('Failed to start crafting');

                setCraftBatchProgress({
                    status: 'complete',
                    completed: totalTransactions,
                    total: totalTransactions,
                    remaining: 0,
                });

                toast({
                    title: 'Crafting started',
                    description: `Started crafting ${multiplier}x ${recipePotion.name}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                window.dispatchEvent(new CustomEvent('mythical-product-event', {detail: {name: 'operation_failed', properties: {operation: 'alchemy', error_code: 'unknown'}}}));
                console.error('Crafting error:', error);
                setCraftBatchProgress(progress => ({ ...(progress || {}), status: 'error' }));
                toast({
                    title: 'Crafting failed',
                    description: error.message || 'An unexpected error occurred',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
                setPendingAction(null);
            }
        },
        [selectedRecipe, selectedFlask, craftDurationBlocks, fakeAssets.potions, infoAccount, prev_height, toast, walletHostOrigin]
    );

    const executeRecoverDepositedAssets = useCallback(
        async ({ passPhrase, walletProvider: recoveryWalletProvider } = {}) => {
            const assets = omnoRecoverableAssets
                .filter(item => Number(item.quantityQNT || 0) > 0)
                .map(item => ({ asset: item.asset, quantityQNT: item.quantityQNT }));

            if (!assets.length) {
                toast({
                    title: 'No deposited Elyxir assets',
                    description: 'There are no ingredients, tools or flasks waiting in Omno for this wallet.',
                    status: 'info',
                    duration: 3500,
                    isClosable: true,
                });
                return;
            }

            setIsRecoveringAssets(true);

            try {
                const response = await withdrawElyxirAssetsFromOmno({
                    assets,
                    passPhrase,
                    walletProvider: recoveryWalletProvider,
                });

                if (!response) throw new Error('Failed to request the Omno withdrawal.');

                toast({
                    title: 'Withdrawal requested',
                    description: 'Omno will return the deposited Elyxir assets to your Ardor account after the message is processed.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                setTimeout(loadRecoverableAssets, 15000);
            } catch (error) {
                console.error('Deposited asset recovery failed:', error);
                toast({
                    title: 'Recovery failed',
                    description: error.message || 'Unable to request the Omno withdrawal.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsRecoveringAssets(false);
                setPendingAction(null);
            }
        },
        [loadRecoverableAssets, omnoRecoverableAssets, toast]
    );

    const handleRecoverDepositedAssets = useCallback(async () => {
        if (!omnoRecoverableAssets.length) {
            await loadRecoverableAssets();
            toast({
                title: 'No deposited Elyxir assets',
                description: 'There are no ingredients, tools or flasks waiting in Omno for this wallet.',
                status: 'info',
                duration: 3500,
                isClosable: true,
            });
            return;
        }

        if (isEmbeddedMode) {
            if (!usesEmbeddedWallet) {
                toast({
                    title: 'Wallet connection unavailable',
                    description: 'Reopen Elyxir from Play Hub with an unlocked wallet.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            await executeRecoverDepositedAssets({ walletProvider });
            return;
        }

        if (!userPassphrase) {
            requestPinForAction('recover');
            return;
        }

        await executeRecoverDepositedAssets({ passPhrase: userPassphrase });
    }, [
        executeRecoverDepositedAssets,
        isEmbeddedMode,
        loadRecoverableAssets,
        omnoRecoverableAssets.length,
        requestPinForAction,
        toast,
        userPassphrase,
        usesEmbeddedWallet,
        walletProvider,
    ]);

    const handlePinInput = useCallback(
        pin => {
            try {
                const userAccount = checkPin(infoAccount.name, pin);
                if (!userAccount || !userAccount.passphrase) {
                    toast({
                        title: 'Invalid PIN',
                        description: 'Please enter your correct PIN',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    return;
                }

                setUserPassphrase(userAccount.passphrase);
                setShowPinInput(false);

                if (pendingAction === 'craft') {
                    executeCrafting({ passphrase: userAccount.passphrase });
                } else if (pendingAction === 'recover') {
                    executeRecoverDepositedAssets({ passPhrase: userAccount.passphrase });
                }
            } catch (error) {
                toast({
                    title: 'PIN Error',
                    description: 'Failed to verify PIN. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        },
        [executeCrafting, executeRecoverDepositedAssets, infoAccount.name, pendingAction, toast]
    );

    const confirmCrafting = useCallback(async () => {
        if (!selectedRecipe || !infoAccount) {
            toast({
                title: 'Error',
                description: "Please select a recipe and ensure you're logged in",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        onClose();

        if (isEmbeddedMode) {
            if (!usesEmbeddedWallet) {
                toast({
                    title: 'Wallet connection unavailable',
                    description: 'Reopen Elyxir from Play Hub with an unlocked wallet.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            await executeCrafting({ walletProvider });
            return;
        }

        if (!userPassphrase) {
            requestPinForAction('craft');
            return;
        }

        await executeCrafting({ passphrase: userPassphrase });
    }, [
        executeCrafting,
        selectedRecipe,
        infoAccount,
        onClose,
        toast,
        isEmbeddedMode,
        usesEmbeddedWallet,
        walletProvider,
        userPassphrase,
        requestPinForAction,
    ]);

    const setClampedCraftDuration = value => {
        setCraftDurationBlocks(clampDurationBlocks(value, durationBounds));
    };

    const changeCraftDuration = deltaBlocks => {
        setCraftDurationBlocks(current => clampDurationBlocks(current + deltaBlocks, durationBounds));
    };

    const handlePrimaryAction = () => {
        if (primaryAction.action === 'craft') {
            handleStartCrafting(selectedRecipe);
            return;
        }

        if (primaryAction.action === 'supply') {
            if (onOpenSupplyBoard) {
                onOpenSupplyBoard(missingItems[0] || (!selectedFlaskOwned ? selectedFlask : null));
                return;
            }
            if (onOpenPantry) {
                onOpenPantry();
                return;
            }
        }

        toast({
            title: primaryAction.label,
            description: 'Select a ready recipe, flask and all required components before brewing.',
            status: 'info',
            duration: 3500,
            isClosable: true,
        });
    };
    const primaryActionBg = primaryAction.tone === 'green' ? '#57d68d' : primaryAction.tone === 'red' ? '#742b2b' : '#6b4f25';
    const primaryActionColor = primaryAction.tone === 'green' ? '#07100c' : 'white';
    const primaryActionHoverBg = primaryAction.tone === 'green' ? '#46c47d' : primaryAction.tone === 'red' ? '#8f3535' : '#7a5a2b';
    const primaryActionDisabled = !selectedRecipe || selectedPotionAlreadyBrewing;

    return (
        <Box color="white">
            <Stack spacing={5}>
                <Box>
                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                        Workbench
                    </Text>
                    <Heading size={{ base: 'lg', md: 'xl' }} letterSpacing="0">
                        {selectedPotion?.name || 'Choose a potion'}
                    </Heading>
                    <Text color="whiteAlpha.700" mt={1} maxW="820px">
                        {selectedPotion?.description || 'Choose a recipe, gather components, select a flask and begin brewing.'}
                    </Text>
                </Box>

                <Grid
                    templateColumns={{
                        base: '1fr',
                        xl: '280px minmax(0, 1fr) 320px',
                        '2xl': '320px minmax(0, 1fr) 360px',
                    }}
                    gap={4}
                    alignItems="start"
                >
                <GridItem>
                    <Panel p={4}>
                        <HStack justify="space-between" mb={4}>
                            <Box>
                                <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                    Recipes
                                </Text>
                                <Heading size="md">Recipe book</Heading>
                            </Box>
                            <Badge bg="whiteAlpha.100" color="whiteAlpha.800" borderRadius="6px">
                                {recipes.length}
                            </Badge>
                        </HStack>
                        <Stack spacing={3} maxH={{ base: 'none', xl: 'calc(100vh - 190px)' }} overflowY={{ base: 'visible', xl: 'auto' }}>
                            {recipes.map(recipe => {
                                const potion = getPotionForRecipe(recipe, fakeAssets.potions);
                                const missing = getMissingItems(recipe, selectedMultiplier);
                                const missingRecipe = missing.some(item => item.type === 'recipe');
                                const alreadyBrewing = activeJobs.some(job => String(job.creationAssetId) === String(recipe.creationAssetId));
                                const statusLabel = alreadyBrewing
                                    ? 'Already brewing'
                                    : !hasOwnedFlask
                                      ? 'Need flask'
                                      : missingRecipe
                                        ? 'Need recipe'
                                        : missing.length === 0
                                          ? 'Ready'
                                          : `Missing ${missing.length}`;
                                const statusScheme = alreadyBrewing ? 'orange' : !hasOwnedFlask ? 'yellow' : missing.length === 0 ? 'green' : 'red';
                                return (
                                    <RecipeCard
                                        key={recipe.recipeAssetId}
                                        recipe={recipe}
                                        potion={potion}
                                        selected={selectedRecipe?.recipeAssetId === recipe.recipeAssetId}
                                        missingCount={missing.length}
                                        statusLabel={statusLabel}
                                        statusScheme={statusScheme}
                                        onSelect={setSelectedRecipe}
                                    />
                                );
                            })}
                        </Stack>
                    </Panel>
                </GridItem>

                <GridItem minW={0}>
                    <Panel p={{ base: 4, md: 5 }} minH={{ xl: 'calc(100vh - 108px)' }}>
                        <HStack justify="space-between" align="flex-start" mb={5}>
                            <Box minW={0} flex="1">
                                <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                    Workbench
                                </Text>
                                <Heading size={{ base: 'md', md: 'lg' }} noOfLines={2}>
                                    {selectedPotion?.name || 'Select a potion'}
                                </Heading>
                            </Box>
                            <Button
                                size="sm"
                                display={{ base: 'none', md: 'inline-flex' }}
                                leftIcon={<Icon as={primaryAction.action === 'craft' ? FaFlask : FaBook} />}
                                bg={primaryActionBg}
                                color={primaryActionColor}
                                fontWeight="black"
                                _hover={{ bg: primaryActionHoverBg }}
                                isLoading={isLoading}
                                loadingText={craftBatchProgressText}
                                isDisabled={primaryActionDisabled}
                                onClick={handlePrimaryAction}
                                flexShrink={0}
                            >
                                {primaryAction.label}
                            </Button>
                        </HStack>

                        <Stack spacing={5}>
                            <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={3}>
                                <MiniMetric label="Stability" value={`${successRate}%`} icon={FaCheckCircle} tone="#57d68d" />
                                <MiniMetric label="Brew time" value={brewTimeLabel} icon={FaClock} tone="#d8b56d" />
                                <MiniMetric label="Finish" value={finishDateLabel} icon={FaClock} tone="#72d9e2" />
                                <MiniMetric label="Yield" value={`x${selectedMultiplier || 0}`} icon={FaFlask} tone="#b999ff" />
                            </SimpleGrid>

                            <Box textAlign="center">
                                <Circle
                                    size={{ base: '170px', md: '200px' }}
                                    mx="auto"
                                    bg="rgba(11, 17, 20, 0.66)"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                >
                                    <AssetImage src={selectedPotion?.imgUrl} boxSize={{ base: '118px', md: '150px' }} />
                                </Circle>
                                <Text color="whiteAlpha.600" fontSize="sm" mt={3}>
                                    {selectedPotion?.description}
                                </Text>
                            </Box>

                            <Stack spacing={4}>
                                <Box>
                                    <HStack justify="space-between" mb={3}>
                                        <Text fontWeight="bold">Choose your flask</Text>
                                        <Text color="whiteAlpha.500" fontSize="sm">
                                            {selectedFlask?.name || 'No flask selected'}
                                        </Text>
                                    </HStack>
                                    <SimpleGrid columns={{ base: 2, md: 3, '2xl': 5 }} spacing={3}>
                                        {flasks.map(flask => (
                                            <FlaskOption
                                                key={flask.asset}
                                                flask={flask}
                                                selected={selectedFlask?.asset === flask.asset}
                                                onSelect={setSelectedFlask}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                <Box>
                                    <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} spacing={3} mb={3} flexWrap="wrap">
                                        <Box>
                                            <Text fontWeight="bold">Brewing time</Text>
                                            <Text color="whiteAlpha.500" fontSize="xs">
                                                {formatNumber(craftDurationBlocks)} blocks, about {brewTimeLabel}
                                            </Text>
                                        </Box>
                                        <HStack spacing={2}>
                                            <Button
                                                size="sm"
                                                leftIcon={<Icon as={FaMinus} />}
                                                variant="outline"
                                                borderColor="whiteAlpha.300"
                                                color="white"
                                                isDisabled={craftDurationBlocks <= durationBounds.min}
                                                onClick={() => changeCraftDuration(-1)}
                                            >
                                                1m
                                            </Button>
                                            <Input
                                                aria-label="Brewing time in blocks"
                                                type="number"
                                                min={durationBounds.min}
                                                max={durationBounds.max}
                                                step={1}
                                                value={craftDurationBlocks}
                                                onChange={event => setClampedCraftDuration(event.target.value)}
                                                w="118px"
                                                h="34px"
                                                bg="rgba(11, 17, 20, 0.70)"
                                                borderColor="whiteAlpha.300"
                                                color="white"
                                                textAlign="center"
                                            />
                                            <Button
                                                size="sm"
                                                rightIcon={<Icon as={FaPlus} />}
                                                variant="outline"
                                                borderColor="whiteAlpha.300"
                                                color="white"
                                                isDisabled={craftDurationBlocks >= durationBounds.max}
                                                onClick={() => changeCraftDuration(1)}
                                            >
                                                1m
                                            </Button>
                                        </HStack>
                                    </HStack>
                                    <Slider
                                        aria-label="Brewing duration"
                                        min={durationBounds.min}
                                        max={durationBounds.max}
                                        step={1}
                                        value={craftDurationBlocks}
                                        onChange={setClampedCraftDuration}
                                        focusThumbOnChange={false}
                                    >
                                        <SliderTrack bg="#1d282d">
                                            <SliderFilledTrack bg="#b999ff" />
                                        </SliderTrack>
                                        <SliderThumb boxSize={4} bg="#d8b56d" />
                                    </Slider>
                                    <HStack spacing={2} mt={3} flexWrap="wrap">
                                        {durationPresets.map(preset => (
                                            <Button
                                                key={`${preset.label}-${preset.blocks}`}
                                                size="xs"
                                                variant={preset.blocks === craftDurationBlocks ? 'solid' : 'outline'}
                                                bg={preset.blocks === craftDurationBlocks ? '#d8b56d' : 'transparent'}
                                                color={preset.blocks === craftDurationBlocks ? '#07100c' : 'whiteAlpha.800'}
                                                borderColor="whiteAlpha.300"
                                                _hover={{ bg: preset.blocks === craftDurationBlocks ? '#d8b56d' : 'whiteAlpha.100' }}
                                                onClick={() => setClampedCraftDuration(preset.blocks)}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </HStack>
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt={3}>
                                        <Box bg="rgba(11, 17, 20, 0.62)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
                                            <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" fontWeight="bold">
                                                Finish estimate
                                            </Text>
                                            <Text fontWeight="black" fontSize="sm" mt={1}>
                                                {finishDateLabel}
                                            </Text>
                                        </Box>
                                        <Box bg="rgba(11, 17, 20, 0.62)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
                                            <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" fontWeight="bold">
                                                Target height
                                            </Text>
                                            <Text fontWeight="black" fontSize="sm" mt={1}>
                                                {targetHeight ? formatNumber(targetHeight) : 'Pending height'}
                                            </Text>
                                        </Box>
                                        <Box bg="rgba(11, 17, 20, 0.62)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
                                            <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" fontWeight="bold">
                                                Range
                                            </Text>
                                            <Text fontWeight="black" fontSize="sm" mt={1}>
                                                {durationProgress}%
                                            </Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                {craftBatchProgress && (
                                    <Box bg="rgba(7, 16, 12, 0.72)" border="1px solid" borderColor="rgba(87, 214, 141, 0.26)" borderRadius="8px" p={3}>
                                        <HStack justify="space-between" mb={1}>
                                            <Text color="#57d68d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                                {usesEmbeddedWallet ? 'Play Hub batch' : 'Crafting transactions'}
                                            </Text>
                                            <Badge bg="rgba(87, 214, 141, 0.14)" color="#9cf2bc" borderRadius="6px">
                                                {craftBatchProgress.status}
                                            </Badge>
                                        </HStack>
                                        <Text color="whiteAlpha.800" fontSize="sm">
                                            {craftBatchProgressText}
                                        </Text>
                                    </Box>
                                )}

                                <Button
                                    h="58px"
                                    leftIcon={<Icon as={primaryAction.action === 'craft' ? FaFlask : FaBook} />}
                                    bg={primaryActionBg}
                                    color={primaryActionColor}
                                    fontWeight="black"
                                    _hover={{ bg: primaryActionHoverBg }}
                                    isLoading={isLoading}
                                    loadingText={craftBatchProgressText}
                                    isDisabled={primaryActionDisabled}
                                    onClick={handlePrimaryAction}
                                >
                                    {primaryAction.label}
                                </Button>
                            </Stack>
                        </Stack>
                    </Panel>
                </GridItem>

                <GridItem>
                    <Stack spacing={4}>
                        <Panel p={4}>
                            <HStack justify="space-between" mb={4}>
                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                        Required components
                                    </Text>
                                    <Heading size="md">Recipe checklist</Heading>
                                </Box>
                                <Icon color={missingItems.length ? '#f6ad55' : '#57d68d'} as={missingItems.length ? FaExclamationTriangle : FaCheckCircle} />
                            </HStack>
                            <Stack spacing={4}>
                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                                        Recipe
                                    </Text>
                                    <Stack spacing={2}>
                                        {groupedRequirements.recipes.map(item => (
                                            <RequirementRow
                                                key={`${item.type}-${item.name}`}
                                                item={item}
                                                onFind={item.have < item.needed && onOpenSupplyBoard ? () => onOpenSupplyBoard(item) : null}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                                        Ingredients
                                    </Text>
                                    <Stack spacing={2}>
                                        {groupedRequirements.ingredients.map(item => (
                                            <RequirementRow
                                                key={`${item.type}-${item.name}`}
                                                item={item}
                                                onFind={item.have < item.needed && onOpenSupplyBoard ? () => onOpenSupplyBoard(item) : null}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                                        Tools
                                    </Text>
                                    <Stack spacing={2}>
                                        {groupedRequirements.tools.map(item => (
                                            <RequirementRow
                                                key={`${item.type}-${item.name}`}
                                                item={item}
                                                onFind={item.have < item.needed && onOpenSupplyBoard ? () => onOpenSupplyBoard(item) : null}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                                        Flask
                                    </Text>
                                    <Stack spacing={2}>
                                        {groupedRequirements.flask.length === 0 && (
                                            <Text color="whiteAlpha.600" fontSize="sm">
                                                Choose a flask to calculate yield.
                                            </Text>
                                        )}
                                        {groupedRequirements.flask.map(item => (
                                            <RequirementRow
                                                key={`${item.type}-${item.name}`}
                                                item={item}
                                                onFind={item.have < item.needed && onOpenSupplyBoard ? () => onOpenSupplyBoard(item) : null}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    colorScheme="purple"
                                    onClick={onOpenSupplyBoard}
                                    isDisabled={!onOpenSupplyBoard}
                                    >
                                        View how to obtain all
                                    </Button>
                                </Stack>
                            </Panel>

                            <Panel p={4}>
                                <HStack justify="space-between" mb={3}>
                                    <Box>
                                        <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                            Omno deposit
                                        </Text>
                                        <Heading size="md">Recover assets</Heading>
                                    </Box>
                                    <Icon as={FaUndo} color="#d8b56d" />
                                </HStack>
                                <Stack spacing={3}>
                                    <Text color="whiteAlpha.700" fontSize="sm">
                                        Withdraw ingredients, tools and flasks currently deposited in Omno back to this Ardor account.
                                    </Text>
                                    <Stack spacing={2} maxH="160px" overflowY="auto">
                                        {isLoadingRecoverableAssets && (
                                            <Text color="whiteAlpha.500" fontSize="sm">
                                                Checking deposited assets...
                                            </Text>
                                        )}
                                        {!isLoadingRecoverableAssets && omnoRecoverableAssets.length === 0 && (
                                            <Text color="whiteAlpha.500" fontSize="sm">
                                                No deposited Elyxir ingredients, tools or flasks found.
                                            </Text>
                                        )}
                                        {omnoRecoverableAssets.map(item => (
                                            <HStack
                                                key={item.asset}
                                                justify="space-between"
                                                spacing={3}
                                                p={2}
                                                bg="rgba(11, 17, 20, 0.62)"
                                                border="1px solid"
                                                borderColor="whiteAlpha.200"
                                                borderRadius="8px"
                                            >
                                                <HStack minW={0} spacing={2}>
                                                    <AssetImage src={item.imgUrl} boxSize="30px" flexShrink={0} />
                                                    <Box minW={0}>
                                                        <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                                                            {item.name}
                                                        </Text>
                                                        <Text color="whiteAlpha.500" fontSize="xs">
                                                            {item.type}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                <Badge colorScheme="cyan" borderRadius="6px" flexShrink={0}>
                                                    {formatNumber(item.quantityQNT)}
                                                </Badge>
                                            </HStack>
                                        ))}
                                    </Stack>
                                    <Button
                                        size="sm"
                                        leftIcon={<Icon as={FaUndo} />}
                                        colorScheme="cyan"
                                        variant="outline"
                                        onClick={handleRecoverDepositedAssets}
                                        isLoading={isRecoveringAssets}
                                        loadingText="Requesting"
                                        isDisabled={isLoadingRecoverableAssets || isRecoveringAssets || omnoRecoverableAssets.length === 0}
                                    >
                                        Withdraw deposited assets
                                    </Button>
                                    {recoverableAssetTotal > 0 && (
                                        <Text color="whiteAlpha.500" fontSize="xs">
                                            {formatNumber(recoverableAssetTotal)} total units found in Omno.
                                        </Text>
                                    )}
                                </Stack>
                            </Panel>

                            <Panel p={4}>
                                <HStack justify="space-between" mb={4}>
                                    <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                        Brewing queue
                                    </Text>
                                    <Heading size="md">Active brews</Heading>
                                </Box>
                                <Badge colorScheme="orange" borderRadius="6px">
                                    {activeJobs.length}
                                </Badge>
                            </HStack>
                            <Stack spacing={3}>
                                {activeJobs.length === 0 && (
                                    <Text color="whiteAlpha.600" fontSize="sm">
                                        No active jobs.
                                    </Text>
                                )}
                                {activeJobs.slice(0, 3).map(job => (
                                    <JobMiniRow key={job.jobId} job={job} />
                                ))}
                                {completedJobs.length > 0 && (
                                    <>
                                        <Divider borderColor="whiteAlpha.200" />
                                        <HStack justify="space-between" color="whiteAlpha.600" fontSize="sm">
                                            <HStack>
                                                <Icon as={FaScroll} />
                                                <Text>Completed history</Text>
                                            </HStack>
                                            <Text>{completedJobs.length}</Text>
                                        </HStack>
                                    </>
                                )}
                            </Stack>
                        </Panel>

                        <Panel p={4}>
                            <HStack justify="space-between" mb={3}>
                                <Text fontWeight="bold">Inventory pulse</Text>
                                <Icon as={FaTools} color="#d8b56d" />
                            </HStack>
                            <SimpleGrid columns={3} spacing={2}>
                                <MiniMetric label="Ing." value={formatNumber(fakeAssets.ingredients?.filter(i => Number(i.quantityQNT || 0) > 0).length)} icon={FaBoxes} />
                                <MiniMetric label="Tools" value={formatNumber(fakeAssets.tools?.filter(i => Number(i.quantityQNT || 0) > 0).length)} icon={FaTools} tone="#d8b56d" />
                                <MiniMetric label="Flasks" value={formatNumber(flasks.filter(i => Number(i.quantityQNT || 0) > 0).length)} icon={FaFlask} tone="#b999ff" />
                            </SimpleGrid>
                        </Panel>
                    </Stack>
                </GridItem>
                </Grid>
            </Stack>

            <CraftingConfirmation
                infoAccount={infoAccount}
                isOpen={isOpen}
                onClose={onClose}
                selectedRecipe={selectedRecipe}
                confirmCrafting={confirmCrafting}
                isLoading={isLoading}
                selectedFlask={selectedFlask}
                embedded={usesEmbeddedWallet}
                currentHeight={prev_height}
                durationLabel={brewTimeLabel}
                finishLabel={finishDateLabel}
            />
            {!isEmbeddedMode && (
                <PinModal showPinInput={showPinInput} setShowPinInput={setShowPinInput} handlePinInput={handlePinInput} />
            )}
        </Box>
    );
};

export default Elyxir;
