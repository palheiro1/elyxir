import { useRef, useState } from 'react';

import {
    Box,
    Button,
    Center,
    Flex,
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

import { NQTDIVIDER, WETHASSET } from '../../data/CONSTANTS';
import CardBadges from './CardBadges';
// Modals
import CraftDialog from '../Modals/CraftDialog/CraftDialog';
import MorphDialog from '../Modals/MorphDialog/MorphDialog';
import SendDialog from '../Modals/SendDialog/SendDialog';

import { BiLockAlt } from 'react-icons/bi';
import AskDialog from '../Modals/TradeDialog/AskDialog/AskDialog';
import BidDialog from '../Modals/TradeDialog/BidDialog/BidDialog';

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
const Card = ({
    card,
    setCardClicked,
    onOpen,
    isMarket = false,
    onlyBuy = true,
    infoAccount,
    market = 'WETH',
    rgbColor = '59, 100, 151',
}) => {
    const separatorColor = `rgba(${rgbColor}, 1)`;
    const newBgColor = 'rgba(47, 129, 144, 0.6)';
    const newBorderColor = 'rgba(47, 129, 144, 1)';
    // ------------------------------

    const { isOpen: isOpenCraft, onOpen: onOpenCraft, onClose: onCloseCraft } = useDisclosure();
    const refCraft = useRef();

    const { isOpen: isOpenMorph, onOpen: onOpenMorph, onClose: onCloseMorph } = useDisclosure();
    const refMorph = useRef();

    const { isOpen: isOpenSend, onOpen: onOpenSend, onClose: onCloseSend } = useDisclosure();
    const refSend = useRef();

    const { isOpen: isOpenAsk, onOpen: onOpenAsk, onClose: onCloseAsk } = useDisclosure();
    const refAsk = useRef();

    const { isOpen: isOpenBid, onOpen: onOpenBid, onClose: onCloseBid } = useDisclosure();
    const refBid = useRef();

    // ------------------------------

    const {
        name: username,
        IGNISBalance: ignis,
        GEMBalance: gem,
        currentAsks: askOrdersAccount,
        currentBids: bidOrdersAccount,
    } = infoAccount;

    const askOrdersForThisCard = askOrdersAccount?.filter(order => order.asset === card.asset);
    const bidOrdersForThisCard = bidOrdersAccount?.filter(order => order.asset === card.asset);

    const {
        name,
        cardImgUrl: image,
        channel: continent,
        quantityQNT: quantity,
        rarity,
        askOrders: askIgnisOrders,
        askOmnoOrders,
        bidOrders: bidIgnisOrders,
        bidOmnoOrders,
        lastPrice: lastIgnisPrice,
        lastOmnoPrice,
    } = card;

    let fixOnlyBuy = onlyBuy;
    if (quantity === 0 && !isMarket) fixOnlyBuy = true;

    let askOrders = market === 'IGNIS' ? askIgnisOrders : askOmnoOrders;
    let bidOrders = market === 'IGNIS' ? bidIgnisOrders : bidOmnoOrders;
    let lastPrice = market === 'IGNIS' ? lastIgnisPrice : lastOmnoPrice;

    // ------------------------------

    const handleClick = ({ card }) => {
        setCardClicked(card);
        onOpen();
    };

    // ------------------------------

    const bgColor = `rgba(${rgbColor}, 0.1)`;
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

    let lowedAskOrders = 0;
    let highBidOrders = 0;
    if (askOrders.length > 0) {
        let auxAsks;
        if (market === 'IGNIS') auxAsks = askOrders[0].priceNQTPerShare / NQTDIVIDER;
        if (market === 'WETH') auxAsks = askOrders[0].take.asset[WETHASSET] / NQTDIVIDER;
        lowedAskOrders = Number.isInteger(auxAsks) ? auxAsks : auxAsks.toFixed(2);
    }
    if (bidOrders.length > 0) {
        let auxBids;
        if (market === 'IGNIS') auxBids = bidOrders[0].priceNQTPerShare / NQTDIVIDER;
        if (market === 'WETH') auxBids = bidOrders[0].give.asset[WETHASSET] / NQTDIVIDER;
        highBidOrders = Number.isInteger(auxBids) ? auxBids : auxBids.toFixed(2);
    }

    // ------------------------------
    const unconfirmedQuantityQNT = Number(card.unconfirmedQuantityQNT);
    const isBlocked = quantity > unconfirmedQuantityQNT && unconfirmedQuantityQNT === 0;
    const isBlockedCraft = unconfirmedQuantityQNT < 5;
    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const lockedCards = quantity - unconfirmedQuantityQNT;
    const haveCardsInMarket = lockedCards > 0;
    const isSingular = Number(lockedCards) === 1;
    // ------------------------------

    const CardButton = ({ text, onClick, isDisabled = false, icon }) => (
        <Button
            fontWeight="medium"
            border="2px"
            borderColor={newBorderColor}
            bgColor={newBgColor}
            color="white"
            fontSize={{ base: 'xs', md: 'sm', '2xl': 'md' }}
            leftIcon={icon}
            _hover={{ fontWeight: 'bold', shadow: 'xl', bgColor: newBorderColor }}
            onClick={onClick}
            isDisabled={isDisabled}>
            {text}
        </Button>
    );

    return (
        <Box
            p={3}
            rounded="lg"
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
                        <Center minHeight={{ base: 'auto', lg: '100%' }}>
                            <Tooltip
                                label={`You have ${lockedCards} blocked ${isSingular ? 'card' : 'cards'} in the market`}
                                display={haveCardsInMarket ? 'flex' : 'none'}
                                placement="bottom">
                                <Flex w={{ base: 'auto', lg: '100%' }}>
                                    <Text textAlign="end" minH={{ base: '100%', lg: 'auto' }}>
                                        <small>Quantity:</small> {quantity}
                                    </Text>
                                    <Center>{haveCardsInMarket && <BiLockAlt size="1rem" color="orange" />}</Center>
                                </Flex>
                            </Tooltip>
                        </Center>
                    </Stack>
                    {!isMarket && !fixOnlyBuy && (
                        <Box
                            onMouseEnter={() => isBlocked && setHoverButton(true)}
                            onMouseLeave={() => isBlocked && setHoverButton(false)}>
                            {!hoverButton && (
                                <SimpleGrid columns={rarity === 'Special' ? 1 : 3} gap={1}>
                                    <CardButton
                                        text="Send"
                                        onClick={onOpenSend}
                                        isDisabled={isBlocked}
                                        icon={<Image src="/images/icons/send.png" w="20px" />}
                                    />
                                    {rarity !== 'Special' && (
                                        <>
                                            <CardButton
                                                text="Craft"
                                                onClick={onOpenCraft}
                                                isDisabled={isBlockedCraft}
                                                icon={<Image src="/images/icons/craft.png" w="20px" />}
                                            />
                                            <CardButton
                                                text="Morph"
                                                onClick={onOpenMorph}
                                                isDisabled={isBlocked}
                                                icon={<Image src="/images/icons/morph.png" w="20px" />}
                                            />
                                        </>
                                    )}
                                </SimpleGrid>
                            )}
                            {hoverButton && (
                                <Center w="100%" bgColor={borderColor} rounded="lg" h="100%">
                                    <Text textAlign="center" fontSize="xs">
                                        <strong>{lockedCards} card(s) locked for all actions.</strong>
                                        <br /> Check for open Ask orders to unlock.
                                    </Text>
                                </Center>
                            )}
                        </Box>
                    )}
                    {isMarket && (
                        <Center>
                            <Stack direction="column" w="100%">
                                <Stack direction="row" w="100%">
                                    <Button
                                        onClick={onOpenBid}
                                        size="lg"
                                        bgColor="#29a992"
                                        w="100%"
                                        color="white"
                                        fontWeight={'black'}
                                        _hover={{ shadow: 'lg' }}>
                                        BUY
                                    </Button>
                                    <Button
                                        onClick={onOpenAsk}
                                        size="lg"
                                        w="100%"
                                        color="white"
                                        bgColor="#eb6473"
                                        isDisabled={isBlocked}
                                        fontWeight={'black'}
                                        _hover={{ shadow: 'lg' }}>
                                        SELL
                                    </Button>
                                </Stack>
                                <Box borderTop="1px" borderTopColor={separatorColor} pt={4}>
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
                                color="white"
                                fontWeight={'black'}
                                variant="solid"
                                bgColor="#9f3772"
                                _hover={{ fontWeight: 'bold', shadow: 'xl' }}
                                onClick={onOpenBid}>
                                BUY
                            </Button>
                        </Box>
                    )}
                </SimpleGrid>
            </Center>

            {/* ------------------------------------ HIDE DIALOGs ------------------------------------ */}
            {card && (
                <>
                    {isOpenSend && (
                        <SendDialog
                            isOpen={isOpenSend}
                            onClose={onCloseSend}
                            reference={refSend}
                            card={card}
                            username={username}
                        />
                    )}

                    {isOpenCraft && (
                        <CraftDialog
                            isOpen={isOpenCraft}
                            onClose={onCloseCraft}
                            reference={refCraft}
                            card={card}
                            gem={gem}
                            username={username}
                        />
                    )}

                    {isOpenMorph && (
                        <MorphDialog
                            isOpen={isOpenMorph}
                            onClose={onCloseMorph}
                            reference={refMorph}
                            card={card}
                            gem={gem}
                            username={username}
                        />
                    )}

                    {isOpenAsk && (
                        <AskDialog
                            reference={refAsk}
                            isOpen={isOpenAsk}
                            onClose={onCloseAsk}
                            card={card}
                            username={username}
                            askOrders={askOrdersForThisCard}
                            bidOrders={bidOrdersForThisCard}
                        />
                    )}

                    {isOpenBid && (
                        <BidDialog
                            reference={refBid}
                            isOpen={isOpenBid}
                            onClose={onCloseBid}
                            card={card}
                            username={username}
                            ignis={ignis}
                            askOrders={askOrdersForThisCard}
                            bidOrders={bidOrdersForThisCard}
                        />
                    )}
                </>
            )}
            {/* -------------------------------------------------------------------------------------- */}
        </Box>
    );
};

export default Card;
