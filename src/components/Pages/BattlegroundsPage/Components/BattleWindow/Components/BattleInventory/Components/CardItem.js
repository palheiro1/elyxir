import { Box, Center, Flex, Img, Spacer, Stack, Text } from '@chakra-ui/react';
import CardBadges from '../../../../../../../Cards/CardBadges';

/**
 * @name CardItem
 * @description Represents a single card in a selectable card grid. Shows card image, name, and badges. Handles selection and pre-selection display.
 * @param {Object} card - Card object containing its image, name, rarity, channel, and selection state.
 * @param {Boolean} isMobile - Flag to adjust dimensions and font sizes for mobile view.
 * @param {Function} onClick - Callback triggered when the card is clicked (only if not already selected).
 * @param {Boolean} isPreSelected - Flag indicating whether the card is currently marked as the "chosen" card.
 * @returns {JSX.Element} A styled box displaying the card and visual cues for selection or pre-selection.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardItem = ({ card, isMobile, onClick, isPreSelected }) => {
    const { cardImgUrl, name, rarity, channel, selected, omnoQuantity } = card;

    const handleClick = () => {
        if (!selected) onClick(card);
    };

    return (
        <Box
            key={card.asset}
            position="relative"
            bg="white"
            borderRadius="10px"
            mx="auto"
            cursor="pointer"
            onClick={handleClick}>
            <Center>
                <Img src={cardImgUrl} w="90%" h="75%" />
            </Center>
            <Stack direction="row" spacing={0} mx={2} mb={1}>
                <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                    <Text fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }} noOfLines={1} fontWeight="bold" color="#000">
                        {name}
                    </Text>
                    <CardBadges rarity={rarity} continent={channel} size={isMobile ? '2xs' : 'sm'} />
                </Stack>
                <Spacer display={{ base: 'none', lg: 'block' }} />
                <Center minHeight={{ base: 'auto', lg: '100%' }}>
                    <Flex w={{ base: 'auto', lg: '100%' }}>
                        <Text fontSize="small" color="#000">
                            Available: {omnoQuantity}
                        </Text>
                    </Flex>
                </Center>
            </Stack>

            {selected && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    bg="rgba(0, 0, 0, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="inherit"
                />
            )}

            {isPreSelected && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    bg="rgba(1, 151, 135, 0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="inherit"
                    fontFamily="Chelsea Market, system-ui">
                    CHOOSE
                </Box>
            )}
        </Box>
    );
};

export default CardItem;
