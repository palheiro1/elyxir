import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import RemainingCards from "../../Cards/RemainingCards";
import JackpotWidget from "../../JackpotWidget/JackpotWidget";
//import SortAndFilterMenu from "../../SortAndFilters/SortAndFilterMenu";

const Jackpot = ({ cards = [] }) => {

    const [ cardsFiltered, setCardsFiltered ] = useState(cards);

    useEffect(() => {
        if(cards.length > 0) {
            console.log(cards)
            const cardWithZero = cards.filter(card => Number(card.quantityQNT) === 0);
            setCardsFiltered(cardWithZero);
        }
    }, [cards])

    return(
        <Box>
            <JackpotWidget cStyle={2} />
            <RemainingCards totalCards={cards.length} remainingCards={cardsFiltered} />
        </Box>
    )
}

export default Jackpot;

// <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered}/>