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
    Grid,
    GridItem,
    HStack,
    Image,
    Input,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useColorModeValue,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';

import Hover from 'react-3d-hover';

import { useEffect, useState } from 'react';
import { GIFTZASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../utils/alerts';
import { buyPackWithWETH } from '../../../utils/cardsUtils';
import { checkPin } from '../../../utils/walletUtils';
import { fetchOmnoMarket } from '../../../utils/omno';

/**
 * @name BuyPackDialog
 * @description This component is used to render the buy pack dialog
 * @param {Object} reference - Reference to the dialog
 * @param {Boolean} isOpen - Flag to open/close the dialog
 * @param {Function} onClose - Function to close the dialog
 * @param {Object} infoAccount - Account info
 * @returns {JSX.Element} BuyPackDialog component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 */
const BuyPackDialog = ({ reference, isOpen, onClose, infoAccount }) => {
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [priceInWETH, setpriceInWETH] = useState(0);
    const [marketOffers, setMarketOffers] = useState([]); // list of market offers
    const [totalOnSale, setTotalOnSale] = useState(0); // total packs on sale
    const [sendingTx, setSendingTx] = useState(false);
    const [selectedOffers, setSelectedOffers] = useState([]); // selected offers

    const { name, WETHBalance, IGNISBalance } = infoAccount;

    const toast = useToast();
    const colorText = useColorModeValue('black', 'white');

    const handleClose = () => {
        setIsValidPin(false);
        setPassphrase('');
        setpriceInWETH(0);
        setMarketOffers([]);
        setTotalOnSale(0);
        setSendingTx(false);
        setSelectedOffers([]);
        onClose();
    };

    useEffect(() => {
        const recoverMarketOffers = async () => {
            const offers = await fetchOmnoMarket();
            const wethAsset = offers.filter(item => {
                return (
                    Object.keys(item.give).length === 1 &&
                    Object.keys(item.take).length === 1 &&
                    item.give.asset[GIFTZASSET] &&
                    item.take.asset[WETHASSET]
                );
            });
            setMarketOffers(wethAsset);

            // Calcular el total de paquetes en venta
            const totalOnSale = wethAsset.reduce((total, item) => {
                return total + item.multiplier * item.give.asset[GIFTZASSET];
            }, 0);
            setTotalOnSale(totalOnSale);
        };

        recoverMarketOffers();
    }, []);

    // ------------------------------------------------------------
    // ------------------ E A S Y  C H E C K E R ------------------
    // ------------------------------------------------------------
    const checker = () => {
        if (!isValidPin || !passphrase) {
            errorToast('You must enter a valid pin', toast);
            return false;
        }

        if (!input.value) {
            errorToast('You must enter a valid number of packs', toast);
            return false;
        }

        if (!priceInWETH) {
            errorToast('Error calculating prices', toast);
            return false;
        }

        if (WETHBalance * NQTDIVIDER < priceInWETH) {
            errorToast("You don't have enough funds (wETH)", toast);
            return false;
        }

        if (!IGNISBalance || IGNISBalance < 0.5) {
            errorToast("You don't have enough funds (0.5 IGNIS)", toast);
            return false;
        }

        return true;
    };

    // ------------------------------------------------------------
    // ------------------ SELECT NUMBER OF PACKS ------------------
    // ------------------------------------------------------------
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput(
        {
            step: 1,
            defaultValue: 0,
            min: 0,
            max: totalOnSale,
        }
    );

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    useEffect(() => {
        const calculatePrices = () => {
            // Check amount is filled in the first offer
            if (marketOffers.length === 0) return;
            if (!input.value) return;

            // Calculate price
            let totalPrice = 0;
            let totalPacks = 0;
            // Save id and amount of packs to buy
            const offersToTake = [];
            for (let i = 0; i < marketOffers.length; i++) {
                const offer = marketOffers[i];
                const amount = offer.give.asset[GIFTZASSET];
                const multiplier = offer.multiplier;
                const totalAmount = amount * multiplier;
                const price = offer.take.asset[WETHASSET];

                if (totalPacks + totalAmount > input.value) {
                    const packsToBuy = input.value - totalPacks;
                    totalPrice += packsToBuy * price;

                    offersToTake.push({
                        id: offer.id,
                        amount: packsToBuy,
                        price: packsToBuy * price,
                    });
                    break;
                } else {
                    totalPrice += totalAmount * price;
                    totalPacks += totalAmount;

                    offersToTake.push({
                        id: offer.id,
                        amount: totalAmount,
                        price: totalAmount * price,
                    });
                }

                if (totalPacks >= input.value) break;
            }

            setpriceInWETH(totalPrice);
            setSelectedOffers(offersToTake);
            console.log('🚀 ~ file: BuyPackDialog.js:174 ~ calculatePrices ~ offersToTake:', offersToTake);
        };

        calculatePrices();
    }, [input.value, marketOffers]);
    // ------------------------------------------------------------

    const handleBuyPack = async () => {
        if (!checker()) return;
        let itsOk = false;

        try {
            setSendingTx(true);
            // buy pack with ignis
            const response = await buyPackWithWETH(passphrase, input.value, WETHBalance, selectedOffers, priceInWETH);
            if (response) itsOk = true;
        } catch (error) {
            console.log('🚀 ~ file: BuyPackDialog.js:82 ~ handleBuyPack ~ error', error);
            itsOk = false;
        }

        if (itsOk) {
            okToast('Pack bought successfully', toast);
            handleClose();
        } else {
            errorToast('Error buying pack', toast);
        }
        setSendingTx(false);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    
    const enoughtWETH = WETHBalance !== 0 && WETHBalance >= priceInWETH / NQTDIVIDER;
    const enoughtIGNIS = IGNISBalance > 0.5;
    const canBuy = enoughtWETH && enoughtIGNIS;
    const isDisabled = !isValidPin || input.value > totalOnSale || input.value === '0' || !canBuy;

    return (
        <>
            <AlertDialog
                size="3xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={handleClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay bgColor="blackAlpha.800" />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">BUY A PACK OF CARDS</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={4}>
                        <Grid templateColumns="repeat(2, 1fr)">
                            <GridItem w="100%">
                                <Center w="100%">
                                    <Hover scale={1.15} perspective={200}>
                                        <Image src="/images/cardPacks/cardPack.png" alt="Card Pack" maxH="25rem" />
                                    </Hover>
                                </Center>
                            </GridItem>

                            <Center>
                                <GridItem>
                                    <Box>
                                        <Text textAlign="center" mb={2}>
                                            Payment method
                                        </Text>
                                        <Center w="100%">
                                            <Stack direction="row" w="100%">
                                                <Box
                                                    textAlign="center"
                                                    w="100%"
                                                    bgColor="blackAlpha.400"
                                                    px={4}
                                                    py={2}
                                                    fontWeight="bold"
                                                    rounded="lg">
                                                    wETH
                                                </Box>
                                            </Stack>
                                        </Center>
                                    </Box>
                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Number of packs
                                        </Text>
                                        <Center>
                                            <HStack spacing={0} border="1px" rounded="lg" borderColor="whiteAlpha.200">
                                                <Button {...dec} rounded="none" borderLeftRadius="lg" color={colorText}>
                                                    -
                                                </Button>
                                                <Input
                                                    {...input}
                                                    rounded="none"
                                                    border="none"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                    disabled
                                                />
                                                <Button
                                                    {...inc}
                                                    rounded="none"
                                                    borderRightRadius="lg"
                                                    color={colorText}>
                                                    +
                                                </Button>
                                            </HStack>
                                        </Center>
                                        <Center>
                                            <Text
                                                fontSize="xs"
                                                color={useColorModeValue('blackAlpha.600', 'whiteAlpha.600')}>
                                                {totalOnSale} packs availables
                                            </Text>
                                        </Center>
                                    </Box>

                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Total price
                                        </Text>
                                        <Center>
                                            <Text fontWeight="bold" fontSize="2xl">
                                                {priceInWETH / NQTDIVIDER} wETH
                                            </Text>
                                        </Center>
                                    </Box>

                                    {totalOnSale === 0 && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold">
                                            There are no packs for sale.
                                        </Text>
                                    )}

                                    {!enoughtWETH && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold">
                                            You don't have enough wETH
                                        </Text>
                                    )}

                                    {!enoughtIGNIS && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold">
                                            You don't have enough IGNIS (0.5 IGNIS)
                                        </Text>
                                    )}

                                    <Center>
                                        <Box py={2} mt={2}>
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
                                        </Box>
                                    </Center>

                                    <Box w="100%" mt={2}>
                                        <Button
                                            isDisabled={isDisabled || sendingTx}
                                            bgColor={!isDisabled ? '#F18800' : null}
                                            w="100%"
                                            py={6}
                                            onClick={handleBuyPack}>
                                            Submit
                                        </Button>
                                    </Box>
                                </GridItem>
                            </Center>
                        </Grid>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BuyPackDialog;
