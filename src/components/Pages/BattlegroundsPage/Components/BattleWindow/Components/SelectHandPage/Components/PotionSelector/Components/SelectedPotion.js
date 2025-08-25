import { Badge, Box, Button, Image, Stack, Text } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import { getContinentColor, getMediumColor } from '../data';

/**
 * @name SelectedPotion
 * @description React component that displays the currently selected potion with its image, name, description,
 * and two action buttons: "Change" to open the potion selection modal, and "Remove" to clear the selection.
 * It shows a badge indicating the potion’s `medium`, `continent`, or `type` depending on availability.
 * Responsive layout is handled using `useBattlegroundBreakpoints`.
 * @param {Function} onPotionModalOpen - Callback function to open the modal for selecting a new potion.
 * @param {Object} selectedPotion - The potion object currently selected. Should include `image`, `name`, `description`,
 *                                   and optionally `medium`, `continent`, or `type` fields.
 * @param {Function} setSelectedPotion - State setter to remove or update the selected potion.
 * @returns {JSX.Element} A visual potion summary box with hover effects and actions.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const SelectedPotion = ({ onPotionModalOpen, selectedPotion, setSelectedPotion }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <>
            <Box
                position="relative"
                cursor="pointer"
                onClick={onPotionModalOpen}
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s">
                <Image
                    src={selectedPotion.image}
                    fallbackSrc="/images/items/WaterCristaline copia.png"
                    boxSize={isMobile ? '50px' : '60px'}
                    borderRadius="md"
                    border="3px solid #D597B2"
                    shadow="0 0 10px rgba(213, 151, 178, 0.5)"
                />
                <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme={
                        selectedPotion.medium
                            ? getMediumColor(selectedPotion.medium)
                            : selectedPotion.continent
                            ? getContinentColor(selectedPotion.continent)
                            : 'gray'
                    }
                    fontSize="xs">
                    {selectedPotion.medium || selectedPotion.continent || selectedPotion.type}
                </Badge>
            </Box>
            <Stack flex={1} spacing={1}>
                <Text
                    color={'#FFF'}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={isMobile ? 'sm' : 'md'}
                    fontWeight={'bold'}>
                    {selectedPotion.name}
                </Text>
                <Text color={'#D597B2'} fontSize={isMobile ? 'xs' : 'sm'} fontFamily={'Inter, system-ui'}>
                    {selectedPotion.description}
                </Text>
            </Stack>
            <Stack spacing={2}>
                <Button size="sm" variant="outline" colorScheme="purple" onClick={onPotionModalOpen}>
                    Change
                </Button>
                <Button size="sm" variant="ghost" color="red.400" onClick={() => setSelectedPotion(null)}>
                    Remove
                </Button>
            </Stack>
        </>
    );
};

export default SelectedPotion;
