import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

/**
 * @name RecipeSelector
 * @description Displays a list of available potion crafting recipes and allows the user to select one.
 * Each recipe shows whether it can be crafted based on the player's available items and the selected flask multiplier.
 * Highlights the currently selected recipe and indicates real blockchain crafting availability.
 * @param {Object} selectedFlask - The currently selected flask, used to determine the crafting multiplier.
 * @param {Object} selectedRecipe - The currently selected recipe to highlight in the list.
 * @param {Function} setSelectedRecipe - Function to set the currently selected recipe when a user clicks on one.
 * @param {Function} getMissingItems - Function that checks which required items are missing for a given recipe and multiplier.
 * @returns {JSX.Element} A responsive list of recipe buttons with indicators for craftability and blockchain integration badges.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RecipeSelector = ({ selectedFlask, selectedRecipe, setSelectedRecipe, getMissingItems }) => {
    const { elyxir, fakeAssets } = useSelector(state => state.elyxir);
    const recipes = elyxir?.definition?.recipes;
    const potions = fakeAssets?.potions;

    if (!recipes) return;

    return (
        <Stack spacing={6} mb={8}>
            <Stack direction={'row'} justify="space-between" align="center">
                <Text fontWeight="bold" fontSize="lg">
                    Select Recipe:
                </Text>
                <Badge colorScheme="purple" fontSize="sm" p={2}>
                    🔗 Real Blockchain Crafting Available
                </Badge>
            </Stack>
            <Wrap spacing={4}>
                {recipes.map((recipe, idx) => {
                    const currentMultiplier = selectedFlask?.multiplier || 1;
                    const missing = getMissingItems(recipe, currentMultiplier);
                    const canCraft = missing.length === 0;
                    const recipePotion = potions?.find(potion => potion?.asset === recipe?.creationAssetId);
                    if (!recipePotion) return null;

                    return (
                        <WrapItem key={idx}>
                            <Box position="relative">
                                <Button
                                    size="md"
                                    variant={
                                        selectedRecipe?.recipeAssetId === recipe?.recipeAssetId ? 'solid' : 'outline'
                                    }
                                    colorScheme={canCraft ? 'green' : 'gray'}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    h="60px"
                                    px={6}>
                                    {recipePotion?.name}
                                </Button>

                                <Badge
                                    position="absolute"
                                    top="-8px"
                                    right="-8px"
                                    colorScheme="purple"
                                    fontSize="xs"
                                    borderRadius="full">
                                    🔗
                                </Badge>
                            </Box>
                        </WrapItem>
                    );
                })}
            </Wrap>
        </Stack>
    );
};

export default RecipeSelector;
