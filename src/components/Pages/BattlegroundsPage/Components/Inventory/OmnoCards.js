import { useState, useCallback, useMemo, memo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

// Components
import BridgeCard from '../../../../Cards/BridgeCard';

// Utils
import { checkPin, sendCardsToOmno } from '../../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../../utils/alerts';
import { setFilteredCards } from '../../../../../redux/reducers/BattlegroundsReducer';
import { setCardsManually } from '../../../../../redux/reducers/CardsReducer';
import { applyCardSwapUpdates, mergeUpdatedCards } from '../../Utils/BattlegroundsUtils';

/**
 * @name OmnoCards
 * @description React component that allows users to select cards and send ("recruit") them to Omno via a blockchain transaction.
 * The component handles PIN authentication, card selection display, and executes the swap logic using `sendCardsToOmno`.
 * It updates the Redux store with the new state of cards and filtered cards after a successful transaction.
 * @param {Object} infoAccount - User account object containing name used to validate PIN.
 * @param {boolean} isMobile - Determines mobile layout (e.g. for spacing).
 * @param {Array} selectedCards - Array of selected card objects to send.
 * @param {Function} setSelectedCards - Callback to update selected cards.
 * @param {Function} handleEdit - Callback for editing a selected card's quantity.
 * @param {Function} handleDeleteSelectedCard - Callback to remove a selected card from the list.
 * @param {Function} handleCloseInventory - Callback to close the inventory modal after successful action.
 * @returns {JSX.Element} OmnoCards UI component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const OmnoCards = ({
    infoAccount,
    isMobile,
    selectedCards,
    setSelectedCards,
    handleEdit,
    handleDeleteSelectedCard,
    handleCloseInventory,
}) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const { cards } = useSelector(state => state.cards);
    const { filteredCards } = useSelector(state => state.battlegrounds);

    const [isValidPin, setIsValidPin] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const cardsToSwap = useMemo(
        () =>
            selectedCards.map(card => ({
                asset: card.asset,
                quantity: Number(card.selectQuantity) || 1,
                name: card.name,
            })),
        [selectedCards]
    );

    const handleCompletePin = useCallback(
        pin => {
            if (isValidPin) setIsValidPin(false); // reset flag
            const { name } = infoAccount;
            const account = checkPin(name, pin);
            if (account) {
                setIsValidPin(true);
                setPassphrase(account.passphrase);
            }
        },
        [infoAccount, isValidPin]
    );

    const handleSwap = useCallback(async () => {
        if (!isValidPin || cardsToSwap.length === 0) return;

        infoToast('Swapping cards...', toast);
        setIsSwapping(true);

        const success = await sendCardsToOmno({
            cards: cardsToSwap,
            passPhrase: passphrase,
            toast,
        });

        if (success) {
            const updatedCards = applyCardSwapUpdates(cards, cardsToSwap);
            const updatedFilteredCards = mergeUpdatedCards(filteredCards, updatedCards);

            okToast('Swap completed successfully. Wait for the next block and refresh the page.', toast);
            setSelectedCards([]);
            dispatch(setCardsManually(updatedCards));
            dispatch(setFilteredCards(updatedFilteredCards));
            handleCloseInventory();
        } else {
            errorToast(
                'Swap failed. Some cards may not have been sent correctly. Please check if you have enough IGNIS balance to pay transaction fees.',
                toast
            );
        }

        setIsSwapping(false);
    }, [
        isValidPin,
        cardsToSwap,
        passphrase,
        cards,
        filteredCards,
        toast,
        dispatch,
        setSelectedCards,
        handleCloseInventory,
    ]);

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Center color="#FFF">
            <Stack direction="column" spacing={8} w={isMobile ? '22rem' : '30rem'}>
                <Box mb={8}>
                    <Heading fontSize="xl" fontWeight="light" mb={4} ml={isMobile && 4}>
                        Choosen
                    </Heading>

                    {selectedCards.length > 0 ? (
                        <Stack
                            spacing={4}
                            bgColor={bgColor}
                            py={4}
                            px={4}
                            rounded="lg"
                            maxH="20rem"
                            className="custom-scrollbar"
                            overflowX="scroll">
                            {selectedCards.map(card => (
                                <BridgeCard
                                    key={card.asset}
                                    card={card}
                                    canEdit
                                    handleDeleteSelectedCard={handleDeleteSelectedCard}
                                    handleEdit={handleEdit}
                                    isMobile={isMobile}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Text fontWeight="light" my="auto">
                            No cards selected
                        </Text>
                    )}
                </Box>

                <Divider bgColor="#393b97" />
                <Heading fontSize="xl" fontWeight="light" textAlign="center">
                    2. Sign and recruit
                </Heading>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            isDisabled={selectedCards.length === 0}
                            size="lg"
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

                <Button
                    w="100%"
                    variant="bridge"
                    isDisabled={!isValidPin || selectedCards.length === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    RECRUIT
                </Button>
            </Stack>
        </Center>
    );
};

export default memo(OmnoCards);
