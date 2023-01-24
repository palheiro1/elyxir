import { Box, Button, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import equal from 'fast-deep-equal';
import Crypto from 'crypto-browserify';

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
const SortAndFilterCards = ({ cards = [], setCardsFiltered, needSpecials = true, needSorting = true }) => {
    const bgButtons = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const [rarity, setRarity] = useState('All');
    const [sort, setSort] = useState('none');
    const [needReload, setNeedReload] = useState(true);
    const [actualCards, setActualCards] = useState(cards);
    const [cardsHash, setCardsHash] = useState('');

    /**
     * @description Filter cards by rarity
     * @param {String} rarity - Rarity
     * @returns {Array} - Filtered cards
     */
    useEffect(() => {
        const filterCards = () => {
            console.log('Filtering cards');
            setNeedReload(false);
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
            setActualCards(filteredCards);
        };

        const checkHash = () => {
            const loadCardsHash = Crypto.createHash('sha256').update(JSON.stringify(cards)).digest('hex');
            if (!equal(cardsHash, loadCardsHash)) {
                setNeedReload(true);
                setCardsHash(loadCardsHash);
            }
        };

        checkHash();
        needReload && filterCards();
    }, [cards, rarity, setCardsFiltered, sort, needReload, actualCards.length, cardsHash]);

    const handleChange = e => {
        if (e.target.value !== sort) {
            setSort(e.target.value);
            setNeedReload(true);
        }
    };

    const handleRarity = auxRarity => {
        if (auxRarity !== rarity) {
            setRarity(auxRarity);
            setNeedReload(true);
        }
    };

    return (
        <Stack direction={['column', 'row']} align="center" justify="space-between" position="relative" mb={4}>
            {needSorting && (
                <Stack
                    direction="row"
                    border="1px"
                    borderColor="gray.600"
                    rounded="lg"
                    px={2}
                    align="center"
                    w={{ base: '100%', md: 'unset' }}>
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
            <Stack
                position={{ base: 'unset', md: 'absolute' }}
                w={{ base: '100%', md: 'unset' }}
                right={{ base: 'unset', md: '0.25%' }}
                direction={['column', 'row']}
                spacing={2}>
                <Button size="sm" bgColor={bgButtons} isActive={rarity === 'All'} onClick={() => handleRarity('All')}>
                    All rarities
                </Button>
                <Button
                    w={{ base: '100%', md: 'unset' }}
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Common'}
                    onClick={() => handleRarity('Common')}>
                    Common
                </Button>
                <Button size="sm" bgColor={bgButtons} isActive={rarity === 'Rare'} onClick={() => handleRarity('Rare')}>
                    Rare
                </Button>
                <Button size="sm" bgColor={bgButtons} isActive={rarity === 'Epic'} onClick={() => handleRarity('Epic')}>
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
