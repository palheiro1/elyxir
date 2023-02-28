import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getJackpotParticipants } from '../../../services/Jackpot/utils';
import RemainingCards from '../../Cards/RemainingCards';
import JackpotWidget from '../../JackpotWidget/JackpotWidget';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import ClaimJackpot from './ClaimJackpot';

/**
 * @name Jackpot
 * @description Jackpot page
 * @param {object} infoAccount - Account info
 * @param {array} cards - All cards
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Jackpot = ({ infoAccount, cards = [] }) => {
    const [totalNoSpecialCards, setTotalNoSpecialCards] = useState([]); // Cards without specials
    const [remainingCards, setRemainingCards] = useState([]); // Cards without specials and with 0 quantity
    const [cardsFiltered, setCardsFiltered] = useState([]); // Cards filtered by search and rarity
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [] });
    const { accountRs: account } = infoAccount;

    useEffect(() => {
        // Get remaining cards
        const getRemainingCards = () => {
            const auxNoSpecialCards = cards.filter(card => card.rarity !== 'Special');
            setTotalNoSpecialCards(auxNoSpecialCards);

            const cardWithZero = auxNoSpecialCards.filter(card => Number(card.quantityQNT) === 0);
            setRemainingCards(cardWithZero);
        };

        getRemainingCards();
    }, [cards]);

    useEffect(() => {
        const getParticipants = async () => {
            // Get participants
            const response = await getJackpotParticipants();
            let auxParticipants = [];
            let numParticipants = 0;
            Object.entries(response).forEach(entry => {
                const [key, value] = entry;
                if (value > 0) {
                    auxParticipants.push({ account: key, quantity: value });
                    numParticipants += value;
                }
            });
            setParticipants({ numParticipants, participants: auxParticipants });
        };

        getParticipants();

        const interval = setInterval(() => {
            getParticipants();
        }, 12500);
        return () => clearInterval(interval);
    }, [account]);

    const findParticipation = participants.participants.find(participant => participant.account === account);
    const imParticipant = findParticipation !== undefined;
    const myParticipation = findParticipation && (findParticipation ? findParticipation.quantity : 0);
    const textParticipations =
        findParticipation && (myParticipation === 1 ? 'once' : findParticipation.quantity + ' times');

    return (
        <Box>
            <JackpotWidget cStyle={2} numParticipants={participants.numParticipants} />

            {imParticipant && (
                <Text mt={4} fontSize="2xl" textAlign="center" fontWeight="bolder">
                    ✅ You've participated {textParticipations} for this round!
                </Text>
            )}

            {remainingCards.length > 0 && (
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
            )}
            {cards.length > 0 && remainingCards.length === 0 && (
                <ClaimJackpot username={infoAccount.name} cards={totalNoSpecialCards} />
            )}
        </Box>
    );
};

export default Jackpot;
