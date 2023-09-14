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
    useColorModeValue,
    useNumberInput,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../../utils/alerts';
import { checkPin, sendBidOrder } from '../../../../utils/walletUtils';
import AskAndBidGrid from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidGrid';
import AskAndBidList from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidList';

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
const BidDialog = ({ reference, isOpen, onClose, card, username, ignis, askOrders = [], bidOrders = [] }) => {
    const toast = useToast();

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [sendingTx, setSendingTx] = useState(false);

    const [selectedItem, setSelectedItem] = useState(''); // selected item in the grid

    const [priceCard, setPriceCard] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const isCurrency = card.assetname === 'GEM' || card.assetname === 'GIFTZ' || card.assetname === 'wETH' || card.assetname === 'MANA';
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
    const userOrders = [...askOrders, ...bidOrders];

    const handlePriceCard = e => {
        e.preventDefault();

        const readValue = Number(e.target.value);

        if (readValue < maxPrice) {
            setPriceCard(e.target.value);
        } else {
            setPriceCard(maxPrice);
        }
    };

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
                inputStep = 0.0001;
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
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: inputStep,
        defaultValue: 0,
        min: 1,
        max: isCurrency ? 999999 : 999,
        precision: inputPrecision,
        value,
        onChange: setValue,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    useEffect(() => {
        const checkNumbers = () => {
            const max = parseFloat(Number(ignis / input.value).toFixed(2));
            const actualPrice = parseFloat(Number(priceCard).toFixed(2));
            if (max === maxPrice) return;
            setMaxPrice(max);

            if (actualPrice > max) {
                setPriceCard(max);
            }
        };

        ignis && input.value && checkNumbers();
    }, [priceCard, ignis, input.value, maxPrice]);

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

    const bgColor = useColorModeValue('', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
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
            if (selectedItem && selectedItem.price < maxPrice) {
                setPriceCard(selectedItem.price);
                setValue(selectedItem.quantity);
                setSelectedItem('');
            }
        };

        checkChange();
    }, [selectedItem, maxPrice]);

    const handleClose = () => {
        setSelectedItem('');
        setPassphrase('');
        setValue(0);
        setPriceCard(0);
        onClose();
    };

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

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
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
                                </Box>
                                <VStack spacing={4} w="100%">
                                    <Box w="100%">
                                        <Text fontWeight="bold" fontSize="xl">
                                            {!isCurrency ? card.name : currencyName}
                                        </Text>
                                        {!isCurrency && (
                                            <Text color="gray">
                                                {card.channel} / {card.rarity}
                                            </Text>
                                        )}
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingGray" id="PricePerCard">
                                            <HStack spacing={0} border="1px" rounded="lg" borderColor={borderColor}>
                                                <Button {...dec} rounded="none" borderLeftRadius="lg">
                                                    -
                                                </Button>
                                                <Input
                                                    {...input}
                                                    rounded="none"
                                                    border="none"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                />
                                                <Button {...inc} rounded="none" borderRightRadius="lg">
                                                    +
                                                </Button>
                                            </HStack>
                                            <FormLabel>Amount of {!isCurrency ? 'cards' : currencyName}</FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingGray" id="PricePerCard">
                                            <InputGroup border="1px" borderColor={borderColor} rounded="lg">
                                                <NumberInput value={priceCard}>
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
                                            <FormLabel>
                                                Price per {!isCurrency ? 'cards' : currencyName} (Max: {maxPrice})
                                            </FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingGray" id="SecurityPIN">
                                            <HStack spacing={4}>
                                                <PinInput
                                                    size="lg"
                                                    placeholder="🔒"
                                                    onComplete={handleCompletePin}
                                                    onChange={handleCompletePin}
                                                    isInvalid={!isValidPin}
                                                    variant="filled"
                                                    mask>
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                    <PinInputField />
                                                </PinInput>
                                            </HStack>
                                            <FormLabel>Security PIN</FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Box w="100%" mt={8}>
                                        <Button
                                            isDisabled={!isValidPin || sendingTx}
                                            bgColor={isValidPin ? '#33B448' : null}
                                            w="100%"
                                            py={6}
                                            onClick={handleSend}>
                                            Buy {isCurrency ? currencyName : card.name}
                                        </Button>
                                    </Box>
                                </VStack>
                                <Box w="50%">
                                    <AskAndBidGrid
                                        columns={1}
                                        askOrders={card.askOrders.slice(0, 3)}
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
