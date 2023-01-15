import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import RemainingCards from "../../Cards/RemainingCards";
import JackpotWidget from "../../JackpotWidget/JackpotWidget";
import SortAndFilterMenu from "../../SortAndFilters/SortAndFilterMenu";

const Jackpot = ({ infoAccount, cards = [] }) => {

    const noSpecialCards = cards.filter(card => card.rarity !== 'Special');
    const [ remainingCards, setRemainingCards ] = useState(noSpecialCards);
    const [ cardsFiltered, setCardsFiltered ] = useState(remainingCards);

    useEffect(() => {
        if(cards.length > 0) {
            const cardWithZero = noSpecialCards.filter(card => Number(card.quantityQNT) === 0);
            setRemainingCards(cardWithZero);
        }
    }, [cards, noSpecialCards])

    return(
        <Box>
            <SortAndFilterMenu cards={remainingCards} setCardsFiltered={setCardsFiltered} needSpecials={false} />
            <JackpotWidget cStyle={2} />
            <RemainingCards username={infoAccount.name} totalCards={noSpecialCards.length} remainingCards={remainingCards.length} cards={cardsFiltered} />
        </Box>
    )
}

export default Jackpot;

// 