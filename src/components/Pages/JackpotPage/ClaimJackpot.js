import { Box, Button, Center, Divider, Heading, HStack, PinInput, PinInputField, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { errorToast, okToast } from '../../../utils/alerts';
import { checkPin, sendToJackpot } from '../../../utils/walletUtils';


/**
 * @name ClaimJackpot
 * @description Component to claim the jackpot
 * @param {String} username - String with the username
 * @param {Number} totalCards - Number with the total cards
 * @returns {JSX.Element} - JSX element
 * @author Jesús Sánchez Fernández
 * @version 1.0
 */
const ClaimJackpot = ({ username, totalCards }) => {

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
            const response = await sendToJackpot(totalCards, passPhrase);
            console.log("🚀 ~ file: RemainingCards.js:27 ~ handleSend ~ response", response)
            
            if(response) okToast("Cards sent to the jackpot", toast)
            else errorToast("Error sending cards to the jackpot", toast)
        }
    };

    return (
        <Box mt={8} textAlign="center">
            <Heading>Congratulations!</Heading>
            <Center>
                <Box textAlign="center">
                    <Text fontSize="xs">
                        You have all the cards!
                    </Text>
                </Box>
            </Center>
            <Center mt={4}>
                <Box p={4} px={8} bgColor="whiteAlpha.200" rounded="xl">
                    <Text fontSize="md" fontWeight="bolder" mb={2}>
                        -- Please READ before claiming --
                    </Text>
                    <Divider />
                    <Text fontSize="xs" mt={2}>
                        <strong>
                            One of each card <u>returned</u> to
                        </strong>{' '}
                        Mythical Beings.
                    </Text>
                    <Text fontSize="xs">
                        <strong>
                            Get a <u>share</u>
                        </strong>{' '}
                        of the jackpot (1 participation = 1 share)
                    </Text>
                    <Text fontSize="xs">
                        Enter into a{' '}
                        <strong>
                            <u>drawing of 7</u> Special Cards
                        </strong>{' '}
                        per cycle
                    </Text>
                </Box>
            </Center>
            <Center my={6}>
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
            <Button p={8} px={16} m={2} isDisabled={!isValidPin} onClick={handleSend}>
                CLAIM JACKPOT
            </Button>
            <Center>
                <Box w="50%" textAlign="center" p={4}>
                    <Text fontSize="xs">
                        Claim can take a few minutes. Use at your own risk within the last hour.
                    </Text>
                </Box>
            </Center>
        </Box>
    );
};

export default ClaimJackpot;
