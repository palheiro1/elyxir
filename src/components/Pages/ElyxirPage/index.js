import { useMemo, useState, useCallback, useEffect } from 'react';
import { Box, useColorModeValue, useToast, useDisclosure } from '@chakra-ui/react';
import { elyxirJobManager, ELYXIR_CONFIG } from '../../../services/Elyxir/elyxirCrafting';
import { checkPin } from '../../../utils/walletUtils';
import RecipeSelector from './Components/RecipeSelector';
import FlaskSelector from './Components/FlaskSelector';
import RecipeDisplay from './Components/RecipeDisplay';
import CraftingControls from './Components/CraftingControls';
import ActiveJobs from './Components/ActiveJobs';
import CompletedJobs from './Components/CompletedJobs';
import CraftingConfirmation from './Components/Modals/CraftingConfirmation';
import PinModal from './Components/Modals/PinModal';
import { ingredientNameMap, rawFlasks, rawIngredients, rawPotions, rawTools, realAssetIds } from './data';
import { getFlaskAssets, sendCraftPotionMessage } from '../../../services/Elyxir/elyxir';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';

// Full set of example potion recipes

const Elyxir = ({ infoAccount }) => {
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [selectedFlask, setSelectedFlask] = useState(0);
    const [craftDuration, setCraftDuration] = useState(1); // default 1 day
    const [craftingProgress, setCraftingProgress] = useState(0); // percent (for demo UI)

    // Real on-chain crafting state
    const [activeJobs, setActiveJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [craftingAmount, setCraftingAmount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [userPassphrase, setUserPassphrase] = useState(null);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const sectionBg = useColorModeValue('gray.50', 'gray.800');

    useEffect(() => {
        const loadJobs = () => {
            const active = elyxirJobManager.getActiveJobs();
            const completed = elyxirJobManager.getCompletedJobs();

            if (active.length === 0 && completed.length === 0) {
                const sampleActiveJob = {
                    jobId: 'WHISPERING_GALE_' + Date.now(),
                    userAccount: infoAccount?.accountRS,
                    potionName: 'Whispering Gale',
                    recipeAsset: '12936439663349626618',
                    potionAsset: '6485210212239811',
                    durationBlocks: 30,
                    startBlock: 12345,
                    endBlock: 12375,
                    successChance: 0.85,
                    flaskMultiplier: 2,
                    flaskAssetId: '4367881087678870632',
                    status: 'ACTIVE',
                    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
                    transactionHashes: ['sample_tx_hash_123'],
                };

                const sampleCompletedJob = {
                    jobId: 'TIDEHEART_' + (Date.now() - 1000),
                    userAccount: infoAccount?.accountRS,
                    potionName: 'Tideheart',
                    recipeAsset: '7024690161218732154',
                    potionAsset: '7582224115266007515',
                    durationBlocks: 20,
                    startBlock: 12300,
                    endBlock: 12320,
                    successChance: 0.74,
                    flaskMultiplier: 1,
                    flaskAssetId: '4367881087678870632',
                    status: 'COMPLETED',
                    success: true,
                    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
                    completedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
                    transactionHashes: ['sample_tx_hash_456', 'completion_tx_789'],
                };

                if (infoAccount?.accountRS) {
                    setActiveJobs([sampleActiveJob]);
                    setCompletedJobs([sampleCompletedJob]);
                    return;
                }
            }

            setActiveJobs(active);
            setCompletedJobs(completed);
        };

        loadJobs();

        // Check for completed jobs every 10 seconds
        const interval = setInterval(loadJobs, 10000);
        return () => clearInterval(interval);
    }, [infoAccount?.accountRS]);

    // Crafting functions
    const handleStartCrafting = useCallback(
        async recipe => {
            // Find the official recipe by name
            if (ELYXIR_CONFIG && ELYXIR_CONFIG.POTION_RECIPES && ELYXIR_CONFIG.POTION_RECIPES[recipe.name]) {
                const officialRecipe = {
                    id: recipe.name.toLowerCase().replace(/\s+/g, '_'),
                    name: recipe.name,
                    ...ELYXIR_CONFIG.POTION_RECIPES[recipe.name],
                };
                setSelectedRecipe(officialRecipe);
                setCraftingAmount(1);
                onOpen();
            } else {
                toast({
                    title: 'Recipe Not Available',
                    description: 'This recipe is not available for real crafting yet',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
            }
        },
        [onOpen, toast]
    );

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

                // Execute the pending action
                if (pendingAction === 'craft') {
                    executeCrafting(userAccount.passphrase);
                } else if (pendingAction && pendingAction.type === 'complete') {
                    executeCompletion(pendingAction.jobId, userAccount.passphrase);
                }
            } catch (error) {
                console.error('PIN verification error:', error);
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

        // Request PIN for crafting
        if (!userPassphrase) {
            requestPinForAction('craft');
            return;
        }

        await executeCrafting(userPassphrase);
    }, [selectedRecipe, infoAccount, onClose, toast, userPassphrase, requestPinForAction]);

    const executeCrafting = useCallback(
        async passphrase => {
            setIsLoading(true);

            try {
                // Start crafting job
                const accountId = addressToAccountId(infoAccount.accountRS);
                const response = await sendCraftPotionMessage({
                    accountId,
                    recipeAssetId: selectedRecipe.realAsset,
                    flaskAssetId: (await fakeAssets).flasks,
                });

                const jobResult = await elyxirJobManager.startCraftingJob(
                    infoAccount.accountRS,
                    passphrase,
                    selectedRecipe.name,
                    30, // 30 blocks duration (about 30 minutes)
                    '4367881087678870632', // default conical flask
                    toast
                );

                if (response) {
                    // Update active jobs
                    const updatedJobs = elyxirJobManager.getActiveJobs();
                    setActiveJobs(updatedJobs);

                    toast({
                        title: 'Crafting Started!',
                        description: `Started crafting ${craftingAmount}x ${selectedRecipe.name}. It will complete in ${
                            selectedRecipe.duration || 30
                        } minutes.`,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(jobResult.message || 'Failed to start crafting');
                }
            } catch (error) {
                console.error('Crafting error:', error);
                toast({
                    title: 'Crafting Failed',
                    description: error.message || 'An unexpected error occurred',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
                setSelectedRecipe(null);
                setCraftingAmount(1);
                setPendingAction(null);
            }
        },
        [selectedRecipe, craftingAmount, infoAccount, toast]
    );

    const executeCompletion = useCallback(
        async (jobId, passphrase) => {
            setIsLoading(true);

            try {
                const result = await elyxirJobManager.completeCraftingJob(jobId, passphrase, toast);

                if (result && result.success) {
                    // Update jobs
                    const active = elyxirJobManager.getActiveJobs();
                    const completed = elyxirJobManager.getCompletedJobs();
                    setActiveJobs(active);
                    setCompletedJobs(completed);

                    toast({
                        title: 'Crafting Completed!',
                        description: result.message || 'Your crafting has been completed successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(result.message || 'Failed to complete crafting');
                }
            } catch (error) {
                console.error('Complete job error:', error);
                toast({
                    title: 'Completion Failed',
                    description: error.message || 'Failed to complete crafting job',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
                setPendingAction(null);
            }
        },
        [toast]
    );

    const handleCompleteJob = useCallback(
        async jobId => {
            // Request PIN for job completion
            if (!userPassphrase) {
                requestPinForAction({ type: 'complete', jobId });
                return;
            }

            await executeCompletion(jobId, userPassphrase);
        },
        [userPassphrase, requestPinForAction, executeCompletion]
    );

    // Create assets using real Ardor asset IDs from the blockchain (same as Inventory and Market)
    const fakeAssets = useMemo(async () => {
        const ingredients = rawIngredients.map((name, index) => {
            const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

            return {
                asset: assetId,
                name:
                    ingredientNameMap[name] ||
                    name
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^\w/, c => c.toUpperCase()),
                description: `A mystical ingredient for potion crafting`,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/ingredients/${name}.png`,
                elyxirType: 'INGREDIENT',
                isFake: true,
            };
        });

        const tools = rawTools.map((tool, index) => {
            const assetId = realAssetIds[tool.key] || `fake_tool_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

            return {
                asset: assetId,
                name: tool.name,
                description: tool.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/tools/${tool.image}`,
                elyxirType: 'TOOL',
                isFake: true,
            };
        });

        const flasksResponse = await getFlaskAssets();
        const flasks = rawFlasks.map((flask, index) => {
            const assetId = realAssetIds[flask.key] || `fake_flask_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

            let multiplier = 0;
            if (flasksResponse) {
                multiplier = flasksResponse[assetId];
            }
            return {
                asset: assetId,
                name: flask.name,
                description: flask.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/flasks/${flask.image}`,
                elyxirType: 'FLASK',
                isFake: true,
                multiplier,
            };
        });

        const potions = rawPotions.map((potion, index) => {
            const assetId = realAssetIds[potion.key] || `fake_potion_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;

            return {
                asset: assetId,
                name: potion.name,
                description: potion.description,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/potions/${potion.image}`,
                elyxirType: 'CREATION',
                isFake: true,
            };
        });

        return { ingredients, tools, flasks, potions };
    }, [infoAccount?.assets]);

    console.log('🚀 ~ Elyxir ~ fakeAssets:', fakeAssets);

    // Use the properly formatted assets instead of raw Redux items
    const allElyxirItems = useMemo(() => {
        return [...fakeAssets.ingredients, ...fakeAssets.tools, ...fakeAssets.flasks, ...fakeAssets.potions];
    }, [fakeAssets]);

    // Group items by type for recipe checking
    const groupedItems = useMemo(() => {
        const result = {};
        allElyxirItems.forEach(item => {
            const type = item.elyxirType.toLowerCase() + 's';
            if (!result[type]) result[type] = [];
            result[type].push(item);
        });
        return result;
    }, [allElyxirItems]);

    // Get missing items for recipe crafting (updated to use flask multiplier)
    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];
            if (recipe.ingredients) {
                recipe.ingredients.forEach(req => {
                    const item = groupedItems.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                    const have = item ? Number(item.quantityQNT) : 0;
                    const needed = req.quantity * flaskMultiplier;
                    if (have < needed) missing.push(`${needed - have}x ${req.name}`);
                });
            }
            if (recipe.tools) {
                recipe.tools.forEach(name => {
                    if (!groupedItems.tools?.some(i => i.name.toLowerCase() === name.toLowerCase())) missing.push(name);
                });
            }
            return missing;
        },
        [groupedItems]
    );

    return (
        <Box maxW={'100%'} px={4} py={6}>
            <Box bg={sectionBg} p={6} borderRadius="md">
                {/* Recipe Selection */}
                <RecipeSelector
                    selectedFlask={selectedFlask}
                    selectedRecipeIdx={selectedRecipeIdx}
                    setSelectedRecipeIdx={setSelectedRecipeIdx}
                    getMissingItems={getMissingItems}
                />

                {/* Flask Selection */}
                <FlaskSelector
                    selectedFlask={selectedFlask}
                    setSelectedFlask={setSelectedFlask}
                    fakeAssets={fakeAssets}
                />

                {/* Selected Recipe Details with Visual Ingredients */}
                <RecipeDisplay
                    selectedFlask={selectedFlask}
                    selectedRecipeIdx={selectedRecipeIdx}
                    craftDuration={craftDuration}
                    groupedItems={groupedItems}
                />

                {/* Crafting Controls */}
                <CraftingControls
                    craftDuration={craftDuration}
                    setCraftDuration={setCraftDuration}
                    craftingProgress={craftingProgress}
                    getMissingItems={getMissingItems}
                    selectedFlask={selectedFlask}
                    selectedRecipeIdx={selectedRecipeIdx}
                    isLoading={isLoading}
                    handleStartCrafting={handleStartCrafting}
                />

                {/* Active Jobs Section */}
                <ActiveJobs
                    activeJobs={activeJobs}
                    sectionBg={sectionBg}
                    handleCompleteJob={handleCompleteJob}
                    isLoading={isLoading}
                />

                {/* Completed Jobs Section */}
                <CompletedJobs completedJobs={completedJobs} sectionBg={sectionBg} />
            </Box>

            {/* Crafting Confirmation Modal */}
            <CraftingConfirmation
                infoAccount={infoAccount}
                isOpen={isOpen}
                onClose={onClose}
                selectedRecipe={selectedRecipe}
                setCraftingAmount={setCraftingAmount}
                confirmCrafting={confirmCrafting}
                isLoading={isLoading}
                selectedFlask={selectedFlask}
            />

            {/* PIN Input Modal */}
            <PinModal showPinInput={showPinInput} setShowPinInput={setShowPinInput} handlePinInput={handlePinInput} />
        </Box>
    );
};

export default Elyxir;
