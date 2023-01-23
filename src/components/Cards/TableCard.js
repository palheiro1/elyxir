import { Box, Image, Stack, Text } from '@chakra-ui/react';

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
        <Stack direction={'row'}>
            <Image maxW="75px" src={image} alt={title} mr={6} />

            <Stack direction={'row'} align="center">
                {!needDelete ? (
                    <Box>
                        <Stack direction={'row'}>
                            <Text fontWeight="bold" fontSize="2xl">
                                {title}
                            </Text>
                        </Stack>

                        <Stack direction={'row'} pt={2}>
                            <Text color="grey">{continent}</Text>
                            <Text color="grey">/</Text>
                            <Text color="grey">{rarity}</Text>
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
