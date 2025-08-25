import { Box, Image, Text } from '@chakra-ui/react';
import { useBattlegroundBreakpoints } from '@hooks/useBattlegroundBreakpoints';

/**
 * @name CardImage
 * @description Renders the image of a card with an optional overlay for defeated cards.
 * The image is centered and can be styled differently for hero cards.
 * @param {Object} props
 * @param {Object} props.card - The card object containing image URL and other metadata.
 * @param {boolean} props.isHero - Whether this card is a hero card (applies special styling).
 * @param {boolean} props.isDefeated - Whether this card has been defeated in the battle.
 * @return {JSX.Element} A box containing the card image, with an overlay if defeated.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 * */
const CardImage = ({ card, isHero, isDefeated }) => {
    const { isMobile } = useBattlegroundBreakpoints();
    return (
        <Box
            position="relative"
            m="auto"
            mt={isMobile && 0}
            width={isMobile ? '40%' : '55%'}
            height={isMobile ? '100%' : '150px'}
            sx={{ border: isHero ? '3px solid #D08FB0' : 'none' }}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Image src={card.cardImgUrl} width={isHero ? '90%' : '100%'} m="auto" />
            </Box>
            {isDefeated && (
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                    bg="rgba(0, 0, 0, 0.3)">
                    <Text fontSize="9rem" color="#E14942" opacity="0.8" fontFamily="'Aagaz', sans-serif">
                        X
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default CardImage;
