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
    useColorModeValue,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { sendIgnis } from '../../../services/Ardor/ardorInterface';
import { checkPin, sendGem, sendGiftz, sendWETH } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import { isArdorAccount } from '../../../utils/validators';
import { NQTDIVIDER } from '../../../data/CONSTANTS';
import QRReader from '../../QRReader/QRReader';

const SendCurrencyDialog = ({ reference, isOpen, onClose, currency, username, IGNISBalance }) => {
    const toast = useToast();

    const [ardorAccount, setArdorAccount] = useState('ARDOR-');
    const [isValidArdorAccount, setIsValidArdorAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [sendingTx, setSendingTx] = useState(false);

    const [readerEnabled, setReaderEnabled] = useState(false);
    const prefix = 'ARDOR-';

    const [passphrase, setPassphrase] = useState('');
    const maxCurrency =
        currency.name === 'GIFTZ' ? Math.floor(currency.balance) : parseFloat(Number(currency.balance).toFixed(2));

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 0,
        min: 0,
        max: maxCurrency,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const handleInput = address => {
        if (address === 'ARDOR') return;
        if (readerEnabled) setReaderEnabled(false);
        //Clean if ARDOR-ARDOR- prefix all phrased
        let auxAddress = address.replaceAll(prefix, '');
        auxAddress = prefix + auxAddress;
        setArdorAccount(auxAddress);
        const isValid = isArdorAccount(auxAddress);
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
        try {
            if (!isValidPin || !isValidArdorAccount || !passphrase || !input.value || input.value > maxCurrency) {
                errorToast('Invalid data', toast);
                return;
            }

            setSendingTx(true);
            let response;
            switch (currency.name) {
                case 'IGNIS':
                    response = await sendIgnis({
                        amountNQT: input.value * NQTDIVIDER,
                        recipient: ardorAccount,
                        passPhrase: passphrase,
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
                case 'wETH':
                    response = await sendWETH({
                        amountNQT: input.value,
                        recipient: ardorAccount,
                        passphrase: passphrase,
                    });
                    break;
                default:
                    errorToast(toast, 'Currency not supported');
                    return;
            }

            if (response) {
                okToast(`${currency.name} sent successfully`, toast);
                onClose();
            } else {
                errorToast(`Error sending ${currency.name}: ${response.errorDescription}`, toast);
            }
        } catch (error) {
            errorToast(`Error sending ${currency.name}: ${error}`, toast);
        } finally {
            setSendingTx(false);
        }
    };

    const bgColor = useColorModeValue('', '#1D1D1D');
    const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const checkDisabled = () => {
            setIsDisabled(
                !isValidPin || !isValidArdorAccount || !passphrase || !input.value || input.value > maxCurrency
            );
        };
        checkDisabled();
    }, [isValidPin, isValidArdorAccount, passphrase, input.value, maxCurrency]);

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">
                        <Center>
                            <Text>SEND {currency.name}</Text>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Box>
                            <Center>
                                <FormControl variant="floatingGray" id="Recipient" my={4}>
                                    <HStack spacing={0} border="1px" rounded="lg" borderColor={borderColor}>
                                        <Button {...dec} rounded="none" borderLeftRadius="lg" size="lg">
                                            -
                                        </Button>
                                        <Input
                                            {...input}
                                            rounded="none"
                                            border="none"
                                            textAlign="center"
                                            fontWeight="bold"
                                            size="lg"
                                        />
                                        <Button {...inc} rounded="none" borderRightRadius="lg" size="lg">
                                            +
                                        </Button>
                                    </HStack>
                                    <FormLabel>Amount to send (max: {maxCurrency})</FormLabel>
                                </FormControl>
                            </Center>
                        </Box>

                        <FormControl variant="floatingGray" id="Recipient" my={4}>
                            <InputGroup size="lg" border="1px" borderColor={borderColor} rounded="lg">
                                <Input
                                    placeholder=" "
                                    value={ardorAccount}
                                    onChange={e => handleInput(e.target.value)}
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
                                            onClick={() => {
                                                setReaderEnabled(!readerEnabled);
                                            }}
                                        />
                                    }
                                />
                            </InputGroup>
                            {readerEnabled && <QRReader handleInput={handleInput} />}
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
                            isDisabled={isDisabled || sendingTx}
                            bgColor={!isDisabled ? '#F18800' : null}
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
