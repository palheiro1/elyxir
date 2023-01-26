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
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Text,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { sendIgnis } from '../../../services/Ardor/ardorInterface';
import { checkPin, sendGem, sendGiftz } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import { isArdorAccount } from '../../../utils/validators';
import { NQTDIVIDER } from '../../../data/CONSTANTS';

const SendCurrencyDialog = ({ reference, isOpen, onClose, currency, username, IGNISBalance }) => {
    console.log('🚀 ~ file: SendCurrencyDialog.js:34 ~ SendCurrencyDialog ~ currency', currency);
    const toast = useToast();

    const [ardorAccount, setArdorAccount] = useState('');
    const [isValidArdorAccount, setIsValidArdorAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [passphrase, setPassphrase] = useState('');
    const maxCurrency = Math.floor(Number(currency.balance));
    console.log('🚀 ~ file: SendCurrencyDialog.js:45 ~ SendCurrencyDialog ~ maxCurrency', maxCurrency);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 0.01,
        defaultValue: 0,
        min: 0,
        max: maxCurrency,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const handleInput = e => {
        e.preventDefault();
        setArdorAccount(e.target.value);
        const isValid = isArdorAccount(e.target.value);
        setIsValidArdorAccount(isValid);
    };

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleSend = async () => {
        if (!isValidPin || !isValidArdorAccount || !passphrase || !input.value || input.value > maxCurrency) {
            errorToast('Invalid data', toast);
            return;
        }

        let response;
        switch (currency.name) {
            case 'IGNIS':
                response = await sendIgnis({
                    amountNQT: input.value * NQTDIVIDER,
                    recipient: ardorAccount,
                    passPhrase: passphrase,
                    message: '',
                });
                break;
            case 'GIFTZ':
                response = await sendGiftz({
                    amountNQT: input.value,
                    recipient: ardorAccount,
                    passphrase: passphrase,
                    ignisBalance: IGNISBalance,
                });
                break;
            case 'GEMS':
                response = await sendGem({
                    amountNQT: input.value,
                    recipient: ardorAccount,
                    passphrase: passphrase,
                });
                break;
            default:
                errorToast(toast, 'Currency not supported');
                return;
        }

        if (response.errorCode) {
            errorToast(`Error sending ${currency.name}: ${response.errorDescription}`, toast);
        } else {
            okToast(`${currency.name} sent successfully`, toast);
            onClose();
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
                    <AlertDialogHeader textAlign="center" color="white">
                        <Center>
                            <Text>SEND {currency.name}</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Box my={4}>
                            <Text textAlign="center" color="white">
                                Amount to send (max: {maxCurrency})
                            </Text>
                            <Center my={2}>
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
                                    />
                                    <Button {...inc} rounded="none" borderRightRadius="lg">
                                        +
                                    </Button>
                                </HStack>
                            </Center>
                        </Box>

                        <FormControl variant="floatingGray" id="Recipient" my={4} mt={8}>
                            <InputGroup size="lg" border="1px" borderColor="whiteAlpha.300" rounded="lg">
                                <Input
                                    placeholder=" "
                                    value={ardorAccount}
                                    onChange={handleInput}
                                    border="0px"
                                    isInvalid={!isValidArdorAccount}
                                />
                                <InputRightAddon
                                    bgColor="transparent"
                                    border="0px"
                                    children={
                                        <IconButton
                                            bgColor="transparent"
                                            aria-label="Scan QR CODE"
                                            icon={<FaQrcode />}
                                        />
                                    }
                                />
                            </InputGroup>

                            <FormLabel>Recipient</FormLabel>
                        </FormControl>

                        <Center>
                            <HStack spacing={7}>
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
                        </Center>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            isDisabled={!isValidPin || !isValidArdorAccount}
                            bgColor="blue.700"
                            w="100%"
                            py={6}
                            onClick={handleSend}>
                            Submit
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SendCurrencyDialog;
