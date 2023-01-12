import {
    Box,
    Button,
    Center,
    Grid,
    GridItem,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

const Account = ({ infoAccount }) => {
    console.log("🚀 ~ file: Account.js:16 ~ Account ~ infoAccount", infoAccount)

    const bgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem>
                <Box p={6} bgColor={bgColor} rounded="lg" mb={2}>
                    <Heading fontSize="lg" pb={2}>
                        Your Ardor account
                    </Heading>
                    <Text>{infoAccount.accountRs}</Text>
                </Box>
                <Box p={6} bgColor={bgColor} rounded="lg" mb={2}>
                    <Heading fontSize="lg" pb={2}>
                        User
                    </Heading>
                    <Text>{infoAccount.name}</Text>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" p={6} bgColor={bgColor} rounded="lg">
                    <GridItem>
                        <Heading fontSize="lg" pb={2}>
                            IGNIS
                        </Heading>
                        <Text fontSize="sm">21.8 (1.52 USD)</Text>
                    </GridItem>
                    <GridItem>
                        <Heading fontSize="lg" pb={2}>
                            GIFTZ
                        </Heading>
                        <Text fontSize="sm">3</Text>
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem>
                <Box p={4} bgColor={bgColor} rounded="lg" mb={2}>
                    <Heading fontSize="lg" pb={2}>
                        Backup your passphrase
                    </Heading>
                    <Text fontSize="sm" pb={2}>
                        Risk of loosing your funds and cards: You store your pass phrase on device.
                        You should export the passphrase and store it somewhere safe.
                    </Text>
                    <Text fontSize="sm">
                        The passphrase is stored encrypted, however you shouldnt use the game wallet
                        for significant funds. If you ever give this device to somebody else, you
                        should delete your information from it.
                    </Text>
                    <Box>
                        <Center>
                            <HStack spacing={2} pt={4}>
                                <PinInput size="lg" placeholder="🔒" variant="filled" mask>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </Center>
                        <Button color="white" mt={4} w="100%" bgColor="blue.800">
                            Export passphrase
                        </Button>
                    </Box>
                </Box>
            </GridItem>
            <GridItem>
                <Box p={4} bgColor={bgColor} rounded="lg" mb={2}>
                    <Heading fontSize="lg" pb={2}>
                        Delete account from device
                    </Heading>
                    <Text fontSize="sm">
                        This deletes stored information from this device. Your account remains
                        available on the network, use Backup Passphrase to save your private key for
                        later use.
                    </Text>
                    <Box>
                        <Center>
                            <HStack spacing={2} pt={4}>
                                <PinInput size="lg" placeholder="🔒" variant="filled" mask>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </Center>
                        <Button color="white" mt={4} w="100%" bgColor="blue.800">
                            Delete account
                        </Button>
                    </Box>
                </Box>
            </GridItem>
        </Grid>
    );
};

export default Account;
