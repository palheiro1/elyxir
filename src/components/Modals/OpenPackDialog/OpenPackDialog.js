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
    Text,
    useColorModeValue,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';

import Hover from 'react-3d-hover';

import { useEffect, useState } from 'react';
import { PACKPRICE } from '../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../utils/alerts';
// import { buyPackWithGiftz, buyPackWithIgnis } from '../../../utils/cardsUtils';
import { checkPin } from '../../../utils/walletUtils';

const OpenPackDialog = ({ reference, isOpen, onClose, infoAccount }) => {
    const [value, setValue] = useState('1');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [ignisPrice, setIgnisPrice] = useState(0);

    const { name, GIFTZBalance } = infoAccount;
    const [sendingTx, setSendingTx] = useState(false);

    const toast = useToast();

    const colorText = useColorModeValue('black', 'white');

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput(
        {
            step: 1,
            defaultValue: 0,
            min: 0,
            max: GIFTZBalance,
        },
        {
            isReadOnly: false,
        }
    );

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    useEffect(() => {
        const calculatePrices = () => {
            setIgnisPrice(input.value * PACKPRICE);
        };

        calculatePrices();
    }, [input.value]);

    const checker = option => {
        if (!isValidPin || !passphrase) {
            errorToast('You must enter a valid pin', toast);
            return false;
        }

        if (!input.value) {
            errorToast('You must enter a valid number of packs', toast);
            return false;
        }
        if (!ignisPrice) {
            errorToast('Error calculating prices', toast);
            return false;
        }

        return true;
    };

    const handleBuyPack = async () => {
        if (checker(value) === false) return;
        let itsOk = false;

        try {
            setSendingTx(true);
            /*
            if (value === '1') {
                // buy pack with ignis
                const response = await buyPackWithIgnis(passphrase, input.value, IGNISBalance);
                if (response) itsOk = true;
            } else if (value === '2') {
                // buy pack with giftz
                const response2 = await buyPackWithGiftz(passphrase, input.value, GIFTZBalance, IGNISBalance);
                if (response2) itsOk = true;
            } else {
                itsOk = false;
            }
            */
        } catch (error) {
            console.log('🚀 ~ file: BuyPackDialog.js:82 ~ handleBuyPack ~ error', error);
            itsOk = false;
        }

        if (itsOk) {
            okToast('Pack bought successfully', toast);
            cleanOnClose();
        } else {
            errorToast('Error buying pack', toast);
        }
        setSendingTx(false);
    };

    const cleanOnClose = () => {
        setValue('1');
        setPassphrase('');
        setIsValidPin(false);
        setSendingTx(false);
        onClose();
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    const isDisabled = !isValidPin || input.value === '0' || GIFTZBalance === 0 || sendingTx;

    return (
        <>
            <AlertDialog
                size="3xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={cleanOnClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay bgColor="blackAlpha.800" />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">OPEN A PACK OF CARDS</AlertDialogHeader>
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
                                    </Box>

                                    {GIFTZBalance === 0 && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold" my={4}>
                                            You don't have enough packs
                                        </Text>
                                    )}

                                    {GIFTZBalance > 0 && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold" my={4}>
                                            You own {GIFTZBalance} packs
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
                                            isDisabled={isDisabled}
                                            bgColor={!isDisabled ? '#F18800' : null}
                                            w="100%"
                                            py={6}
                                            onClick={handleBuyPack}>
                                            OPEN
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

export default OpenPackDialog;
