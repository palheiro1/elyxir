import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
    Heading, 
    Text, 
    Box, 
    Stack, 
    Button, 
    HStack, 
    Badge, 
    Progress, 
    Wrap, 
    WrapItem, 
    useColorModeValue,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    VStack,
    Divider,
    Select,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
    PinInput,
    PinInputField
} from '@chakra-ui/react';
import { elyxirJobManager, ELYXIR_CONFIG } from '../../../services/Elyxir/elyxirCrafting';
import { checkPin } from '../../../utils/walletUtils';

// Full set of example potion recipes
const RECIPES = [
    {
        id: 'whispering_gale',
        name: 'Whispering Gale',
        ingredients: [
            { name: 'Cloud Essence', quantity: 1 },
            { name: 'Wind Essence', quantity: 2 },
            { name: 'Himalayan Snow', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.8,
        result: 'Whispering Gale',
    },
    {
        id: 'tideheart',
        name: 'Tideheart',
        ingredients: [
            { name: 'Sea Water', quantity: 2 },
            { name: 'Crystal Water', quantity: 1 },
            { name: 'Rainbow Dust', quantity: 1 },
        ],
        tools: ['Silver Ladle', 'Ancient Cauldron'],
        successRate: 0.75,
        result: 'Tideheart',
    },
    {
        id: 'stoneblood',
        name: 'Stoneblood',
        ingredients: [
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Raw Diamond', quantity: 1 },
            { name: 'Desert Sand', quantity: 2 },
        ],
        tools: ['Stone Mortar', 'Mystical Bellows'],
        successRate: 0.82,
        result: 'Stoneblood',
    },
    {
        id: 'feathered_flame',
        name: 'Feathered Flame',
        ingredients: [
            { name: 'Feather', quantity: 2 },
            { name: 'Volcano Lava', quantity: 1 },
            { name: 'Lightning Essence', quantity: 1 },
        ],
        tools: ['Mystical Bellows', 'Silver Ladle'],
        successRate: 0.7,
        result: 'Feathered Flame',
    },
    {
        id: 'eternal_silk',
        name: 'Eternal Silk',
        ingredients: [
            { name: 'Cotton Flower', quantity: 1 },
            { name: 'Garden Flower', quantity: 2 },
            { name: 'Bottled Sunlight', quantity: 1 },
        ],
        tools: ['Stone Mortar', 'Ancient Cauldron'],
        successRate: 0.77,
        result: 'Eternal Silk',
    },
    {
        id: 'coral',
        name: 'Coral',
        ingredients: [
            { name: 'Sea Water', quantity: 2 },
            { name: 'Rainbow Dust', quantity: 1 },
            { name: 'Garden Flower', quantity: 1 },
        ],
        tools: ['Ancient Cauldron', 'Silver Ladle'],
        successRate: 0.74,
        result: 'Coral',
    },
];

const Elyxir = ({ infoAccount }) => {
    // Alchemy UI state
    const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);
    const [selectedFlaskIdx, setSelectedFlaskIdx] = useState(0);
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
    
    // UI colors (hooks must be at top level)
    const sectionBg = useColorModeValue('gray.50', 'gray.800');

    // Calculate success rate based on craft duration using actual DURATION_OPTIONS
    const calculateSuccessRate = (days) => {
        // Find the closest duration option or interpolate
        const options = ELYXIR_CONFIG.DURATION_OPTIONS;
        
        // Find exact match first
        const exactMatch = options.find(opt => opt.days === days);
        if (exactMatch) {
            return exactMatch.successChance;
        }
        
        // If no exact match, find the closest lower and upper bounds
        const sortedOptions = [...options].sort((a, b) => a.days - b.days);
        
        // If days is less than minimum, return minimum
        if (days <= sortedOptions[0].days) {
            return sortedOptions[0].successChance;
        }
        
        // If days is greater than maximum, return maximum  
        if (days >= sortedOptions[sortedOptions.length - 1].days) {
            return sortedOptions[sortedOptions.length - 1].successChance;
        }
        
        // Linear interpolation between two closest values
        for (let i = 0; i < sortedOptions.length - 1; i++) {
            const lower = sortedOptions[i];
            const upper = sortedOptions[i + 1];
            
            if (days >= lower.days && days <= upper.days) {
                const ratio = (days - lower.days) / (upper.days - lower.days);
                return Math.round(lower.successChance + ratio * (upper.successChance - lower.successChance));
            }
        }
        
        // Fallback
        return 31;
    };

    // Load jobs from localStorage on component mount
    useEffect(() => {
        const loadJobs = () => {
            const active = elyxirJobManager.getActiveJobs();
            const completed = elyxirJobManager.getCompletedJobs();
            
            // If no jobs exist and we're in development, create sample jobs for testing
            if (active.length === 0 && completed.length === 0 && process.env.NODE_ENV === 'development') {
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
                    transactionHashes: ['sample_tx_hash_123']
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
                    transactionHashes: ['sample_tx_hash_456', 'completion_tx_789']
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
    const handleStartCrafting = useCallback(async (recipe) => {
        // Find the official recipe by name
        if (ELYXIR_CONFIG && ELYXIR_CONFIG.POTION_RECIPES && ELYXIR_CONFIG.POTION_RECIPES[recipe.name]) {
            const officialRecipe = {
                id: recipe.name.toLowerCase().replace(/\s+/g, '_'),
                name: recipe.name,
                ...ELYXIR_CONFIG.POTION_RECIPES[recipe.name]
            };
            setSelectedRecipe(officialRecipe);
            setCraftingAmount(1);
            onOpen();
        } else {
            toast({
                title: "Recipe Not Available",
                description: "This recipe is not available for real crafting yet",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [onOpen, toast]);

    const handlePinInput = useCallback((pin) => {
        try {
            const userAccount = checkPin(infoAccount.name, pin);
            if (!userAccount || !userAccount.passphrase) {
                toast({
                    title: "Invalid PIN",
                    description: "Please enter your correct PIN",
                    status: "error",
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
                title: "PIN Error",
                description: "Failed to verify PIN. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [infoAccount.name, pendingAction, toast]);

    const requestPinForAction = useCallback((action) => {
        setPendingAction(action);
        setShowPinInput(true);
    }, []);

    const confirmCrafting = useCallback(async () => {
        if (!selectedRecipe || !infoAccount) {
            toast({
                title: "Error",
                description: "Please select a recipe and ensure you're logged in",
                status: "error",
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

    const executeCrafting = useCallback(async (passphrase) => {
        setIsLoading(true);

        try {
            // Start crafting job
            const jobResult = await elyxirJobManager.startCraftingJob(
                infoAccount.accountRS,
                passphrase,
                selectedRecipe.name,
                30, // 30 blocks duration (about 30 minutes)
                "4367881087678870632", // default conical flask
                toast
            );

            if (jobResult.success) {
                // Update active jobs
                const updatedJobs = elyxirJobManager.getActiveJobs();
                setActiveJobs(updatedJobs);

                toast({
                    title: "Crafting Started!",
                    description: `Started crafting ${craftingAmount}x ${selectedRecipe.name}. It will complete in ${selectedRecipe.duration || 30} minutes.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error(jobResult.message || 'Failed to start crafting');
            }
        } catch (error) {
            console.error('Crafting error:', error);
            toast({
                title: "Crafting Failed",
                description: error.message || 'An unexpected error occurred',
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
            setSelectedRecipe(null);
            setCraftingAmount(1);
            setPendingAction(null);
        }
    }, [selectedRecipe, craftingAmount, infoAccount, toast]);

    const executeCompletion = useCallback(async (jobId, passphrase) => {
        setIsLoading(true);

        try {
            const result = await elyxirJobManager.completeCraftingJob(
                jobId, 
                passphrase, 
                toast
            );
            
            if (result && result.success) {
                // Update jobs
                const active = elyxirJobManager.getActiveJobs();
                const completed = elyxirJobManager.getCompletedJobs();
                setActiveJobs(active);
                setCompletedJobs(completed);

                toast({
                    title: "Crafting Completed!",
                    description: result.message || 'Your crafting has been completed successfully',
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to complete crafting');
            }
        } catch (error) {
            console.error('Complete job error:', error);
            toast({
                title: "Completion Failed",  
                description: error.message || 'Failed to complete crafting job',
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
            setPendingAction(null);
        }
    }, [toast]);

    const handleCompleteJob = useCallback(async (jobId) => {
        // Request PIN for job completion
        if (!userPassphrase) {
            requestPinForAction({ type: 'complete', jobId });
            return;
        }

        await executeCompletion(jobId, userPassphrase);
    }, [userPassphrase, requestPinForAction, executeCompletion]);

    const getMaxCraftable = useCallback((recipe) => {
        if (!recipe || !recipe.ingredients || !infoAccount?.assets) return 0;
        
        let maxAmount = Infinity;
        
        recipe.ingredients.forEach(ingredient => {
            const userAsset = infoAccount.assets.find(asset => asset.asset === ingredient.assetId);
            const available = userAsset ? parseInt(userAsset.quantityQNT) : 0;
            const possibleAmount = Math.floor(available / ingredient.baseQNT);
            maxAmount = Math.min(maxAmount, possibleAmount);
        });
        
        return maxAmount === Infinity ? 0 : maxAmount;
    }, [infoAccount?.assets]);

    // Flask multipliers for ingredient quantities
    const flaskMultipliers = [1, 2, 3, 4, 5]; // x1 to x5

    // Create assets using real Ardor asset IDs from the blockchain (same as Inventory and Market)
    const fakeAssets = useMemo(() => {
        // Real Ardor Asset IDs mapping (from CSV file)
        const realAssetIds = {
            // Ingredients
            'aguas_fetidas': '7536385584787697086',
            'alcoholbeer': '2795734210888256790',
            'blood': '16326649816730553703',
            'watercristaline': '10917692030112170713',
            'water_sea': '10444425886085847503',
            'cloud': '18101012326255288772',
            'lightninggg': '3607141736374727634',
            'wind': '65767141008711421',
            'sunlight': '8717959006135737805',
            'lava': '488367278629756964',
            'flordealgodao': '6086151229884242778',
            'gardenflower': '8966516609271135665',
            'corteza': '1941380340903453000',
            'herbadeetiopia': '5528548442683058721',
            'poisonherb': '524790161704873898',
            'mustardseeds': '583958094572828441',
            'peyote': '12313032092046113556',
            'alamorcego': '8825927167203958938',
            'bigfootshair': '4735490741705855799',
            'feather': '15284691712437925618',
            'kangarootail': '16412049206728355506',
            'vampirefang': '1853993309806999896',
            'wolfsfang': '1734749669966442838',
            'araucarianresine': '9146455733851008946',
            'ash': '15102806604556354632',
            'bonepowder': '10982823421829006444',
            'diamantebruto': '5570219882495290440',
            'gardensoil': '11508698419506139756',
            'horndust': '10089652431946070133',
            'hymalayansnow': '2603114092541070832',
            'pluma': '15230533556325993984',
            'skin': '11436325470737709655',
            'sand': '6043065774866721090',
            'rahusaliva': '1571336020100556625',
            'rainboudust': '7891814295348826088',
            'holi': '13446501052073878899',
            // Tools
            'bellow': '7394449015011337044',
            'cauldron': '1310229991284473521',
            'ladle': '9451976923053037726',
            'mortar': '188493294393002400',
            // Flasks
            'conical_flask': '4367881087678870632',
            'pear_flask': '3758988694981372970',
            'kjeldahl_flask': '1328293559375692481',
            'florence_flask': '8026549983053279231',
            'round_flask': '9118586585609900793',
            // Potions (Creations)
            'whispering_gale': '6485210212239811',
            'tideheart': '7582224115266007515',
            'stoneblood': '10474636406729395731',
            'eternal_silk': '5089659721388119266',
            'coral_spirits': '8693351662911145147',
            'feathered_flame': '11206437400477435454',
            'shifting_dunes': '12861522637067934750',
            'forgotten_grove': '3858707486313568681',
        };

        // Mapping of image file names to proper names (matching Inventory and Market)
        const ingredientNameMap = {
            'aguas_fetidas': 'Fetid Waters',
            'alamorcego': 'Bat Wing',
            'alcoholbeer': 'Alcohol Beer',
            'araucarianresine': 'Araucarian Resine',
            'ash': 'Volcanic Ash',
            'bigfootshair': 'Bigfoot Hair',
            'blood': 'Blood',
            'bonepowder': 'Bone Powder',
            'cloud': 'Cloud Essence',
            'corteza': 'Tree Bark',
            'diamantebruto': 'Raw Diamond',
            'feather': 'Feather',
            'flordealgodao': 'Cotton Flower',
            'gardenflower': 'Garden Flower',
            'gardensoil': 'Garden Soil',
            'herbadeetiopia': 'Ethiopian Herb',
            'holi': 'Holi Powder',
            'horndust': 'Horn Dust',
            'hymalayansnow': 'Himalayan Snow',
            'kangarootail': 'Kangaroo Tail',
            'lava': 'Volcano Lava',
            'lightninggg': 'Lightning Essence',
            'mustardseeds': 'Mustard Seeds',
            'peyote': 'Peyote',
            'pluma': 'Feather',
            'poisonherb': 'Poison Herb',
            'rainboudust': 'Rainbow Dust',
            'rahusaliva': 'Rahu Saliva',
            'sand': 'Desert Sand',
            'skin': 'Snake Skin',
            'sunlight': 'Bottled Sunlight',
            'vampirefang': 'Vampire Blood',
            'watercristaline': 'Crystal Water',
            'water_sea': 'Sea Water',
            'wind': 'Wind Essence',
            'wolfsfang': 'Wolf Fang',
        };

        const ingredients = [
            'aguas_fetidas', 'alamorcego', 'alcoholbeer', 'araucarianresine', 'ash', 'bigfootshair', 'blood', 
            'bonepowder', 'cloud', 'corteza', 'diamantebruto', 'feather', 'flordealgodao', 'gardenflower',
            'gardensoil', 'herbadeetiopia', 'holi', 'horndust', 'hymalayansnow', 'kangarootail', 'lava',
            'lightninggg', 'mustardseeds', 'peyote', 'pluma', 'poisonherb', 'rainboudust', 'rahusaliva',
            'sand', 'skin', 'sunlight', 'vampirefang', 'watercristaline', 'water_sea', 'wind', 'wolfsfang'
        ].map((name, index) => {
            const assetId = realAssetIds[name] || `fake_ingredient_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
            return {
                asset: assetId,
                name: ingredientNameMap[name] || name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase()),
                description: `A mystical ingredient for potion crafting`,
                quantityQNT: realQuantity,
                totalQuantityQNT: 1,
                unconfirmedQuantityQNT: realUnconfirmedQuantity,
                imgUrl: `/images/elyxir/ingredients/${name}.png`,
                elyxirType: 'INGREDIENT',
                isFake: true,
            };
        });

        const tools = [
            { name: 'Mystical Bellows', description: 'Used to heat up potions during crafting', image: 'bellow.png', key: 'bellow' },
            { name: 'Ancient Cauldron', description: 'Essential for mixing ingredients together', image: 'cauldron.png', key: 'cauldron' },
            { name: 'Silver Ladle', description: 'For transferring potions into flasks', image: 'ladle.png', key: 'ladle' },
            { name: 'Stone Mortar', description: 'Grinds ingredients to release their full potential', image: 'mortar.png', key: 'mortar' }
        ].map((tool, index) => {
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

        const flasks = [
            { name: 'Conical Flask', description: 'Specialized conical laboratory flask', image: 'flask1.png', key: 'conical_flask' },
            { name: 'Pear-Shaped Flask', description: 'Unique pear-shaped distillation flask', image: 'flask2.png', key: 'pear_flask' },
            { name: 'Kjeldahl Flask', description: 'Professional analytical flask', image: 'flask3.png', key: 'kjeldahl_flask' },
            { name: 'Florence Flask', description: 'Classic round-bottom florence flask', image: 'flask4.png', key: 'florence_flask' },
            { name: 'Round-Bottom Flask', description: 'Standard round-bottom flask', image: 'flask5.png', key: 'round_flask' }
        ].map((flask, index) => {
            const assetId = realAssetIds[flask.key] || `fake_flask_${index}`;
            const realAsset = infoAccount?.assets?.find(asset => asset.asset === assetId);
            const realQuantity = realAsset ? parseInt(realAsset.quantityQNT) : 0;
            const realUnconfirmedQuantity = realAsset ? parseInt(realAsset.unconfirmedQuantityQNT) : 0;
            
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
            };
        });

        const potions = [
            { name: 'Whispering Gale Potion', description: 'Harnesses the power of wind and storms', image: 'whispering_gale.png', key: 'whispering_gale' },
            { name: 'Tideheart Potion', description: 'Contains the essence of ocean tides', image: 'tideheart.png', key: 'tideheart' },
            { name: 'Stoneblood Potion', description: 'Infused with the strength of mountains', image: 'stoneblood.png', key: 'stoneblood' },
            { name: 'Eternal Silk Potion', description: 'Woven with ancient Asian wisdom', image: 'eternal_silk.png', key: 'eternal_silk' },
            { name: 'Coral Spirits Potion', description: 'Blessed by oceanic guardians', image: 'coral_spirits.png', key: 'coral_spirits' },
            { name: 'Feathered Flame Potion', description: 'Burns with the spirit of the Americas', image: 'feathered_flame.png', key: 'feathered_flame' },
        ].map((potion, index) => {
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

    // Use the properly formatted assets instead of raw Redux items
    const allElyxirItems = useMemo(() => {
        return [
            ...fakeAssets.ingredients,
            ...fakeAssets.tools,
            ...fakeAssets.flasks,
            ...fakeAssets.potions
        ];
    }, [fakeAssets]);

    // Group items by type for recipe checking
    const grouped = useMemo(() => {
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
                    const item = grouped.ingredients?.find(i => i.name.toLowerCase() === req.name.toLowerCase());
                    const have = item ? Number(item.quantityQNT) : 0;
                    const needed = req.quantity * flaskMultiplier;
                    if (have < needed) missing.push(`${needed - have}x ${req.name}`);
                });
            }
            if (recipe.tools) {
                recipe.tools.forEach(name => {
                    if (!grouped.tools?.some(i => i.name.toLowerCase() === name.toLowerCase()))
                        missing.push(name);
                });
            }
            return missing;
        },
        [grouped]
    );

    return (
        <Box maxW={'100%'} px={4} py={6}>
            {/* Header */}


            <Box bg={sectionBg} p={6} borderRadius="md">
                {/* Recipe Selection */}
                <Stack spacing={6} mb={8}>
                    <HStack justify="space-between" align="center">
                        <Text fontWeight="bold" fontSize="lg">Select Recipe:</Text>
                        <Badge colorScheme="purple" fontSize="sm" p={2}>
                            🔗 Real Blockchain Crafting Available
                        </Badge>
                    </HStack>
                    <Wrap spacing={4}>
                        {RECIPES.map((recipe, idx) => {
                            const currentMultiplier = flaskMultipliers[selectedFlaskIdx];
                            const missing = getMissingItems(recipe, currentMultiplier);
                            const canCraft = missing.length === 0;
                            
                            // Check if this recipe has a real implementation
                            const hasRealImplementation = ELYXIR_CONFIG && ELYXIR_CONFIG.POTION_RECIPES && Object.keys(ELYXIR_CONFIG.POTION_RECIPES).some(name => name === recipe.name);
                            
                            return (
                                <WrapItem key={idx}>
                                    <Box position="relative">
                                        <Button
                                            size="md"
                                            variant={selectedRecipeIdx === idx ? 'solid' : 'outline'}
                                            colorScheme={canCraft ? 'green' : 'gray'}
                                            onClick={() => setSelectedRecipeIdx(idx)}
                                            isDisabled={!canCraft}
                                            h="60px"
                                            px={6}>
                                            {recipe.name}
                                        </Button>
                                        {hasRealImplementation && (
                                            <Badge
                                                position="absolute"
                                                top="-8px"
                                                right="-8px"
                                                colorScheme="purple"
                                                fontSize="xs"
                                                borderRadius="full">
                                                🔗
                                            </Badge>
                                        )}
                                    </Box>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </Stack>

                {/* Flask Selection */}
                <Stack spacing={6} mb={8}>
                    <Text fontWeight="bold" fontSize="lg">Select Flask (Potion Quantity):</Text>
                    <Wrap spacing={4}>
                        {fakeAssets.flasks.map((flask, idx) => (
                            <WrapItem key={idx}>
                                <Button
                                    variant={selectedFlaskIdx === idx ? 'solid' : 'outline'}
                                    colorScheme="blue"
                                    onClick={() => setSelectedFlaskIdx(idx)}
                                    h="120px"
                                    w="120px"
                                    flexDirection="column"
                                    p={2}>
                                    <Box
                                        w="60px"
                                        h="60px"
                                        backgroundImage={`url(${flask.imgUrl})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                        mb={2}
                                    />
                                    <Text fontSize="xs" textAlign="center">
                                        {flask.name}
                                    </Text>
                                    <Badge colorScheme="blue" fontSize="xs">
                                        x{flaskMultipliers[idx]} potions
                                    </Badge>
                                </Button>
                            </WrapItem>
                        ))}
                    </Wrap>
                </Stack>

                {/* Selected Recipe Details with Visual Ingredients */}
                {RECIPES[selectedRecipeIdx] && (
                    <Box p={6} border="2px" borderColor="purple.300" borderRadius="md" mb={8}>
                        <Heading size="md" mb={4}>{RECIPES[selectedRecipeIdx].name}</Heading>
                        <Text fontSize="md" mb={4} color="purple.600" fontWeight="bold">
                            Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                        </Text>
                        
                        <Stack spacing={6}>
                            {/* Ingredients with Images */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Required Ingredients:</Text>
                                <Wrap spacing={6}>
                                    {RECIPES[selectedRecipeIdx].ingredients.map((ing, i) => {
                                        const ingredient = grouped.ingredients?.find(item => 
                                            item.name.toLowerCase() === ing.name.toLowerCase()
                                        );
                                        const requiredQty = ing.quantity * flaskMultipliers[selectedFlaskIdx];
                                        const have = ingredient ? Number(ingredient.quantityQNT) : 0;
                                        const hasEnough = have >= requiredQty;
                                        
                                        return (
                                            <WrapItem key={i}>
                                                <Box 
                                                    p={4}
                                                    border="2px"
                                                    borderColor={hasEnough ? "green.300" : "red.300"}
                                                    borderRadius="md"
                                                    textAlign="center"
                                                    w="140px">
                                                    {ingredient && (
                                                        <Box
                                                            w="60px"
                                                            h="60px"
                                                            backgroundImage={`url(${ingredient.imgUrl})`}
                                                            backgroundSize="contain"
                                                            backgroundRepeat="no-repeat"
                                                            backgroundPosition="center"
                                                            mx="auto"
                                                            mb={2}
                                                        />
                                                    )}
                                                    <Text fontSize="sm" fontWeight="bold" mb={1}>
                                                        {ing.name}
                                                    </Text>
                                                    <Badge 
                                                        colorScheme={hasEnough ? "green" : "red"}
                                                        fontSize="xs">
                                                        {requiredQty} needed
                                                    </Badge>
                                                    <Text fontSize="xs" color="gray.600">
                                                        ({have} available)
                                                    </Text>
                                                </Box>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>
                            </Box>

                            {/* Tools with Images */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Required Tools:</Text>
                                <Wrap spacing={6}>
                                    {RECIPES[selectedRecipeIdx].tools.map((toolName, i) => {
                                        const tool = grouped.tools?.find(item => 
                                            item.name.toLowerCase() === toolName.toLowerCase()
                                        );
                                        const hasTool = !!tool;
                                        
                                        return (
                                            <WrapItem key={i}>
                                                <Box 
                                                    p={4}
                                                    border="2px"
                                                    borderColor={hasTool ? "green.300" : "red.300"}
                                                    borderRadius="md"
                                                    textAlign="center"
                                                    w="140px">
                                                    {tool && (
                                                        <Box
                                                            w="60px"
                                                            h="60px"
                                                            backgroundImage={`url(${tool.imgUrl})`}
                                                            backgroundSize="contain"
                                                            backgroundRepeat="no-repeat"
                                                            backgroundPosition="center"
                                                            mx="auto"
                                                            mb={2}
                                                        />
                                                    )}
                                                    <Text fontSize="sm" fontWeight="bold" mb={1}>
                                                        {toolName}
                                                    </Text>
                                                    <Badge 
                                                        colorScheme={hasTool ? "green" : "red"}
                                                        fontSize="xs">
                                                        {hasTool ? "Available" : "Missing"}
                                                    </Badge>
                                                </Box>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/* Crafting Controls */}
                <Stack spacing={6}>
                    <HStack spacing={8}>
                        <Text fontWeight="bold" fontSize="lg">Craft Duration:</Text>
                        <HStack>
                            <Button 
                                size="md" 
                                onClick={() => {
                                    const options = ELYXIR_CONFIG.DURATION_OPTIONS.map(opt => opt.days).sort((a, b) => a - b);
                                    const currentIndex = options.indexOf(craftDuration);
                                    const prevIndex = Math.max(0, currentIndex - 1);
                                    setCraftDuration(options[prevIndex]);
                                }}
                                colorScheme="purple"
                                variant="outline"
                                isDisabled={craftDuration <= Math.min(...ELYXIR_CONFIG.DURATION_OPTIONS.map(opt => opt.days))}>
                                -
                            </Button>
                            <Text minW="80px" textAlign="center" fontSize="lg" fontWeight="bold">
                                {craftDuration} {craftDuration === 1 ? 'day' : 'days'}
                            </Text>
                            <Button 
                                size="md" 
                                onClick={() => {
                                    const options = ELYXIR_CONFIG.DURATION_OPTIONS.map(opt => opt.days).sort((a, b) => a - b);
                                    const currentIndex = options.indexOf(craftDuration);
                                    const nextIndex = Math.min(options.length - 1, currentIndex + 1);
                                    setCraftDuration(options[nextIndex]);
                                }}
                                colorScheme="purple"
                                variant="outline"
                                isDisabled={craftDuration >= Math.max(...ELYXIR_CONFIG.DURATION_OPTIONS.map(opt => opt.days))}>
                                +
                            </Button>
                        </HStack>
                        <Text fontSize="md" color="purple.600" fontWeight="bold">
                            Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                        </Text>
                    </HStack>
                    
                    {craftingProgress > 0 && (
                        <Box>
                            <Text mb={2} fontWeight="bold">Crafting Progress:</Text>
                            <Progress value={craftingProgress} colorScheme="purple" size="lg" />
                        </Box>
                    )}
                    
                    <Button
                        colorScheme="purple"
                        size="lg"
                        h="60px"
                        fontSize="lg"
                        isDisabled={getMissingItems(RECIPES[selectedRecipeIdx], flaskMultipliers[selectedFlaskIdx]).length > 0 || craftingProgress > 0 || isLoading}
                        onClick={() => handleStartCrafting(RECIPES[selectedRecipeIdx])}>
                        {isLoading ? <Spinner size="sm" mr={2} /> : null}
                        {craftingProgress > 0 ? 'Crafting...' : isLoading ? 'Starting...' : `Start Real Crafting (${flaskMultipliers[selectedFlaskIdx]} potions)`}
                    </Button>
                </Stack>

                {/* Active Jobs Section */}
                {activeJobs.length > 0 && (
                    <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
                        <Heading size="md" mb={4} color="orange.500">Active Crafting Jobs</Heading>
                        <VStack spacing={4}>
                            {activeJobs.map((job) => {
                                // Calculate time-based values using block system
                                const currentTime = Date.now();
                                const startTime = new Date(job.createdAt).getTime();
                                const estimatedDuration = job.durationBlocks * 60 * 1000; // Assuming 1 minute per block
                                const completionTime = startTime + estimatedDuration;
                                const timeLeft = Math.max(0, completionTime - currentTime);
                                const totalTime = estimatedDuration;
                                const progress = totalTime > 0 ? Math.min(100, ((totalTime - timeLeft) / totalTime) * 100) : 0;
                                const isComplete = timeLeft <= 0;

                                return (
                                    <Box key={job.jobId} p={4} border="1px solid" borderColor={isComplete ? "green.200" : "orange.200"} borderRadius="md" w="full" bg={isComplete ? "green.50" : "orange.50"}>
                                        <HStack justify="space-between" mb={2}>
                                            <HStack>
                                                <Text fontWeight="bold" color={isComplete ? "green.700" : "orange.700"}>
                                                    🧪 {job.potionName}
                                                </Text>
                                                <Badge colorScheme="purple" variant="subtle">
                                                    x{job.flaskMultiplier}
                                                </Badge>
                                            </HStack>
                                            <Badge colorScheme={isComplete ? "green" : "orange"} fontSize="xs" px={2}>
                                                {isComplete ? "✅ Ready!" : `⏱️ ${Math.ceil(timeLeft / 60000)} min left`}
                                            </Badge>
                                        </HStack>
                                        
                                        <HStack spacing={4} mb={2}>
                                            <Text fontSize="sm" color="gray.600">
                                                📊 Success Rate: <strong>{Math.round(job.successChance || 80)}%</strong>
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                ⛏️ Duration: <strong>{job.durationBlocks} blocks</strong>
                                            </Text>
                                        </HStack>
                                        
                                        <Progress 
                                            value={progress} 
                                            colorScheme={isComplete ? "green" : "orange"} 
                                            size="sm" 
                                            mb={3} 
                                            borderRadius="md"
                                            bg="gray.100"
                                        />
                                        
                                        <HStack justify="space-between" align="center">
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="xs" color="gray.500">
                                                    🕐 Started: {new Date(job.createdAt).toLocaleTimeString()}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    🔗 Blocks: {job.startBlock} → {job.endBlock}
                                                </Text>
                                            </VStack>
                                            {isComplete && (
                                                <Button
                                                    size="sm"
                                                    colorScheme="green"
                                                    onClick={() => handleCompleteJob(job.jobId)}
                                                    isLoading={isLoading}
                                                    leftIcon={<span>🎯</span>}>
                                                    Complete Crafting
                                                </Button>
                                            )}
                                        </HStack>
                                    </Box>
                                );
                            })}
                        </VStack>
                    </Box>
                )}

                {/* Completed Jobs Section */}
                {completedJobs.length > 0 && (
                    <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
                        <Heading size="md" mb={4} color="green.500">Recent Completed Jobs</Heading>
                        <VStack spacing={3}>
                            {completedJobs.slice(-5).map((job) => (
                                <Box 
                                    key={job.jobId} 
                                    p={3} 
                                    border="1px solid" 
                                    borderColor={job.success ? "green.200" : "red.200"} 
                                    borderRadius="md" 
                                    w="full" 
                                    bg={job.success ? "green.50" : "red.50"}
                                >
                                    <HStack justify="space-between">
                                        <VStack align="start" spacing={1}>
                                            <HStack>
                                                <Text fontWeight="bold" fontSize="sm" color={job.success ? "green.700" : "red.700"}>
                                                    🧪 {job.potionName}
                                                </Text>
                                                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                                                    x{job.flaskMultiplier}
                                                </Badge>
                                            </HStack>
                                            <Text fontSize="xs" color="gray.600">
                                                {job.success 
                                                    ? `✅ Success: Crafted ${job.flaskMultiplier} potion${job.flaskMultiplier > 1 ? 's' : ''}` 
                                                    : `❌ Failed (${Math.round(job.successChance || 80)}% success rate)`
                                                }
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                ⛏️ {job.durationBlocks} blocks • 📊 {Math.round(job.successChance || 80)}% rate
                                            </Text>
                                        </VStack>
                                        <VStack align="end" spacing={0}>
                                            <Badge colorScheme={job.success ? "green" : "red"} fontSize="xs">
                                                {job.success ? "COMPLETED" : "FAILED"}
                                            </Badge>
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(job.completedAt || job.createdAt).toLocaleDateString()}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(job.completedAt || job.createdAt).toLocaleTimeString()}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                )}

                {/* Empty State Messages */}
                {activeJobs.length === 0 && (
                    <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
                        <Heading size="md" mb={4} color="orange.500">Active Crafting Jobs</Heading>
                        <VStack spacing={3} py={8}>
                            <Text fontSize="4xl">⚗️</Text>
                            <Text color="gray.500" textAlign="center" fontWeight="medium">No active crafting jobs</Text>
                            <Text color="gray.400" textAlign="center" fontSize="sm">Start crafting potions to see progress here</Text>
                        </VStack>
                    </Box>
                )}

                {completedJobs.length === 0 && (
                    <Box bg={sectionBg} p={6} borderRadius="lg" mb={8}>
                        <Heading size="md" mb={4} color="green.500">Recent Completed Jobs</Heading>
                        <VStack spacing={3} py={8}>
                            <Text fontSize="4xl">📜</Text>
                            <Text color="gray.500" textAlign="center" fontWeight="medium">No completed jobs yet</Text>
                            <Text color="gray.400" textAlign="center" fontSize="sm">Your crafting history will appear here</Text>
                        </VStack>
                    </Box>
                )}
            </Box>

            {/* Crafting Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Real Crafting</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedRecipe && (
                            <VStack spacing={4} align="stretch">
                                <Alert status="info" borderRadius="md">
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle>Real Blockchain Transaction!</AlertTitle>
                                        <AlertDescription>
                                            This will use real assets from your account and create actual blockchain transactions.
                                        </AlertDescription>
                                    </Box>
                                </Alert>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Recipe: {selectedRecipe.name}</Text>
                                    <Text fontSize="sm" color="gray.600" mb={4}>{selectedRecipe.description}</Text>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Amount to Craft:</Text>
                                    <Select
                                        value={craftingAmount}
                                        onChange={(e) => setCraftingAmount(parseInt(e.target.value))}
                                        maxW="150px">
                                        {Array.from({ length: Math.min(10, getMaxCraftable(selectedRecipe)) }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </Select>
                                </Box>

                                <Divider />

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Required Ingredients:</Text>
                                    <VStack spacing={2} align="stretch">
                                        {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ingredient, index) => {
                                            const userAsset = infoAccount?.assets?.find(asset => asset.asset === ingredient.assetId);
                                            const available = userAsset ? parseInt(userAsset.quantityQNT) : 0;
                                            const needed = ingredient.baseQNT * craftingAmount;
                                            const hasEnough = available >= needed;

                                            return (
                                                <HStack key={index} justify="space-between">
                                                    <Text fontSize="sm">{ingredient.name}</Text>
                                                    <Text fontSize="sm" color={hasEnough ? "green.500" : "red.500"}>
                                                        {needed} needed ({available} available)
                                                    </Text>
                                                </HStack>
                                            );
                                        })}
                                    </VStack>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Crafting Details:</Text>
                                    <Text fontSize="sm">Duration: {selectedRecipe.duration || 30} minutes</Text>
                                    <Text fontSize="sm">Success Rate: {Math.round(selectedRecipe.successRate || 80)}%</Text>
                                    <Text fontSize="sm">Fee: {selectedRecipe.fee || 0.1} ARDOR</Text>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="purple" 
                            onClick={confirmCrafting}
                            isLoading={isLoading}>
                            Start Crafting
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* PIN Input Modal */}
            <Modal isOpen={showPinInput} onClose={() => setShowPinInput(false)} size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Enter Your PIN</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Text textAlign="center" color="gray.600">
                                Please enter your 4-digit PIN to authorize the transaction
                            </Text>
                            <HStack>
                                <PinInput size="lg" onComplete={handlePinInput}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Elyxir;
