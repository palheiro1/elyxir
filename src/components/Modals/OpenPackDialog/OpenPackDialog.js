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
    useNumberInput,
    useToast,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { PACKPRICE } from '../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';
import { openPackWithGiftz } from '../../../utils/cardsUtils';

import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";

const OpenPackDialog = ({ reference, isOpen, onClose, infoAccount }) => {
    const [value, setValue] = useState('1');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [ignisPrice, setIgnisPrice] = useState(0);

    const { name, GIFTZBalance } = infoAccount;
    const [sendingTx, setSendingTx] = useState(false);

    const toast = useToast();

    const colorText = 'white';

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 0,
        min: 0,
        max: GIFTZBalance,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const handleClose = () => {
        setValue('1');
        setPassphrase('');
        setIsValidPin(false);
        setIgnisPrice(0);
        setSendingTx(false);
        onClose();
    };

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
            errorToast('You must enter a valid number of GIFTZ', toast);
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
            const response = await openPackWithGiftz(passphrase, input.value, GIFTZBalance);
            if (response) itsOk = true;
        } catch (error) {
            console.error('🚀 ~ file: BuyPackDialog.js:82 ~ handleBuyPack ~ error', error);
            itsOk = false;
        }

        if (itsOk) {
            okToast('Opening your pack.', toast);
            handleClose();
        } else {
            errorToast('Error opening the pack.', toast);
        }
        setSendingTx(false);
    };

    const bgColor = '#e094b3';
    const textColor = 'whiteAlpha.500';
    const isDisabled = !isValidPin || input.value === '0' || GIFTZBalance === 0 || sendingTx;

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

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor="#f7e4ec" shadow="dark-lg" color="white">
                    <AlertDialogHeader textAlign="center">OPEN A PACK OF CARDS</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={4}>
                        <Grid templateColumns="repeat(2, 1fr)">
                            <GridItem w="100%">
                                <Center w="100%">
                                    <HoverCard scaleFactor={1.4}>
                                        <Image src="/images/cardPacks/cardPack.png" alt="Card Pack" maxH="25rem" />
                                    </HoverCard>
                                </Center>
                            </GridItem>

                            <Center>
                                <GridItem>
                                    <Box mt={6}>
                                        <Text textAlign="center" my={2} border="1px solid #f7e4ec" rounded="lg" p={2}>
                                            Number of GIFTZ
                                        </Text>
                                        <Center>
                                            <HStack spacing={0} border="1px" rounded="lg" borderColor="#f7e4ec">
                                                <Button
                                                    {...dec}
                                                    rounded="none"
                                                    borderLeftRadius="lg"
                                                    color={colorText}
                                                    _hover={{ bgColor: '#f7e4ec' }}
                                                    bgColor={'#efc9d9'}>
                                                    -
                                                </Button>
                                                <Input
                                                    {...input}
                                                    rounded="none"
                                                    color="white !important"
                                                    border="none"
                                                    textAlign="center"
                                                    fontWeight="bold"
                                                    isReadOnly
                                                />
                                                <Button
                                                    {...inc}
                                                    bgColor={'#e8afc6'}
                                                    rounded="none"
                                                    _hover={{ bgColor: '#f7e4ec' }}
                                                    borderRightRadius="lg"
                                                    color={colorText}>
                                                    +
                                                </Button>
                                            </HStack>
                                        </Center>
                                    </Box>

                                    {GIFTZBalance === 0 && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold" my={4}>
                                            You don't have enough GIFTZ
                                        </Text>
                                    )}

                                    {GIFTZBalance > 0 && (
                                        <Text textAlign="center" fontSize="sm" color={textColor} fontWeight="bold">
                                            You own {GIFTZBalance} GIFTZ
                                        </Text>
                                    )}

                                    <Center mt={8}>
                                        <Box py={2} mt={2}>
                                            <HStack spacing={4}>
                                                <PinInput
                                                    size="lg"
                                                    onComplete={handleCompletePin}
                                                    onChange={handleCompletePin}
                                                    isInvalid={!isValidPin}
                                                    variant="filled"
                                                    mask>
                                                    <PinInputField bgColor={'#e8afc6'} />
                                                    <PinInputField bgColor={'#e8afc6'} />
                                                    <PinInputField bgColor={'#e8afc6'} />
                                                    <PinInputField bgColor={'#e8afc6'} />
                                                </PinInput>
                                            </HStack>
                                        </Box>
                                    </Center>

                                    <Box w="100%" mt={2}>
                                        <Button
                                            isDisabled={isDisabled}
                                            bgColor={'#efc9d9'}
                                            color="white"
                                            fontWeight={'black'}
                                            _hover={{ bgColor: '#e8afc6', color: 'white' }}
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
