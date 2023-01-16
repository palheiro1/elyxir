import { Box, Image, Stack, Text } from '@chakra-ui/react';

const TableCard = ({ image, title, continent, rarity, needDelete = false }) => {
    return (
        <Stack direction={'row'}>
            <Image maxW="75px" src={image} alt={title} mr={6} />

            <Stack direction={'row'} align="center">
                {!needDelete ? (
                    <Box>
                        <Text fontWeight="bold" fontSize="2xl">
                            {title}
                        </Text>
                        <Stack direction={'row'} align="center" pt={2}>
                            <Text color="grey">{continent}</Text>
                            <Text color="grey">/</Text>
                            <Text color="grey">{rarity}</Text>
                        </Stack>
                    </Box>
                ) : (
                    <Box>
                        <Text fontWeight="bold" fontSize="2xl">
                            Delete this order
                        </Text>
                    </Box>
                )}
            </Stack>
        </Stack>
    );
};

export default TableCard;
