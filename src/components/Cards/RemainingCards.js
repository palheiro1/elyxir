import { Box, Button, Center, Divider, Heading, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { checkPin } from '../../utils/walletUtils';
import GridCards from './GridCards';

const RemainingCards = ({ totalCards, remainingCards, cards, username }) => {
    const have = totalCards - remainingCards;

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

    return remainingCards > 0 ? (
        <Box mt={4}>
            <Box>
                <Text fontSize="xl">
                    You have {have} out of {totalCards} cards.
                </Text>
                <Text fontSize="xs">Complete the collection to claim the jackpot. {remainingCards} cards missing.</Text>
            </Box>
            <GridCards cards={cards} onlyBuy={true} />
        </Box>
    ) : (
        <Box mt={8} textAlign="center">
            <Heading>Congratulations!</Heading>
            <Center>
                <Box textAlign="center">
                    <Text fontSize="xs">
                        You have {have} out of {totalCards} cards. You have all the cards!
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
            <Button p={8} px={16} m={2} isDisabled={!isValidPin}>
                CLAIM JACKPOT
            </Button>
            <Center>
                <Box w="50%" textAlign="center" p={4}>
                    <Text fontSize="xs">Claim can take a few minutes. Use at your own risk within the last hour.</Text>
                </Box>
            </Center>
        </Box>
    );
};

export default RemainingCards;
