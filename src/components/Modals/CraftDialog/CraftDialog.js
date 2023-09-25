import { InfoIcon } from '@chakra-ui/icons';
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
    Collapse,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    PinInput,
    PinInputField,
    Stack,
    Text,
    Tooltip,
    useNumberInput,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CRAFTINGCOMMON, CRAFTINGRARE } from '../../../data/CONSTANTS';
import { checkPin, sendToCraft } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import CardBadges from '../../Cards/CardBadges';

/**
 * @name CraftDialog
 * @description Component to craft cards
 * @param {Object} reference - Object with the reference to the modal
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} card - Object with the card data
 * @param {String} username - String with the username
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const CraftDialog = ({ reference, isOpen, onClose, card, username, ignis }) => {
    const toast = useToast();
    const maxCards = Number(card.unconfirmedQuantityQNT);
    const maxCrafts = Math.floor(maxCards / 5);
    const [sendingTx, setSendingTx] = useState(false);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: maxCrafts,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    const [craftingCost, setCraftingCost] = useState(0);
    const [passPhrase, setPassPhrase] = useState('');
    const [noCards, setNoCards] = useState(0);
    const [noCrafts, setNoCrafts] = useState(0);

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassPhrase(account.passphrase);
        }
    };

    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const infoMsg =
        "For every 5 identical cards you sacrifice you will be rewarded with a card of higher ratity. The crafting costs depende on the sacrificed card's rarity.";

    useEffect(() => {
        const { rarity } = card;
        const nCrafts = Math.floor(input.value);
        setNoCards(nCrafts * 5);
        setNoCrafts(nCrafts);
        if (rarity === 'Common') {
            setCraftingCost(nCrafts * CRAFTINGCOMMON);
        } else if (rarity === 'Rare') {
            setCraftingCost(nCrafts * CRAFTINGRARE);
        }
    }, [input, card]);

    const handleCrafting = async () => {
        if (!isValidPin) return errorToast('Invalid PIN', toast);
        if (!passPhrase) return errorToast('Invalid PIN', toast);
        if (noCrafts > maxCrafts) return errorToast('Invalid number of crafts', toast);
        if (noCrafts === 0) return errorToast('Invalid number of crafts', toast);
        if (craftingCost === 0) return errorToast('Invalid number of crafts', toast);
        if (noCards % 5 !== 0) return errorToast('Invalid number of crafts', toast);

        try {
            setSendingTx(true);
            const ok = await sendToCraft({
                asset: card.asset,
                noCards: noCards,
                passPhrase: passPhrase,
                cost: craftingCost,
            });
            if (ok) {
                okToast('Crafting request sent', toast);
                onClose();
            } else {
                errorToast('Error sending crafting request', toast);
            }
        } catch (error) {
            errorToast('Error sending crafting request', toast);
        } finally {
            setSendingTx(false);
        }
    };

    const bgColor = '#246773';
    const borderColor = '#2f8190';

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={reference}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />

                <AlertDialogContent
                    bgColor={bgColor}
                    border="1px"
                    borderColor={borderColor}
                    shadow="dark-lg"
                    color="white">
                    <AlertDialogHeader textAlign="center">
                        <Center>
                            <Text mr={2}>CRAFTING</Text>
                            <Tooltip label={infoMsg} aria-label="Info about craft" hasArrow variant="black">
                                <InfoIcon fontSize="xs" />
                            </Tooltip>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Center rounded="lg" bgColor={borderColor} p={4}>
                            <Stack direction="row" align="center" spacing={4}>
                                <Image src={card.cardImgUrl} maxH="5rem" />
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {card.name}
                                    </Text>
                                    <CardBadges rarity={card.rarity} continent={card.channel} />
                                    <Text fontSize="sm">Quantity: {maxCards}</Text>
                                </Box>
                            </Stack>
                        </Center>
                        <Box my={4}>
                            <Text textAlign="center">Crafts (max: {maxCrafts})</Text>
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

                        <FormControl variant="floatingModalTransparent" id="name" my={4} mt={8}>
                            <InputGroup size="lg" border="1px solid #2f8190" rounded="lg">
                                <Input placeholder=" " value={input.value * 5} disabled />
                                <InputRightAddon bgColor={borderColor} children={card.name} />
                            </InputGroup>

                            <FormLabel>Cards to sacrifice</FormLabel>
                        </FormControl>

                        <FormControl
                            variant="floatingModalTransparent"
                            id="name"
                            my={6}
                            border="1px solid #2f8190"
                            rounded="lg">
                            <Input placeholder=" " value={craftingCost + ' IGNIS'} size="lg" disabled />
                            <FormLabel>Crafting costs</FormLabel>
                        </FormControl>

                        <Collapse in={ignis < craftingCost}>
                            <Text color="red.500" textAlign="center" fontWeight="bold">
                                Not enough IGNIS
                            </Text>
                        </Collapse>

                        <Center mt={4}>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
                                    placeholder="🔒"
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
                            isDisabled={!isValidPin || sendingTx || ignis < craftingCost}
                            bgColor={borderColor}
                            w="100%"
                            py={6}
                            onClick={handleCrafting}>
                            Submit
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CraftDialog;
