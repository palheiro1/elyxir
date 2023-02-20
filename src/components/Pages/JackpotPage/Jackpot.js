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
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [], imParticipant: false });
    const account = infoAccount.accountRs;

    useEffect(() => {
        const getRemainingCards = () => {
            const cardWithZero = totalNoSpecialCards.filter(card => Number(card.quantityQNT) === 0);
            setRemainingCards(cardWithZero);
            setNeedReload(false);
        };

        needReload && getRemainingCards();
    }, [needReload, totalNoSpecialCards]);

    useEffect(() => {
        const getParticipants = async () => {
            // Get participants
            const response = await getJackpotParticipants();
            let auxParticipants = [];
            let numParticipants = 0;
            let imParticipant = false;
            Object.entries(response).forEach(entry => {
                const [key, value] = entry;
                if (value > 0) {
                    auxParticipants.push(key);
                    numParticipants += value;
                    if (key === account) {
                        imParticipant = true;
                    }
                }
            });
            setParticipants({ numParticipants, participants: auxParticipants, imParticipant });
        };

        getParticipants();

        const interval = setInterval(() => {
            getParticipants();
        }, 12500);
        return () => clearInterval(interval);
    }, [account]);

    return (
        <Box>
            <JackpotWidget cStyle={2} numParticipants={participants.numParticipants} />

            {participants.imParticipant && (
                <Text mt={4} fontSize="2xl" textAlign="center" fontWeight="bolder">
                    ✅ You've participated once for this round!
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

//
