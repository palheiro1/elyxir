import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    PinInput,
    PinInputField,
    Stack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';

// Components
import BridgeCard from '../../../../Cards/BridgeCard';

// Utils
import { checkPin } from '../../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../../utils/alerts';
import { getUsersState, withdrawCardsFromOmno } from '../../../../../services/Ardor/omnoInterface';
import { addressToAccountId } from '../../../../../services/Ardor/ardorInterface';

/**
 * @name SwapToPolygon
 * @description This component is used to swap cards to Polygon
 * @author Jesús Sánchez Fernández
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {String} ardorAddress - Ardor address
 * @param {Array} cards - Cards
 * @returns {JSX.Element} - JSX element
 */
const ArdorCards = ({ infoAccount, ardorAddress, cards }) => {
    const toast = useToast();
    const { accountRs } = infoAccount;
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag
    const [filteredCards, setFilteredCards] = useState([]);

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);

    const myCards = filteredCards;
    const notSelectedCards = myCards.filter(card => !selectedCards.includes(card));

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false); // reset invalid pin flag

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleDeleteSelectedCard = card => {
        const newSelectedCards = selectedCards.filter(selectedCard => selectedCard.asset !== card);
        setSelectedCards(newSelectedCards);
    };

    const handleEdit = (card, quantity) => {
        const newSelectedCards = selectedCards.map(selectedCard => {
            if (selectedCard.asset === card) {
                return { ...selectedCard, selectQuantity: Number(quantity) };
            }
            return selectedCard;
        });
        setSelectedCards(newSelectedCards);
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

    useEffect(() => {
        const filterCards = async () => {
            const userInfo = await getUserState();
            if (userInfo.balance) {
                const assetIds = Object.keys(userInfo.balance.asset);

                const matchingCards = cards
                    .filter(card => assetIds.includes(card.asset))
                    .map(card => ({
                        ...card,
                        omnoQuantity: userInfo.balance.asset[card.asset],
                    }));

                setFilteredCards(matchingCards);
            }
        };
        filterCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, infoAccount]);

    const getUserState = async () => {
        const accountId = addressToAccountId(accountRs);
        let res = await getUsersState().then(res => {
            return res.data.find(item => item.id === accountId);
        });
        return res;
    };

    return (
        <Center color={'#FFF'}>
            <Stack direction="column" spacing={8} w={'30rem'}>
                <Heading fontSize="xl" fontWeight="light" textAlign="center">
                    1. Select cards to send to Inventory
                </Heading>

                <Menu w="100%">
                    <MenuButton
                        w="100%"
                        px={4}
                        py={2}
                        borderColor="#393b97"
                        transition="all 0.2s"
                        borderRadius="md"
                        borderWidth="1px"
                        _hover={{ bg: 'gray.400' }}
                        _expanded={{ bg: 'blue.400' }}
                        _focus={{ boxShadow: 'outline' }}>
                        Select cards <ChevronDownIcon />
                    </MenuButton>
                    <MenuList minW="100%" maxH="25rem" overflowY="auto" overflowX="hidden">
                        {notSelectedCards.map(card => (
                            <MenuItem
                                minW="100%"
                                key={card.asset}
                                onClick={() => setSelectedCards([...selectedCards, card])}>
                                <BridgeCard card={card} omnoQuantity={card.omnoQuantity} />
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                {selectedCards.length > 0 && (
                    <Box mb={8}>
                        <Heading fontSize="xl" fontWeight="light" mb={4}>
                            Choosen
                        </Heading>

                        <Stack
                            direction="column"
                            spacing={4}
                            bgColor={bgColor}
                            py={4}
                            px={6}
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
                    </Box>
                )}

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
