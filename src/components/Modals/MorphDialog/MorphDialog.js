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
import { MORPHINGCOMMON, MORPHINGEPIC, MORPHINGRARE } from '../../../data/CONSTANTS';
import { checkPin, sendToMorph, waitForRefresh } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';
import CardBadges from '../../Cards/CardBadges';

/**
 * @name MorphDialog
 * @description Component to morph cards
 * @param {Object} reference - Object with the reference to the modal
 * @param {Boolean} isOpen - Boolean to know if the modal is open
 * @param {Function} onClose - Function to close the modal
 * @param {Object} card - Object with the card data
 * @param {String} username - String with the username
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const MorphDialog = ({ reference, isOpen, onClose, card, username, gem }) => {
    const toast = useToast();
    const maxCards = Number(card.unconfirmedQuantityQNT);
    const [sendingTx, setSendingTx] = useState(false);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: maxCards,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    const [morphingCost, setMorphingCost] = useState(0);
    const [passPhrase, setPassPhrase] = useState('');

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
        'Morph your card to one random card of the same rarity. If the random card would be the same card that you morphed, there is a small chance to get an additional random card back.';

    useEffect(() => {
        const { rarity } = card;
        if (rarity === 'Common') {
            setMorphingCost(input.value * MORPHINGCOMMON);
        } else if (rarity === 'Rare') {
            setMorphingCost(input.value * MORPHINGRARE);
        } else if (rarity === 'Epic') {
            setMorphingCost(input.value * MORPHINGEPIC);
        }
    }, [input, card]);

    const handleMorph = async () => {
        try {
            setSendingTx(true);
            const ok = await sendToMorph({
                asset: card.asset,
                noCards: input.value,
                passPhrase: passPhrase,
                cost: morphingCost,
            });

            if (ok) {
                await waitForRefresh();
                okToast('Morphing successful', toast);
                onClose();
            } else {
                errorToast('Morphing failed', toast);
            }
        } catch (error) {
            errorToast('Morphing failed', toast);
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
                            <Text mr={2}>MORPHING</Text>
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
                                    <CardBadges rarity={card.rarity} continent={card.channel} size="sm" />
                                    <Text fontSize="sm">Quantity: {card.quantityQNT}</Text>
                                </Box>
                            </Stack>
                        </Center>
                        <Box my={4}>
                            <Text textAlign="center">Morph cards (max: {maxCards})</Text>
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
                                <Input placeholder=" " value={input.value} disabled />
                                <InputRightAddon bgColor="transparent" children={card.name} />
                            </InputGroup>

                            <FormLabel color="white">Cards to sacrifice</FormLabel>
                        </FormControl>

                        <FormControl
                            variant="floatingModalTransparent"
                            id="name"
                            my={6}
                            border="1px solid #2f8190"
                            rounded="lg">
                            <Input placeholder=" " value={morphingCost + ' GEM'} size="lg" disabled />
                            <FormLabel>Morphing costs</FormLabel>
                        </FormControl>

                        <Collapse in={gem < morphingCost}>
                            <Text color="red.500" textAlign="center" fontWeight="bold">
                                Not enough GEM
                            </Text>
                        </Collapse>

                        <Center mt={4}>
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
                            isDisabled={!isValidPin || sendingTx || gem < morphingCost}
                            bgColor={borderColor}
                            w="100%"
                            color="white"
                            _hover={{ filter: 'brightness(1.2)' }}
                            fontWeight={'black'}
                            py={6}
                            onClick={handleMorph}>
                            {sendingTx ? 'MORPHING...' : 'SUBMIT'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default MorphDialog;
