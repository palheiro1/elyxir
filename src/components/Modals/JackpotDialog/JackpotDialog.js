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

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassPhrase(account.passphrase);
        }
    };

    const handleSend = async () => {
        if (isValidPin) {
            const response = await sendToJackpot({ cards: totalCards, passPhrase: passPhrase });
            if (response) okToast('Jackpot participation registered', toast);
            else errorToast('Error registering participation', toast);

            onClose();
        }
    };

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

                <AlertDialogContent bgColor="#1D1D1D" border="1px" borderColor="whiteAlpha.400" shadow="dark-lg">
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
                                borderColor="whiteAlpha.400"
                                rounded="md"
                                shadow="lg"
                                my={4}
                                bgColor="blackAlpha.600">
                                <Text textAlign="center" color="gray">
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
                                            Enter into a{' '}
                                            <strong>
                                                <u>drawing of 7</u>
                                            </strong>{' '}
                                            Special Cards per cycle.
                                        </Text>
                                    </GridItem>
                                </Grid>
                            </Stack>
                        </Center>

                        <Center my={4}>
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

                        <Center my={2}>
                            <Button
                                isDisabled={!isValidPin}
                                bgColor={isValidPin ? '#F18800' : null}
                                onClick={handleSend}
                                minW="90%"
                                size="lg">
                                Submit
                            </Button>
                        </Center>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default JackpotDialog;
