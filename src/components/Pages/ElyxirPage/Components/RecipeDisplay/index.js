import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import RequiredIngredients from './Components/RequiredIngredients';
import RequiredTools from './Components/RequiredTools';
import { calculateSuccessRate } from '../../../../../utils/elyxirUtils';
import { useSelector } from 'react-redux';

const RecipeDisplay = ({ selectedRecipe, craftDuration, selectedFlask }) => {
    const { fakeAssets } = useSelector(state => state.elyxir);
    const recipePotion = fakeAssets.potions?.find(potion => potion?.asset === selectedRecipe?.creationAssetId);

    const successRate = Math.trunc(calculateSuccessRate(craftDuration) * 10000) / 100;

    return (
        recipePotion && (
            <Box p={6} border="2px" borderColor="purple.300" borderRadius="md" mb={8}>
                <Heading size="md" mb={4}>
                    {recipePotion.name}
                </Heading>
                <Text fontSize="md" mb={4} color="purple.600" fontWeight="bold">
                    Success Rate: {successRate}%
                </Text>
                <Stack spacing={6}>
                    <RequiredIngredients selectedFlask={selectedFlask} selectedRecipe={selectedRecipe} />
                    <RequiredTools selectedRecipe={selectedRecipe} />
                </Stack>
            </Box>
        )
    );
};

export default RecipeDisplay;
