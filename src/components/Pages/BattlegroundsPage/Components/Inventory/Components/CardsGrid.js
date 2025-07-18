import { Box, Center, Img, SimpleGrid, Stack, Text, Tooltip, Flex, Spacer, useColorModeValue } from '@chakra-ui/react';
import CardBadges from '../../../../../Cards/CardBadges';

/**
 * @name CardGrid
 * @description Generic card grid to display selectable card items with optional badge and quantity.
 * @param {Object[]} cards - Array of card objects to render.
 * @param {Function} onSelect - Function to call when a card is clicked.
 * @param {Function} gridColumns - Function that returns number of columns based on screen size.
 * @param {boolean} isMobile - Whether the layout is on mobile view.
 * @param {string} quantityKey - Key in card object to show as quantity (e.g. "quantityQNT", "omnoQuantity").
 * @param {string} quantityLabel - Label to display next to quantity value.
 * @param {string} emptyText - Message to show when cards array is empty.
 * @returns {JSX.Element} Responsive card grid component.
 */
const CardGrid = ({
    cards,
    onSelect,
    gridColumns,
    quantityKey = 'quantityQNT',
    quantityLabel = 'Available',
    emptyText = 'No cards available',
}) => {
    const textColor = useColorModeValue('black', 'white');

    if (!cards.length) {
        return (
            <Box pos="absolute" top="50%" transform="translateY(-50%)" boxSize="fit-content">
                <Text color={textColor}>{emptyText}</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid
            columns={gridColumns}
            gap={4}
            align="center"
            overflowY="auto"
            className="custom-scrollbar"
            w="100%"
            p={4}
            height="100%">
            {cards.map((card, idx) => {
                const { name, cardImgUrl, rarity, channel } = card;
                const quantity = card[quantityKey] ?? 0;

                return (
                    <Box key={idx} bg="white" borderRadius="10px" mx="auto" maxH="345px" onClick={() => onSelect(card)}>
                        <Center>
                            <Img src={cardImgUrl} w="90%" h="75%" />
                        </Center>
                        <Stack direction="column" spacing={0} mx={2} mb={1}>
                            <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                                <Text
                                    fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }}
                                    noOfLines={1}
                                    fontWeight="bold"
                                    color="#000">
                                    {name}
                                </Text>
                                <CardBadges rarity={rarity} continent={channel} size="sm" />
                            </Stack>
                            <Spacer display={{ base: 'none', lg: 'block' }} />
                            <Center minHeight={{ base: 'auto', lg: '100%' }}>
                                <Tooltip label={`${quantityLabel}: ${quantity}`} placement="bottom">
                                    <Flex w={{ base: 'auto', lg: '100%' }}>
                                        <Text fontSize="small" color="#000">
                                            {quantityLabel}: {quantity}
                                        </Text>
                                    </Flex>
                                </Tooltip>
                            </Center>
                        </Stack>
                    </Box>
                );
            })}
        </SimpleGrid>
    );
};

export default CardGrid;
