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
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredCards } from '../../../../../redux/reducers/BattlegroundsReducer';
import { setCardsManually } from '../../../../../redux/reducers/CardsReducer';
import { applyCardSwapUpdates, mergeUpdatedCards } from '../../Utils/BattlegroundsUtils';

/**
 * @name ArdorCards
 * @description React component that allows users to withdraw selected OMNO cards from their
 * Ardor account by validating a 4-digit PIN and signing the transaction.
 * Handles the visual selection of cards, PIN verification, swap execution, and Redux state updates.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - User account information including the name (used to validate PIN).
 * @param {boolean} props.isMobile - Flag to adjust layout styles on mobile devices.
 * @param {Array} props.selectedCards - Array of currently selected cards for withdrawal.
 * @param {Function} props.setSelectedCards - Function to update selected cards.
 * @param {Function} props.handleEdit - Function to handle editing a selected card.
 * @param {Function} props.handleDeleteSelectedCard - Function to delete a card from the selection.
 * @param {Function} props.handleCloseInventory - Function to close the inventory view after successful swap.
 * @returns {JSX.Element} The rendered component displaying selected cards, PIN input, and swap action.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company.
 */
const ArdorCards = ({
    infoAccount,
    isMobile,
    selectedCards,
    setSelectedCards,
    handleEdit,
    handleDeleteSelectedCard,
    handleCloseInventory,
}) => {
    const toast = useToast();
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');

    const { filteredCards } = useSelector(state => state.battlegrounds);
    const { cards } = useSelector(state => state.cards);
    const dispatch = useDispatch();

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
            quantity: Number(card.selectQuantity) || 1,
        }));

        const success = await withdrawCardsFromOmno({
            cards: cardsToSwap,
            passPhrase: passphrase,
        });

        if (success) {
            const updatedFilteredCards = applyCardSwapUpdates(filteredCards, cardsToSwap, true).filter(
                card => Number(card.omnoQuantity) > 0
            );

            const mergedCards = mergeUpdatedCards(cards, updatedFilteredCards);
            okToast('Swap completed successfully', toast);
            setSelectedCards([]);
            dispatch(setFilteredCards(updatedFilteredCards));
            dispatch(setCardsManually(mergedCards));
            handleCloseInventory();
        } else {
            errorToast('Swap failed. Please check if you have enough IGNIS balance to pay transaction fees.', toast);
        }

        setIsSwapping(false);
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
