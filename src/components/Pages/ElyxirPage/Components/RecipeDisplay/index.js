import { Alert, AlertDescription, AlertIcon, Box, Heading, Stack, Text } from '@chakra-ui/react';
import RequiredIngredients from './Components/RequiredIngredients';
import RequiredTools from './Components/RequiredTools';
import { calculateSuccessRate, formatSuccessRate } from '../../../../../utils/elyxirUtils';
import { useSelector } from 'react-redux';
import { ELYXIR_LIFECYCLE_FIX_HEIGHT, NEW_LIFECYCLE_ACTIVE_COPY } from '../../../../../utils/elyxirLifecycle';

/**
 * @name RecipeDisplay
 * @description Displays detailed information about the selected crafting recipe, including the resulting potion name,
 * calculated success rate based on crafting duration, required ingredients, and necessary tools.
 * Provides a clear overview before the crafting process begins.
 * @param {Object} selectedRecipe - The currently selected recipe, containing ingredient and tool requirements.
 * @param {number} craftDuration - The chosen crafting duration in days, used to calculate success rate.
 * @param {Object} selectedFlask - The currently selected flask, used to determine required ingredient quantities.
 * @returns {JSX.Element} A styled box showing potion details, success rate, required ingredients, and tools needed for crafting.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RecipeDisplay = ({ selectedRecipe, craftDuration, selectedFlask, currentHeight }) => {
    const { items } = useSelector(state => state.items);
    const potions = items.filter(item => item.type === 'potion');
    const recipePotion = potions?.find(potion => potion?.asset === selectedRecipe?.creationAssetId);

    const successRate = formatSuccessRate(calculateSuccessRate(craftDuration));
    const usesNewLifecycle = Number(currentHeight) >= ELYXIR_LIFECYCLE_FIX_HEIGHT;

    return (
        recipePotion && (
            <Box p={6} border="2px" borderColor="purple.300" borderRadius="md" mb={8}>
                <Heading size="md" mb={4}>
                    {recipePotion.name}
                </Heading>
                <Text fontSize="md" mb={4} color="purple.600" fontWeight="bold">
                    Success Rate: {successRate}%
                </Text>
                {usesNewLifecycle && (
                    <Alert status="warning" borderRadius="md" mb={4}>
                        <AlertIcon />
                        <AlertDescription>{NEW_LIFECYCLE_ACTIVE_COPY}</AlertDescription>
                    </Alert>
                )}
                <Stack spacing={6}>
                    <RequiredIngredients selectedFlask={selectedFlask} selectedRecipe={selectedRecipe} />
                    <RequiredTools selectedRecipe={selectedRecipe} />
                </Stack>
            </Box>
        )
    );
};

export default RecipeDisplay;
