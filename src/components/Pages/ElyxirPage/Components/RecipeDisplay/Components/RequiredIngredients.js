import { Badge, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { RECIPES } from '../../../data';

const RequiredIngredients = ({ groupedItems, selectedRecipeIdx, selectedFlask }) => {
    return (
        <Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                Required Ingredients:
            </Text>
            <Wrap spacing={6}>
                {RECIPES[selectedRecipeIdx].ingredients.map((ing, i) => {
                    const ingredient = groupedItems.ingredients?.find(
                        item => item.name.toLowerCase() === ing.name.toLowerCase()
                    );
                    const requiredQty = ing.quantity * selectedFlask.multiplier;
                    const have = ingredient ? Number(ingredient.quantityQNT) : 0;
                    const hasEnough = have >= requiredQty;

                    return (
                        <WrapItem key={i}>
                            <Box
                                p={4}
                                border="2px"
                                borderColor={hasEnough ? 'green.300' : 'red.300'}
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
