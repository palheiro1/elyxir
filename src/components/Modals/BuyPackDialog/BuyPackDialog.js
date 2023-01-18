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
    Grid,
    GridItem,
    HStack,
    Image,
    Input,
    PinInput,
    PinInputField,
    Radio,
    RadioGroup,
    Stack,
    Text,
    useNumberInput,
} from '@chakra-ui/react';
import { useState } from 'react';
import { checkPin } from '../../../utils/walletUtils';

const BuyPackDialog = ({ reference, isOpen, onClose, username }) => {
    
    const [value, setValue] = useState('1');
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [passphrase, setPassphrase] = useState('');

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: 1,
        min: 1,
        max: 10,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const account = checkPin(username, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleBuyPack = () => {

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
                    <AlertDialogHeader textAlign="center">BUY A PACK OF CARDS</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={8}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <Center>
                                <GridItem w="100%" alignContent="center">
                                    <Image src="/images/cardPack.png" alt="Card Pack" w="15rem" />
                                </GridItem>
                            </Center>
                            <Center>
                                <GridItem>
                                    <Box>
                                        <Text textAlign="center" my={2}>
                                            Payment method
                                        </Text>
                                        <Center w="100%">
                                            <Stack direction="row" w="100%">
                                                <RadioGroup onChange={setValue} value={value}  w="100%">
                                                    <Stack direction="row">
                                                        <Box
                                                            textAlign="center"
                                                            w="100%"
                                                            bgColor="blackAlpha.400"
                                                            px={4}
                                                            py={2}
                                                            rounded="lg">
                                                            <Radio value="1">IGNIS</Radio>
                                                        </Box>
                                                        <Box
                                                            textAlign="center"
                                                            w="100%"
                                                            bgColor="blackAlpha.400"
                                                            px={4}
                                                            py={2}
                                                            rounded="lg">
                                                            <Radio value="2">GIFTZ</Radio>
                                                        </Box>
                                                    </Stack>
                                                </RadioGroup>
                                            </Stack>
                                        </Center>
                                    </Box>
                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Number of packs
                                        </Text>
                                        <Center>
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
                                                    disabled
                                                />
                                                <Button {...inc} rounded="none" borderRightRadius="lg">
                                                    +
                                                </Button>
                                            </HStack>
                                        </Center>
                                    </Box>

                                    <Box mt={6}>
                                        <Text textAlign="center" my={2}>
                                            Total price
                                        </Text>
                                        <Center>
                                            <Text color="white" fontWeight="bold" fontSize="2xl">
                                                0.00000000 IGNIS
                                            </Text>
                                        </Center>
                                    </Box>

                                    <Box py={2} mt={4}>
                                        <HStack spacing={4}>
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
                                    </Box>
                                    <Box w="100%" mt={8}>
                                        <Button
                                            isDisabled={!isValidPin}
                                            bgColor="blue.700"
                                            w="100%"
                                            py={6}
                                            onClick={handleBuyPack}>
                                            Submit
                                        </Button>
                                    </Box>
                                </GridItem>
                            </Center>
                        </Grid>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BuyPackDialog;
