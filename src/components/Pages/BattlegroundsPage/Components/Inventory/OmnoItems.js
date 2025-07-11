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
import BridgeItem from '../../../../Items/BridgeItem';

// Utils
import { checkPin } from '../../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../../utils/alerts';

/**
 * @name OmnoItems
 * @description This component is used to send items to the OMNO inventory
 * @author Assistant
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {Array} selectedItems - Selected items
 * @param {Function} setSelectedItems - Function to set selected items
 * @param {Function} handleEdit - Function to handle item editing
 * @param {Function} handleDeleteSelectedItem - Function to handle item deletion
 * @param {Boolean} isMobile - Boolean used for controlling the mobile view
 * @returns {JSX.Element} - JSX element
 */
const OmnoItems = ({
    infoAccount,
    isMobile,
    selectedItems,
    setSelectedItems,
    handleEdit,
    handleDeleteSelectedItem,
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
        if (!isValidPin || selectedItems.length === 0) return;
        infoToast('Sending potions to battlegrounds...', toast);
        setIsSwapping(true);

        // Mock implementation for now - in real app this would call the blockchain
        // const itemsToSwap = selectedItems.map(item => ({
        //     id: item.id,
        //     quantity: item.selectQuantity || 1,
        // }));

        // Simulate API call
        setTimeout(() => {
            okToast('Potions sent successfully to battlegrounds. Wait for the next block and refresh the page.', toast);
            setSelectedItems([]);
            setIsSwapping(false);
        }, 2000);
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
                            placeholder="•"
                            size="lg"
                            onComplete={handleCompletePin}
                            isInvalid={!isValidPin && selectedItems.length > 0}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                    {!isValidPin && selectedItems.length > 0 && (
                        <Text color="red.400" fontSize="sm">
                            Invalid PIN. Please try again.
                        </Text>
                    )}
                </Stack>

                <Stack direction="column" spacing={4} align="center">
                    <Heading fontSize="lg" fontWeight="light">
                        3. Send potions to battlegrounds
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
