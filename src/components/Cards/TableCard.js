import { Box, Image, Stack, Text } from "@chakra-ui/react";

const TableCard = ({ image, title, continent, rarity }) => {
    return (
        <Box>
            <Stack direction={'row'}>
                <Image minW="75px" src={image} alt={title} mr={6} />

                <Stack direction={'row'} align="center">
                    <Box>
                        <Text fontWeight="bold" fontSize="2xl">{title}</Text>
                        <Stack direction={'row'} align="center" pt={2}>
                            <Text color="grey">{continent}</Text>
                            <Text color="grey">/</Text>
                            <Text color="grey">{rarity}</Text>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}

export default TableCard;