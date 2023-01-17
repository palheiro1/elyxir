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
import { checkPin, sendToMorph } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';


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
const MorphDialog = ({ reference, isOpen, onClose, card, username }) => {

    const toast = useToast();

    const maxCards = Number(card.quantityQNT);

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
    const [ passPhrase, setPassPhrase ] = useState('')

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
        if (rarity === 'Common') {
            setMorphingCost(input.value * MORPHINGCOMMON);
        } else if (rarity === 'Rare') {
            setMorphingCost(input.value * MORPHINGRARE);
        } else if (rarity === 'Epic') {
            setMorphingCost(input.value * MORPHINGEPIC);
        }
    }, [input, card]);

    const handleMorph = async () => {
        const ok = await sendToMorph({
            asset: card.asset,
            noCards: input.value,
            passPhrase: passPhrase,
            cost: morphingCost,
        })
        if(ok){
            okToast('Morphing successful', toast)
            onClose();
        } else {
            errorToast('Morphing failed', toast)
        }
    }

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
                            <Text mr={2}>MORPHING</Text>
                            <Tooltip label={infoMsg} aria-label="Info about craft" hasArrow variant="black">
                                <InfoIcon fontSize="xs" />
                            </Tooltip>
                        </Center>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Center rounded="lg" bgColor="whiteAlpha.100" p={4}>
                            <Stack direction="row" align="center" spacing={4}>
                                <Image src={card.cardImgUrl} maxH="5rem" />
                                <Box>
                                    <Text fontSize="2xl" fontWeight="bold" color="white">
                                        {card.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {card.channel} / {card.rarity}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Quantity: {card.quantityQNT}
                                    </Text>
                                </Box>
                            </Stack>
                        </Center>
                        <Box my={4}>
                            <Text textAlign="center" color="white">
                                Morph cards (max: {maxCards})
                            </Text>
                            <Center my={2}>
                                <HStack maxW="50%" spacing={0} border="1px" rounded="lg" borderColor="whiteAlpha.200">
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

                        <FormControl variant="floatingGray" id="name" my={4} mt={8}>
                            <InputGroup size="lg">
                                <Input placeholder=" " value={input.value} disabled />
                                <InputRightAddon bgColor="transparent" children={card.name} />
                            </InputGroup>

                            <FormLabel>Cards to sacrifice</FormLabel>
                        </FormControl>

                        <FormControl variant="floatingGray" id="name" my={4}>
                            <Input placeholder=" " value={morphingCost + ' GEM'} size="lg" disabled />
                            <FormLabel>Morphing costs</FormLabel>
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
                        <Button isDisabled={!isValidPin} bgColor="blue.700" w="100%" py={6} onClick={handleMorph}>
                            Submit
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default MorphDialog;
