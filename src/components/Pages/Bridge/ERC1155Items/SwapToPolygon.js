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
import BridgeItem from '../../../Items/BridgeItem';

// Utils
import { checkPin } from '../../../../utils/walletUtils';
import { errorToast, infoToast, okToast } from '../../../../utils/alerts';

/**
 * @name SwapToPolygon
 * @description This component is used to swap potions to Polygon
 * @author Assistant
 * @version 0.1
 * @param {Object} infoAccount - Account info
 * @param {String} ardorAddress - Ardor address
 * @param {Array} items - Items/Potions
 * @returns {JSX.Element} - JSX element
 */
const SwapToPolygon = ({ infoAccount, ardorAddress, items }) => {
    const toast = useToast();

    const [polygonAccount, setPolygonAccount] = useState('');
    const [isValidAccount, setIsValidAccount] = useState(false);
    const [isValidPin, setIsValidPin] = useState(false); // invalid pin flag

    const [isSwapping, setIsSwapping] = useState(false);

    const [passphrase, setPassphrase] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const myItems = items.filter(item => parseInt(item.quantity) > 0);
    const notSelectedItems = myItems.filter(item => !selectedItems.some(selected => selected.id === item.id));

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

    const handleDeleteSelectedItem = item => {
        const newSelectedItems = selectedItems.filter(selectedItem => selectedItem.id !== item.id);
        setSelectedItems(newSelectedItems);
    };

    const handleEdit = (item, quantity) => {
        const newSelectedItems = selectedItems.map(selectedItem => {
            if (selectedItem.id === item.id) {
                return { ...selectedItem, selectQuantity: Number(quantity) };
            }
            return selectedItem;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleSwap = async () => {
        if (!isValidPin || !isValidAccount || selectedItems.length === 0) return;
        infoToast('Swapping potions to Polygon...', toast);
        setIsSwapping(true);

        // Mock implementation - in real app this would call the blockchain
        // const itemsToSwap = selectedItems.map(item => ({
        //     id: item.id,
        //     quantity: item.selectQuantity || 1,
        // }));

        // Simulate API call
        setTimeout(() => {
            okToast('Potions swapped successfully to Polygon!', toast);
            setSelectedItems([]);
            setIsSwapping(false);
        }, 2000);
    };

    const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Center>
            <Stack direction="column" spacing={8} w={'30rem'}>
                <Box>
                    <Heading fontSize="xl" fontWeight="light" mb={4}>
                        Swap potions to Polygon
                    </Heading>
                    <Stack direction="column" spacing={4}>
                        <Box>
                            <Heading fontSize="lg" fontWeight="light" mb={2}>
                                1. Select potions to swap
                            </Heading>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                                    Select potions ({notSelectedItems.length} available)
                                </MenuButton>
                                <MenuList maxH="200px" overflowY="auto">
                                    {notSelectedItems.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => setSelectedItems([...selectedItems, item])}>
                                            {item.name} ({item.quantity} available)
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Box>

                        {selectedItems.length > 0 && (
                            <Box>
                                <Heading fontSize="lg" fontWeight="light" mb={2}>
                                    Selected potions
                                </Heading>
                                <Stack
                                    direction="column"
                                    spacing={4}
                                    bg={bgColor}
                                    p={4}
                                    borderRadius="md"
                                    maxH="300px"
                                    overflowY="auto">
                                    {selectedItems.map((item, index) => (
                                        <BridgeItem
                                            key={index}
                                            item={item}
                                            handleEdit={handleEdit}
                                            handleDeleteSelectedItem={handleDeleteSelectedItem}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Divider />

                        <Box>
                            <Heading fontSize="lg" fontWeight="light" mb={2}>
                                2. Enter Polygon address
                            </Heading>
                            <Input
                                placeholder="0x..."
                                value={polygonAccount}
                                onChange={handleInput}
                                isInvalid={polygonAccount !== '' && !isValidAccount}
                            />
                        </Box>

                        <Divider />

                        <Box>
                            <Heading fontSize="lg" fontWeight="light" mb={2}>
                                3. Enter your PIN
                            </Heading>
                            <HStack spacing={4} justify="center">
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
                        </Box>

                        <Divider />

                        <Box>
                            <Heading fontSize="lg" fontWeight="light" mb={2}>
                                4. Confirm swap
                            </Heading>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                w="100%"
                                onClick={handleSwap}
                                isLoading={isSwapping}
                                loadingText="Swapping..."
                                isDisabled={!isValidPin || !isValidAccount || selectedItems.length === 0}>
                                Swap {selectedItems.length} potion{selectedItems.length !== 1 ? 's' : ''} to Polygon
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </Center>
    );
};

export default SwapToPolygon;
