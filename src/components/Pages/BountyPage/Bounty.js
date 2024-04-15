import { Box, Center, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getBountyParticipants } from '../../../services/Bounty/utils';
import RemainingCards from '../../Cards/RemainingCards';
import BountyWidget from '../../BountyWidget/BountyWidget';
import SortAndFilterCards from '../../SortAndFilters/SortAndFilterCards';
import ClaimBounty from './ClaimBounty';
import { IGNIS_REQUIRED, REFRESH_BOUNTY_PARTICIPANTS } from '../../../data/CONSTANTS';

/**
 * @name Bounty
 * @description Bounty page
 * @param {object} infoAccount - Account info
 * @param {array} cards - All cards
 * @returns {JSX.Element} - JSX to display
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Bounty = ({ infoAccount, cards = [] }) => {
    const [totalNoSpecialCards, setTotalNoSpecialCards] = useState([]); // Cards without specials
    const [remainingCards, setRemainingCards] = useState([]); // Cards without specials and with 0 quantity
    const [cardsFiltered, setCardsFiltered] = useState([]); // Cards filtered by search and rarity
    const [participants, setParticipants] = useState({ numParticipants: 0, participants: [] });
    // const [missingCards, setMissingCards] = useState(false);
    const { accountRs: account, IGNISBalance } = infoAccount;

    const IS_BOUNTY_ENABLED = true;

    useEffect(() => {
        // Get remaining cards
        const getRemainingCards = () => {
            const auxNoSpecialCards = cards.filter(card => card.rarity !== 'Special');
            setTotalNoSpecialCards(auxNoSpecialCards);

            const cardWithZero = auxNoSpecialCards.filter(
                card =>
                    Number(card.quantityQNT) === 0 ||
                    (Number(card.quantityQNT) > Number(card.unconfirmedQuantityQNT) &&
                        Number(card.unconfirmedQuantityQNT) === 0)
            );
            setRemainingCards(cardWithZero);
        };

        getRemainingCards();
    }, [cards]);

    useEffect(() => {
        const getParticipants = async () => {
            // Get participants
            const response = await getBountyParticipants();
            let auxParticipants = [];
            let numParticipants = 0;
            Object.entries(response).forEach(entry => {
                const [key, value] = entry;
                if (value > 0) {
                    auxParticipants.push({ account: key, quantity: value });
                    numParticipants += value;
                }

                // if (key === account && value === 0) {
                //     setMissingCards(true);
                // }
            });
            setParticipants({ numParticipants, participants: auxParticipants });
        };

        getParticipants();

        const interval = setInterval(() => {
            getParticipants();
        }, REFRESH_BOUNTY_PARTICIPANTS);
        return () => clearInterval(interval);
    }, [account]);

    const findParticipation = participants.participants.find(participant => participant.account === account);
    const imParticipant = findParticipation !== undefined;
    const myParticipation = findParticipation && (findParticipation ? findParticipation.quantity : 0);
    const textParticipations =
        findParticipation && (myParticipation === 1 ? 'once' : findParticipation.quantity + ' times');

    const canClaimBounty = IS_BOUNTY_ENABLED && cards.length > 0 && remainingCards.length === 0;

    return (
        <Box>
            <Center>
                <BountyWidget cStyle={2} />
            </Center>

            {imParticipant && (
                <Text mt={4} fontSize="2xl" textAlign="center" fontWeight="bolder">
                    ✅ You've participated {textParticipations} for this round!
                </Text>
            )}

            {/*missingCards && (
                <Box>
                    <Text textAlign="center" fontWeight="bolder" color={'red'}>
                        We have detected that you have played the Bounty, but there are still cards to be sent.
                    </Text>
                    <Text pb={2} textTransform={"uppercase"} textAlign="center" fontWeight="bolder" color={'red'}>
                        (your participation is not taken into account)
                    </Text>
                </Box>
            )*/}

            {remainingCards.length > 0 && (
                <>
                    <SortAndFilterCards
                        cards={remainingCards}
                        setCardsFiltered={setCardsFiltered}
                        needSpecials={false}
                        needSorting={false}
                        rgbColor={'59, 83, 151'}
                    />
                    <RemainingCards
                        infoAccount={infoAccount}
                        username={infoAccount.name}
                        totalCards={totalNoSpecialCards.length}
                        remainingCards={remainingCards}
                        cards={cardsFiltered}
                    />
                </>
            )}

            {canClaimBounty && (
                <ClaimBounty
                    username={infoAccount.name}
                    cards={totalNoSpecialCards}
                    haveIgnis={IGNISBalance >= IGNIS_REQUIRED}
                />
            )}
        </Box>
    );
};

export default Bounty;
