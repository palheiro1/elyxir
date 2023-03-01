import { useRef, useState } from 'react';

import {
    Box,
    Button,
    Center,
    Image,
    SimpleGrid,
    Spacer,
    Spinner,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';

import { NQTDIVIDER } from '../../data/CONSTANTS';
import CardBadges from './CardBadges';
// Modals
import CraftDialog from '../Modals/CraftDialog/CraftDialog';
import MorphDialog from '../Modals/MorphDialog/MorphDialog';
import SendDialog from '../Modals/SendDialog/SendDialog';
import TradeDialog from '../Modals/TradeDialog/TradeDialog';

// Icons
import { BsArrowLeftRight, BsTools } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

import { BiLockAlt } from 'react-icons/bi';

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
    if (quantity === 0 && !isMarket) fixOnlyBuy = true;

    // ------------------------------

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    // ------------------------------

    const bgColor = useColorModeValue('white', 'transparent');
    const [hover, setHover] = useState(false);
    const [hoverButton, setHoverButton] = useState(false);

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
    const cardOpacity = haveThisCard ? 1 : 0.25;
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
    let lowedAskOrders = '';
    let highBidOrders = '';
    if (askOrders.length > 0) {
        const auxAsks = askOrders[0].priceNQTPerShare / NQTDIVIDER;
        lowedAskOrders = Number.isInteger(auxAsks) ? auxAsks : auxAsks.toFixed(2);
    }
    if (bidOrders.length > 0) {
        const auxBids = bidOrders[0].priceNQTPerShare / NQTDIVIDER;
        highBidOrders = Number.isInteger(auxBids) ? auxBids : auxBids.toFixed(2);
    }
    // ------------------------------
    const unconfirmedQuantityQNT = Number(card.unconfirmedQuantityQNT);
    const isBlocked = quantity > unconfirmedQuantityQNT && unconfirmedQuantityQNT === 0;
    const isBlockedCraft = unconfirmedQuantityQNT < 5;
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const lockedCards = quantity - unconfirmedQuantityQNT;
    console.log('🚀 ~ file: Card.js:117 ~ Card ~ lockedCards:', lockedCards);
    const haveCardsInMarket = lockedCards > 0;
    console.log('🚀 ~ file: Card.js:119 ~ Card ~ haveCardsInMarket:', haveCardsInMarket);

    return (
        <Box
            p={3}
            border="1px"
            rounded="lg"
            shadow="lg"
            bgColor={bgColor}
            borderColor={borderColor}
            minH={{ base: '25rem', md: '29rem' }}
            minW={{ base: '15rem', md: '12rem' }}>
            <Center>
                <SimpleGrid columns={1} spacing={{ base: 2, lg: 4 }}>
                    <Image
                        minH="20rem"
                        src={image}
                        alt={name}
                        rounded="lg"
                        onClick={() => (haveThisCard ? handleClick({ card: card }) : null)}
                        style={hover ? hoverStyle : initialStyle}
                        onMouseEnter={() => (haveThisCard ? setHover(true) : null)}
                        onMouseLeave={() => (haveThisCard ? setHover(false) : null)}
                        opacity={cardOpacity}
                    />
                    <Stack direction={{ base: 'column', lg: 'row' }} spacing={0}>
                        <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }}>
                            <Text fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }} noOfLines={1} fontWeight="bold">
                                {name}
                            </Text>
                            <CardBadges rarity={rarity} continent={continent} size="sm" />
                        </Stack>
                        <Spacer display={{ base: 'none', lg: 'block' }} />
                        <Center minHeight="100%">
                            {haveCardsInMarket && (
                                <Tooltip
                                    label={`You have ${lockedCards} blocked cards in the market`}
                                    minH={{ base: '100%', lg: 'auto' }}
                                    placement="bottom">
                                    <Box w="25%" mr={1}>
                                        <BiLockAlt size="1.5rem" color="orange" />
                                    </Box>
                                </Tooltip>
                            )}
                            <Text textAlign="end" minH={{ base: '100%', lg: 'auto' }}>
                                <small>Quantity:</small> {quantity}
                            </Text>
                        </Center>
                    </Stack>
                    {!isMarket && !fixOnlyBuy && (
                        <Box
                            onMouseEnter={() => isBlocked && setHoverButton(true)}
                            onMouseLeave={() => isBlocked && setHoverButton(false)}>
                            {!hoverButton && (
                                <SimpleGrid columns={3} gap={1}>
                                    <Button
                                        fontWeight="medium"
                                        fontSize={{ base: 'xs', md: 'sm', '2xl': 'md' }}
                                        leftIcon={<FaRegPaperPlane />}
                                        _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                                        onClick={onOpenSend}
                                        isDisabled={isBlocked}>
                                        Send
                                    </Button>

                                    <Button
                                        fontWeight="medium"
                                        fontSize={{ base: 'xs', md: 'sm', '2xl': 'md' }}
                                        leftIcon={<BsTools />}
                                        _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                                        onClick={onOpenCraft}
                                        isDisabled={isBlockedCraft}>
                                        Craft
                                    </Button>

                                    <Button
                                        fontWeight="medium"
                                        fontSize={{ base: 'xs', md: 'sm', '2xl': 'md' }}
                                        leftIcon={<BsArrowLeftRight />}
                                        _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                                        onClick={onOpenMorph}
                                        isDisabled={isBlocked}>
                                        Morph
                                    </Button>
                                </SimpleGrid>
                            )}
                            {hoverButton && (
                                <Center w="100%" bgColor={borderColor} rounded="lg" h="100%">
                                    <Text textAlign="center" fontSize="xs">
                                        <strong>1 card(s) locked for all actions.</strong>
                                        <br /> Check for open Ask orders to unlock.
                                    </Text>
                                </Center>
                            )}
                        </Box>
                    )}
                    {isMarket && (
                        <Center>
                            <Stack direction="column" w="100%">
                                <Box
                                    w="100%"
                                    onMouseEnter={() => isBlocked && setHoverButton(true)}
                                    onMouseLeave={() => isBlocked && setHoverButton(false)}>
                                    {!hoverButton && (
                                        <Button
                                            isDisabled={isBlocked}
                                            onClick={onOpenTrade}
                                            size="lg"
                                            w="100%"
                                            leftIcon={<BsArrowLeftRight />}
                                            _hover={{ fontWeight: 'bold', shadow: 'xl' }}>
                                            Trade
                                        </Button>
                                    )}
                                    {hoverButton && (
                                        <Center w="100%" minH="3rem" bgColor={borderColor} rounded="lg" h="100%">
                                            <Text textAlign="center" fontSize="xs">
                                                <strong>1 card(s) locked for all actions.</strong>
                                                <br /> Check for open Ask orders to unlock.
                                            </Text>
                                        </Center>
                                    )}
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
                    {fixOnlyBuy && (
                        <Box>
                            <Button
                                w="100%"
                                color="black"
                                variant="solid"
                                bgColor="#F18800"
                                _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                                onClick={onOpenTrade}>
                                BUY
                            </Button>
                        </Box>
                    )}
                </SimpleGrid>
            </Center>

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
