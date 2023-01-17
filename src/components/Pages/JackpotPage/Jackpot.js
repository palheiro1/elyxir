import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import RemainingCards from '../../Cards/RemainingCards';
import JackpotWidget from '../../JackpotWidget/JackpotWidget';
import SortAndFilterMenu from '../../SortAndFilters/SortAndFilterMenu';
import ClaimJackpot from './ClaimJackpot';


/**
 * @name Jackpot
 * @description Jackpot page
 * @param {object} infoAccount - account info
 * @param {array} cards - All cards
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Jackpot = ({ infoAccount, cards = [] }) => {
    const noSpecialCards = cards.filter(card => card.rarity !== 'Special');
    const [remainingCards, setRemainingCards] = useState(noSpecialCards);
    const [cardsFiltered, setCardsFiltered] = useState(remainingCards);

    useEffect(() => {
        if (cards.length > 0) {
            const cardWithZero = noSpecialCards.filter(card => Number(card.quantityQNT) === 0);
            setRemainingCards(cardWithZero);
        }
    }, [cards, noSpecialCards]);

    return (
        <Box>
            <JackpotWidget cStyle={2} />

            {remainingCards.length < 0 ? (
                <>
                    <SortAndFilterMenu
                        cards={remainingCards}
                        setCardsFiltered={setCardsFiltered}
                        needSpecials={false}
                        needSorting={false}
                    />
                    <RemainingCards
                        username={infoAccount.name}
                        totalCards={noSpecialCards.length}
                        remainingCards={remainingCards.length}
                        cards={cardsFiltered}
                    />
                </>
            ) : (
                <ClaimJackpot username={infoAccount.name} cards={cards} />
            )}
        </Box>
    );
};

export default Jackpot;

//
