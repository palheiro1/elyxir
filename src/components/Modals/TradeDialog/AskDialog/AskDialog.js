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

/**
 * @name AskDialog - Ask dialog component
 * @description This component is the ask dialog component
 * @dev This component is used in the TradeDialog component
 * @param {Object} reference - Reference to the dialog
 * @param {Boolean} isOpen - Flag to open the dialog
 * @param {Function} onClose - Function to close the dialog
 * @param {Object} card - Card object (or GEM)
 * @param {String} username - Username
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0.0
 */
const AskDialog = ({ reference, isOpen, onClose, card, username }) => {
    const toast = useToast();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [passphrase, setPassphrase] = useState('');

    const isGem = card.assetname === 'GEM';
    const gemImg = './images/gems.svg';
    const maxCards = isGem ? card.quantityQNT / NQTDIVIDER : card.quantityQNT;

    const [selectedItem, setSelectedItem] = useState(''); // selected item in the grid

    const [priceCard, setPriceCard] = useState(0);
    const handlePriceCard = e => {
        e.preventDefault();
        setPriceCard(e.target.value);
    };

    const [value, setValue] = useState(0);
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: isGem ? 0.01 : 1,
        defaultValue: 0,
        min: 1,
        max: maxCards,
        precision: isGem ? 2 : 0,
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
        const value = Number(input.value);
        const quantity = !isGem ? value : value * NQTDIVIDER;
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
            if (selectedItem) {
                setPriceCard(selectedItem.price);
                setValue(selectedItem.quantity);
            }
        };

        checkChange();
    }, [selectedItem]);

    const handleClose = () => {
        setSelectedItem('');
        setValue(0);
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
                            <Text>ASK FOR {!isGem ? 'CARD' : 'GEM'}</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack>
                            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                                <Box minW="50%">
                                    <Image src={!isGem ? card.cardImgUrl : gemImg} maxH="25rem" />
                                </Box>
                                <VStack spacing={4}>
                                    <Box w="100%">
                                        <Text fontWeight="bold" fontSize="xl">
                                            {!isGem ? card.name : 'GEM'}
                                        </Text>
                                        {!isGem && (
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
                                            <FormLabel>Amount of {!isGem ? 'cards' : 'GEMs'} </FormLabel>
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
                                            <FormLabel>Price per {!isGem ? 'card' : 'GEM'}</FormLabel>
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
                                            isDisabled={!isValidPin}
                                            bgColor={isValidPin ? '#F18800' : null}
                                            w="100%"
                                            py={6}
                                            onClick={handleSend}>
                                            Submit
                                        </Button>
                                    </Box>
                                </VStack>
                            </Stack>
                            <Box w="100%">
                                <AskAndBidGrid
                                    askOrders={card.askOrders}
                                    bidOrders={card.bidOrders}
                                    onlyOneAsset={true}
                                    setSelectedItem={setSelectedItem}
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
