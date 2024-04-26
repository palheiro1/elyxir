import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Center,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin, sendToBounty } from '../../../utils/walletUtils';

const SendMissingCardDialog = ({ reference, isOpen, onClose, username, missingCards }) => {
    console.log("🚀 ~ SendMissingCardDialog ~ missingCards:", missingCards)
    const toast = useToast();
    const [passPhrase, setPassPhrase] = useState('');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [sendingTx, setSendingTx] = useState(false);

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassPhrase(account.passphrase);
        }
    };

    const handleSend = async () => {
        if (!isValidPin) return errorToast('Invalid pin', toast);
        setSendingTx(true);
        try {
            const { response, message } = await sendToBounty({ cards: missingCards, passPhrase: passPhrase });
            if (response) okToast('Bounty participation registered', toast);
            else errorToast(message, toast);
        } catch (error) {
            errorToast('An error occurred', toast);
        } finally {
            setSendingTx(false);
            onClose();
        }
    };

    const bgColor = '#d86471';
    const borderColor = '#f39d54';
    const filledColor = '#f79c27';

    return (
        <>
            <AlertDialog
                size="xl"
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
                    <AlertDialogHeader textAlign="center" fontWeight="bolder">
                        <Heading>Claim the Bounty</Heading>
                        <Text>Send the missing cards to participate</Text>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Center>
                            <Stack
                                minW="90%"
                                direction="column"
                                spacing={4}
                                pt={4}
                                p={4}
                                border="1px"
                                borderColor={borderColor}
                                rounded="md"
                                shadow="lg"
                                my={4}
                                bgColor="blackAlpha.600"
                                color="white">
                                <Text textAlign="center" color="whiteAlpha.800">
                                    You have participated in the Bounty, but there are still cards to be sent. ({missingCards.length} cards)
                                </Text>
                            </Stack>
                        </Center>

                        <Center my={4}>
                            <HStack spacing={7}>
                                <PinInput
                                    size="lg"
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

                        <Center my={2}>
                            <Button
                                isDisabled={!isValidPin || sendingTx}
                                bgColor={filledColor}
                                fontWeight={'black'}
                                onClick={handleSend}
                                minW="90%"
                                size="lg">
                                SUBMIT
                            </Button>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SendMissingCardDialog;
