import { Box } from "@chakra-ui/react";
import { useState } from "react";
import RemainingCards from "../../Cards/RemainingCards";
import JackpotWidget from "../../JackpotWidget/JackpotWidget";
import SortAndFilterMenu from "../../SortAndFilters/SortAndFilterMenu";

const Jackpot = ({ cards }) => {

    const [ cardsFiltered, setCardsFiltered ] = useState(cards);

    return(
        <Box>
            <SortAndFilterMenu cards={cards} setCardsFiltered={setCardsFiltered}/>
            <JackpotWidget cStyle={2} />
            <RemainingCards remainingCards={cardsFiltered} />
        </Box>
    )
}

export default Jackpot;