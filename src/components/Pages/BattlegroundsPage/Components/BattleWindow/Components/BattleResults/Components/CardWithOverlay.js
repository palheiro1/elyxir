import { Box, Text, Image } from "@chakra-ui/react";

/**
 * @name CardWithOverlay
 * @description Renders a card thumbnail with an optional defeat overlay ("X"). Used inside the BattleCardsSummary.
 * @param {Object} props
 * @param {Object} props.card - Card object including `cardImgUrl` and `asset`.
 * @param {boolean} props.isOverlayVisible - Whether to display the defeat overlay on top of the card.
 * @returns {JSX.Element} A card image with optional overlay.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardWithOverlay = ({ card, isOverlayVisible }) => (
    <Box position="relative" m="auto" width="12%">
        <Image src={card.cardImgUrl} width="100%" />
        {isOverlayVisible && (
            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="rgba(0, 0, 0, 0.3)">
                <Text fontSize="4rem" color="#E14942" opacity="0.8" fontFamily="'Aagaz', sans-serif">
                    X
                </Text>
            </Box>
        )}
    </Box>
);

export default CardWithOverlay;
