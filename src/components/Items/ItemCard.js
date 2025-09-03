import { useRef, useState } from 'react';

import {
    Box,
    Button,
    Center,
    Flex,
    Image,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { getTypeValue, getColor } from './data';
import { NQTDIVIDER, WETHASSET } from '../../data/CONSTANTS';
import AskDialog from '../Modals/TradeDialog/AskDialog/AskDialog';
import BidDialog from '../Modals/TradeDialog/BidDialog/BidDialog';
import SendDialog from '../Modals/SendDialog/SendDialog';
import { BiLockAlt } from 'react-icons/bi';

/**
 * @name ItemCard
 * @description ItemCard component - Shows the potion/item data and actions
 * @param {Object} item - Object with the item data
 * @param {Function} setItemClicked - Function to set the item clicked
 * @param {Function} onOpen - Function to open the dialog
 * @param {Boolean} isMarket - Boolean to know if the item is in the market
 * @param {Boolean} onlyBuy - Boolean to know if the item is only buyable
 * @param {String} username - String with the username
 * @param {Object} infoAccount - Object with the account info
 * @param {String} market - String with the market
 * @param {String} rgbColor - String with the RGB color
 * @returns {JSX.Element} - JSX element
 */
const ItemCard = ({
    item,
    setItemClicked,
    onOpen,
    isMarket = false,
    onlyBuy = true,
    infoAccount = {},
    market = 'IGNIS',
    rgbColor = '59, 100, 151',
}) => {
    const newBgColor = `rgba(${rgbColor}, 0.1)`;
    const newBorderColor = 'rgba(47, 129, 144, 1)';
    const separatorColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

    const { name, imgUrl, bonus, quantityQNT = 0, description } = item;

    const handleClick = ({ item }) => {
        setItemClicked(item);
        onOpen();
    };

    const bgColor = `rgba(${rgbColor}, 0.1)`;
    const [hover, setHover] = useState(false);
    const [hoverButton, setHoverButton] = useState(false);

    const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

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

    const haveThisItem = quantityQNT > 0;
    const itemOpacity = haveThisItem ? 1 : 0.25;

    const [canUseIcon] = useMediaQuery('(min-width: 1200px)');

    const ItemButton = ({ text, onClick, isDisabled = false, icon }) => (
        <Button
            fontWeight="medium"
            border="2px"
            borderColor={newBorderColor}
            bgColor={newBgColor}
            color="white"
            fontSize={{ base: 'xs', md: 'sm' }}
            leftIcon={canUseIcon ? icon : null}
            _hover={{ fontWeight: 'bold', shadow: 'xl', bgColor: newBorderColor }}
            onClick={onClick}
            isDisabled={isDisabled}>
            {text}
        </Button>
    );

    const { isOpen: isOpenAsk, onOpen: onOpenAsk, onClose: onCloseAsk } = useDisclosure();
    const refAsk = useRef();

    const { isOpen: isOpenBid, onOpen: onOpenBid, onClose: onCloseBid } = useDisclosure();
    const refBid = useRef();

    const { isOpen: isOpenSend, onOpen: onOpenSend, onClose: onCloseSend } = useDisclosure();
    const refSend = useRef();

    const {
        currentAsks: askOrdersAccount,
        currentBids: bidOrdersAccount,
        name: username,
        IGNISBalance: ignis,
    } = infoAccount;

    const askOrdersForThisCard = askOrdersAccount?.filter(order => order.asset === item.asset);
    const bidOrdersForThisCard = bidOrdersAccount?.filter(order => order.asset === item.asset);

    const {
        askOrders: askIgnisOrders,
        askOmnoOrders,
        bidOrders: bidIgnisOrders,
        bidOmnoOrders,
        lastPrice: lastIgnisPrice,
        lastOmnoPrice,
    } = item;

    let askOrders = market === 'IGNIS' ? askIgnisOrders : askOmnoOrders;
    let bidOrders = market === 'IGNIS' ? bidIgnisOrders : bidOmnoOrders;
    let lastPrice = market === 'IGNIS' ? lastIgnisPrice : lastOmnoPrice;
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

    const unconfirmedQuantityQNT = Number(item.unconfirmedQuantityQNT);
    const isBlocked = quantityQNT > unconfirmedQuantityQNT && unconfirmedQuantityQNT === 0;
    const lockedCards = quantityQNT - unconfirmedQuantityQNT;
    const haveCardsInMarket = lockedCards > 0;
    const isSingular = Number(lockedCards) === 1;

    let fixOnlyBuy = onlyBuy;
    if (quantityQNT === 0 && !isMarket) fixOnlyBuy = true;

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
                        src={imgUrl}
                        alt={name}
                        rounded="lg"
                        onClick={() => (haveThisItem ? handleClick({ item: item }) : null)}
                        style={hover ? hoverStyle : initialStyle}
                        onMouseEnter={() => (haveThisItem ? setHover(true) : null)}
                        onMouseLeave={() => (haveThisItem ? setHover(false) : null)}
                        opacity={itemOpacity}
                    />

                    <Stack direction={{ base: 'column', lg: 'row' }} spacing={0}>
                        <Stack direction="column" spacing={0} align={{ base: 'center', lg: 'start' }} w={'100%'}>
                            <Text fontSize={{ base: 'sm', md: 'md', '2xl': 'xl' }} noOfLines={1} fontWeight="bold">
                                {description}
                            </Text>
                            <Text
                                px={2}
                                fontSize="sm"
                                bgColor={getColor(bonus)}
                                rounded="lg"
                                color="white"
                                textTransform={'capitalize'}>
                                {bonus.type} ({getTypeValue(bonus)})
                            </Text>
                            <Stack direction={'row'} w={'100%'} justifyContent={'space-between'} align={'center'}>
                                <Text fontSize="sm" color="green.400">
                                    +{bonus.power} Power
                                </Text>{' '}
                                <Tooltip
                                    label={`You have ${lockedCards} blocked ${
                                        isSingular ? 'card' : 'cards'
                                    } in the market`}
                                    display={haveCardsInMarket ? 'flex' : 'none'}
                                    placement="bottom">
                                    <Flex>
                                        <Text textAlign="end" minH={{ base: '100%', lg: 'auto' }} noOfLines={1}>
                                            <small>Quantity:</small> {quantityQNT}
                                        </Text>
                                        <Center>{haveCardsInMarket && <BiLockAlt size="1rem" color="orange" />}</Center>
                                    </Flex>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </Stack>

                    {isMarket && !fixOnlyBuy && (
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
                                        isDisabled={!haveThisItem}
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
                    {!isMarket && !fixOnlyBuy && (
                        <Box
                            onMouseEnter={() => isBlocked && setHoverButton(true)}
                            onMouseLeave={() => isBlocked && setHoverButton(false)}>
                            {!hoverButton && (
                                <SimpleGrid columns={1} gap={1}>
                                    <ItemButton
                                        text="Send"
                                        onClick={onOpenSend}
                                        isDisabled={isBlocked}
                                        icon={<Image src="/images/icons/send.png" w="15px" />}
                                    />
                                </SimpleGrid>
                            )}
                        </Box>
                    )}
                </SimpleGrid>
            </Center>
            {isOpenAsk && (
                <AskDialog
                    reference={refAsk}
                    isOpen={isOpenAsk}
                    onClose={onCloseAsk}
                    card={item}
                    username={username}
                    askOrders={askOrdersForThisCard}
                    bidOrders={bidOrdersForThisCard}
                    actualAmount={quantityQNT}
                    isItem
                />
            )}
            {isOpenBid && (
                <BidDialog
                    reference={refBid}
                    isOpen={isOpenBid}
                    onClose={onCloseBid}
                    card={item}
                    username={username}
                    ignis={ignis}
                    askOrders={askOrdersForThisCard}
                    bidOrders={bidOrdersForThisCard}
                    actualAmount={quantityQNT}
                    isItem
                />
            )}

            {isOpenSend && (
                <SendDialog
                    isOpen={isOpenSend}
                    onClose={onCloseSend}
                    reference={refSend}
                    card={item}
                    username={username}
                    isItem
                />
            )}
        </Box>
    );
};

export default ItemCard;
