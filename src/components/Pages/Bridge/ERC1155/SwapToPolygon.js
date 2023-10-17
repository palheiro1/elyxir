import { useState } from 'react';
import ethereum_address from 'ethereum-address';
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    Input,
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
import BridgeCard from '../../../Cards/BridgeCard';

// Utils
import { checkPin, sendToPolygonBridge } from '../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../utils/alerts';

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
const SwapToPolygon = ({ infoAccount, ardorAddress, cards }) => {
    const toast = useToast();

    const [polygonAccount, setPolygonAccount] = useState('');
    const [isValidAccount, setIsValidAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);

    const myCards = cards.filter(card => card.quantityQNT > 0);
    const notSelectedCards = myCards.filter(card => !selectedCards.includes(card));

    const handleInput = e => {
        e.preventDefault();
        const { value } = e.target;
        setPolygonAccount(value);
        setIsValidAccount(ethereum_address.isAddress(value));
    };

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
        if (!isValidPin || !isValidAccount || selectedCards.length === 0) return;
        infoToast('Swapping cards...', toast);
        setIsSwapping(true);

        const cardsToSwap = selectedCards.map(card => ({
            asset: card.asset,
            quantity: card.selectQuantity || 1,
        }));

        const success = await sendToPolygonBridge({
            cards: cardsToSwap,
            ardorAccount: ardorAddress,
            ethAccount: polygonAccount,
            passPhrase: passphrase,
        });

        if (success) {
            okToast('Swap completed successfully', toast);
            setSelectedCards([]);
            setPolygonAccount('');
            setIsSwapping(false);
        } else {
            errorToast('Swap failed', toast);
        }
    };

    const bgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

    return (
        <Center>
            <Stack direction="column" spacing={8}>
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    1. Select cards to swap
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
                    <MenuList minW="100%" maxH="30rem" overflowY="auto" overflowX="hidden">
                        {notSelectedCards.map(card => (
                            <MenuItem
                                minW="100%"
                                key={card.asset}
                                onClick={() => setSelectedCards([...selectedCards, card])}>
                                <BridgeCard card={card} />
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
                            overflowY="auto">
                            {selectedCards.map(card => (
                                <BridgeCard
                                    key={card.asset}
                                    card={card}
                                    canEdit={true}
                                    handleDeleteSelectedCard={handleDeleteSelectedCard}
                                    handleEdit={handleEdit}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                <Divider bgColor="#393b97" />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    2. Enter your polygon address
                </Heading>

                <Input
                    isDisabled={selectedCards.length === 0}
                    placeholder={selectedCards.length === 0 ? 'Select cards first' : '0x...'}
                    value={polygonAccount}
                    onChange={handleInput}
                    isInvalid={!isValidAccount}
                />

                <Divider bgColor="#393b97" />
                <Heading fontSize="3xl" fontWeight="light" textAlign="center">
                    3. Sign and submit
                </Heading>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            isDisabled={selectedCards.length === 0 || !isValidAccount}
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
                    disabled={!isValidAccount || !isValidPin || selectedCards.length === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    SWAP
                </Button>
            </Stack>
        </Center>
    );
};

export default SwapToPolygon;
