import { Box, Button, Image, Select, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';
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
const SortAndFilterCards = ({ cards = [], setCardsFiltered, needSpecials = true, needSorting = true, rgbColor = "47, 129, 144" }) => {
    const bgButtons = `rgba(${rgbColor}, 0.35)`;
    const borderButtons = `rgba(${rgbColor}, 1)`;

    const [rarity, setRarity] = useState('All');
    const [sort, setSort] = useState('moreQuantity');
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

    const RarityButton = ({ name, icon, isActive }) => {
        return (
            <Button
                w={{ base: '100%', lg: 'unset' }}
                size="sm"
                bgColor={bgButtons}
                isActive={isActive}
                color="white"
                onClick={() => handleRarity(name)}
                _hover={{ bgColor: borderButtons }}
                _active={{ border: '2px', borderColor: borderButtons }}
                leftIcon={icon}>
                {name}
            </Button>
        );
    };

    return (
        <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            position="relative"
            mb={4}>
            {needSorting && (
                <Stack
                    direction="row"
                    border="2px"
                    borderColor={borderButtons}
                    rounded="lg"
                    bg="transparent"
                    shadow="md"
                    px={2}
                    align="center"
                    w={{ base: '100%', lg: 'unset' }}>
                    <Box pl={1} py={2}>
                        <BsArrowDownUp color={borderButtons} />
                    </Box>
                    <Text fontSize="sm" color={borderButtons}>
                        Sort:{' '}
                    </Text>
                    <Select border="0px" borderColor="gray.800" size="xs" onChange={handleChange}>
                        <option value="moreQuantity">Descending</option>
                        <option value="lessQuantity">Ascending</option>
                    </Select>
                </Stack>
            )}
            <Stack
                position={{ base: 'unset', lg: 'absolute' }}
                w={{ base: '100%', lg: 'unset' }}
                right={{ base: 'unset', lg: '0.25%' }}
                direction={['column', 'row']}
                spacing={2}>
                <RarityButton
                    name="All"
                    isActive={rarity === 'All'}
                    icon={<Image width={'20px'} src="/images/rarities/all.png" />}
                />

                <RarityButton
                    name="Common"
                    isActive={rarity === 'Common'}
                    icon={<Image width={'20px'} src="/images/rarities/common.png" />}
                />

                <RarityButton
                    name="Rare"
                    isActive={rarity === 'Rare'}
                    icon={<Image width={'20px'} src="/images/rarities/rare.png" />}
                />

                <RarityButton
                    name="Epic"
                    isActive={rarity === 'Epic'}
                    icon={<Image width={'20px'} src="/images/rarities/epic.png" />}
                />

                {needSpecials && (
                    <RarityButton
                        name="Special"
                        isActive={rarity === 'Special'}
                        icon={<Image width={'20px'} src="/images/rarities/special.png" />}
                    />
                )}
            </Stack>
        </Stack>
    );
};

export default SortAndFilterCards;
