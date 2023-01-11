import { useEffect, useState } from 'react';
import { Box, Button, Grid, Select, Stack, Text, useDisclosure } from '@chakra-ui/react';

import DetailedCard from '../Cards/DetailedCard';

import { FaRegPaperPlane } from 'react-icons/fa';
import { fetchAllCards } from '../../utils/cardsUtils';
import { COLLECTIONACCOUNT, TARASCACARDACCOUNT } from '../../data/CONSTANTS';
import GridItemCard from './GridItemCard';

/**
 * Inventory component
 * @name Inventory
 * @description This component is the inventory page
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @returns {JSX.Element} - Inventory component
 * @example
 * <Inventory infoAccount={infoAccount} />
 */
const Inventory = ({ infoAccount }) => {
    // Open DetailedCardView
    const { isOpen, onOpen, onClose } = useDisclosure();

    // All cards
    const [cards, setCards] = useState([]);

    // Card clicked
    const [cardClicked, setCardClicked] = useState();

    // Filtered cards
    const [cardsFiltered, setCardsFiltered] = useState(cards);
    const [rarity, setRarity] = useState('All');


    /**
     * @description Get all cards
     * @param {Object} infoAccount - Account info
     * @returns {Array} - All cards
     */
    useEffect(() => {
        const getAllCards = async () => {
            const response = await fetchAllCards(
                infoAccount.accountRs,
                COLLECTIONACCOUNT,
                TARASCACARDACCOUNT
            );
            setCards(response);
        };

        infoAccount && getAllCards();
    }, [infoAccount]);


    /**
     * @description Filter cards by rarity
     * @param {String} rarity - Rarity
     * @returns {Array} - Filtered cards
     */
    useEffect(() => {
        const filterCards = rarity => {
            if (rarity === 'All') {
                setCardsFiltered(cards);
                return;
            }
            setCardsFiltered(cards.filter(card => card.rarity === rarity));
        };

        filterCards(rarity);
    }, [cards, rarity]);

    return (
        <Box>
            <Stack direction="row" pb={2}>
                <Stack
                    direction="row"
                    border="1px"
                    borderColor="gray.600"
                    rounded="2xl"
                    px={2}
                    align="center"
                    mx={4}>
                    <FaRegPaperPlane size="1.5em" />
                    <Text fontSize="sm" color="gray.400">
                        Sort:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" placeholder="Sort option">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                    </Select>
                </Stack>
                <Stack position="absolute" right="70px" direction="row" spacing={4}>
                    <Button onClick={() => setRarity('All')}>All rarities</Button>
                    <Button onClick={() => setRarity('Common')}>Common</Button>
                    <Button onClick={() => setRarity('Rare')}>Rare</Button>
                    <Button onClick={() => setRarity('Epic')}>Epic</Button>
                    <Button onClick={() => setRarity('Special')}>Special</Button>
                </Stack>
            </Stack>

            <Grid templateColumns="repeat(4, 1fr)">
                {cardsFiltered &&
                    cardsFiltered.map(card => {
                        return (
                            <GridItemCard
                                card={card}
                                setCardClicked={setCardClicked}
                                onOpen={onOpen}
                            />
                        );
                    })}
            </Grid>
            {isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} />}
        </Box>
    );
};

export default Inventory;
