import { RECIPES } from '../../data';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import RequiredIngredients from './Components/RequiredIngredients';
import RequiredTools from './Components/RequiredTools';
import { calculateSuccessRate } from '../../../../../utils/elyxirUtils';

const RecipeDisplay = ({ selectedRecipeIdx, craftDuration, selectedFlask, groupedItems }) => {
    return (
        RECIPES[selectedRecipeIdx] && (
            <Box p={6} border="2px" borderColor="purple.300" borderRadius="md" mb={8}>
                <Heading size="md" mb={4}>
                    {RECIPES[selectedRecipeIdx].name}
                </Heading>
                <Text fontSize="md" mb={4} color="purple.600" fontWeight="bold">
                    Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                </Text>

                <Stack spacing={6}>
                    {/* Ingredients with Images */}
                    <RequiredIngredients
                        selectedFlask={selectedFlask}
                        selectedRecipeIdx={selectedRecipeIdx}
                        groupedItems={groupedItems}
                    />

                    {/* Tools with Images */}
                    <RequiredTools selectedRecipeIdx={selectedRecipeIdx} groupedItems={groupedItems} />
                </Stack>
            </Box>
        )
    );
};

export default RecipeDisplay;
