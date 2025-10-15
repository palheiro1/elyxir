import { Box, Button, Progress, Spinner, Stack, Text } from '@chakra-ui/react';
import { calculateSuccessRate } from '../../../../utils/elyxirUtils';
import { DURATION_OPTIONS } from '../data';

const CraftingControls = ({
    craftDuration,
    setCraftDuration,
    craftingProgress,
    getMissingItems,
    selectedFlask,
    selectedRecipe,
    isLoading,
    handleStartCrafting,
}) => {
    const multiplier = selectedFlask?.multiplier || 1;
    const disabledBtn =
        !selectedRecipe ||
        !selectedFlask ||
        getMissingItems(selectedRecipe, multiplier).length > 0 ||
        craftingProgress > 0 ||
        isLoading;

    const changeCraftDuration = direction => {
        const options = DURATION_OPTIONS.map(opt => opt.days).sort((a, b) => a - b);
        const currentIndex = options.indexOf(craftDuration);

        let newIndex = currentIndex;
        if (direction === 'increase') {
            newIndex = Math.min(options.length - 1, currentIndex + 1);
        } else if (direction === 'decrease') {
            newIndex = Math.max(0, currentIndex - 1);
        }

        setCraftDuration(options[newIndex]);
    };

    const disabledControl = direction => {
        return direction === 'increase'
            ? craftDuration >= Math.max(...DURATION_OPTIONS.map(opt => opt.days))
            : craftDuration <= Math.min(...DURATION_OPTIONS.map(opt => opt.days));
    };

    const buttonText =
        craftingProgress > 0
            ? 'Crafting...'
            : isLoading
            ? 'Starting...'
            : `Start Real Crafting (${multiplier} potions)`;

    const successRate = Math.trunc(calculateSuccessRate(craftDuration) * 10000) / 100;

    return (
        selectedRecipe !== null && (
            <Stack spacing={6}>
                <Stack direction={'row'} spacing={8}>
                    <Text fontWeight="bold" fontSize="lg">
                        Craft Duration:
                    </Text>
                    <Stack direction={'row'}>
                        <Button
                            size="md"
                            onClick={() => changeCraftDuration('decrease')}
                            colorScheme="purple"
                            variant="outline"
                            isDisabled={disabledControl('decrease')}>
                            -
                        </Button>
                        <Text minW="80px" textAlign="center" fontSize="lg" fontWeight="bold">
                            {craftDuration} {craftDuration === 1 ? 'day' : 'days'}
                        </Text>
                        <Button
                            size="md"
                            onClick={() => changeCraftDuration('increase')}
                            colorScheme="purple"
                            variant="outline"
                            isDisabled={disabledControl('increase')}>
                            +
                        </Button>
                    </Stack>
                    <Text fontSize="md" color="purple.600" fontWeight="bold">
                        Success Rate: {successRate}%
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
                    isDisabled={disabledBtn}
                    onClick={() => handleStartCrafting(selectedRecipe)}>
                    {isLoading ? <Spinner size="sm" mr={2} /> : buttonText}
                </Button>
            </Stack>
        )
    );
};

export default CraftingControls;
