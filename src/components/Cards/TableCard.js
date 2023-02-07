import { Box, Image, Stack, Text } from '@chakra-ui/react';
import CardBadges from './CardBadges';

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
    return (
        <Stack direction={'row'} spacing={4}>
            <Image maxW="75px" src={image} alt={title} shadow="lg" rounded="sm" />

            <Stack direction={'row'} align="center">
                {!needDelete ? (
                    <Box>
                        <Stack direction={'row'} mb={2}>
                            <Text fontWeight="bold" fontSize="2xl">
                                {title}
                            </Text>
                        </Stack>

                        <CardBadges continent={continent} rarity={rarity} />
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
