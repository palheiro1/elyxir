import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Center,
    Collapse,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    NumberInput,
    NumberInputField,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useBreakpointValue,
    useNumberInput,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../../utils/alerts';
import { checkPin, roundNumberWithMaxDecimals, sendBidOrder } from '../../../../utils/walletUtils';
import AskAndBidGrid from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidGrid';
import AskAndBidList from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidList';
import { getUser } from '../../../../utils/storage';

/**
 * @name BidDialog
 * @description BID dialog component - used to bid for a card
 * @dev Called by TradeDialog
 * @param {Object} reference - reference to the dialog
 * @param {Boolean} isOpen - dialog open flag
 * @param {Function} onClose - dialog close function
 * @param {Object} card - card to bid for (or currency assets)
 * @param {String} username - user's name
 * @param {Number} ignis - user's ignis balance
 * @returns {JSX.Element} - BidDialog component
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const BidDialog = ({
    reference,
    isOpen,
    onClose,
    card,
    username,
    ignis,
    askOrders = [],
    bidOrders = [],
    actualAmount = 0,
}) => {
    const toast = useToast();

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [sendingTx, setSendingTx] = useState(false);

    const [selectedItem, setSelectedItem] = useState(''); // selected item in the grid

    const [priceCard, setPriceCard] = useState(0);
    //const [maxPrice, setMaxPrice] = useState(0);

    const accountRS = getUser(username).accountRs;

    const isCurrency =
        card.assetname === 'GEM' ||
        card.assetname === 'GIFTZ' ||
        card.assetname === 'wETH' ||
        card.assetname === 'MANA';
    const currencyName = isCurrency ? card.assetname : '';
    let currencyImg;
    if (currencyName === 'GEM') {
        currencyImg = '/images/currency/gem.png';
    } else if (currencyName === 'GIFTZ') {
        currencyImg = '/images/currency/giftz.png';
    } else if (currencyName === 'wETH') {
        currencyImg = '/images/currency/weth.png';
    } else if (currencyName === 'MANA') {
        currencyImg = '/images/currency/mana.png';
    }

    // Mix ask with bid orders
    let userOrders = [...askOrders, ...bidOrders];
    // Filter only my orders
    userOrders = userOrders.filter(order => order.accountRS === accountRS);

    // ------------------ Quantity ------------------
    const handlePriceCard = e => {
        e.preventDefault();
        const value = parseFloat(e.target.value);

        if (value <= 0 || isNaN(value)) {
            setPriceCard(0);
            return;
        }

        setPriceCard(value);
    };
    // -----------------------------------------------

    let inputStep = 1,
        inputPrecision = 0;

    if (isCurrency) {
        switch (currencyName) {
            case 'GEM':
                inputStep = 0.01;
                inputPrecision = 2;
                break;
            case 'GIFTZ':
                inputStep = 1;
                inputPrecision = 0;
                break;
            case 'wETH':
                inputStep = 0.000001;
                inputPrecision = 6;
                break;
            case 'MANA':
                inputStep = 0.01;
                inputPrecision = 2;
                break;
            default:
                inputStep = 1;
                inputPrecision = 0;
                break;
        }
    }

    const [value, setValue] = useState(0);

    const handleChange = value => {
        if (value < 0) {
            setValue(0);
            return;
        }
        setValue(value);
    };

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: inputStep,
        defaultValue: 0,
        min: inputStep,
        max: isCurrency ? 999999 : 999,
        precision: inputPrecision,
        value,
        onChange: handleChange,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    // useEffect(() => {
    //     const checkNumbers = () => {
    //         const max = parseFloat(Number(ignis / input.value).toFixed(2));
    //         const actualPrice = parseFloat(Number(priceCard).toFixed(2));
    //         if (max === maxPrice) return;
    //         setMaxPrice(max);

    //         if (actualPrice > max) {
    //             setPriceCard(max);
    //         }
    //     };

    //     ignis && input.value && checkNumbers();
    // }, [priceCard, ignis, input.value, maxPrice]);

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleSend = async () => {
        try {
            setSendingTx(true);
            const value = Number(input.value);
            let quantity;
            if (isCurrency) {
                if (currencyName === 'GIFTZ') {
                    quantity = value;
                } else {
                    quantity = value * NQTDIVIDER;
                }
            } else {
                quantity = value;
            }
            // const quantity = !isCurrency ? value : value * NQTDIVIDER;
            const response = await sendBidOrder({
                asset: card.asset,
                quantity: quantity,
                price: priceCard * NQTDIVIDER,
                passPhrase: passphrase,
            });

            if (response) {
                okToast('Bid order sent successfully', toast);
                onClose();
            } else {
                errorToast('Error sending bid order', toast);
            }
        } catch (error) {
            errorToast('Error sending bid order', toast);
        } finally {
            setSendingTx(false);
        }
    };

    const bgColor = '#d86471';
    const borderColor = '#f39d54';
    const filledColor = '#f79c27';
    const isCentered = useBreakpointValue(
        {
            base: false,
            md: true,
        },
        {
            fallback: false,
        }
    );

    useEffect(() => {
        const checkChange = () => {
            if (selectedItem) {
                setPriceCard(selectedItem.price);
                setValue(selectedItem.quantity);
                setSelectedItem('');
            }
        };

        checkChange();
    }, [selectedItem]);

    const handleClose = () => {
        setSelectedItem('');
        setPassphrase('');
        setValue(0);
        setPriceCard(0);
        onClose();
    };

    let finalActualAmount = actualAmount;
    if (isCurrency) {
        if (currencyName === 'GIFTZ') {
            finalActualAmount = actualAmount;
        } else {
            finalActualAmount = (actualAmount / NQTDIVIDER).toFixed(2);
        }
    }

    return (
        <>
            <AlertDialog
                size="6xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={handleClose}
                isOpen={isOpen}
                isCentered={isCentered}>
                <AlertDialogOverlay />

                <AlertDialogContent
                    bgColor={bgColor}
                    border="1px"
                    borderColor={borderColor}
                    shadow="dark-lg"
                    color="white">
                    <AlertDialogHeader textAlign="center">
                        <Center>
                            <Text>BUY {!isCurrency ? 'CARDS' : currencyName} </Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack>
                            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%">
                                <Box mx={2}>
                                    <Center>
                                        <Image
                                            minW="22rem"
                                            shadow={!isCurrency && 'lg'}
                                            rounded={!isCurrency && 'md'}
                                            src={!isCurrency ? card.cardImgUrl : currencyImg}
                                            maxH="30rem"
                                        />
                                    </Center>
                                    <Text fontSize="sm" textAlign="center" my={2}>
                                        You have {finalActualAmount} {isCurrency ? currencyName : card.name}
                                    </Text>
                                </Box>
                                <VStack spacing={4} w="100%">
                                    <Box w="100%" mb={2}>
                                        {!isCurrency && (
                                            <>
                                                <Text fontWeight="bold" fontSize="xl">
                                                    {card.name}
                                                </Text>
                                                <Text>
                                                    {card.channel} / {card.rarity}
                                                </Text>
                                                <Text fontSize={'sm'}>Asset: {card.asset}</Text>
                                            </>
                                        )}
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingModalTransparent" id="PricePerCard">
                                            <HStack spacing={0} border="1px" rounded="lg" borderColor={borderColor}>
                                                <Button
                                                    {...dec}
                                                    rounded="none"
                                                    borderLeftRadius="lg"
                                                    color="white"
                                                    bgColor={filledColor}>
                                                    -
                                                </Button>
                                                <Input
                                                    {...input}
                                                    rounded="none"
                                                    border="none"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                    value={roundNumberWithMaxDecimals(parseFloat(input.value), 8)}
                                                />
                                                <Button
                                                    {...inc}
                                                    rounded="none"
                                                    color="white"
                                                    borderRightRadius="lg"
                                                    bgColor={filledColor}>
                                                    +
                                                </Button>
                                            </HStack>
                                            <FormLabel>Amount of {!isCurrency ? 'cards' : currencyName}</FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingModalTransparent" id="PricePerCard">
                                            <InputGroup border="1px" borderColor={borderColor} rounded="lg">
                                                <NumberInput value={priceCard} precision={2}>
                                                    <NumberInputField
                                                        rounded="none"
                                                        border="none"
                                                        textAlign="center"
                                                        fontWeight="bold"
                                                        onChange={handlePriceCard}
                                                    />
                                                </NumberInput>
                                                <InputRightAddon
                                                    fontSize="sm"
                                                    border="none"
                                                    children="IGNIS"
                                                    bgColor="transparent"
                                                    rounded="none"
                                                    borderLeftRadius="lg"
                                                />
                                            </InputGroup>
                                            <FormLabel>Price per {!isCurrency ? 'cards' : currencyName}</FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Collapse in={priceCard > 0 && input.value > 0}>
                                        <Box pt={4}>
                                            <FormControl variant="floatingModalTransparent" id="PricePerCard">
                                                <InputGroup border="1px" borderColor={borderColor} rounded="lg">
                                                    <NumberInput isReadOnly value={roundNumberWithMaxDecimals(priceCard * input.value, 8)}>
                                                        <NumberInputField
                                                            rounded="none"
                                                            border="none"
                                                            textAlign="center"
                                                            fontWeight="bold"
                                                        />
                                                    </NumberInput>
                                                    <InputRightAddon
                                                        fontSize="sm"
                                                        border="none"
                                                        children="IGNIS"
                                                        bgColor="transparent"
                                                        rounded="none"
                                                        borderLeftRadius="lg"
                                                    />
                                                </InputGroup>
                                                <FormLabel>Total amount</FormLabel>
                                            </FormControl>
                                        </Box>
                                    </Collapse>
                                    <Box py={2}>
                                        <FormControl variant="floatingModalTransparent" id="SecurityPIN">
                                            <HStack spacing={4}>
                                                <PinInput
                                                    size="lg"
                                                    onComplete={handleCompletePin}
                                                    onChange={handleCompletePin}
                                                    isInvalid={!isValidPin}
                                                    variant="filled"
                                                    mask>
                                                    <PinInputField
                                                        bgColor={'whiteAlpha.200'}
                                                        _hover={{ bgColor: 'whiteAlpha.400' }}
                                                    />
                                                    <PinInputField
                                                        bgColor={'whiteAlpha.200'}
                                                        _hover={{ bgColor: 'whiteAlpha.400' }}
                                                    />
                                                    <PinInputField
                                                        bgColor={'whiteAlpha.200'}
                                                        _hover={{ bgColor: 'whiteAlpha.400' }}
                                                    />
                                                    <PinInputField
                                                        bgColor={'whiteAlpha.200'}
                                                        _hover={{ bgColor: 'whiteAlpha.400' }}
                                                    />
                                                </PinInput>
                                            </HStack>
                                            <FormLabel>Security PIN</FormLabel>
                                        </FormControl>
                                    </Box>

                                    <Collapse in={priceCard * input.value > ignis}>
                                        <Text textAlign="center" fontWeight={'bold'}>
                                            You don't have enough IGNIS to buy this amount of{' '}
                                            {!isCurrency ? 'cards' : currencyName}
                                        </Text>
                                    </Collapse>

                                    <Box w="100%" mt={8}>
                                        <Button
                                            isDisabled={!isValidPin || sendingTx || priceCard * input.value > ignis}
                                            bgColor={filledColor}
                                            fontWeight={'black'}
                                            w="100%"
                                            color="white"
                                            py={6}
                                            onClick={handleSend}>
                                            BUY {isCurrency ? currencyName : card.name}
                                        </Button>
                                    </Box>
                                </VStack>
                                <Box w="50%">
                                    <AskAndBidGrid
                                        columns={1}
                                        askOrders={card.askOrders.slice(0, 3).reverse()}
                                        bidOrders={card.bidOrders.slice(0, 3)}
                                        onlyOneAsset={true}
                                        setSelectedItem={setSelectedItem}
                                    />
                                </Box>
                            </Stack>

                            <Box w="100%">
                                <AskAndBidList
                                    orders={userOrders}
                                    name={isCurrency ? currencyName : card.name}
                                    canDelete={true}
                                    username={username}
                                />
                            </Box>
                        </VStack>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BidDialog;
