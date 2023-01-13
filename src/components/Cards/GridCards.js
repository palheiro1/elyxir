import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import Card from './Card';
import DetailedCard from './DetailedCard';

const GridCards = ({ cards, isMarket = false, onlyBuy = false, username }) => {
    // Card clicked
    const [cardClicked, setCardClicked] = useState();

    // Open DetailedCardView
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Grid
                templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(3, 3fr)',
                    'repeat(5, 1fr)',
                ]}
                gap={4}
                my={4}>
                {cards &&
                    cards.map((card, index) => {
                        return (
                            <GridItem key={index}>
                                <Card
                                    username={username}
                                    card={card}
                                    setCardClicked={setCardClicked}
                                    onOpen={onOpen}
                                    isMarket={isMarket}
                                    onlyBuy={onlyBuy}
                                />
                            </GridItem>
                        );
                    })}
            </Grid>
            {isOpen && <DetailedCard isOpen={isOpen} onClose={onClose} data={cardClicked} />}
        </>
    );
};

export default GridCards;
