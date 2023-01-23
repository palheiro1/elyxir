import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Image,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { BsArrowLeftRight, BsTools } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';
import { NQTDIVIDER } from '../../data/CONSTANTS';
import CraftDialog from '../Modals/CraftDialog/CraftDialog';
import MorphDialog from '../Modals/MorphDialog/MorphDialog';
import SendDialog from '../Modals/SendDialog/SendDialog';
import TradeDialog from '../Modals/TradeDialog/TradeDialog';

/**
 * @name Card
 * @description Card component - Shows the card data and the actions
 * @param {Object} card - Object with the card data
 * @param {Function} setCardClicked - Function to set the card clicked
 * @param {Function} onOpen - Function to open the dialog
 * @param {Boolean} isMarket - Boolean to know if the card is in the market
 * @param {Boolean} onlyBuy - Boolean to know if the card is only buyable
 * @param {String} username - String with the username
 * @param {Object} ignis - Object with the ignis data
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const Card = ({ card, setCardClicked, onOpen, isMarket = false, onlyBuy = true, username, ignis }) => {
    const {
        name,
        cardImgUrl: image,
        channel: continent,
        quantityQNT: quantity,
        rarity,
        askOrders,
        bidOrders,
        lastPrice,
    } = card;

    let fixOnlyBuy = onlyBuy;
    if(quantity === 0 && !isMarket)
        fixOnlyBuy = true;

    // ------------------------------

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    // ------------------------------

    const bgColor = useColorModeValue('white', 'transparent');
    const [hover, setHover] = useState(false);

    const rarityColor =
        rarity === 'Common'
            ? 'linear-gradient(45deg, #8e9eab, #eef2f3) 1'
            : rarity === 'Rare'
            ? 'linear-gradient(45deg, #2F80ED, #56CCF2) 1'
            : rarity === 'Epic'
            ? 'linear-gradient(45deg, #F09819, #EDDE5D) 1'
            : rarity === 'Special'
            ? 'linear-gradient(60deg, #53AF53, #2D5B53) 1'
            : 'linear-gradient(45deg, #8e9eab, #eef2f3) 1';

    const initialStyle = {
        transform: 'scale(1)',
        transition: 'all 0.3s ease-in-out',
        shadow: 'none',
    };
    const hoverStyle = {
        cursor: 'pointer',
        transform: 'scale(1.025)',
        transition: 'all 0.3s ease-in-out',
        shadow: 'xl',
    };

    const haveThisCard = quantity > 0;
    const cardOpacity = haveThisCard ? 1 : 0.5;
    // ------------------------------

    const { isOpen: isOpenCraft, onOpen: onOpenCraft, onClose: onCloseCraft } = useDisclosure();
    const refCraft = useRef();

    const { isOpen: isOpenMorph, onOpen: onOpenMorph, onClose: onCloseMorph } = useDisclosure();
    const refMorph = useRef();

    const { isOpen: isOpenSend, onOpen: onOpenSend, onClose: onCloseSend } = useDisclosure();
    const refSend = useRef();

    const { isOpen: isOpenTrade, onOpen: onOpenTrade, onClose: onCloseTrade } = useDisclosure();
    const refTrade = useRef();

    // ------------------------------
    const lowedAskOrders = askOrders.length > 0 ? askOrders[0].priceNQTPerShare / NQTDIVIDER : '';
    const highBidOrders = bidOrders.length > 0 ? bidOrders[0].priceNQTPerShare / NQTDIVIDER : '';
    // ------------------------------

    return (
        <Box p={3} border="1px" rounded="lg" borderColor="gray" shadow="xl" bgColor={bgColor}>
            <Stack direction="column" spacing={4}>
                <Image
                    src={image}
                    alt={name}
                    rounded="lg"
                    onClick={() => haveThisCard ? handleClick({ card: card }) : null}
                    style={hover ? hoverStyle : initialStyle}
                    onMouseEnter={() => haveThisCard ? setHover(true) : null}
                    onMouseLeave={() => haveThisCard ? setHover(false) : null}
                    opacity={cardOpacity}
                />

                <Grid templateColumns="repeat(4, 1fr)" alignContent="center">
                    <GridItem colSpan="3">
                        <Text fontSize="xl" fontWeight="bolder" minW="100%">
                            {name}
                        </Text>

                        <Flex gap={2}>
                            <Text
                                color="white"
                                fontSize="md"
                                rounded="lg"
                                fontWeight="bolder"
                                bgColor="whiteAlpha.300"
                                px={2}>
                                {continent}
                            </Text>
                            <Text
                                fontWeight="bolder"
                                color="black"
                                fontSize="md"
                                bgGradient={rarityColor}
                                rounded="lg"
                                px={2}>
                                {rarity}
                            </Text>
                        </Flex>
                    </GridItem>
                    <GridItem alignContent="center" minH="100%">
                        <Center minHeight="100%">
                            <Text textAlign="end" minH="100%">
                                <small>Quantity:</small> {quantity}
                            </Text>
                        </Center>
                    </GridItem>
                </Grid>
                {fixOnlyBuy ? (
                    <Box w="100%">
                        <Button w="100%" variant="solid" _hover={{ fontWeight: 'bold', shadow: 'xl' }} onClick={onOpenTrade}>
                            BUY
                        </Button>
                    </Box>
                ) : !isMarket ? (
                    <SimpleGrid columns={3} gap={1}>
                        <Button
                            leftIcon={<FaRegPaperPlane />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                            onClick={onOpenSend}
                            isDisabled={quantity === 0}>
                            Send
                        </Button>

                        <Button
                            leftIcon={<BsTools />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                            onClick={onOpenCraft}
                            isDisabled={quantity <= 4}>
                            Craft
                        </Button>

                        <Button
                            leftIcon={<BsArrowLeftRight />}
                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                            onClick={onOpenMorph}
                            isDisabled={quantity === 0}>
                            Morph
                        </Button>
                    </SimpleGrid>
                ) : (
                    <Center>
                        <Stack direction="column" w="100%">
                            <Box w="100%">
                                <Button
                                    onClick={onOpenTrade}
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
                                            {lowedAskOrders === '' ? <Spinner size="md" /> : lowedAskOrders}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Highest bid
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            {highBidOrders === '' ? <Spinner size="md" /> : highBidOrders}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Latest price
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            {lastPrice === '' ? <Spinner size="md" /> : lastPrice}
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>
                        </Stack>
                    </Center>
                )}
            </Stack>

            {/* ------------------------------------ HIDE DIALOGs ------------------------------------ */}
            <SendDialog isOpen={isOpenSend} onClose={onCloseSend} reference={refSend} card={card} username={username} />
            <CraftDialog
                isOpen={isOpenCraft}
                onClose={onCloseCraft}
                reference={refCraft}
                card={card}
                username={username}
            />
            <MorphDialog
                isOpen={isOpenMorph}
                onClose={onCloseMorph}
                reference={refMorph}
                card={card}
                username={username}
            />
            <TradeDialog
                isOpen={isOpenTrade}
                onClose={onCloseTrade}
                reference={refTrade}
                card={card}
                username={username}
                ignis={ignis}
                onlyBid={fixOnlyBuy}
            />
            {/* -------------------------------------------------------------------------------------- */}
        </Box>
    );
};

export default Card;
