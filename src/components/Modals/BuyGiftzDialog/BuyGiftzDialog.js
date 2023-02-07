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
    GridItem,
    HStack,
    Input,
    PinInput,
    PinInputField,
    Text,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';


import { useEffect, useState } from 'react';
import { EXCHANGERATE, PACKPRICE } from '../../../data/CONSTANTS';
import { buyGiftz } from '../../../services/Ardor/ardorInterface';
import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin } from '../../../utils/walletUtils';

/**
 * @name BuyGiftzDialog
 * @description This component is used to render the buy pack dialog
 * @param {Object} reference - Reference to the dialog
 * @param {Boolean} isOpen - Flag to open/close the dialog
 * @param {Function} onClose - Function to close the dialog
 * @param {String} name - User name
 * @param {Number} IGNISBalance - User IGNIS balance
 * @returns {JSX.Element} BuyPackDialog component
 * @author Jesús Sánchez Fernández
 * @version 0.1
 */
const BuyGiftzDialog = ({ reference, isOpen, onClose, name, IGNISBalance }) => {
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');
    const [ignisPrice, setIgnisPrice] = useState(0);

    const maxPacksWithIgnis = Math.floor(IGNISBalance / EXCHANGERATE);

    const toast = useToast();

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput(
        {
            step: 1,
            defaultValue: 0,
            min: 0,
            max: maxPacksWithIgnis,
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

    const checker = () => {
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

        if (IGNISBalance < ignisPrice) {
            errorToast("You don't have enough funds", toast);
            return false;
        }

        return true;
    };

    const handleBuyPack = async () => {
        if (checker() === false) return;
        let itsOk = false;

        try {
            // Buy GIFTZ with IGNIS
            await buyGiftz({ passphrase: passphrase, amountNQT: input.value});
            itsOk = true;
        } catch (error) {
            console.log("🚀 ~ file: BuyGiftzDialog.js:115 ~ handleBuyPack ~ error", error)
            itsOk = false;
        }

        if (itsOk) {
            okToast('GIFTZs bought successfully', toast);
            onClose();
        } else {
            errorToast('Error buying GIFTZs', toast);
        }
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">BUY GIFTZ</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={4}>
                        <Center>
                            <GridItem>
                                <Box>
                                    {maxPacksWithIgnis === 0 && (
                                        <Text textAlign="center" color="red.500" fontWeight="bold">
                                            You don't have enough IGNIS to buy GIFTZ
                                        </Text>
                                    )}
                                </Box>
                                <Box mt={6}>
                                    <Text textAlign="center" my={2}>
                                        Number of GIFTZs
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
                                            {ignisPrice} IGNIS
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
                                        isDisabled={!isValidPin || passphrase === '' || input.value > maxPacksWithIgnis}
                                        bgColor="blue.700"
                                        w="100%"
                                        py={6}
                                        onClick={handleBuyPack}>
                                        Submit
                                    </Button>
                                </Box>
                            </GridItem>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BuyGiftzDialog;
