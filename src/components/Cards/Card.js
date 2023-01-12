import {
    Box,
    Button,
    Center,
    Grid,
    GridItem,
    Image,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import { BsArrowLeftRight, BsTools } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const Card = ({ card, setCardClicked, onOpen, isMarket = false, onlyBuy = true }) => {
    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    const { name, cardImgUrl: image, channel: continent, quantityQNT: quantity, rarity } = card;

    const bgColor = useColorModeValue('white', 'transparent');

    return (
        <Box p={3} border="1px" rounded="lg" borderColor="gray" shadow="xl" bgColor={bgColor}>
            <Stack direction="column" spacing={4}>
                <Image
                    _hover={{ cursor: 'pointer', transform: 'scale(1.025)', transition: 'all 0.3s ease-in-out', shadow: 'xl' }}
                    src={image}
                    alt={name}
                    rounded="lg"
                    onClick={() => handleClick({ card: card })}
                    shadow="md"
                />

                <Grid templateColumns="repeat(4, 1fr)" alignContent="center">
                    <GridItem colSpan="3">
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
                                <small>Quantity:</small> {quantity}
                            </Text>
                        </Center>
                    </GridItem>
                </Grid>
                {onlyBuy ? (
                    <Box w="100%">
                        <Button size="lg" w="100%" _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Buy
                        </Button>
                    </Box>
                ) : !isMarket ? (
                    <SimpleGrid columns={3} gap={1}>
                        <Button
                            leftIcon={<FaRegPaperPlane />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Send
                        </Button>
                        <Button
                            leftIcon={<BsTools />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Craft
                        </Button>
                        <Button
                            leftIcon={<BsArrowLeftRight />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                            Morph
                        </Button>
                    </SimpleGrid>
                ) : (
                    <Center>
                        <Stack direction="column" w="100%">
                            <Box w="100%">
                                <Button
                                    size="lg"
                                    w="100%"
                                    leftIcon={<BsArrowLeftRight />}
                                    _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                                    Trade
                                </Button>
                            </Box>
                            <Box borderTop="1px" borderTopColor="gray.600" pt={4}>
                                <SimpleGrid columns={3} spacing={4}>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Lowest ask
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            32
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Highest bid
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            15
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Latest price
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            200
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Box>
    );
};

export default Card;
