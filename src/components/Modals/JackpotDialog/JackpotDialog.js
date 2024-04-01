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
    Flex,
    Grid,
    GridItem,
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
import { checkPin, sendToJackpot } from '../../../utils/walletUtils';

const JackpotDialog = ({ reference, isOpen, onClose, username, totalCards }) => {
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
            const { response, message } = await sendToJackpot({ cards: totalCards, passPhrase: passPhrase });
            if (response) okToast('Jackpot participation registered', toast);
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
                        <Heading>Claim the Jackpot</Heading>
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
                                    Please read before claiming
                                </Text>

                                <Grid templateColumns="repeat(8, 1fr)">
                                    <GridItem>
                                        <Flex>
                                            <Box bgColor="white" color="black" rounded="full" p={1} px={3}>
                                                <Text>1</Text>
                                            </Box>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={7}>
                                        <Text>
                                            One of each card is{' '}
                                            <strong>
                                                <u>returned</u>
                                            </strong>{' '}
                                            to Mythical Beings.
                                        </Text>
                                    </GridItem>
                                </Grid>

                                <Grid templateColumns="repeat(8, 1fr)">
                                    <GridItem>
                                        <Flex>
                                            <Box bgColor="white" color="black" rounded="full" p={1} px={3}>
                                                <Text>2</Text>
                                            </Box>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={7}>
                                        <Text>
                                            Get a{' '}
                                            <strong>
                                                <u>share</u>
                                            </strong>{' '}
                                            of the jackpot (1 participation = 1 share)
                                        </Text>
                                    </GridItem>
                                </Grid>

                                <Grid templateColumns="repeat(8, 1fr)">
                                    <GridItem>
                                        <Flex>
                                            <Box bgColor="white" color="black" rounded="full" p={1} px={3}>
                                                <Text>3</Text>
                                            </Box>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={7}>
                                        <Text>
                                            Participate in the{' '}
                                            <strong>
                                                <u>drawing of 9 lots</u>
                                            </strong>{' '}
                                            of 1000 MANA for each cycle and 1 special card.
                                        </Text>
                                    </GridItem>
                                </Grid>
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

export default JackpotDialog;
