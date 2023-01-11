import { GridItem } from '@chakra-ui/react';
import Card from '../Cards/Card';

const GridItemCard = ({ card, setCardClicked, onOpen }) => {
    if (!card) return;

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    }

    return (
        <GridItem onClick={() => handleClick({ card: card })}>
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

export default GridItemCard;