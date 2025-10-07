import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { RECIPES } from '../data';
import { ELYXIR_CONFIG } from '../../../../services/Elyxir/elyxirCrafting';

const RecipeSelector = ({ selectedFlask, selectedRecipeIdx, setSelectedRecipeIdx, getMissingItems }) => {
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
                {RECIPES.map((recipe, idx) => {
                    const currentMultiplier = selectedFlask.multiplier;
                    const missing = getMissingItems(recipe, currentMultiplier);
                    const canCraft = missing.length === 0;

                    // Check if this recipe has a real implementation
                    const hasRealImplementation =
                        ELYXIR_CONFIG &&
                        ELYXIR_CONFIG.POTION_RECIPES &&
                        Object.keys(ELYXIR_CONFIG.POTION_RECIPES).some(name => name === recipe.name);

                    return (
                        <WrapItem key={idx}>
                            <Box position="relative">
                                <Button
                                    size="md"
                                    variant={selectedRecipeIdx === idx ? 'solid' : 'outline'}
                                    colorScheme={canCraft ? 'green' : 'gray'}
                                    onClick={() => setSelectedRecipeIdx(idx)}
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
    );
};

export default RecipeSelector;
