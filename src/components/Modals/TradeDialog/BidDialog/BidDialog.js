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
    PinInput,
    PinInputField,
    Text,
    useNumberInput,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NQTDIVIDER } from '../../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../../utils/alerts';
import { checkPin, sendBidOrder } from '../../../../utils/walletUtils';
import AskAndBidGrid from '../../../Pages/MarketPage/TradesAndOrders/AskAndBids/AskAndBidGrid';

const BidDialog = ({ reference, isOpen, onClose, card, username, ignis }) => {
    const toast = useToast();

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [passphrase, setPassphrase] = useState('');

    const [priceCard, setPriceCard] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const handlePriceCard = e => {
        e.preventDefault();
		
		const readValue = Number(e.target.value);
		console.log("🚀 ~ file: BidDialog.js:46 ~ handlePriceCard ~ readValue", readValue)
		console.log("🚀 ~ file: BidDialog.js:49 ~ handlePriceCard ~ maxPrice", maxPrice)
		console.log("isGreaterThan", readValue < maxPrice)

		if(readValue < maxPrice) {
        	setPriceCard(e.target.value);
		} else {
			setPriceCard(maxPrice);
		}
    };

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: 10,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    useEffect(() => {
		const checkNumbers = () => {
			const max = parseFloat(Number(ignis / input.value).toFixed(2));
			const actualPrice = parseFloat(Number(priceCard).toFixed(2));
			console.log("useEffect")
			if(max === maxPrice) return;
			setMaxPrice(max);
	
			console.log(actualPrice, max , actualPrice > max)
			if(actualPrice > max) {
				console.log("Actualizo desde useEffect")
				setPriceCard(max);
			}
		}
		
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
        const response = await sendBidOrder({
            asset: card.asset,
            quantity: input.value,
            price: priceCard * NQTDIVIDER,
            passPhrase: passphrase,
        });

        if (response) {
            okToast('Bid order sent successfully', toast);
            onClose();
        } else {
            errorToast('Error sending bid order', toast);
        }
    };

    return (
        <>
            <AlertDialog
                size="6xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent
                    bgColor="#1D1D1D"
                    border="1px"
                    borderColor="whiteAlpha.400"
                    shadow="dark-lg">
                    <AlertDialogHeader textAlign="center" color="white">
                        <Center>
                            <Text>BID FOR CARD</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack>
                            <HStack spacing={4}>
                                <Box minW="50%">
                                    <Image src={card.cardImgUrl} maxH="25rem" />
                                </Box>
                                <VStack spacing={4}>
                                    <Box w="100%">
                                        <Text color="white" fontWeight="bold" fontSize="xl">
                                            {card.name}
                                        </Text>
                                        <Text color="gray">
                                            {card.channel} / {card.rarity}
                                        </Text>
                                    </Box>
                                    <Box py={2}>
                                        <Text color="white">Amount of cards</Text>
                                        <HStack
                                            spacing={0}
                                            border="1px"
                                            rounded="lg"
                                            borderColor="whiteAlpha.200">
                                            <Button {...dec} rounded="none" borderLeftRadius="lg">
                                                -
                                            </Button>
                                            <Input
                                                {...input}
                                                rounded="none"
                                                border="none"
                                                color="white"
                                                textAlign="center"
                                                fontWeight="bold"
                                                disabled
                                            />
                                            <Button {...inc} rounded="none" borderRightRadius="lg">
                                                +
                                            </Button>
                                        </HStack>
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingGray" id="PricePerCard">
                                            <InputGroup
                                                border="1px"
                                                borderColor="whiteAlpha.300"
                                                rounded="lg">
                                                <Input
                                                    value={priceCard}
                                                    rounded="none"
                                                    border="none"
                                                    color="white"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                    onChange={handlePriceCard}
                                                />
                                                <InputRightAddon
                                                    fontSize="sm"
                                                    border="none"
                                                    children="IGNIS"
                                                    color="white"
                                                    bgColor="transparent"
                                                    rounded="none"
                                                    borderLeftRadius="lg"
                                                />
                                            </InputGroup>
                                            <FormLabel>Price per card (Max: {maxPrice})</FormLabel>
                                        </FormControl>
                                    </Box>
                                    <Box py={2}>
                                        <FormControl variant="floatingGray" id="SecurityPIN">
                                            <HStack spacing={4}>
                                                <PinInput
                                                    size="lg"
                                                    placeholder="🔒"
                                                    onComplete={handleCompletePin}
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
                                            bgColor="blue.700"
                                            w="100%"
                                            py={6}
                                            onClick={handleSend}>
                                            Submit
                                        </Button>
                                    </Box>
                                </VStack>
                            </HStack>
                            <Box w="100%">
                                <AskAndBidGrid
                                    askOrders={card.askOrders.slice(0, 3)}
                                    bidOrders={card.bidOrders.slice(0, 3)}
                                    onlyText={true}
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

export default BidDialog;
