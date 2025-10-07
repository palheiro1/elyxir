import { Box, Button, Progress, Spinner, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { ELYXIR_CONFIG } from '../../../../services/Elyxir/elyxirCrafting';
import { RECIPES } from '../data';
import { calculateSuccessRate } from '../../../../utils/elyxirUtils';

const CraftingControls = ({
    craftDuration,
    setCraftDuration,
    craftingProgress,
    getMissingItems,
    selectedFlask,
    selectedRecipeIdx,
    isLoading,
    handleStartCrafting,
}) => {
    return (
        <Stack spacing={6}>
            <Stack direction={'row'} spacing={8}>
                <Text fontWeight="bold" fontSize="lg">
                    Craft Duration:
                </Text>
                <Stack direction={'row'}>
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
                </Stack>
                <Text fontSize="md" color="purple.600" fontWeight="bold">
                    Success Rate: {Math.round(calculateSuccessRate(craftDuration))}%
                </Text>
            </Stack>

            {craftingProgress > 0 && (
                <Box>
                    <Text mb={2} fontWeight="bold">
                        Crafting Progress:
                    </Text>
                    <Progress value={craftingProgress} colorScheme="purple" size="lg" />
                </Box>
            )}

            <Button
                colorScheme="purple"
                size="lg"
                h="60px"
                fontSize="lg"
                isDisabled={
                    getMissingItems(RECIPES[selectedRecipeIdx], selectedFlask.multiplier).length > 0 ||
                    craftingProgress > 0 ||
                    isLoading
                }
                onClick={() => handleStartCrafting(RECIPES[selectedRecipeIdx])}>
                {isLoading ? <Spinner size="sm" mr={2} /> : null}
                {craftingProgress > 0
                    ? 'Crafting...'
                    : isLoading
                    ? 'Starting...'
                    : `Start Real Crafting (${selectedFlask.multiplier} potions)`}
            </Button>
        </Stack>
    );
};

export default CraftingControls;
