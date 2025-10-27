import { Badge, Box, Button, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';

/**
 * @name FlaskSelector
 * @description Displays a selectable list of available flasks, each representing a potion quantity multiplier.
 * Allows users to choose which flask to use when crafting a potion, showing its image, name, multiplier, and remaining quantity.
 * The section is only visible when a potion has been selected.
 * @param {Array} flasks - List of flask objects containing `asset`, `name`, `imgUrl`, `multiplier`, and `quantityQNT`.
 * @param {Object} selectedFlask - The currently selected flask, used to visually highlight the active selection.
 * @param {Function} setSelectedFlask - Function to update the selected flask when the user clicks on one.
 * @param {boolean} isPotionSelected - Determines whether the potion selection step has been completed, enabling flask selection.
 * @returns {JSX.Element} A responsive grid of flask buttons with images, multipliers, and stock indicators, or nothing if no potion is selected.
 * author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const FlaskSelector = ({ flasks, selectedFlask, setSelectedFlask, isPotionSelected }) => {
    return (
        isPotionSelected && (
            <Stack spacing={6} mb={8}>
                <Text fontWeight="bold" fontSize="lg">
                    Select Flask (Potion Quantity):
                </Text>
                <Wrap spacing={4}>
                    {flasks
                        .sort((a, b) => a.multiplier - b.multiplier)
                        .map((flask, idx) => {
                            return (
                                <WrapItem key={idx} position={'relative'}>
                                    <Button
                                        variant={selectedFlask?.asset === flask?.asset ? 'solid' : 'outline'}
                                        colorScheme="blue"
                                        onClick={() => setSelectedFlask(flask)}
                                        h="120px"
                                        w="120px"
                                        flexDirection="column"
                                        p={2}
                                        disabled={flask?.quantityQNT <= 0}>
                                        <Box
                                            w="60px"
                                            h="60px"
                                            backgroundImage={`url(${flask?.imgUrl})`}
                                            backgroundSize="contain"
                                            backgroundRepeat="no-repeat"
                                            backgroundPosition="center"
                                            mb={2}
                                        />
                                        <Text fontSize="xs" textAlign="center">
                                            {flask?.description}
                                        </Text>
                                        <Badge colorScheme="blue" fontSize="xs">
                                            x{flask?.multiplier} potions
                                        </Badge>
                                    </Button>
                                    <Badge
                                        right={-2}
                                        top={-2}
                                        borderRadius={'full'}
                                        boxSize={'25px'}
                                        position={'absolute'}
                                        bgColor={'#4a83de'}
                                        textTransform={'lowercase'}
                                        align={'center'}>
                                        <Text mx={'auto'}>x{flask?.quantityQNT}</Text>
                                    </Badge>
                                </WrapItem>
                            );
                        })}
                </Wrap>
            </Stack>
        )
    );
};

export default FlaskSelector;
