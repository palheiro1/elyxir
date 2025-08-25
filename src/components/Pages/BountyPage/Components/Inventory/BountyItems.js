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
import BridgeItem from './BridgeItem';

// Utils
import { checkPin } from '../../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../../utils/alerts';

/**
 * @name BountyItems
 * @description This component is used to burn items for bounty rewards
 * @param {Object} infoAccount - Account info
 * @param {Boolean} isMobile - Boolean used for controlling the mobile view
 * @param {Array} selectedItems - Selected items
 * @param {Function} setSelectedItems - Function to set selected items
 * @param {Function} handleEdit - Function to handle edit
 * @param {Function} handleDeleteSelectedItem - Function to handle delete selected item
 * @param {Function} handleCloseInventory - Function to handle close inventory
 * @returns {JSX.Element} - JSX element
 */
const BountyItems = ({
    infoAccount,
    isMobile,
    selectedItems,
    setSelectedItems,
    handleEdit,
    handleDeleteSelectedItem,
    handleCloseInventory,
}) => {
    const toast = useToast();
    const [isValidPin, setIsValidPin] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [passphrase, setPassphrase] = useState('');

    const handleCompletePin = pin => {
        isValidPin && setIsValidPin(false);

        const { name } = infoAccount;
        const account = checkPin(name, pin);
        if (account) {
            setIsValidPin(true);
            setPassphrase(account.passphrase);
        }
    };

    const handleSwap = async () => {
        if (!isValidPin || selectedItems.length === 0) return;
        
        infoToast('Burning items for bounty...', toast);
        setIsSwapping(true);

        // Mock burning process
        setTimeout(() => {
            okToast('Items burned successfully for bounty rewards!', toast);
            setSelectedItems([]);
            setIsSwapping(false);
            handleCloseInventory();
        }, 2000);
    };

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Center color={'#FFF'}>
            <Stack direction="column" spacing={8} w={{ base: '20rem', md: '30rem' }}>
                <Box mb={8}>
                    <Heading fontSize="xl" fontWeight="light" mb={4} ml={isMobile && 4}>
                        Selected Potions
                    </Heading>
                    {selectedItems.length > 0 ? (
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
                            {selectedItems.map(item => (
                                <BridgeItem
                                    key={item.id}
                                    item={item}
                                    canEdit={true}
                                    handleDeleteSelectedItem={handleDeleteSelectedItem}
                                    handleEdit={handleEdit}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Text fontWeight="light" my={'auto'}>
                            No potions selected
                        </Text>
                    )}
                </Box>

                <Divider bgColor="#393b97" />
                <Heading fontSize="xl" fontWeight="light" textAlign="center">
                    2. Sign and burn for bounty
                </Heading>

                <Center>
                    <HStack spacing={7}>
                        <PinInput
                            isDisabled={selectedItems.length === 0}
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
                    disabled={!isValidPin || selectedItems.length === 0 || isSwapping}
                    onClick={handleSwap}
                    letterSpacing="widest">
                    Burn for bounty
                </Button>
            </Stack>
        </Center>
    );
};

export default BountyItems;
