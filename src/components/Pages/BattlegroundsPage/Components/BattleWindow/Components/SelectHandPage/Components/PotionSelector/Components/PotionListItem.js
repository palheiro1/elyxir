import { Badge, Box, Image, Stack, Text } from '@chakra-ui/react';
import { getContinentColor, getMediumColor } from '../data';

/**
 * @name PotionListItem
 * @description Component that displays a single battle potion item for selection within a list.
 * It shows the potion image, name, description, quantity, and a colored badge based on its medium or continent.
 * Highlights when selected and calls a selection handler on click.
 * @param {Object} props - Component properties.
 * @param {Object} props.potion - Potion object containing id, name, description, medium, continent, image, and quantity.
 * @param {string|null} props.selectedPotionId - ID of the currently selected potion, used to highlight the selection.
 * @param {Function} props.handleSelectPotion - Callback to set this potion as selected when clicked.
 * @returns {JSX.Element} Clickable item representing a potion for selection in the modal.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const PotionListItem = ({ potion, selectedPotionId, handleSelectPotion }) => {
    const { id, medium, continent, name, description, quantity, image } = potion;
    return (
        <Box
            position={'relative'}
            key={id}
            bg={selectedPotionId === id ? 'rgba(213, 151, 178, 1)' : '#465A5A'}
            borderRadius={'10px'}
            p={4}
            cursor={'pointer'}
            border={selectedPotionId === id ? '3px solid #D597B2' : '2px solid transparent'}
            onClick={() => handleSelectPotion(potion)}
            transition="all 0.2s"
            _hover={{
                bg: selectedPotionId === id ? 'rgba(213, 151, 178, 0.25)' : '#5A679B',
                transform: 'scale(1.02)',
            }}>
            <Stack direction={'column'} spacing={3}>
                <Box position="relative">
                    <Image
                        src={image}
                        fallbackSrc="/images/items/WaterCristaline copia.png"
                        boxSize="70px"
                        borderRadius="md"
                        border="2px solid #D597B2"
                    />
                    <Badge
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme={
                            medium ? getMediumColor(medium) : continent ? getContinentColor(continent) : 'gray'
                        }
                        fontSize="xs">
                        {medium || continent || 'Universal'}
                    </Badge>
                </Box>
                <Stack flex={1} spacing={1}>
                    <Text color={'#ffffffff'} fontWeight={'bold'} fontSize={'md'} fontFamily={'Chelsea Market, system-ui'}>
                        {name}
                    </Text>
                    {/* 
                    <Stack direction={'column'} spacing={2}>
                        {medium && (
                            <Badge colorScheme={getMediumColor(medium)} size="sm">
                                {medium}
                            </Badge>
                        )}
                        {continent && (
                            <Badge colorScheme={getContinentColor(continent)} size="sm">
                                {continent}
                            </Badge>
                        )}
                        <Badge colorScheme="gray" size="sm">
                            {type}
                        </Badge>
                    </Stack> 
                    */}
                    <Text color={'#D597B2'} fontSize={'sm'} fontFamily={'Inter, system-ui'}>
                        {description}
                    </Text>
                    <Text color={'#FFF'} fontSize={'xs'} fontFamily={'Inter, system-ui'}>
                        Available: {quantity}
                    </Text>
                </Stack>
                {selectedPotionId === id && (
                    <Box color={'#D597B2'} fontSize={'xl'} position={'absolute'} bottom={1} right={2}>
                        ✓
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default PotionListItem;
