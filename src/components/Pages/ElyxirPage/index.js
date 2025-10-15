/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { Box, useColorModeValue, useToast, useDisclosure } from '@chakra-ui/react';
import { checkPin } from '../../../utils/walletUtils';
import RecipeSelector from './Components/RecipeSelector';
import FlaskSelector from './Components/FlaskSelector';
import RecipeDisplay from './Components/RecipeDisplay';
import CraftingControls from './Components/CraftingControls';
import ActiveJobs from './Components/ActiveJobs';
import CompletedJobs from './Components/CompletedJobs';
import CraftingConfirmation from './Components/Modals/CraftingConfirmation';
import PinModal from './Components/Modals/PinModal';
import { getUserJobs, sendCraftPotionAssets, sendCraftPotionMessage } from '../../../services/Elyxir/elyxir';
import { addressToAccountId } from '../../../services/Ardor/ardorInterface';
import { useSelector } from 'react-redux';
import { DURATION_OPTIONS } from './data';

const Elyxir = ({ infoAccount }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const { prev_height } = useSelector(state => state.blockchain);

    const [selectedFlask, setSelectedFlask] = useState(null);
    const [craftDuration, setCraftDuration] = useState(1);

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
        const loadJobs = async () => {
            const accountId = addressToAccountId(infoAccount.accountRs);
            const jobs = await getUserJobs({ accountId });

            const active = jobs.filter(job => job.status === 'STARTED');
            const completed = jobs.filter(job => job.status !== 'STARTED');

            setActiveJobs(active);
            setCompletedJobs(completed);
        };

        loadJobs();

        const interval = setInterval(loadJobs, 10000);
        return () => clearInterval(interval);
    }, [infoAccount?.accountRs]);

    const handleStartCrafting = useCallback(
        async recipe => {
            const recipeConfig = elyxir.definition.recipes.find(r => r.recipeAssetId === recipe.recipeAssetId);
            if (recipeConfig) {
                setSelectedRecipe(recipeConfig);
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
        [elyxir?.definition?.recipes, onOpen, toast]
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

                if (pendingAction === 'craft') {
                    executeCrafting(userAccount.passphrase);
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
                const accountId = addressToAccountId(infoAccount.accountRs);
                const recipePotion = fakeAssets.potions?.find(
                    potion => potion?.asset === selectedRecipe?.creationAssetId
                );
                const multiplier = selectedFlask?.multiplier || 1;

                const mergedAssets = [];

                mergedAssets.push({ asset: selectedFlask?.asset, qnt: 1 });

                selectedRecipe.tools.forEach(asset => {
                    return mergedAssets.push({ asset, qnt: 1 });
                });

                selectedRecipe.ingredients.forEach(ing => {
                    const qnt = ing.qtyQNT * multiplier;
                    const asset = ing.assetId;
                    mergedAssets.push({ asset, qnt });
                });

                const durationBlocks = DURATION_OPTIONS.find(item => item.days === craftDuration).blocks;

                const transfered = await sendCraftPotionAssets({ mergedAssets, passphrase });
                if (!transfered) throw new Error('Failed transfering crafting asset');

                const response = await sendCraftPotionMessage({
                    accountId,
                    recipeAssetId: selectedRecipe?.recipeAssetId,
                    creationAssetId: recipePotion?.asset,
                    flaskAssetId: selectedFlask?.asset,
                    durationBlocks,
                    passphrase,
                    blockId: prev_height,
                });

                if (!response) throw new Error('Failed to start crafting');

                toast({
                    title: 'Crafting Started!',
                    description: `Started crafting ${craftingAmount}x ${recipePotion.name}. It will complete in ${craftDuration} days.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
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

    const getMissingItems = useCallback(
        (recipe, flaskMultiplier) => {
            const missing = [];
            if (recipe?.ingredients) {
                recipe?.ingredients?.forEach(req => {
                    const item = fakeAssets.ingredients?.find(i => i.asset === req.assetId);
                    const have = item ? Number(item.quantityQNT) : 0;
                    const needed = req.qtyQNT * flaskMultiplier;
                    if (have < needed) missing.push(`${needed - have}x ${req.name}`);
                });
            }
            if (recipe?.tools) {
                recipe.tools.forEach(asset => {
                    if (!fakeAssets.tools?.some(i => i.asset === asset)) missing.push(asset);
                });
            }
            return missing;
        },
        [fakeAssets.ingredients, fakeAssets.tools]
    );

    return (
        <Box maxW={'100%'} px={4} py={6}>
            <Box bg={sectionBg} p={6} borderRadius="md">
                <RecipeSelector
                    selectedFlask={selectedFlask}
                    selectedRecipe={selectedRecipe}
                    setSelectedRecipe={setSelectedRecipe}
                    getMissingItems={getMissingItems}
                    potions={fakeAssets.potions}
                />
                <FlaskSelector
                    selectedFlask={selectedFlask}
                    setSelectedFlask={setSelectedFlask}
                    flasks={fakeAssets.flasks}
                    isPotionSelected={selectedRecipe !== null}
                />
                <RecipeDisplay
                    selectedFlask={selectedFlask}
                    selectedRecipe={selectedRecipe}
                    craftDuration={craftDuration}
                />
                <CraftingControls
                    craftDuration={craftDuration}
                    setCraftDuration={setCraftDuration}
                    getMissingItems={getMissingItems}
                    selectedFlask={selectedFlask}
                    selectedRecipe={selectedRecipe}
                    isLoading={isLoading}
                    handleStartCrafting={handleStartCrafting}
                />
                <ActiveJobs activeJobs={activeJobs} sectionBg={sectionBg} isLoading={isLoading} />
                <CompletedJobs completedJobs={completedJobs} sectionBg={sectionBg} />
            </Box>
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
            <PinModal showPinInput={showPinInput} setShowPinInput={setShowPinInput} handlePinInput={handlePinInput} />
        </Box>
    );
};

export default Elyxir;
