import { useEffect, useState } from 'react';
import { Box, Button, Grid, GridItem, Select, Stack, Text, useDisclosure } from '@chakra-ui/react';
import Card from '../Cards/Card';
import DetailedCard from '../Cards/DetailedCard';

import { FaRegPaperPlane } from 'react-icons/fa';
import { fetchAllCards } from '../../utils/cardsUtils';
import { COLLECTIONACCOUNT, TARASCACARDACCOUNT } from '../../data/CONSTANTS';

const Inventory = ({ infoAccount }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ cards, setCards ] = useState([]);
    const [ cardClicked, setCardClicked ] = useState();
    //const [cardsFiltered, setCardsFiltered] = useState([]);
    //const [rarity, setRarity] = useState("All");

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    }

    const GridItemCard = ({ card }) => {
        if(!card) return;
        return (
            <GridItem onClick={() => handleClick({card: card})}>
                <Card
                    name={card.name}
                    image={card.cardImgUrl}
                    quantity={card.quantityQNT}
                    continent={card.channel}
                    rarity={card.rarity}
                />
            </GridItem>
        );
    };

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

    return (
        <Box>
            <Stack direction="row">
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
                        Sort
                    </Select>
                </Stack>
                <Stack position="fixed" right="68px" direction="row" spacing={4}>
                    <Button>All rarities</Button>
                    <Button>Common</Button>
                    <Button>Rare</Button>
                    <Button>Very rare</Button>
                </Stack>
            </Stack>

            <Grid templateColumns="repeat(4, 1fr)">
                {cards &&
                    cards.map((card) => {
                        return <GridItemCard card={card} />;
                    })}
            </Grid>
            { isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} /> }
        </Box>
    );
};

export default Inventory;
