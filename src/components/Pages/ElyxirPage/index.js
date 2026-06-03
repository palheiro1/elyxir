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
import { getUserJobs, sendCraftPotionAssets, sendCraftPotionMessage } from '../../../services/Elyxir/elyxir';
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

const Panel = ({ children, ...props }) => (
    <Box
        bg="#10171b"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="8px"
        boxShadow="0 18px 60px rgba(0, 0, 0, 0.25)"
        {...props}
    >
        {children}
    </Box>
);

const AssetImage = ({ src, boxSize = '52px', ...props }) => (
    <Image src={src || imageFallback} fallbackSrc={imageFallback} boxSize={boxSize} objectFit="contain" {...props} />
);

const MiniMetric = ({ label, value, icon, tone = '#57d68d' }) => (
    <Box bg="#0b1114" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
        <HStack justify="space-between">
            <Box minW={0}>
                <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" fontWeight="bold">
                    {label}
                </Text>
                <Text fontWeight="black" fontSize="xl">
                    {value}
                </Text>
            </Box>
            <Circle size="32px" bg="whiteAlpha.100" color={tone}>
                <Icon as={icon} />
            </Circle>
        </HStack>
    </Box>
);

const RecipeCard = ({ recipe, potion, selected, missingCount, onSelect }) => {
    const ready = missingCount === 0;

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
            bg={selected ? 'rgba(87, 214, 141, 0.12)' : '#0b1114'}
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
                        Recipe {String(recipe.recipeAssetId || '').slice(-6)}
                    </Text>
                    <HStack mt={2} spacing={2}>
                        <Badge colorScheme={ready ? 'green' : 'orange'} borderRadius="6px">
                            {ready ? 'Ready' : `${missingCount} missing`}
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
            minH="96px"
            p={3}
            border="1px solid"
            borderColor={selected ? '#d8b56d' : 'whiteAlpha.200'}
            bg={selected ? 'rgba(216, 181, 109, 0.12)' : '#0b1114'}
            borderRadius="8px"
            _hover={{ borderColor: quantity > 0 ? '#d8b56d' : 'whiteAlpha.200' }}
            onClick={() => quantity > 0 && onSelect(flask)}
        >
            <Stack align="center" spacing={2}>
                <AssetImage src={flask?.imgUrl} boxSize="42px" />
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

const RequirementRow = ({ item }) => {
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
            <Badge colorScheme={ok ? 'green' : 'orange'} borderRadius="6px">
                {formatNumber(item.have)} / {formatNumber(item.needed)}
            </Badge>
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
        <Box bg="#0b1114" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px" p={3}>
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

const Elyxir = ({ infoAccount, walletProvider = null, embedded = false }) => {
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const isEmbeddedMode = Boolean(embedded);
    const usesEmbeddedWallet = Boolean(isEmbeddedMode && walletProvider);

    const selectedPotion = useMemo(() => getPotionForRecipe(selectedRecipe, fakeAssets.potions), [selectedRecipe, fakeAssets.potions]);
    const selectedMultiplier = selectedFlask?.multiplier || 1;
    const selectedFlaskOwned = Number(selectedFlask?.quantityQNT || 0) > 0;
    const successRate = Math.trunc(calculateSuccessRate(craftDuration) * 10000) / 100;

    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];

            recipe?.ingredients?.forEach(req => {
                const item = fakeAssets.ingredients?.find(i => String(i.asset) === String(req.assetId));
                const have = item ? Number(item.quantityQNT || 0) : 0;
                const needed = Number(req.qtyQNT || 0) * flaskMultiplier;
                if (have < needed) {
                    missing.push({
                        type: 'ingredient',
                        name: item?.name || req.name || req.assetId,
                        have,
                        needed,
                    });
                }
            });

            recipe?.tools?.forEach(asset => {
                const item = fakeAssets.tools?.find(i => String(i.asset) === String(asset));
                const have = item ? Number(item.quantityQNT || 0) : 0;
                if (have <= 0) {
                    missing.push({
                        type: 'tool',
                        name: item?.name || asset,
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
            const item = fakeAssets.ingredients?.find(i => String(i.asset) === String(req.assetId));
            return {
                type: 'Ingredient',
                name: item?.name || req.name || req.assetId,
                imgUrl: item?.imgUrl,
                have: item ? Number(item.quantityQNT || 0) : 0,
                needed: Number(req.qtyQNT || 0) * selectedMultiplier,
            };
        }) || [];

        const tools = selectedRecipe.tools?.map(asset => {
            const item = fakeAssets.tools?.find(i => String(i.asset) === String(asset));
            return {
                type: 'Tool',
                name: item?.name || asset,
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
    const canCraft = Boolean(selectedRecipe && selectedFlask && selectedFlaskOwned && missingItems.length === 0 && !isLoading);

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
        [selectedRecipe, selectedFlask, craftDuration, fakeAssets.potions, infoAccount, prev_height, toast]
    );

    const changeCraftDuration = direction => {
        const index = getDurationIndex(craftDuration);
        const nextIndex = direction === 'increase' ? Math.min(DURATION_OPTIONS.length - 1, index + 1) : Math.max(0, index - 1);
        setCraftDuration(DURATION_OPTIONS[nextIndex].days);
    };

    return (
        <Box color="white">
            <Grid templateColumns={{ base: '1fr', xl: '310px minmax(0, 1fr) 330px' }} gap={4} alignItems="start">
                <GridItem>
                    <Panel p={4}>
                        <HStack justify="space-between" mb={4}>
                            <Box>
                                <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                    Recipes
                                </Text>
                                <Heading size="md">Potion browser</Heading>
                            </Box>
                            <Badge bg="whiteAlpha.100" color="whiteAlpha.800" borderRadius="6px">
                                {recipes.length}
                            </Badge>
                        </HStack>
                        <Stack spacing={3} maxH={{ base: 'none', xl: 'calc(100vh - 190px)' }} overflowY={{ base: 'visible', xl: 'auto' }}>
                            {recipes.map(recipe => {
                                const potion = getPotionForRecipe(recipe, fakeAssets.potions);
                                const missing = getMissingItems(recipe, selectedMultiplier);
                                return (
                                    <RecipeCard
                                        key={recipe.recipeAssetId}
                                        recipe={recipe}
                                        potion={potion}
                                        selected={selectedRecipe?.recipeAssetId === recipe.recipeAssetId}
                                        missingCount={missing.length}
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
                            <Box minW={0}>
                                <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                    Crafting station
                                </Text>
                                <Heading size={{ base: 'md', md: 'lg' }} noOfLines={1}>
                                    {selectedPotion?.name || 'Select a potion'}
                                </Heading>
                            </Box>
                            <Badge colorScheme={canCraft ? 'green' : 'orange'} borderRadius="6px" px={3} py={1}>
                                {canCraft ? 'Ready' : 'Blocked'}
                            </Badge>
                        </HStack>

                        <Grid templateColumns={{ base: '1fr', lg: '220px minmax(0, 1fr)' }} gap={5} alignItems="center">
                            <Box textAlign="center">
                                <Circle
                                    size={{ base: '170px', md: '210px' }}
                                    mx="auto"
                                    bg="#0b1114"
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
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                                    <MiniMetric label="Success" value={`${successRate}%`} icon={FaCheckCircle} tone="#57d68d" />
                                    <MiniMetric label="Duration" value={`${craftDuration}d`} icon={FaClock} tone="#d8b56d" />
                                    <MiniMetric label="Output" value={`x${selectedMultiplier || 0}`} icon={FaFlask} tone="#b999ff" />
                                </SimpleGrid>

                                <Box>
                                    <HStack justify="space-between" mb={3}>
                                        <Text fontWeight="bold">Flask</Text>
                                        <Text color="whiteAlpha.500" fontSize="sm">
                                            {selectedFlask?.name || 'No flask selected'}
                                        </Text>
                                    </HStack>
                                    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={3}>
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
                                        <Text fontWeight="bold">Duration</Text>
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

                                <Button
                                    h="58px"
                                    leftIcon={<Icon as={FaFlask} />}
                                    bg="#57d68d"
                                    color="#07100c"
                                    fontWeight="black"
                                    _hover={{ bg: '#46c47d' }}
                                    isLoading={isLoading}
                                    isDisabled={!canCraft}
                                    onClick={() => handleStartCrafting(selectedRecipe)}
                                >
                                    Craft potion
                                </Button>
                            </Stack>
                        </Grid>
                    </Panel>
                </GridItem>

                <GridItem>
                    <Stack spacing={4}>
                        <Panel p={4}>
                            <HStack justify="space-between" mb={4}>
                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                        Requirements
                                    </Text>
                                    <Heading size="md">Asset check</Heading>
                                </Box>
                                <Icon color={missingItems.length ? '#f6ad55' : '#57d68d'} as={missingItems.length ? FaExclamationTriangle : FaCheckCircle} />
                            </HStack>
                            <Stack spacing={2}>
                                {requirementRows.map(item => (
                                    <RequirementRow key={`${item.type}-${item.name}`} item={item} />
                                ))}
                            </Stack>
                        </Panel>

                        <Panel p={4}>
                            <HStack justify="space-between" mb={4}>
                                <Box>
                                    <Text color="#d8b56d" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                                        Jobs
                                    </Text>
                                    <Heading size="md">Active queue</Heading>
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

            <CraftingConfirmation
                infoAccount={infoAccount}
                isOpen={isOpen}
                onClose={onClose}
                selectedRecipe={selectedRecipe}
                confirmCrafting={confirmCrafting}
                isLoading={isLoading}
                selectedFlask={selectedFlask}
            />
            {!isEmbeddedMode && (
                <PinModal showPinInput={showPinInput} setShowPinInput={setShowPinInput} handlePinInput={handlePinInput} />
            )}
        </Box>
    );
};

export default Elyxir;
