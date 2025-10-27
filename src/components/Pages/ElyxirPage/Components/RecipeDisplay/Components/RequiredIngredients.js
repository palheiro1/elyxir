import { Badge, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

/**
 * @name RequiredIngredients
 * @description Displays all ingredients required to craft the selected recipe, including quantities adjusted by the selected flask multiplier.
 * Visually indicates whether the player has enough of each ingredient, using color-coded borders and badges.
 * @param {Object} selectedRecipe - The currently selected recipe containing an array of ingredient requirements.
 * @param {Object} selectedFlask - The selected flask used to determine the multiplier applied to ingredient quantities.
 * @returns {JSX.Element} A grid of ingredient cards showing names, images, required and available quantities, and sufficiency status indicators.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const RequiredIngredients = ({ selectedRecipe, selectedFlask }) => {
    const { items } = useSelector(state => state.items);
    const ingredients = items.filter(item => item.type === 'ingredient');

    return (
        <Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                Required Ingredients:
            </Text>
            <Wrap spacing={6}>
                {selectedRecipe.ingredients.map((ing, i) => {
                    const ingredient = ingredients?.find(item => item.asset === ing.assetId);
                    const multiplier = selectedFlask?.multiplier || 1;
                    const requiredQty = ing.qtyQNT * multiplier;
                    const have = ingredient ? Number(ingredient.quantityQNT) : 0;
                    const hasEnough = have >= requiredQty;

                    const formatedName = ingredient?.description?.replace('Ingredient of', '');

                    return (
                        <WrapItem key={i}>
                            <Box
                                p={3}
                                border="2px"
                                borderColor={hasEnough ? 'green.300' : 'red.300'}
                                borderRadius="md"
                                textAlign="center"
                                w="140px">
                                {ingredient && (
                                    <Box
                                        w="60px"
                                        h="60px"
                                        backgroundImage={`url(${ingredient?.imgUrl})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                        mx="auto"
                                        mb={2}
                                    />
                                )}
                                <Text fontSize="sm" fontWeight="bold" mb={1}>
                                    {formatedName}
                                </Text>
                                <Badge colorScheme={hasEnough ? 'green' : 'red'} fontSize="xs">
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
    );
};

export default RequiredIngredients;
