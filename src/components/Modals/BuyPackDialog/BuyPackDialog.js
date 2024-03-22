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
    Select,
    Text,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { GIFTZASSET, NQTDIVIDER, WETHASSET } from '../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../utils/alerts';
import { buyPackWithWETH } from '../../../utils/cardsUtils';
import { checkPin } from '../../../utils/walletUtils';
import { fetchGiftzMarket } from '../../../utils/omno';
import { Animated } from 'react-animated-css';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { getEthPrice, getMaticPriceWithEth } from '../../../services/coingecko/utils';
import { getEthDepositAddressFor1155 } from '../../../services/Ardor/ardorInterface';

import './BuyPackDialog.css';

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
    const [priceInWETH, setPriceInWETH] = useState(0);
    const [marketOffers, setMarketOffers] = useState([]); // list of market offers
    const [totalOnSale, setTotalOnSale] = useState(0); // total packs on sale
    const [sendingTx, setSendingTx] = useState(false);
    const [selectedOffers, setSelectedOffers] = useState([]); // selected offers

    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [maticPrice, setMaticPrice] = useState(0);
    const [priceInMatic, setPriceInMatic] = useState(0);
    const [bridgeAddress, setBridgeAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('wETH');
    const [ethPrice, setEthPrice] = useState(0);

    const { name, WETHRealBalance: WETHBalance, IGNISBalance, accountRs } = infoAccount;

    const toast = useToast();
    const colorText = 'white';

    const handleClose = () => {
        setIsValidPin(false);
        setPassphrase('');
        setPriceInWETH(0);
        setMarketOffers([]);
        setTotalOnSale(0);
        setSendingTx(false);
        setSelectedOffers([]);
        setNeedReload(true);
        onClose();
    };

    useEffect(() => {
        const recoverMarketOffers = async () => {
            try {
                setIsLoading(true);
                setNeedReload(false);
                const [{ wethAsset, totalOnSale }, auxBridgeAddress] = await Promise.all([
                    fetchGiftzMarket(),
                    getEthDepositAddressFor1155(accountRs),
                ]);
                setBridgeAddress(!auxBridgeAddress ? null : auxBridgeAddress);

                setMarketOffers(wethAsset);
                setTotalOnSale(totalOnSale);

                getMaticPriceWithEth()
                    .then(maticPrice => {
                        setMaticPrice(maticPrice);
                    })
                    .catch(error => {
                        console.log('🚀 ~ recoverMarketOffers ~ getMaticPriceWithEth ~ error:', error);
                    });

                getEthPrice()
                    .then(ethPrice => {
                        setEthPrice(ethPrice);
                    })
                    .catch(error => {
                        console.log('🚀 ~ recoverMarketOffers ~ getEthPrice ~ error:', error);
                    });
            } catch (error) {
                console.log('🚀 ~ recoverMarketOffers ~ error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        needReload && accountRs && recoverMarketOffers();
    }, [needReload, accountRs]);

    // ------------------------------------------------------------
    // ------------------ E A S Y  C H E C K E R ------------------
    // ------------------------------------------------------------
    const checker = () => {
        if (!isValidPin || !passphrase) {
            errorToast('You must enter a valid pin', toast);
            return false;
        }

        if (!input.value) {
            errorToast('You must enter a valid number of GIFTZ', toast);
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
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 0,
        min: 0,
        max: totalOnSale,
    });

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

            setPriceInWETH(totalPrice);
            setSelectedOffers(offersToTake);
            const realPriceEth = totalPrice / NQTDIVIDER;
            setPriceInMatic(((realPriceEth / maticPrice) + 1).toFixed(0));
        };

        calculatePrices();
    }, [input.value, marketOffers, maticPrice]);
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
            console.error('🚀 ~ file: BuyPackDialog.js:82 ~ handleBuyPack ~ error', error);
            itsOk = false;
        }

        if (itsOk) {
            okToast('GIFTZ bought successfully', toast);
            handleClose();
        } else {
            errorToast('Error buying GIFTZ', toast);
        }
        setSendingTx(false);
        setNeedReload(true);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const bgColor = '#371328';

    const enoughtWETH = WETHBalance !== 0 && WETHBalance >= priceInWETH / NQTDIVIDER;
    const enoughtIGNIS = IGNISBalance > 0.5;
    const canBuy = enoughtWETH && enoughtIGNIS;
    const correctNumberInput = input.value > 0 && input.value <= totalOnSale && input.value !== '0';
    const isDisabled = !isValidPin || !correctNumberInput || !canBuy;

    const randomTime = () => {
        return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    };

    return (
        <>
            <AlertDialog
                size="3xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={handleClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay bgColor="blackAlpha.500" />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor="#9f3772" shadow="dark-lg" color="white">
                    <AlertDialogHeader textAlign="center">BUY A CARD PACK</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={4}>
                        <Grid templateColumns="repeat(2, 1fr)">
                            <GridItem w="100%">
                                <Center w="100%">
                                    <Animated animationIn="shake" animationInDelay={randomTime()} isVisible={true}>
                                        <Image
                                            src="/images/cardPacks/BuyPackExpendedora.png"
                                            alt="Card Pack"
                                            maxH="30rem"
                                        />
                                    </Animated>
                                </Center>
                            </GridItem>

                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <Center>
                                    <GridItem>
                                        <Box>
                                            <Text textAlign="center" mb={2}>
                                                Payment method
                                            </Text>
                                            <Center w="100%">
                                                <Select
                                                    border="1px solid #9f3772"
                                                    textAlign="center"
                                                    w="100%"
                                                    bgColor="blackAlpha.400"
                                                    fontWeight="bold"
                                                    rounded="lg"
                                                    onChange={e => setPaymentMethod(e.target.value)}>
                                                    <option
                                                        value="wETH"
                                                        style={{
                                                            backgroundColor: '#6b254d',
                                                            borderRadius: '1rem',
                                                        }}>
                                                        wETH
                                                    </option>
                                                    {bridgeAddress && (
                                                        <option
                                                            value="CreditCard"
                                                            style={{
                                                                backgroundColor: '#6b254d',
                                                                borderRadius: '1rem',
                                                            }}>
                                                            Credit Card
                                                        </option>
                                                    )}
                                                </Select>
                                            </Center>
                                            <Center>
                                                <Text fontSize="xs" color={'whiteAlpha.600'}>
                                                    Select between wETH or credit card.
                                                </Text>
                                            </Center>
                                        </Box>
                                        <Box mt={6}>
                                            <Text textAlign="center" my={2}>
                                                Number of GIFTZ
                                            </Text>
                                            <Center>
                                                <HStack spacing={0} border="1px" rounded="lg" borderColor="#9f3772">
                                                    <Button
                                                        {...dec}
                                                        rounded="none"
                                                        borderLeftRadius="lg"
                                                        color={colorText}
                                                        _hover={{ bgColor: '#9f3772' }}
                                                        bgColor={'#6b254d'}>
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
                                                        bgColor={'#6b254d'}
                                                        rounded="none"
                                                        borderRightRadius="lg"
                                                        _hover={{ bgColor: '#9f3772' }}
                                                        color={colorText}>
                                                        +
                                                    </Button>
                                                </HStack>
                                            </Center>
                                            {paymentMethod === 'CreditCard' && (
                                                <>
                                                    <Text fontSize="xs" color={'whiteAlpha.600'} textAlign={'center'}>
                                                        Fees are applied by our payment gateway.
                                                    </Text>

                                                    <Text fontSize="xs" color={'whiteAlpha.600'} textAlign={'center'}>
                                                        A small purchase will incur higher fees.
                                                    </Text>

                                                    <Text fontSize="xs" color={'whiteAlpha.600'} textAlign={'center'}>
                                                        Simulation: 1 GIFTZ, fee = 37% | 25 GIFTZ, fee = 5.5%
                                                    </Text>
                                                </>
                                            )}
                                            {paymentMethod === 'wETH' && (
                                                <Center>
                                                    <Text fontSize="xs" color={'whiteAlpha.600'}>
                                                        {totalOnSale} GIFTZ availables
                                                    </Text>
                                                </Center>
                                            )}
                                        </Box>
                                        {paymentMethod === 'wETH' && (
                                            <>
                                                <Box mt={6}>
                                                    <Text textAlign="center" my={2}>
                                                        Total price
                                                    </Text>
                                                    <Center>
                                                        <Text fontWeight="bold" fontSize="2xl">
                                                            {priceInWETH / NQTDIVIDER} wETH
                                                        </Text>
                                                    </Center>
                                                    <Center>
                                                        <Text fontSize="xs" color={'whiteAlpha.600'}>
                                                            ($ {(ethPrice * (priceInWETH / NQTDIVIDER)).toFixed(2)})
                                                        </Text>
                                                    </Center>
                                                </Box>

                                                {totalOnSale === 0 && (
                                                    <Text textAlign="center" color="#9f3772" fontWeight="bold">
                                                        There are no GIFTZ left in the machine. You can wait for it to
                                                        refill or buy them on the secondary market.
                                                    </Text>
                                                )}

                                                {!enoughtWETH && (
                                                    <Text textAlign="center" color="#9f3772" fontWeight="bold">
                                                        You don't have enough wETH
                                                    </Text>
                                                )}

                                                {!enoughtIGNIS && (
                                                    <Text textAlign="center" color="#9f3772" fontWeight="bold">
                                                        You don't have enough IGNIS (0.5 IGNIS)
                                                    </Text>
                                                )}

                                                <Center>
                                                    <Box py={2} mt={2}>
                                                        <HStack spacing={4}>
                                                            <PinInput
                                                                size="lg"
                                                                onComplete={handleCompletePin}
                                                                onChange={handleCompletePin}
                                                                isInvalid={!isValidPin}
                                                                variant="filled"
                                                                mask>
                                                                <PinInputField bgColor={'#6b254d'} />
                                                                <PinInputField bgColor={'#6b254d'} />
                                                                <PinInputField bgColor={'#6b254d'} />
                                                                <PinInputField bgColor={'#6b254d'} />
                                                            </PinInput>
                                                        </HStack>
                                                    </Box>
                                                </Center>

                                                <Box w="100%" mt={2}>
                                                    <Button
                                                        color="white"
                                                        isDisabled={isDisabled || sendingTx}
                                                        bgColor={'#6b254d'}
                                                        fontWeight={'black'}
                                                        _hover={{ bgColor: '#9f3772' }}
                                                        w="100%"
                                                        py={6}
                                                        onClick={handleBuyPack}>
                                                        SUBMIT
                                                    </Button>
                                                </Box>
                                            </>
                                        )}

                                        {paymentMethod === 'CreditCard' && (
                                            <Box w="100%" mt={8}>
                                                <CrossmintPayButton
                                                    disabled={!correctNumberInput}
                                                    collectionId="682b163e-c8c5-4704-91d2-fe9c20dbf969"
                                                    projectId="df884160-8b39-4fc9-960d-0a35094cc158"
                                                    mintConfig={{
                                                        totalPrice: priceInMatic.toString(),
                                                        amount: input.value.toString(),
                                                    }}
                                                    mintTo={bridgeAddress.toString()}
                                                    paymentMethod="fiat"
                                                    className="xmint-btn"
                                                />
                                            </Box>
                                        )}
                                    </GridItem>
                                </Center>
                            )}
                        </Grid>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BuyPackDialog;
