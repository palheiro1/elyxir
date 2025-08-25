import { Box, Text, Image } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name CardWithOverlay
 * @description Renders a card thumbnail with an optional defeat overlay ("X"). Used inside the BattleCardsSummary.
 * @param {Object} props
 * @param {Object} props.card - Card object including `cardImgUrl` and `asset`.
 * @param {boolean} props.isOverlayVisible - Whether to display the defeat overlay on top of the card.
 * @returns {JSX.Element} A card image with optional overlay.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardWithOverlay = ({ card, isOverlayVisible }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Box position="relative" m="auto" width="12%">
            <Image src={card?.cardImgUrl} width="100%" />
            {isOverlayVisible && (
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="rgba(0, 0, 0, 0.3)">
                    <Text
                        fontSize={isMobile ? '3rem' : '4rem'}
                        color="#E14942"
                        opacity="0.8"
                        fontFamily="'Aagaz', sans-serif">
                        X
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default CardWithOverlay;
