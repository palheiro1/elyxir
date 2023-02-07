import { Box, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { RARITY_COLORS } from '../../data/CONSTANTS';

/**
 * @name TableCard
 * @description Component to show the card in the table
 * @param {String} image - Image of the card
 * @param {String} title - Title of the card
 * @param {String} continent - Continent of the card
 * @param {String} rarity - Rarity of the card
 * @param {Boolean} needDelete - If the card is to delete
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const TableCard = ({ image, title, continent, rarity, needDelete = false }) => {
    const badgeColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300');
    return (
        <Stack direction={'row'}>
            <Image maxW="75px" src={image} alt={title} mr={6} shadow="lg" rounded="sm" />

            <Stack direction={'row'} align="center">
                {!needDelete ? (
                    <Box>
                        <Stack direction={'row'}>
                            <Text fontWeight="bold" fontSize="2xl">
                                {title}
                            </Text>
                        </Stack>

                        <Stack direction={'row'} pt={2}>
                            <Text
                                fontSize="md"
                                bgColor={badgeColor}
                                rounded="lg"
                                color="white"
                                px={2}
                                textAlign="center">
                                {continent}
                            </Text>
                            <Text
                                fontSize="md"
                                bgGradient={RARITY_COLORS[rarity]}
                                rounded="lg"
                                color="black"
                                px={2}
                                textAlign="center">
                                {rarity}
                            </Text>
                        </Stack>
                    </Box>
                ) : (
                    <Box>
                        <Text fontWeight="bold" fontSize="2xl">
                            Delete order
                        </Text>
                    </Box>
                )}
            </Stack>
        </Stack>
    );
};

export default TableCard;
