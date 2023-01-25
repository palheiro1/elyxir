import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import RemainingCards from '../../Cards/RemainingCards';
import JackpotWidget from '../../JackpotWidget/JackpotWidget';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
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
    const totalNoSpecialCards = cards.filter(card => card.rarity !== 'Special');

    const [remainingCards, setRemainingCards] = useState([]);
    const [cardsFiltered, setCardsFiltered] = useState([]);
    const [needReload, setNeedReload] = useState(true);

    useEffect(() => {
        const getRemainingCards = () => {
            const cardWithZero = totalNoSpecialCards.filter(card => Number(card.quantityQNT) === 0);
            setRemainingCards(cardWithZero);
            setNeedReload(false);
        };

        needReload && getRemainingCards();
    }, [needReload, totalNoSpecialCards]);

    return (
        <Box>
            <JackpotWidget cStyle={2} account={infoAccount.accountRs} />

            {remainingCards.length > 0 ? (
                <>
                    <SortAndFilterCards
                        cards={remainingCards}
                        setCardsFiltered={setCardsFiltered}
                        needSpecials={false}
                        needSorting={false}
                    />
                    <RemainingCards
                        username={infoAccount.name}
                        totalCards={totalNoSpecialCards.length}
                        remainingCards={remainingCards}
                        cards={cardsFiltered}
                    />
                </>
            ) : (
                <ClaimJackpot username={infoAccount.name} cards={totalNoSpecialCards} />
            )}
        </Box>
    );
};

export default Jackpot;

//
