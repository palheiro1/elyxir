import { Box, Button, Grid, GridItem, Stack } from '@chakra-ui/react';
import Card from '../Cards/Card';

const Inventory = () => {
    return (
        <Box>
            <Stack direction="row" spacing={8} mb={6} w="100%">
                <Button>Sort</Button>
                <Box>
                    <Button>All rarities</Button>
                    <Button>Common</Button>
                    <Button>Rare</Button>
                    <Button>Very rare</Button>
                </Box>
            </Stack>

            <Grid templateColumns="repeat(4, 1fr)">
                <GridItem>
                    <Card
                        name="Kel Essuf"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <GridItem>
                    <Card
                        name="Kel Essuf"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <GridItem>
                    <Card
                        name="Kel Essuf"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <Card
                    name="Card 1"
                    image="/images/cards/card.png"
                    quantity={7}
                    continent="Europe"
                    rarity="Common"
                />
                <GridItem>
                    <Card
                        name="Card 1"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <GridItem>
                    <Card
                        name="Card 1"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <GridItem>
                    <Card
                        name="Card 1"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
                <GridItem>
                    <Card
                        name="Card 1"
                        image="/images/cards/card.png"
                        quantity={7}
                        continent="Europe"
                        rarity="Common"
                    />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Inventory;
