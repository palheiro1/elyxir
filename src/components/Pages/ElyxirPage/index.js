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
    Progress,
    SimpleGrid,
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
import { calculateSuccessRate } from '../../../utils/elyxirUtils';
import { DURATION_OPTIONS } from './data';

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

const getDurationIndex = days => {
    const options = DURATION_OPTIONS.map(option => option.days);
    return Math.max(0, options.indexOf(days));
};

const getCraftBatchProgressText = status => {
    const labels = {
        preparing: 'Preparing the wallet batch...',
        broadcasting: 'Broadcasting required asset transfers...',
        awaiting_confirmations: 'Waiting for one blockchain confirmation on every transfer...',
        ready_to_finalize: 'Transfers confirmed. Finalizing the Elyxir craft...',
        finalizing: 'Sending the final Elyxir crafting message...',
        complete: 'Crafting job submitted.',
        stale: 'A transfer needs wallet recovery before Elyxir can finalize this craft.',
        error: 'Wallet batch failed.',
    };

    return labels[status] || 'Working with the Play Hub wallet...';
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
                <Text fontWeight="black" fontSize={{ base: 'md', md: 'lg' }} whiteSpace="nowrap">
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
                        {formatNumber(blocksLeft)} blocks left
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
    const flasks = fakeAssets.flasks || [];

    const [selectedFlask, setSelectedFlask] = useState(null);
    const [craftDuration, setCraftDuration] = useState(1);
    const [activeJobs, setActiveJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userPassphrase, setUserPassphrase] = useState(null);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [craftBatchProgress, setCraftBatchProgress] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const isEmbeddedMode = Boolean(embedded);
    const usesEmbeddedWallet = Boolean(isEmbeddedMode && walletProvider);

    const selectedPotion = useMemo(() => getPotionForRecipe(selectedRecipe, fakeAssets.potions), [selectedRecipe, fakeAssets.potions]);
    const selectedMultiplier = selectedFlask?.multiplier || 1;
    const selectedFlaskOwned = Number(selectedFlask?.quantityQNT || 0) > 0;
    const successRate = Math.trunc(calculateSuccessRate(craftDuration) * 10000) / 100;
    const craftBatchProgressText = getCraftBatchProgressText(craftBatchProgress?.status);

    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];

            recipe?.ingredients?.forEach(req => {
                const item = findAssetById(fakeAssets, req.assetId);
                const have = item ? Number(item.quantityQNT || 0) : 0;
                const needed = Number(req.qtyQNT || 0) * flaskMultiplier;
                if (have < needed) {
                    missing.push({
                        type: 'ingredient',
                        name: item?.name || req.name || getAssetFallbackName(req.assetId, 'Ingredient'),
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
                        have,
                        needed: 1,
                    });
                }
            });

            return missing;
        },
        [fakeAssets.ingredients, fakeAssets.tools]
    );

    const requirementRows = useMemo(() => {
        if (!selectedRecipe) return [];
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

        return [...ingredients, ...tools];
    }, [selectedRecipe, fakeAssets.ingredients, fakeAssets.tools, selectedMultiplier]);

    const missingItems = useMemo(
        () => (selectedRecipe ? getMissingItems(selectedRecipe, selectedMultiplier) : []),
        [selectedRecipe, selectedMultiplier, getMissingItems]
    );
    const hasOwnedFlask = flasks.some(flask => Number(flask.quantityQNT || 0) > 0);
    const selectedPotionAlreadyBrewing = activeJobs.some(job => String(job.creationAssetId) === String(selectedRecipe?.creationAssetId));
    const primaryAction = useMemo(() => {
        if (!selectedRecipe) return { label: 'Open recipe first', tone: 'gray', action: 'select' };
        if (selectedPotionAlreadyBrewing) return { label: 'Already brewing', tone: 'orange', action: 'wait' };
        if (!selectedFlask || !selectedFlaskOwned) return { label: 'Find a flask', tone: 'orange', action: 'supply' };
        if (missingItems.length > 0) return { label: `Gather ${missingItems.length} missing component${missingItems.length === 1 ? '' : 's'}`, tone: 'red', action: 'supply' };
        return { label: 'Begin brewing', tone: 'green', action: 'craft' };
    }, [selectedRecipe, selectedPotionAlreadyBrewing, selectedFlask, selectedFlaskOwned, missingItems.length]);

    const groupedRequirements = useMemo(
        () => ({
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
        if (!selectedRecipe && recipes.length) setSelectedRecipe(recipes[0]);
    }, [recipes, selectedRecipe]);

    useEffect(() => {
        if (!selectedFlask && flasks.length) {
            setSelectedFlask(flasks.find(flask => Number(flask.quantityQNT || 0) > 0) || flasks[0]);
        }
    }, [flasks, selectedFlask]);

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
        [infoAccount.name, pendingAction, toast]
    );

    const requestPinForAction = useCallback(action => {
        setPendingAction(action);
        setShowPinInput(true);
    }, []);

    const handleStartCrafting = useCallback(
        recipe => {
            if (!recipe || !selectedFlask || !selectedFlaskOwned || missingItems.length > 0) {
                toast({
                    title: 'Crafting blocked',
                    description: 'Select an available flask and complete every required asset.',
                    status: 'warning',
                    duration: 3500,
                    isClosable: true,
                });
                return;
            }

            setSelectedRecipe(recipe);
            onOpen();
        },
        [selectedFlask, selectedFlaskOwned, missingItems, onOpen, toast]
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
    }, [selectedRecipe, infoAccount, onClose, toast, isEmbeddedMode, usesEmbeddedWallet, walletProvider, userPassphrase, requestPinForAction]);

    const executeCrafting = useCallback(
        async ({ passphrase, walletProvider: craftingWalletProvider } = {}) => {
            setIsLoading(true);
            setCraftBatchProgress(null);

            try {
                if (!selectedRecipe || !selectedFlask) throw new Error('Select a recipe and flask first');

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

                const durationBlocks = DURATION_OPTIONS.find(item => item.days === craftDuration).blocks;
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

                const transfered = await sendCraftPotionAssets({ mergedAssets, ...signingStrategy });
                if (!transfered) throw new Error('Failed transfering crafting asset');

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

                toast({
                    title: 'Crafting started',
                    description: `Started crafting ${multiplier}x ${recipePotion.name}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Crafting error:', error);
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
        [selectedRecipe, selectedFlask, craftDuration, fakeAssets.potions, infoAccount, prev_height, toast, walletHostOrigin]
    );

    const changeCraftDuration = direction => {
        const index = getDurationIndex(craftDuration);
        const nextIndex = direction === 'increase' ? Math.min(DURATION_OPTIONS.length - 1, index + 1) : Math.max(0, index - 1);
        setCraftDuration(DURATION_OPTIONS[nextIndex].days);
    };

    const handlePrimaryAction = () => {
        if (primaryAction.action === 'craft') {
            handleStartCrafting(selectedRecipe);
            return;
        }

        if (primaryAction.action === 'supply') {
            if (onOpenSupplyBoard) {
                onOpenSupplyBoard();
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
                                const alreadyBrewing = activeJobs.some(job => String(job.creationAssetId) === String(recipe.creationAssetId));
                                const statusLabel = alreadyBrewing
                                    ? 'Already brewing'
                                    : !hasOwnedFlask
                                      ? 'Need flask'
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
                                loadingText={usesEmbeddedWallet ? craftBatchProgressText : 'Crafting'}
                                isDisabled={primaryActionDisabled}
                                onClick={handlePrimaryAction}
                                flexShrink={0}
                            >
                                {primaryAction.label}
                            </Button>
                        </HStack>

                        <Stack spacing={5}>
                            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
                                <MiniMetric label="Stability" value={`${successRate}%`} icon={FaCheckCircle} tone="#57d68d" />
                                <MiniMetric label="Brew time" value={`${craftDuration}d`} icon={FaClock} tone="#d8b56d" />
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
                                    <HStack justify="space-between" mb={3}>
                                        <Text fontWeight="bold">Brewing time</Text>
                                        <HStack>
                                            <Button
                                                size="sm"
                                                leftIcon={<FaMinus />}
                                                variant="outline"
                                                borderColor="whiteAlpha.300"
                                                color="white"
                                                isDisabled={getDurationIndex(craftDuration) === 0}
                                                onClick={() => changeCraftDuration('decrease')}
                                            >
                                                Less
                                            </Button>
                                            <Button
                                                size="sm"
                                                rightIcon={<FaPlus />}
                                                variant="outline"
                                                borderColor="whiteAlpha.300"
                                                color="white"
                                                isDisabled={getDurationIndex(craftDuration) === DURATION_OPTIONS.length - 1}
                                                onClick={() => changeCraftDuration('increase')}
                                            >
                                                More
                                            </Button>
                                        </HStack>
                                    </HStack>
                                    <Progress value={(getDurationIndex(craftDuration) / (DURATION_OPTIONS.length - 1)) * 100} colorScheme="purple" bg="#1d282d" borderRadius="6px" />
                                </Box>

                                {usesEmbeddedWallet && craftBatchProgress && (
                                    <Box bg="rgba(7, 16, 12, 0.72)" border="1px solid" borderColor="rgba(87, 214, 141, 0.26)" borderRadius="8px" p={3}>
                                        <HStack justify="space-between" mb={1}>
                                            <Text color="#57d68d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                                Play Hub batch
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
                                    loadingText={usesEmbeddedWallet ? craftBatchProgressText : 'Crafting'}
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
                                        Ingredients
                                    </Text>
                                    <Stack spacing={2}>
                                        {groupedRequirements.ingredients.map(item => (
                                            <RequirementRow
                                                key={`${item.type}-${item.name}`}
                                                item={item}
                                                onFind={item.have < item.needed ? onOpenSupplyBoard : null}
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
                                                onFind={item.have < item.needed ? onOpenSupplyBoard : null}
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
                                                onFind={item.have < item.needed ? onOpenSupplyBoard : null}
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
            />
            {!isEmbeddedMode && (
                <PinModal showPinInput={showPinInput} setShowPinInput={setShowPinInput} handlePinInput={handlePinInput} />
            )}
        </Box>
    );
};

export default Elyxir;
