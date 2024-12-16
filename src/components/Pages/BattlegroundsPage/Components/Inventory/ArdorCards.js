import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

// Components
import BridgeCard from '../../../../Cards/BridgeCard';

// Utils
import { checkPin } from '../../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../../utils/alerts';
import { withdrawCardsFromOmno } from '../../../../../services/Ardor/omnoInterface';

/**
 * @name ArdorCards
 * @description This component is used to withdraw cards from the OMNO inventory
 * @author Darío Maza Berdugo
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} cards - Cards
 * @param {Boolean} isMobile - Boolean used for controll the mobile view
 * @returns {JSX.Element} - JSX element
 */
const ArdorCards = ({
    infoAccount,
    isMobile,
    selectedCards,
    setSelectedCards,
    handleEdit,
    handleDeleteSelectedCard,
}) => {
    const toast = useToast();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleSwap = async () => {
        if (!isValidPin || selectedCards.length === 0) return;
        infoToast('Swapping cards...', toast);
        setIsSwapping(true);

        const cardsToSwap = selectedCards.map(card => ({
            asset: card.asset,
            quantity: card.selectQuantity || 1,
        }));

        const success = withdrawCardsFromOmno({
            cards: cardsToSwap,
            passPhrase: passphrase,
        });

        if (success) {
            okToast('Swap completed successfully', toast);
            setSelectedCards([]);
            setIsSwapping(false);
        } else {
            errorToast('Swap failed', toast);
        }
    };

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Center color={'#FFF'}>
            <Stack direction="column" spacing={8} w={'30rem'}>
                <Box mb={8}>
                    <Heading fontSize="xl" fontWeight="light" mb={4} ml={isMobile && 4}>
                        Choosen
                    </Heading>
                    {selectedCards.length > 0 ? (
                        <Stack
                            direction="column"
                            spacing={4}
                            bgColor={bgColor}
                            py={4}
                            px={4}
                            rounded="lg"
                            maxH="20rem"
                            className="custom-scrollbar"
                            overflowX={'scroll'}>
                            {selectedCards.map(card => (
                                <BridgeCard
                                    key={card.asset}
                                    card={card}
                                    canEdit={true}
                                    handleDeleteSelectedCard={handleDeleteSelectedCard}
                                    handleEdit={handleEdit}
                                    omnoQuantity={card.omnoQuantity}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Text fontWeight="light" my={'auto'}>
                            No cards selected
                        </Text>
                    )}
                </Box>

                <Divider bgColor="#393b97" />
                <Heading fontSize="xl" fontWeight="light" textAlign="center">
                    2. Sign and send
                </Heading>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            isDisabled={selectedCards.length === 0}
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

                <Button
                    w="100%"
                    variant="bridge"
                    disabled={!isValidPin || selectedCards.length === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    SEND
                </Button>
            </Stack>
        </Center>
    );
};

export default ArdorCards;
