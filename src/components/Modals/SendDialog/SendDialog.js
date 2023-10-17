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
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { transferAsset } from '../../../services/Ardor/ardorInterface';
import { checkPin } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import { isArdorAccount } from '../../../utils/validators';
import CardBadges from '../../Cards/CardBadges';
import QRReader from '../../QRReader/QRReader';

/**
 * @name SendDialog
 * @description Component to send cards
 * @param {Object} reference - Object with the reference to the modal
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} card - Object with the card data
 * @param {String} username - String with the username
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const SendDialog = ({ reference, isOpen, onClose, card, username }) => {
    const toast = useToast();

    const [ardorAccount, setArdorAccount] = useState('ARDOR-');
    const [isValidArdorAccount, setIsValidArdorAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [sendingTx, setSendingTx] = useState(false);

    const [readerEnabled, setReaderEnabled] = useState(false);
    const prefix = 'ARDOR-';

    const [passphrase, setPassphrase] = useState('');
    const maxCards = Number(card.unconfirmedQuantityQNT);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: maxCards,
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
            setSendingTx(true);
            const response = await transferAsset({
                asset: card.asset,
                quantityQNT: input.value,
                recipient: ardorAccount,
                passPhrase: passphrase,
            });

            if (response) {
                okToast('Card sent successfully', toast);
                cleanOnClose();
            } else {
                errorToast('Error sending card', toast);
            }
        } catch (error) {
            console.error('🚀 ~ file: SendDialog.js:104 ~ handleSend ~ error:', error);
            errorToast('Error sending card', toast);
        } finally {
            setSendingTx(false);
        }
    };

    const bgColor = '#246773';
    const borderColor = '#2f8190';
    const isDisabled = !isValidPin || !isValidArdorAccount || input.value === 0;

    // const bgColor = '#246773';
    // const borderColor = '#2f8190';

    const cleanOnClose = () => {
        setArdorAccount('ARDOR-');
        setIsValidArdorAccount(false);
        setIsValidPin(false);
        setPassphrase('');
        setSendingTx(false);
        onClose();
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={cleanOnClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent bgColor={bgColor} border="1px" borderColor={borderColor} shadow="dark-lg">
                    <AlertDialogHeader textAlign="center">
                        <Text color="white">SEND CARD</Text>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton color="white" />
                    <AlertDialogBody color="white">
                        <Center rounded="lg" bgColor={borderColor} p={4}>
                            <Stack direction="row" align="center" spacing={4}>
                                <Image src={card.cardImgUrl} maxH="5rem" />
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {card.name}
                                    </Text>
                                    <CardBadges rarity={card.rarity} continent={card.channel} size="sm" />
                                    <Text fontSize="sm">Quantity: {card.quantityQNT}</Text>
                                </Box>
                            </Stack>
                        </Center>

                        <Box my={4}>
                            <Text textAlign="center">Amount (max: {maxCards})</Text>
                            <Center my={2}>
                                <HStack spacing={0} border="1px" rounded="lg" borderColor={borderColor} w="100%">
                                    <Button {...dec} rounded="none" borderLeftRadius="lg" bgColor={borderColor}>
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
                                    <Button {...inc} rounded="none" borderRightRadius="lg" bgColor={borderColor}>
                                        +
                                    </Button>
                                </HStack>
                            </Center>
                        </Box>

                        <FormControl variant="floatingModalTransparent" id="Recipient" my={6}>
                            <InputGroup size="lg" border="2px" borderColor={borderColor} rounded="lg">
                                <Input
                                    placeholder=" "
                                    value={ardorAccount}
                                    onChange={e => handleInput(e.target.value)}
                                    border="0px"
                                    isInvalid={ardorAccount !== 'ARDOR-' && !isValidArdorAccount}
                                />
                                <InputRightAddon
                                    bgColor="transparent"
                                    border="0px"
                                    children={
                                        <IconButton
                                            bgColor="transparent"
                                            aria-label="Scan QR CODE"
                                            w="100%"
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
                                    onComplete={handleCompletePin}
                                    onChange={handleCompletePin}
                                    isInvalid={!isValidPin}
                                    variant="filled"
                                    mask>
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                    <PinInputField bgColor={borderColor} />
                                </PinInput>
                            </HStack>
                        </Center>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            isDisabled={isDisabled || sendingTx}
                            bgColor={borderColor}
                            w="100%"
                            _hover={{ filter: 'brightness(1.2)' }}
                            py={6}
                            color="white"
                            fontWeight={'black'}
                            onClick={handleSend}>
                            SUBMIT
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SendDialog;
