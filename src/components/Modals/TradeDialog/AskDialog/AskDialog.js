import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
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
import { checkPin, sendAskOrder } from '../../../../utils/walletUtils';
import AskAndBidGrid from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidGrid';
import AskAndBidList from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidList';

/**
 * @name AskDialog - Ask dialog component
 * @description This component is the ask dialog component
 * @dev This component is used in the TradeDialog component
 * @param {Object} reference - Reference to the dialog
 * @param {Boolean} isOpen - Flag to open the dialog
 * @param {Function} onClose - Function to close the dialog
 * @param {Object} card - Card object (or currency assets)
 * @param {String} username - Username
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const AskDialog = ({ reference, isOpen, onClose, card, username, askOrders = [], bidOrders = [] }) => {
    const toast = useToast();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [sendingTx, setSendingTx] = useState(false);

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

    let maxCards = Number(card.unconfirmedQuantityQNT);

    if (isCurrency && currencyName !== 'GIFTZ') {
        maxCards = Number(card.unconfirmedQuantityQNT) / NQTDIVIDER;
    }

    // Mix ask with bid orders
    const userOrders = [...askOrders, ...bidOrders];

    const [selectedItem, setSelectedItem] = useState(''); // selected item in the grid

    const [priceCard, setPriceCard] = useState(0);
    const handlePriceCard = e => {
        e.preventDefault();
        setPriceCard(e.target.value);
    };

    const [value, setValue] = useState(0);

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

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: inputStep,
        defaultValue: 0,
        min: currencyName === "wETH" ? 0.000001 : 1,
        max: maxCards,
        precision: inputPrecision,
        value: value,
        onChange: setValue,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

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
                if(currencyName === 'GIFTZ') {
                    quantity = value;
                } else {
                    quantity = value * NQTDIVIDER;
                }
            } else {
                quantity = value;
            }

            // const quantity = !isCurrency ? value : value * NQTDIVIDER;
            const response = await sendAskOrder({
                asset: card.asset,
                quantity: quantity,
                price: priceCard * NQTDIVIDER,
                passPhrase: passphrase,
            });

            if (response) {
                okToast('Ask order sent successfully', toast);
                onClose();
            } else {
                errorToast('Error sending ask order', toast);
            }
        } catch (error) {
            errorToast('Error sending ask order', toast);
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
            if (selectedItem && selectedItem.quantity <= maxCards) {
                setPriceCard(selectedItem.price);
                setValue(selectedItem.quantity);
            }
            if (selectedItem) setSelectedItem('');
        };

        checkChange();
    }, [selectedItem, maxCards]);

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
                            <Text>SELL {!isCurrency ? 'CARDS' : currencyName}</Text>
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
                                            <FormLabel>Amount of {!isCurrency ? 'cards' : currencyName} </FormLabel>
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
                                            <FormLabel>Price per {!isCurrency ? 'card' : currencyName}</FormLabel>
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
                                            isDisabled={!isValidPin || sendingTx || value === 0 || priceCard === 0 || card.unconfirmedQuantityQNT < value}
                                            bgColor={isValidPin ? '#F18800' : null}
                                            w="100%"
                                            py={6}
                                            onClick={handleSend}>
                                            Sell {isCurrency ? currencyName : card.name}
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

                    <AlertDialogFooter></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AskDialog;
