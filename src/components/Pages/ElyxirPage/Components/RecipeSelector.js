import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

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
