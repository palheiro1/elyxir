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
import BridgeItem from '../../../../../Items/BridgeItem';

// Utils
import { checkPin, sendCardsToOmno } from '../../../../../../utils/walletUtils';
import { infoToast, okToast } from '../../../../../../utils/alerts';
import { withdrawCardsFromOmno } from '../../../../../../services/Ardor/omnoInterface';

/**
 * @name OmnoItems
 * @description Component that manages the process of sending or withdrawing potion items between the user's account and
 * Battlegrounds/Inventory. It allows the user to review selected items, validate with a PIN, and execute the transfer.
 * @param {Object} props - Component props.
 * @param {Object} props.infoAccount - User account information used to validate PIN and get the passphrase.
 * @param {boolean} props.isMobile - Indicates if the view is mobile for responsive layout adjustments.
 * @param {Array} props.selectedItems - List of items selected by the user to send or withdraw.
 * @param {Function} props.setSelectedItems - Setter function to update the list of selected items.
 * @param {Function} props.handleEdit - Callback function to edit an item’s quantity or details.
 * @param {Function} props.handleDeleteSelectedItem - Callback function to remove an item from the selected list.
 * @param {boolean} props.withdraw - Defines the transfer mode: `true` for withdrawing to inventory, `false` for sending to battlegrounds.
 * @returns {JSX.Element} Rendered `OmnoItems` component.
 * @author Dario Maza - Unknown Gravity | All-in-one Blockchain Company
 */
const OmnoItems = ({
    infoAccount,
    isMobile,
    selectedItems,
    setSelectedItems,
    handleEdit,
    handleDeleteSelectedItem,
    withdraw,
}) => {
    const toast = useToast();

    const transferFn = withdraw ? withdrawCardsFromOmno : sendCardsToOmno;

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
        if (!isValidPin || selectedItems.length === 0) return;
        infoToast('Sending potions to battlegrounds...', toast);
        setIsSwapping(true);

        const itemsToSwap = selectedItems.map(item => ({
            asset: item.asset,
            quantity: item.selectQuantity || 1,
        }));

        const success = await transferFn({ cards: itemsToSwap, passPhrase: passphrase, toast });
        if (success) {
            okToast(
                `Potions  ${
                    withdraw ? 'withdraw' : 'sent'
                } successfully to battlegrounds. Wait for the next block and refresh the page.`,
                toast
            );
            setSelectedItems([]);
            setIsSwapping(false);
        }
    };

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Center color={'#FFF'}>
            <Stack direction="column" spacing={8} w={'30rem'}>
                <Box mb={8}>
                    <Heading fontSize="xl" fontWeight="light" mb={4} ml={isMobile && 4}>
                        Chosen
                    </Heading>
                    {selectedItems.length > 0 ? (
                        <Stack
                            direction="column"
                            spacing={4}
                            overflowY="auto"
                            maxH="300px"
                            className="custom-scrollbar"
                            bg={bgColor}
                            borderRadius="md"
                            p={4}>
                            {selectedItems.map((item, itemIndex) => (
                                <BridgeItem
                                    key={itemIndex}
                                    item={item}
                                    isMobile={isMobile}
                                    handleEdit={handleEdit}
                                    handleDeleteSelectedItem={handleDeleteSelectedItem}
                                    withdraw={withdraw}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Center minH="200px">
                            <Text color="gray.500">No potions selected</Text>
                        </Center>
                    )}
                </Box>

                <Divider />

                <Stack direction="column" spacing={4} align="center">
                    <Heading fontSize="lg" fontWeight="light">
                        2. Enter your pin to confirm
                    </Heading>
                    <HStack spacing={4}>
                        <PinInput
                            size="lg"
                            isDisabled={selectedItems.length === 0}
                            mask
                            onComplete={handleCompletePin}
                            isInvalid={!isValidPin}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                    {!isValidPin && (
                        <Text color="red.400" fontSize="sm">
                            Invalid PIN. Please try again.
                        </Text>
                    )}
                </Stack>

                <Stack direction="column" spacing={4} align="center">
                    <Heading fontSize="lg" fontWeight="light">
                        3. Send potions to {withdraw ? 'inventory' : 'battlegrounds'}
                    </Heading>
                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleSwap}
                        isLoading={isSwapping}
                        loadingText="Sending..."
                        isDisabled={!isValidPin || selectedItems.length === 0}
                        w="full">
                        Send {selectedItems.length} potion{selectedItems.length !== 1 ? 's' : ''}
                    </Button>
                </Stack>
            </Stack>
        </Center>
    );
};

export default OmnoItems;
