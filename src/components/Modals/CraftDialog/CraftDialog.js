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
import { CRAFTINGCOMMON, CRAFTINGRARE } from '../../../data/CONSTANTS';
import { checkPin, sendToCraft } from '../../../utils/walletUtils';
import { errorToast, okToast } from '../../../utils/alerts';

const CraftDialog = ({ reference, isOpen, onClose, card, username }) => {

    const toast = useToast();
    const maxCards = Number(card.quantityQNT);

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 5,
        defaultValue: 5,
        min: 5,
        max: maxCards,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();
    const [craftingCost, setCraftingCost] = useState(0);
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
        "For every 5 identical cards you sacrifice you will be rewarded with a card of higher ratity. The crafting costs depende on the sacrificed card's rarity.";

    useEffect(() => {
        const { rarity } = card;
        const noCrafts = Math.floor(input.value / 5);
        if (rarity === 'Common') {
            setCraftingCost(noCrafts * CRAFTINGCOMMON);
        } else if (rarity === 'Rare') {
            setCraftingCost(noCrafts * CRAFTINGRARE);
        }
    }, [input, card]);

    const handleCrafting = async () => {
        const ok = await sendToCraft({
            asset: card.asset,
            noCards: input.value,
            passPhrase: passPhrase,
            cost: craftingCost,
        });
        if (ok) {
            okToast('Crafting request sent', toast)
            onClose();
        } else {
            errorToast('Error sending crafting request', toast)
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
                            <Text mr={2}>CRAFTING</Text>
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
                                Carft cards (max: {maxCards})
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
                            <Input placeholder=" " value={craftingCost + ' IGNIS'} size="lg" disabled />
                            <FormLabel>Crafting costs</FormLabel>
                        </FormControl>

                        <Center>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
                                    placeholder="🔒"
                                    onComplete={handleCompletePin}
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
                        <Button isDisabled={!isValidPin} bgColor="blue.700" w="100%" py={6} onClick={handleCrafting} >
                            Submit
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CraftDialog;
