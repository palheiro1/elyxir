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
    Radio,
    RadioGroup,
    Stack,
    Text,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';

import Hover from 'react-3d-hover';

import { useEffect, useState } from 'react';
import { PACKPRICE, PACKPRICEGIFTZ } from '../../../data/CONSTANTS';
import { errorToast, okToast } from '../../../utils/alerts';
import { buyPackWithGiftz, buyPackWithIgnis } from '../../../utils/cardsUtils';
import { checkPin } from '../../../utils/walletUtils';

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
    const [value, setValue] = useState('1');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [ignisPrice, setIgnisPrice] = useState(0);
    const [giftzPrice, setGiftzPrice] = useState(0);

    const { name, GIFTZBalance, IGNISBalance } = infoAccount;
    const maxPacksWithIgnis = Math.floor(IGNISBalance / PACKPRICE);
    const maxPacksWithGiftz = Math.floor(GIFTZBalance / PACKPRICEGIFTZ);

    const toast = useToast();

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: value === '1' ? maxPacksWithIgnis : maxPacksWithGiftz,
    });

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
            setGiftzPrice(input.value * PACKPRICEGIFTZ);
        };

        calculatePrices();
    }, [input.value]);

    const checker = () => {
        if (!isValidPin || !passphrase) {
            errorToast('You must enter a valid pin', toast);
            return false;
        }

        if (!input.value) {
            errorToast('You must enter a valid number of packs', toast);
            return false;
        }
        if (!ignisPrice || !giftzPrice) {
            errorToast('Error calculating prices', toast);
            return false;
        }

        if (IGNISBalance < ignisPrice || GIFTZBalance < giftzPrice) {
            errorToast("You don't have enough funds", toast);
            return false;
        }

        return true;
    };

    const handleBuyPack = async () => {
        if (checker() === false) return;
        let itsOk = false;

        try {
            if (value === '1') {
                // buy pack with ignis
                const response = await buyPackWithIgnis(passphrase, input.value, IGNISBalance);
                if(response) itsOk = true;
            } else if (value === '2') {
                // buy pack with giftz
                const response2 = await buyPackWithGiftz(passphrase, input.value, GIFTZBalance, IGNISBalance);
                if(response2) itsOk = true;
            } else {
                itsOk = false;
            }
        } catch (error) {
            console.log('🚀 ~ file: BuyPackDialog.js:82 ~ handleBuyPack ~ error', error);
            itsOk = false;
        }

        if (itsOk) {
            okToast('Pack bought successfully', toast);
            onClose();
        } else {
            errorToast('Error buying pack', toast);
        }
    };

    return (
        <>
            <AlertDialog
                size="3xl"
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">BUY A PACK OF CARDS</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={4}>
                        <Grid templateColumns="repeat(2, 1fr)">
                            <GridItem w="100%">
                                <Center w="100%">
                                    <Hover scale={1.15} perspective={200}>
                                        <Image src="/images/cardPack.png" alt="Card Pack" maxH="25rem" />
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
                                                <RadioGroup onChange={setValue} value={value} w="100%">
                                                    <Stack direction="row">
                                                        <Box
                                                            textAlign="center"
                                                            w="100%"
                                                            bgColor="blackAlpha.400"
                                                            px={4}
                                                            py={2}
                                                            rounded="lg">
                                                            <Radio value="1">IGNIS</Radio>
                                                        </Box>
                                                        <Box
                                                            textAlign="center"
                                                            w="100%"
                                                            bgColor="blackAlpha.400"
                                                            px={4}
                                                            py={2}
                                                            rounded="lg">
                                                            <Radio value="2">GIFTZ</Radio>
                                                        </Box>
                                                    </Stack>
                                                </RadioGroup>
                                            </Stack>
                                        </Center>
                                    </Box>
                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Number of packs
                                        </Text>
                                        <Center>
                                            <HStack spacing={0} border="1px" rounded="lg" borderColor="whiteAlpha.200">
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
                                        </Center>
                                    </Box>

                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Total price
                                        </Text>
                                        <Center>
                                            <Text color="white" fontWeight="bold" fontSize="2xl">
                                                {value === '1' ? `${ignisPrice} IGNIS` : `${giftzPrice} GIFTZ`}
                                            </Text>
                                        </Center>
                                    </Box>

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
                                            isDisabled={!isValidPin || passphrase === ''}
                                            bgColor="blue.700"
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
