import { Box, Button, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';

const SortAndFilterMenu = ({
    cards = [],
    setCardsFiltered,
    needSpecials = true,
    needSorting = true,
}) => {
    const bgButtons = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const [rarity, setRarity] = useState('All');
    const [sort, setSort] = useState('none');

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
        };

        console.log(rarity, sort);
        filterCards();
    }, [cards, rarity, setCardsFiltered, sort]);

    const handleChange = e => {
        setSort(e.target.value);
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
                    onClick={() => setRarity('All')}>
                    All rarities
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Common'}
                    onClick={() => setRarity('Common')}>
                    Common
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Rare'}
                    onClick={() => setRarity('Rare')}>
                    Rare
                </Button>
                <Button
                    size="sm"
                    bgColor={bgButtons}
                    isActive={rarity === 'Epic'}
                    onClick={() => setRarity('Epic')}>
                    Epic
                </Button>
                {needSpecials && (
                    <Button
                        size="sm"
                        bgColor={bgButtons}
                        isActive={rarity === 'Special'}
                        onClick={() => setRarity('Special')}>
                        Special
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};

export default SortAndFilterMenu;
