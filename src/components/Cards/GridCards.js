import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import Card from './Card';
import DetailedCard from './DetailedCard';

const GridCards = ({ cards }) => {
    
    // Card clicked
    const [cardClicked, setCardClicked] = useState();

    // Open DetailedCardView
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Grid templateColumns="repeat(4, 1fr)">
                {cards &&
                    cards.map(card => {
                        return (
                            <GridItem>
                                <Card card={card} setCardClicked={setCardClicked} onOpen={onOpen} />
                            </GridItem>
                        );
                    })}
            </Grid>
            {isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} />}
        </>
    );
};

export default GridCards;
