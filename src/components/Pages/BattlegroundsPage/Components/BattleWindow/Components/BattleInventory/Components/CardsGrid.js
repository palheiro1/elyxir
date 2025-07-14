import { SimpleGrid, Text } from '@chakra-ui/react';
import CardItem from './CardItem';

/**
 * @name CardsGrid
 * @description Displays a responsive grid of available cards using a custom `CardItem` component. If no cards are available, a fallback message is shown.
 * @param {Array} cards - Array of card objects to display.
 * @param {Object} preSelectedCard - Currently pre-selected card object to highlight.
 * @param {Function} onCardClick - Callback function triggered when a card is clicked.
 * @param {Boolean} isMobile - Flag to adjust styles for mobile view.
 * @param {Function} getColumns - Function returning the number of columns based on viewport or layout logic.
 * @returns {JSX.Element} A Chakra UI `SimpleGrid` displaying cards or an empty state message.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const CardsGrid = ({ cards, preSelectedCard, onCardClick, isMobile, getColumns }) => {
    const renderCards = () =>
        cards.map(card => (
            <CardItem
                key={card.asset}
                card={card}
                isMobile={isMobile}
                onClick={onCardClick}
                isPreSelected={preSelectedCard?.asset === card.asset}
            />
        ));

    return (
        <SimpleGrid
            columns={getColumns()}
            spacing={3}
            p={3}
            overflowY="auto"
            className="custom-scrollbar"
            position="relative">
            {cards.length > 0 ? (
                renderCards()
            ) : (
                <Text
                    position="absolute"
                    fontFamily="Chelsea Market, system-ui"
                    color="#FFF"
                    fontSize="xl"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)">
                    No cards left
                </Text>
            )}
        </SimpleGrid>
    );
};

export default CardsGrid;
