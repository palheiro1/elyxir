import {
    Box,
    Button,
    Center,
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
        lastPrice
    } = card;

    // ------------------------------

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    // ------------------------------

    const bgColor = useColorModeValue('white', 'transparent');
    const [hover, setHover] = useState(false);
    const initialStyle = {
        cursor: 'none',
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
                    onClick={() => handleClick({ card: card })}
                    style={hover ? hoverStyle : initialStyle}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
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
                                            {lowedAskOrders === "" ? <Spinner size='md' /> : lowedAskOrders}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Highest bid
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            {highBidOrders === "" ? <Spinner size='md' /> : highBidOrders}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color="gray" textAlign="center">
                                            Latest price
                                        </Text>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                            {lastPrice === "" ? <Spinner size='md' /> : lastPrice}
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>
                        </Stack>
                    </Center>
                )}
            </Stack>

            {/* ------------------------------------ HIDE DIALOGs ------------------------------------ */}
            <SendDialog
                isOpen={isOpenSend}
                onClose={onCloseSend}
                reference={refSend}
                card={card}
                username={username}
            />
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
            />
            {/* -------------------------------------------------------------------------------------- */}
        </Box>
    );
};

export default Card;
