import { Box, Button, Center, Grid, GridItem, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';

import { BsArrowLeftRight, BsTools } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const Card = ({ name, image, quantity, continent, rarity }) => {

    const bgColor = useColorModeValue("white", "transparent")

    return (
        <Box p={4} m={4} border="1px" rounded="3xl" borderColor="gray" shadow="dark-lg" bgColor={bgColor}>
            <Stack direction="column" spacing={4} shadow={'inner'}>
                <Image src={image} alt={name} rounded="lg" />
                <Grid templateColumns="repeat(3, 1fr)" alignContent="center">
                    <GridItem colSpan="2">
                        <Text fontSize="xl" fontWeight="bolder" minW="100%">
                            {name}
                        </Text>
                        <Text color="gray" fontSize="md">
                            {continent} / {rarity}{' '}
                        </Text>
                    </GridItem>
                    <GridItem alignContent="center" minH="100%">
                        <Center minHeight="100%">
                            <Text textAlign="end" minH="100%">
                                Quantity: {quantity}
                            </Text>
                        </Center>
                    </GridItem>
                </Grid>
                <Center>
                    <Stack direction="row">
                        <Button leftIcon={<BsArrowLeftRight />} _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Trade
                        </Button>
                        <Button leftIcon={<FaRegPaperPlane />} _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Send
                        </Button>
                        <Button leftIcon={<BsTools />} _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Craft
                        </Button>
                    </Stack>
                </Center>
            </Stack>
        </Box>
    );
};

export default Card;
