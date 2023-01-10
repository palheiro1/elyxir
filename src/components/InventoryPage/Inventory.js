import { Box, Button, Grid, GridItem, Select, Stack, Text, useDisclosure } from '@chakra-ui/react';
import Card from '../Cards/Card';
import DetailedCard from '../Cards/DetailedCard';

import { FaRegPaperPlane } from 'react-icons/fa';

const Inventory = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const data = {
        name: "Kel Essuf",
        image: "/images/cards/card.png",
        continent: "Europe",
        rarity: "Common",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pulvinar mi ut ornare imperdiet. Vivamus imperdiet vel sem quis viverra. Aliquam convallis ultricies metus a aliquam. Phasellus accumsan nunc eget massa accumsan, sed pretium nisi tempor. Donec sed aliquam magna. Aliquam erat volutpat. Aliquam vestibulum malesuada eleifend. Mauris vestibulum urna id eros molestie, id luctus elit vulputate. Vivamus ultrices felis id felis auctor laoreet. "
    }

    const GridItemCard = ({ name, image, quantity, continent, rarity }) => {
        return(
            <GridItem onClick={onOpen}>
                <Card
                    name="Kel Essuf"
                    image="/images/cards/card.png"
                    quantity={7}
                    continent="Europe"
                    rarity="Common"
                />
            </GridItem>
        );
    }

    return (
        <Box>
            <Stack direction="row">
                <Stack direction="row" border="1px" borderColor="gray.600" rounded="2xl" p={2} align="center" mx={4}>
                    <FaRegPaperPlane size="2em" />
                    <Text fontSize="sm" color="gray.400">Sort: </Text>
                    <Select border="1px" borderColor="gray.800" size="xs" placeholder='Sort option'>Sort</Select>
                </Stack>
                <Stack position="fixed" right="68px" direction="row" spacing={4}>
                    <Button>All rarities</Button>
                    <Button>Common</Button>
                    <Button>Rare</Button>
                    <Button>Very rare</Button>
                </Stack>
            </Stack>

            <Grid templateColumns="repeat(4, 1fr)">
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
                <GridItemCard />
            </Grid>
            <DetailedCard isOpen={isOpen} onClose={onClose} data={data} />
        </Box>
    );
};

export default Inventory;
