import { Badge, Box, Button, Image, Stack, Text } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';
import { getColor, getTypeValue } from '../../../../../../../../../Items/data';

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
    const { imgUrl, bonus, description } = selectedPotion;
    return (
        <>
            <Box
                position="relative"
                cursor="pointer"
                onClick={onPotionModalOpen}
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s">
                <Image
                    src={imgUrl}
                    fallbackSrc="/images/items/WaterCristaline copia.png"
                    boxSize={isMobile ? '50px' : '60px'}
                    borderRadius="md"
                    border="3px solid #D597B2"
                    shadow="0 0 10px rgba(213, 151, 178, 0.5)"
                />
            </Box>
            <Stack flex={1} spacing={1}>
                <Text
                    color={'#FFF'}
                    fontFamily={'Chelsea Market, system-ui'}
                    fontSize={isMobile ? 'sm' : 'md'}
                    fontWeight={'bold'}>
                    {description}
                </Text>
                <Stack direction={'row'} align={'center'}>
                    <Text color={'#D597B2'} fontSize={isMobile ? 'xs' : 'sm'} fontFamily={'Inter, system-ui'}>
                        +{bonus.power} power
                    </Text>
                    <Badge colorScheme={getColor(bonus)} fontSize="xs" rounded={'md'}>
                        {bonus.type} ({getTypeValue(bonus)})
                    </Badge>
                </Stack>
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
