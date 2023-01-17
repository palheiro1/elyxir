import { Box, Button, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';


/**
 * @name SortAndFilterCards
 * @description Menu to sort and filter cards
 * @param {Array} cards - Array with the cards
 * @param {Function} setCardsFiltered - Function to set the filtered cards
 * @param {Boolean} needSpecials - If the menu needs the specials cards options
 * @param {Boolean} needSorting - If the menu needs the sorting options
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const SortAndFilterCards = ({
    cards = [],
    setCardsFiltered,
    needSpecials = true,
    needSorting = true,
}) => {
    const bgButtons = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const [rarity, setRarity] = useState('All');
    const [sort, setSort] = useState('none');
    const [needReload, setNeedReload] = useState(true);
    const [actualCards, setActualCards] = useState(cards);

    /**
     * @description Filter cards by rarity
     * @param {String} rarity - Rarity
     * @returns {Array} - Filtered cards
     */
    useEffect(() => {
        const filterCards = () => {
            let filteredCards = new Array(...cards);

            if (rarity !== 'All') {
                filteredCards = filteredCards.filter(card => card.rarity === rarity);
            }
            if (sort === 'moreQuantity') {
                filteredCards = filteredCards.sort((a, b) => b.quantityQNT - a.quantityQNT);
            } else if (sort === 'lessQuantity') {
                filteredCards = filteredCards.sort((a, b) => a.quantityQNT - b.quantityQNT);
            }
            setCardsFiltered(filteredCards);
            setNeedReload(false);
            setActualCards(filteredCards);
        };

        if(cards.length !== actualCards.length) setNeedReload(true);

        needReload && filterCards();
    }, [cards, rarity, setCardsFiltered, sort, needReload, actualCards.length]);

    const handleChange = e => {
        if(e.target.value !== sort) {
            setSort(e.target.value);
            setNeedReload(true);
        }
    };

    const handleRarity = auxRarity => {
        if(auxRarity !== rarity) {
            setRarity(auxRarity);
            setNeedReload(true);
        }
    };

    return (
        <Stack direction="row" pb={2}>
            {needSorting && (
                <Stack
                    direction="row"
                    border="1px"
                    borderColor="gray.600"
                    rounded="lg"
                    px={2}
                    align="center">
                    <Box pl={1} py={2}>
                        <FaRegPaperPlane />
                    </Box>
                    <Text fontSize="sm" color="gray.400">
                        Sort:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" onChange={handleChange}>
                        <option value="none">None</option>
                        <option value="moreQuantity">More quantity</option>
                        <option value="lessQuantity">Less quantity</option>
                    </Select>
                </Stack>
            )}
            <Stack position="absolute" right="70px" direction="row" spacing={2}>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'All'}
                    onClick={() => handleRarity('All')}>
                    All rarities
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Common'}
                    onClick={() => handleRarity('Common')}>
                    Common
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Rare'}
                    onClick={() => handleRarity('Rare')}>
                    Rare
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Epic'}
                    onClick={() => handleRarity('Epic')}>
                    Epic
                </Button>
                {needSpecials && (
                    <Button
                        size="sm"
                        bgColor={bgButtons}
                        isActive={rarity === 'Special'}
                        onClick={() => handleRarity('Special')}>
                        Special
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};

export default SortAndFilterCards;
